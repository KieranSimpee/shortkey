/**
 * Virtual try-on engine for the homepage hero model.
 *
 * 1) Facial landmarks (MediaPipe Face Landmarker) → anatomy anchors
 * 2) Feathered alpha masks → lip / cheekbone / eyelid only
 * 3) Isolated overlay layers → base homepage asset is never mutated
 */

export type Point = { x: number; y: number };

export type FaceAnatomy = {
  /** Normalized landmarks 0–1 */
  lipsOuter: Point[];
  lipsInner: Point[];
  cheekLeft: Point[];
  cheekRight: Point[];
  eyelidLeft: Point[];
  eyelidRight: Point[];
  width: number;
  height: number;
  source: "mediapipe" | "fallback";
};

export type TryOnColors = {
  lip: string | null;
  cheek: string | null;
  eye: string | null;
};

type Landmark = { x: number; y: number; z?: number };

/** MediaPipe Face Mesh — ordered lip contours */
const LIPS_OUTER = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181,
  91, 146,
];
const LIPS_INNER = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82,
  81, 80, 191,
];

/** Cheekbone clusters (apple of cheek) */
const CHEEK_LEFT = [50, 101, 118, 119, 120, 100, 36, 205, 187, 147, 123, 116];
const CHEEK_RIGHT = [280, 330, 347, 348, 349, 329, 266, 425, 411, 376, 352, 345];

/** Upper eyelid / crease beds */
const EYELID_LEFT = [
  33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7,
];
const EYELID_RIGHT = [
  263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249,
];

type FaceLandmarkerLike = {
  detect: (image: HTMLCanvasElement | HTMLImageElement) => {
    faceLandmarks?: Landmark[][];
  };
};

let landmarkerPromise: Promise<FaceLandmarkerLike | null> | null = null;

function pts(landmarks: Landmark[], indices: number[]): Point[] {
  return indices.map((i) => {
    const p = landmarks[i] ?? landmarks[0];
    return { x: p.x, y: p.y };
  });
}

function convexHull(points: Point[]): Point[] {
  if (points.length < 3) return points;
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Point, a: Point, b: Point) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Point[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function ellipsePoly(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  steps = 24,
  rot = 0,
): Point[] {
  const out: Point[] = [];
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    out.push({ x: cx + x * c - y * s, y: cy + x * s + y * c });
  }
  return out;
}

/** Fallback anatomy when MediaPipe is unavailable — contour-shaped, not random spots */
function fallbackAnatomy(width: number, height: number): FaceAnatomy {
  return {
    lipsOuter: ellipsePoly(0.505, 0.41, 0.058, 0.02, 28, -0.04),
    lipsInner: ellipsePoly(0.505, 0.412, 0.028, 0.007, 20, 0),
    cheekLeft: ellipsePoly(0.4, 0.365, 0.055, 0.038, 24, -0.25),
    cheekRight: ellipsePoly(0.605, 0.36, 0.052, 0.036, 24, 0.22),
    eyelidLeft: ellipsePoly(0.425, 0.274, 0.04, 0.01, 20, -0.15),
    eyelidRight: ellipsePoly(0.555, 0.286, 0.041, 0.01, 20, 0.12),
    width,
    height,
    source: "fallback",
  };
}

function withSuppressedTfLiteNoise<T>(fn: () => Promise<T>): Promise<T> {
  const original = console.error;
  console.error = (...args: unknown[]) => {
    const msg = String(args[0] ?? "");
    if (
      msg.includes("XNNPACK") ||
      msg.includes("TensorFlow Lite") ||
      msg.includes("Created TensorFlow")
    ) {
      return;
    }
    original.apply(console, args as Parameters<typeof console.error>);
  };
  return fn().finally(() => {
    console.error = original;
  });
}

async function getFaceLandmarker(): Promise<FaceLandmarkerLike | null> {
  if (landmarkerPromise) return landmarkerPromise;

  landmarkerPromise = withSuppressedTfLiteNoise(async () => {
    try {
      let FaceLandmarker: {
        createFromOptions: (
          fileset: unknown,
          options: unknown,
        ) => Promise<FaceLandmarkerLike>;
      };
      let FilesetResolver: {
        forVisionTasks: (path: string) => Promise<unknown>;
      };

      try {
        const local = await import("@mediapipe/tasks-vision");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        FaceLandmarker = local.FaceLandmarker as any;
        FilesetResolver = local.FilesetResolver;
      } catch {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const remote = await import(
          /* webpackIgnore: true */
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/+esm"
        );
        FaceLandmarker = remote.FaceLandmarker as any; // eslint-disable-line
        FilesetResolver = remote.FilesetResolver;
      }

      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm",
      );
      return await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "CPU",
        },
        runningMode: "IMAGE",
        numFaces: 1,
      });
    } catch (err) {
      console.warn("[try-on] MediaPipe unavailable — anatomy fallback", err);
      return null;
    }
  });

  return landmarkerPromise;
}

/** Flatten cutout onto light plate so Face Landmarker can see skin tones. */
function toDetectionCanvas(image: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
  const W =
    image instanceof HTMLImageElement
      ? image.naturalWidth || image.width
      : image.width;
  const H =
    image instanceof HTMLImageElement
      ? image.naturalHeight || image.height
      : image.height;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f3ece4";
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(image, 0, 0, W, H);
  return canvas;
}

export function loadHomepageModelImage(url: string): Promise<HTMLImageElement> {
  const abs =
    typeof window !== "undefined" && url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load homepage model image"));
    img.src = abs;
  });
}

/** Knock out studio black for display — returns a NEW canvas; never touches the file asset. */
export function stripBlackBackground(
  source: HTMLImageElement | HTMLCanvasElement,
): HTMLCanvasElement {
  const W =
    source instanceof HTMLImageElement
      ? source.naturalWidth || source.width
      : source.width;
  const H =
    source instanceof HTMLImageElement
      ? source.naturalHeight || source.height
      : source.height;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("No canvas");

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(source, 0, 0, W, H);

  const imageData = ctx.getImageData(0, 0, W, H);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const max = Math.max(r, g, b);
    const sum = r + g + b;
    if (max <= 16 && sum <= 36) {
      d[i + 3] = 0;
    } else if (max <= 42 && sum <= 90) {
      d[i + 3] = Math.round(d[i + 3] * Math.min(1, (sum - 36) / 54));
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export async function detectFaceAnatomy(
  image: HTMLImageElement | HTMLCanvasElement,
): Promise<FaceAnatomy> {
  const width =
    image instanceof HTMLImageElement
      ? image.naturalWidth || image.width
      : image.width;
  const height =
    image instanceof HTMLImageElement
      ? image.naturalHeight || image.height
      : image.height;

  const fallback = fallbackAnatomy(width, height);

  try {
    const landmarker = await getFaceLandmarker();
    if (!landmarker) return fallback;

    const result = await withSuppressedTfLiteNoise(async () => {
      return landmarker.detect(toDetectionCanvas(image));
    });

    const face = result.faceLandmarks?.[0];
    if (!face?.length) return fallback;

    return {
      lipsOuter: pts(face, LIPS_OUTER),
      lipsInner: pts(face, LIPS_INNER),
      cheekLeft: convexHull(pts(face, CHEEK_LEFT)),
      cheekRight: convexHull(pts(face, CHEEK_RIGHT)),
      eyelidLeft: convexHull(pts(face, EYELID_LEFT)),
      eyelidRight: convexHull(pts(face, EYELID_RIGHT)),
      width,
      height,
      source: "mediapipe",
    };
  } catch (err) {
    console.warn("[try-on] landmark detect failed", err);
    return fallback;
  }
}

/**
 * Build a soft binary mask (white = tintable) from a landmark polygon.
 * Heavy blur = feathered anatomy edge, not a hard spot.
 */
function buildFeatheredMask(
  W: number,
  H: number,
  polygon: Point[],
  featherPx: number,
): HTMLCanvasElement {
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const ctx = mask.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  if (polygon.length < 3) return mask;

  const hard = document.createElement("canvas");
  hard.width = W;
  hard.height = H;
  const hctx = hard.getContext("2d")!;
  hctx.fillStyle = "#fff";
  hctx.beginPath();
  hctx.moveTo(polygon[0].x * W, polygon[0].y * H);
  for (let i = 1; i < polygon.length; i++) {
    hctx.lineTo(polygon[i].x * W, polygon[i].y * H);
  }
  hctx.closePath();
  hctx.fill();

  if (featherPx > 0) {
    ctx.filter = `blur(${featherPx}px)`;
  }
  ctx.drawImage(hard, 0, 0);
  ctx.filter = "none";
  return mask;
}

/**
 * Radial gradient mask for cheekbones — diffused from landmark centroid.
 */
function buildCheekGradientMask(
  W: number,
  H: number,
  polygon: Point[],
): HTMLCanvasElement {
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const ctx = mask.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  if (polygon.length < 3) return mask;

  let minX = 1,
    minY = 1,
    maxX = 0,
    maxY = 0,
    cx = 0,
    cy = 0;
  for (const p of polygon) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
    cx += p.x;
    cy += p.y;
  }
  cx /= polygon.length;
  cy /= polygon.length;
  const rx = Math.max(0.01, (maxX - minX) * 0.65) * W;
  const ry = Math.max(0.01, (maxY - minY) * 0.7) * H;

  const g = ctx.createRadialGradient(cx * W, cy * H, 0, cx * W, cy * H, Math.max(rx, ry));
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.45, "rgba(255,255,255,0.55)");
  g.addColorStop(0.78, "rgba(255,255,255,0.18)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx * W, cy * H, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Clip soft falloff further to cheek hull so color stays on cheekbone anatomy
  const clip = document.createElement("canvas");
  clip.width = W;
  clip.height = H;
  const cctx = clip.getContext("2d")!;
  cctx.fillStyle = "#fff";
  cctx.beginPath();
  cctx.moveTo(polygon[0].x * W, polygon[0].y * H);
  for (let i = 1; i < polygon.length; i++) {
    cctx.lineTo(polygon[i].x * W, polygon[i].y * H);
  }
  cctx.closePath();
  cctx.fill();
  cctx.filter = "blur(18px)";
  cctx.drawImage(clip, 0, 0);
  cctx.filter = "none";

  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(clip, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  return mask;
}

function paintMaskedTint(
  target: CanvasRenderingContext2D,
  W: number,
  H: number,
  mask: HTMLCanvasElement,
  color: string,
  alpha: number,
  composite: GlobalCompositeOperation,
) {
  const layer = document.createElement("canvas");
  layer.width = W;
  layer.height = H;
  const lctx = layer.getContext("2d")!;
  lctx.fillStyle = color;
  lctx.fillRect(0, 0, W, H);
  lctx.globalCompositeOperation = "destination-in";
  lctx.drawImage(mask, 0, 0);

  target.save();
  target.globalAlpha = alpha;
  target.globalCompositeOperation = composite;
  target.drawImage(layer, 0, 0);
  target.restore();
}

/**
 * Composite temporary try-on overlays over an immutable base canvas.
 * Base is never written to — only drawn from.
 */
export function compositeTryOnLayers(
  immutableBase: HTMLCanvasElement,
  anatomy: FaceAnatomy,
  colors: TryOnColors,
): string {
  const W = anatomy.width || immutableBase.width;
  const H = anatomy.height || immutableBase.height;

  // Output frame (ephemeral)
  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ctx = out.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(immutableBase, 0, 0, W, H);

  // --- Eye lids (temporary overlay) ---
  if (colors.eye) {
    const left = buildFeatheredMask(W, H, anatomy.eyelidLeft, 6);
    const right = buildFeatheredMask(W, H, anatomy.eyelidRight, 6);
    paintMaskedTint(ctx, W, H, left, colors.eye, 0.42, "multiply");
    paintMaskedTint(ctx, W, H, right, colors.eye, 0.44, "multiply");
    paintMaskedTint(ctx, W, H, left, colors.eye, 0.2, "soft-light");
    paintMaskedTint(ctx, W, H, right, colors.eye, 0.22, "soft-light");
  }

  // --- Cheeks (radial diffused, anatomy-clipped) ---
  if (colors.cheek) {
    const left = buildCheekGradientMask(W, H, anatomy.cheekLeft);
    const right = buildCheekGradientMask(W, H, anatomy.cheekRight);
    paintMaskedTint(ctx, W, H, left, colors.cheek, 0.4, "soft-light");
    paintMaskedTint(ctx, W, H, right, colors.cheek, 0.38, "soft-light");
    paintMaskedTint(ctx, W, H, left, colors.cheek, 0.16, "multiply");
    paintMaskedTint(ctx, W, H, right, colors.cheek, 0.14, "multiply");
  }

  // --- Lips (outer mesh mask minus soft inner aperture) ---
  if (colors.lip) {
    const lipMask = buildFeatheredMask(W, H, anatomy.lipsOuter, 3.5);
    if (anatomy.lipsInner.length >= 3) {
      const mctx = lipMask.getContext("2d")!;
      mctx.globalCompositeOperation = "destination-out";
      mctx.filter = "blur(2px)";
      mctx.fillStyle = "#000";
      mctx.beginPath();
      mctx.moveTo(anatomy.lipsInner[0].x * W, anatomy.lipsInner[0].y * H);
      for (let i = 1; i < anatomy.lipsInner.length; i++) {
        mctx.lineTo(anatomy.lipsInner[i].x * W, anatomy.lipsInner[i].y * H);
      }
      mctx.closePath();
      mctx.fill();
      mctx.filter = "none";
      mctx.globalCompositeOperation = "source-over";
    }
    paintMaskedTint(ctx, W, H, lipMask, colors.lip, 0.7, "multiply");
    paintMaskedTint(ctx, W, H, lipMask, colors.lip, 0.28, "color");
    paintMaskedTint(ctx, W, H, lipMask, colors.lip, 0.14, "soft-light");
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.filter = "none";
  return out.toDataURL("image/png");
}

/**
 * Prepare in-memory try-on session from homepage model URL.
 * Underlying `/public` file is never modified.
 */
export async function prepareTryOnSession(modelUrl: string): Promise<{
  /** Immutable display base (black plate stripped) */
  base: HTMLCanvasElement;
  /** Clean preview with no makeup */
  cleanPreviewUrl: string;
  anatomy: FaceAnatomy;
}> {
  const img = await loadHomepageModelImage(modelUrl);
  const base = stripBlackBackground(img);
  const anatomy = await detectFaceAnatomy(base);
  return {
    base,
    cleanPreviewUrl: base.toDataURL("image/png"),
    anatomy,
  };
}
