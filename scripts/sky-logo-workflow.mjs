/**
 * SKY WORKFLOW — logo
 * 1) Visual-lock master (never edit the lock)
 * 2) Edge flood-fill clear plate only (keys / X / wordmark / tagline protected)
 * 3) Soft fringe + trim → shortkey-logo-clear.png
 *
 * Usage:
 *   node scripts/sky-logo-workflow.mjs [optional-source.png]
 * Default source: ./Shortkey-Logo.png (repo root) or public/images/shortkey-logo.png
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

const argSrc = process.argv[2];
const defaultMaster = path.join(root, "Shortkey-Logo.png");
const source = argSrc
  ? path.resolve(argSrc)
  : existsSync(defaultMaster)
    ? defaultMaster
    : workingPath;

if (!existsSync(source)) {
  console.error("SKY workflow: missing source", source);
  process.exit(1);
}

console.log("SKY workflow source →", source);

// Remove previous clear so nothing stale is served
for (const p of [clearPath]) {
  if (existsSync(p)) unlinkSync(p);
}

// 1) Visual lock FIRST — archive then set working master from lock
copyFileSync(source, lockedPath);
copyFileSync(lockedPath, workingPath);
console.log("1/4 visual lock →", lockedPath);

// 2) Detect plate from corners on locked pixels
const { data, info } = await sharp(lockedPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height, channels } = info;
const corner = (x, y) => {
  const i = (y * width + x) * channels;
  return [data[i], data[i + 1], data[i + 2]];
};
const samples = [
  corner(2, 2),
  corner(width - 3, 2),
  corner(2, height - 3),
  corner(width - 3, height - 3),
];
const avg = samples
  .reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0])
  .map((v) => v / samples.length);
const plateIsWhite = avg[0] > 200 && avg[1] > 200 && avg[2] > 200;
console.log(
  "2/4 plate →",
  plateIsWhite ? "white" : "dark",
  "avg",
  avg.map((n) => Math.round(n)),
);

const isPlate = (r, g, b) => {
  if (plateIsWhite) {
    const lum = (r + g + b) / 3;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    // Keep lilac wordmark/tagline (has saturation). Clear flat white only.
    if (lum < 242) return false;
    if (sat > 0.045) return false;
    return true;
  }
  return r < 36 && g < 36 && b < 36;
};

const visited = new Uint8Array(width * height);
const stack = [];
const idx = (x, y) => (y * width + x) * channels;
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (!isPlate(data[i], data[i + 1], data[i + 2])) return;
  visited[p] = 1;
  stack.push([x, y]);
};

for (let x = 0; x < width; x++) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y++) {
  push(0, y);
  push(width - 1, y);
}

while (stack.length) {
  const [x, y] = stack.pop();
  data[idx(x, y) + 3] = 0;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}

// Soft fringe on plate-adjacent pixels (never opaque mark cores)
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const i = idx(x, y);
    if (data[i + 3] === 0) continue;
    if (!isPlate(data[i], data[i + 1], data[i + 2])) continue;
    let nearClear = false;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      if (data[idx(x + dx, y + dy) + 3] === 0) nearClear = true;
    }
    if (nearClear) data[i + 3] = 0;
  }
}

console.log("3/4 plate cleared (mark protected)");

const clearedBuf = await sharp(data, { raw: { width, height, channels } })
  .png()
  .toBuffer();

const trimMeta = await sharp(clearedBuf).trim({ threshold: 6 }).png().toFile(clearPath);
console.log("4/4 clear trimmed →", clearPath, `${trimMeta.width}×${trimMeta.height}`);

// Verify
const check = await sharp(clearPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let clear = 0;
let opaque = 0;
for (let i = 3; i < check.data.length; i += check.info.channels) {
  if (check.data[i] < 16) clear++;
  else opaque++;
}
const total = check.info.width * check.info.height;
console.log("SKY verify", {
  clearPct: ((clear / total) * 100).toFixed(1),
  opaquePct: ((opaque / total) * 100).toFixed(1),
});

// Cache-bust token so a normal reload serves the new clear mark
const stamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);
mkdirSync(path.dirname(metaPath), { recursive: true });
writeFileSync(
  metaPath,
  `/** Auto-written by scripts/sky-logo-workflow.mjs — do not edit by hand. */
export const logoMeta = {
  src: "/images/shortkey-logo-clear.png",
  width: ${trimMeta.width},
  height: ${trimMeta.height},
  /** Query bust so browser reload picks up a new plate clear without Ctrl+F5 */
  v: "${stamp}",
} as const;
`,
);
console.log("cache bust →", metaPath, `v=${stamp}`);
