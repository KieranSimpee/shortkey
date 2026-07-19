/**
 * SKY extract — visual lock FIRST.
 * 1) Edge-flood clear white plate
 * 2) Keep only 3 largest remaining white blobs (keycaps)
 * 3) Clear ALL other white (counters, fringe, islands)
 * 4) Clear drop-shadows
 */
import { createRequire } from "node:module";
import path from "node:path";
import { copyFileSync, existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = "C:/Users/Kieran/Projects/shortkey";
const imgDir = path.join(root, "public/images");
const lockedPath = path.join(imgDir, "shortkey-logo-locked.png");
const workingPath = path.join(imgDir, "shortkey-logo.png");
const clearPath = path.join(imgDir, "shortkey-logo-clear.png");
const metaPath = path.join(root, "src/generated/logoMeta.ts");

const master = process.argv[2]
  ? path.resolve(process.argv[2])
  : existsSync(path.join(root, "Shortkey-Logo.png"))
    ? path.join(root, "Shortkey-Logo.png")
    : workingPath;

if (!existsSync(master)) {
  console.error("missing source", master);
  process.exit(1);
}
if (existsSync(clearPath)) unlinkSync(clearPath);

copyFileSync(master, lockedPath);
copyFileSync(lockedPath, workingPath);
console.log("1/6 visual lock →", lockedPath);

const { data, info } = await sharp(lockedPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height, channels } = info;
const idx = (x, y) => (y * width + x) * channels;
const lum = (r, g, b) => (r + g + b) / 3;
const sat = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
};

const isBrandInk = (r, g, b) => {
  const s = sat(r, g, b);
  const L = lum(r, g, b);
  return s > 0.07 && L > 60 && L < 235 && b >= g - 20 && r > 85;
};

const isWhiteish = (r, g, b, a = 255) => {
  if (a < 16) return false;
  if (isBrandInk(r, g, b)) return false;
  const L = lum(r, g, b);
  const s = sat(r, g, b);
  // Aggressive: catch plate, letter counters, pale fringe
  return L >= 200 && s < 0.18;
};

const isDropShadow = (r, g, b) => {
  if (isBrandInk(r, g, b)) return false;
  const L = lum(r, g, b);
  const s = sat(r, g, b);
  return s <= 0.18 && L <= 210;
};

// --- 2) Edge flood-fill white plate ---
const visited = new Uint8Array(width * height);
const stack = [];
const pushEdgeWhite = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (!isWhiteish(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
  visited[p] = 1;
  stack.push([x, y]);
};
for (let x = 0; x < width; x++) {
  pushEdgeWhite(x, 0);
  pushEdgeWhite(x, height - 1);
}
for (let y = 0; y < height; y++) {
  pushEdgeWhite(0, y);
  pushEdgeWhite(width - 1, y);
}
let plateCleared = 0;
while (stack.length) {
  const [x, y] = stack.pop();
  data[idx(x, y) + 3] = 0;
  plateCleared++;
  pushEdgeWhite(x + 1, y);
  pushEdgeWhite(x - 1, y);
  pushEdgeWhite(x, y + 1);
  pushEdgeWhite(x, y - 1);
}
console.log("2/6 edge white plate cleared", plateCleared);

// --- 3) Label remaining white components; keep top 3 (keys) ---
const label = new Int32Array(width * height).fill(-1);
const sizes = [];
let nextId = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = y * width + x;
    if (label[p] !== -1) continue;
    const i = idx(x, y);
    if (data[i + 3] === 0) continue;
    if (!isWhiteish(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;

    const id = nextId++;
    sizes[id] = 0;
    const st = [[x, y]];
    label[p] = id;
    while (st.length) {
      const [cx, cy] = st.pop();
      sizes[id]++;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const np = ny * width + nx;
        if (label[np] !== -1) continue;
        const ni = idx(nx, ny);
        if (data[ni + 3] === 0) continue;
        if (!isWhiteish(data[ni], data[ni + 1], data[ni + 2], data[ni + 3])) continue;
        label[np] = id;
        st.push([nx, ny]);
      }
    }
  }
}

// Centroid Y for each component — keys sit in the upper band
const sumY = new Float64Array(nextId);
const countN = new Float64Array(nextId);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const id = label[y * width + x];
    if (id < 0) continue;
    sumY[id] += y;
    countN[id]++;
  }
}

const ranked = sizes
  .map((size, id) => ({
    id,
    size: size || 0,
    cy: countN[id] ? sumY[id] / countN[id] : 0,
  }))
  .filter((c) => c.size > 0)
  .sort((a, b) => b.size - a.size);

// Keycaps sit ABOVE the wordmark — pick topmost white blobs in key band
const keyCandidates = ranked
  .filter((c) => c.size >= 40 && c.size <= 2500 && c.cy < height * 0.5)
  .sort((a, b) => a.cy - b.cy || b.size - a.size)
  .slice(0, 3);
const keepIds = new Set(keyCandidates.map((c) => c.id));
console.log(
  "3/6 top white blobs",
  ranked.slice(0, 10).map((c) => ({ size: c.size, cy: Math.round(c.cy) })),
  "keep keys",
  keyCandidates.map((c) => ({ size: c.size, cy: Math.round(c.cy) })),
);

let islandCleared = 0;
for (let p = 0; p < width * height; p++) {
  const id = label[p];
  if (id < 0) continue;
  if (keepIds.has(id)) continue;
  data[p * channels + 3] = 0;
  islandCleared++;
}
console.log("4/6 cleared white islands/counters", islandCleared);

// Global: any pale/white not in the 3 keycaps → gone (letter holes, fringe)
for (let p = 0; p < width * height; p++) {
  const i = p * channels;
  if (data[i + 3] === 0) continue;
  if (keepIds.has(label[p])) continue;
  if (isBrandInk(data[i], data[i + 1], data[i + 2])) continue;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const L = lum(r, g, b);
  const s = sat(r, g, b);
  if (L >= 190 && s < 0.2) data[i + 3] = 0;
}

// Second pass: flood from clear into pale pixels still stuck in counters
visited.fill(0);
stack.length = 0;
const pushPale = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (data[i + 3] === 0) return;
  if (keepIds.has(label[p])) return;
  if (isBrandInk(data[i], data[i + 1], data[i + 2])) return;
  const L = lum(data[i], data[i + 1], data[i + 2]);
  const s = sat(data[i], data[i + 1], data[i + 2]);
  if (!(L >= 185 && s < 0.22)) return;
  visited[p] = 1;
  stack.push([x, y]);
};
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (data[idx(x, y) + 3] !== 0) continue;
    pushPale(x + 1, y);
    pushPale(x - 1, y);
    pushPale(x, y + 1);
    pushPale(x, y - 1);
  }
}
while (stack.length) {
  const [x, y] = stack.pop();
  data[idx(x, y) + 3] = 0;
  pushPale(x + 1, y);
  pushPale(x - 1, y);
  pushPale(x, y + 1);
  pushPale(x, y - 1);
}

// --- 5) Shadows ---
visited.fill(0);
stack.length = 0;
const pushShadow = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (data[i + 3] === 0) return;
  if (keepIds.has(label[p])) return;
  if (isBrandInk(data[i], data[i + 1], data[i + 2])) return;
  if (!isDropShadow(data[i], data[i + 1], data[i + 2])) return;
  visited[p] = 1;
  stack.push([x, y]);
};
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const i = idx(x, y);
    if (data[i + 3] === 0) continue;
    if (!isDropShadow(data[i], data[i + 1], data[i + 2])) continue;
    let near = false;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      if (data[idx(x + dx, y + dy) + 3] === 0) near = true;
    }
    if (near) pushShadow(x, y);
  }
}
while (stack.length) {
  const [x, y] = stack.pop();
  data[idx(x, y) + 3] = 0;
  pushShadow(x + 1, y);
  pushShadow(x - 1, y);
  pushShadow(x, y + 1);
  pushShadow(x, y - 1);
}
console.log("5/6 shadows cleared");

// Despeckle: kill tiny white halo crumbs (< 35px) still opaque
{
  const lab2 = new Int32Array(width * height).fill(-1);
  const sz2 = [];
  let nid = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (lab2[p] !== -1) continue;
      const i = idx(x, y);
      if (data[i + 3] === 0) continue;
      if (!isWhiteish(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
      const id = nid++;
      sz2[id] = 0;
      const st = [[x, y]];
      lab2[p] = id;
      while (st.length) {
        const [cx, cy] = st.pop();
        sz2[id]++;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const np = ny * width + nx;
          if (lab2[np] !== -1) continue;
          const ni = idx(nx, ny);
          if (data[ni + 3] === 0) continue;
          if (!isWhiteish(data[ni], data[ni + 1], data[ni + 2], data[ni + 3])) continue;
          lab2[np] = id;
          st.push([nx, ny]);
        }
      }
    }
  }
  let crumbs = 0;
  for (let p = 0; p < width * height; p++) {
    const id = lab2[p];
    if (id < 0) continue;
    if ((sz2[id] || 0) >= 35) continue;
    if (keepIds.has(label[p])) continue;
    data[p * channels + 3] = 0;
    crumbs++;
  }
  console.log("5b/6 white halo crumbs cleared", crumbs);
}

const buf = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
const meta = await sharp(buf).trim({ threshold: 2 }).png().toFile(clearPath);
console.log("6/6 →", clearPath, `${meta.width}×${meta.height}`);

const check = await sharp(clearPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let clear = 0;
let whiteLeft = 0;
for (let i = 0; i < check.data.length; i += check.info.channels) {
  if (check.data[i + 3] < 16) {
    clear++;
    continue;
  }
  const r = check.data[i];
  const g = check.data[i + 1];
  const b = check.data[i + 2];
  if ((r + g + b) / 3 >= 225 && sat(r, g, b) < 0.12) whiteLeft++;
}
const total = check.info.width * check.info.height;
console.log("verify", {
  clearPct: ((clear / total) * 100).toFixed(1),
  opaqueNearWhite: whiteLeft,
  note: "opaqueNearWhite should be ~keycap faces only",
});

const stamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);
mkdirSync(path.dirname(metaPath), { recursive: true });
writeFileSync(
  metaPath,
  `/** Auto-written by scripts/sky-logo-extract.mjs — do not edit by hand. */
export const logoMeta = {
  src: "/images/shortkey-logo-clear.png",
  width: ${meta.width},
  height: ${meta.height},
  /** Query bust so browser reload picks up a new plate clear without Ctrl+F5 */
  v: "${stamp}",
} as const;
`,
);
console.log("cache bust →", metaPath, `v=${stamp}`);
