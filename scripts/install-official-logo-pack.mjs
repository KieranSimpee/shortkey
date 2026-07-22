/**
 * SHORTKEY logo install — PRODUCTION = Lilac (Simplex-ity registered)
 * Alternate = Black monochrome · Archive = blue / rainbow / original
 * Run: node scripts/install-official-logo-pack.mjs
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoDir = path.join(root, "public", "logo");
const archiveDir = path.join(logoDir, "archive");
const brandDir = path.join(root, "src", "brand", "logo-locked");
const alternateDir = path.join(logoDir, "alternate");

fs.mkdirSync(logoDir, { recursive: true });
fs.mkdirSync(archiveDir, { recursive: true });
fs.mkdirSync(alternateDir, { recursive: true });
fs.mkdirSync(brandDir, { recursive: true });

const MASTER = {
  lilac: path.join(brandDir, "Shortkey_Logo_lilac.png"),
  black: path.join(brandDir, "Shortkey_Logo_black.png"),
  blue: path.join(brandDir, "Shortkey_Logo_blue.png"),
  rainbow: path.join(brandDir, "Shortkey_Logo_rainbow.png"),
  original: path.join(brandDir, "Shortkey_Logo_original.png"),
};

for (const [name, p] of Object.entries(MASTER)) {
  if (!fs.existsSync(p)) {
    console.error("MISSING master", name, p);
    process.exit(1);
  }
}

/** Clear white / near-white plate; keep logo ink + keycaps */
async function clearWhitePlate(inputBuf) {
  const { data, info } = await sharp(inputBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = Buffer.from(data);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    // Pure / near-white plate
    if (r > 242 && g > 242 && b > 242) {
      px[i + 3] = 0;
      continue;
    }
    // Soft off-white plate (low chroma)
    if (chroma < 12 && r > 235 && g > 235 && b > 235) {
      px[i + 3] = 0;
    }
  }
  return sharp(px, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer({ resolveWithObject: true });
}

/**
 * On-dark lilac for hero:
 * - Drop grey “plate / matte / shadow boxes” around keycaps (no colour = dirty fringe)
 * - Tint key faces soft lilac so round tabs aren’t dead white
 * - Keep brand lilac ink (don’t blow to pure white)
 */
async function toOnDarkLilac(clearPngBuf) {
  const { data, info } = await sharp(clearPngBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = Buffer.from(data);
  const w = info.width;
  const h = info.height;

  // Soft lilac key fill (brand-aligned, readable on Dark Luxury)
  const KEY_R = 228;
  const KEY_G = 222;
  const KEY_B = 255;
  // Brand lilac ink ceiling (wordmark / X / S+)
  const INK_R = 190;
  const INK_G = 175;
  const INK_B = 255;

  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3];
    if (a < 8) continue;
    let r = px[i];
    let g = px[i + 1];
    let b = px[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Drop-shadow / matte / rectangular fringe under keys → remove
    // (grey “no colour” boxes around round tabs on Dark Luxury)
    if (chroma < 40 && lum < 95) {
      px[i + 3] = 0;
      continue;
    }
    if (chroma < 22 && lum >= 35 && lum <= 175 && a < 240) {
      px[i + 3] = 0;
      continue;
    }
    if (chroma < 18 && lum >= 90 && lum <= 210 && a < 200) {
      px[i + 3] = 0;
      continue;
    }

    // Coloured lilac ink — gentle lift, cap so it stays lilac not white
    if (chroma > 20) {
      const t = 0.25;
      px[i] = Math.round(r * (1 - t) + INK_R * t);
      px[i + 1] = Math.round(g * (1 - t) + INK_G * t);
      px[i + 2] = Math.round(b * (1 - t) + INK_B * t);
      // Never brighter than soft lilac white
      if (px[i] > 245 && px[i + 1] > 240 && px[i + 2] > 250) {
        px[i] = INK_R;
        px[i + 1] = INK_G;
        px[i + 2] = INK_B;
      }
      continue;
    }

    // Keycap body (near-white / light grey, solid) → soft lilac fill
    if (chroma < 28 && lum > 175) {
      px[i] = KEY_R;
      px[i + 1] = KEY_G;
      px[i + 2] = KEY_B;
      px[i + 3] = 255;
      continue;
    }

    // Darker grey key bevel → deeper lilac-grey
    if (chroma < 28 && lum > 110) {
      px[i] = 170;
      px[i + 1] = 162;
      px[i + 2] = 210;
      continue;
    }
  }

  // Second pass: kill isolated light fringe pixels (orphan matte)
  const out = Buffer.from(px);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      if (out[i + 3] < 8) continue;
      const chroma =
        Math.max(out[i], out[i + 1], out[i + 2]) -
        Math.min(out[i], out[i + 1], out[i + 2]);
      const lum = 0.2126 * out[i] + 0.7152 * out[i + 1] + 0.0722 * out[i + 2];
      if (chroma > 25 || lum < 160) continue;
      let transparentNeighbours = 0;
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const ni = ((y + dy) * w + (x + dx)) * 4;
        if (out[ni + 3] < 8) transparentNeighbours++;
      }
      if (transparentNeighbours >= 3) out[i + 3] = 0;
    }
  }

  return sharp(out, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png()
    .toBuffer();
}

/** Black mono on-dark (alternate utility) */
async function toOnDarkMono(clearPngBuf) {
  const { data, info } = await sharp(clearPngBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = Buffer.from(data);
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3];
    if (a < 8) continue;
    const lum = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
    if (lum < 90) {
      px[i] = 255;
      px[i + 1] = 255;
      px[i + 2] = 255;
    }
  }
  return sharp(px, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function cropIcon(clearPngBuf) {
  const meta = await sharp(clearPngBuf).metadata();
  const h = Math.round((meta.height ?? 400) * 0.48);
  return sharp(clearPngBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: h })
    .trim({ threshold: 8 })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

// 1) Production from LILAC
const lilacRaw = fs.readFileSync(MASTER.lilac);
const cleared = await clearWhitePlate(lilacRaw);
const primaryPath = path.join(logoDir, "shortkey-primary.png");
await sharp(cleared.data).png().toFile(primaryPath);
console.log("PRODUCTION lilac primary →", primaryPath, `${cleared.info.width}×${cleared.info.height}`);

const onDarkBuf = await toOnDarkLilac(cleared.data);
const onDarkPath = path.join(logoDir, "shortkey-primary-on-dark.png");
await sharp(onDarkBuf).png().toFile(onDarkPath);
console.log("PRODUCTION lilac on-dark →", onDarkPath);

const iconBuf = await cropIcon(cleared.data);
const iconPath = path.join(logoDir, "shortkey-icon.png");
await sharp(iconBuf).png().toFile(iconPath);

for (const size of [32, 64, 128, 256, 512]) {
  await sharp(iconBuf)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(logoDir, `shortkey-favicon-${size}.png`));
}

// 2) Alternate black (utility mono)
const blackCleared = await clearWhitePlate(fs.readFileSync(MASTER.black));
await sharp(blackCleared.data)
  .png()
  .toFile(path.join(alternateDir, "shortkey-primary-black.png"));
await sharp(await toOnDarkMono(blackCleared.data))
  .png()
  .toFile(path.join(alternateDir, "shortkey-primary-black-on-dark.png"));
console.log("ALTERNATE black →", alternateDir);

// 3) Archive other variants
for (const name of ["blue", "rainbow", "original"]) {
  const c = await clearWhitePlate(fs.readFileSync(MASTER[name]));
  await sharp(c.data)
    .png()
    .toFile(path.join(archiveDir, `shortkey-${name}.png`));
  console.log("archive →", name);
}
// Keep cleared lilac master copy in archive for history too
await sharp(cleared.data)
  .png()
  .toFile(path.join(archiveDir, "shortkey-lilac.png"));

const v = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);

fs.writeFileSync(
  path.join(root, "src", "generated", "logoMeta.ts"),
  `/** SHORTKEY — PRODUCTION lilac (Simplex-ity registered). Run scripts/install-official-logo-pack.mjs */
export const logoMeta = {
  id: "SHORTKEY-LILAC",
  name: "Shortkey Primary Logo",
  edition: "Production Lilac (Simplex-ity registered)",
  /** Light surfaces */
  light: "/logo/shortkey-primary.png",
  /** Dark Luxury — soft lilac on dark */
  dark: "/logo/shortkey-primary-on-dark.png",
  icon: "/logo/shortkey-icon.png",
  /** Utility mono (not default) */
  alternateBlack: "/logo/alternate/shortkey-primary-black.png",
  alternateBlackDark: "/logo/alternate/shortkey-primary-black-on-dark.png",
  src: "/logo/shortkey-primary.png",
  fallbackSrc: "/logo/alternate/shortkey-primary-black.png",
  width: ${cleared.info.width},
  height: ${cleared.info.height},
  v: "${v}",
} as const;
`,
);

console.log("logoMeta v=", v);
console.log("DONE — production mark is LILAC (Simplex-ity)");
