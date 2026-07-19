/**
 * Visual-lock shortkey logo FIRST, then edge flood-fill clear the plate, then trim.
 * Supports black OR white plates (attached lilac logo is on white).
 */
import { createRequire } from "node:module";
import path from "node:path";
import { copyFileSync, existsSync } from "node:fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = "C:/Users/Kieran/Projects/shortkey/public/images";
const src = path.join(root, "shortkey-logo.png");
const lockedCopy = path.join(root, "shortkey-logo-locked.png");
const out = path.join(root, "shortkey-logo-clear.png");

if (!existsSync(src)) {
  console.error("missing source", src);
  process.exit(1);
}

// 1) Visual lock — archive mark before any alpha work
copyFileSync(src, lockedCopy);
console.log("1/3 visual lock →", lockedCopy);

const { data, info } = await sharp(lockedCopy).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height, channels } = info;

// Sample corners to detect plate color
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
console.log("plate detected:", plateIsWhite ? "white" : "dark", "avg", avg.map((n) => Math.round(n)));

const isPlate = (r, g, b) => {
  if (plateIsWhite) {
    // white / near-white plate — keep lilac wordmark & soft shadows
    const lum = (r + g + b) / 3;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (lum < 235) return false;
    if (sat > 0.06) return false; // lilac text has saturation
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

const clearedBuf = await sharp(data, { raw: { width, height, channels } })
  .png()
  .toBuffer();
console.log("2/3 plate edge-cleared (mark protected)");

const trimMeta = await sharp(clearedBuf).trim({ threshold: 8 }).png().toFile(out);
console.log("3/3 trimmed clear →", out, `${trimMeta.width}×${trimMeta.height}`);
