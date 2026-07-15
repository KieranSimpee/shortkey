import { createRequire } from "node:module";
import path from "node:path";
import { copyFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = "C:/Users/Kieran/Projects/shortkey/public/images";
const src = path.join(root, "hero-tryon-model.png");
const locked = path.join(root, "hero-tryon-model-locked.png");
const out = path.join(root, "hero-tryon-model-clear.png");

function isLilacPlate(r, g, b) {
  const lum = (r + g + b) / 3;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  // Generated try-on plate is soft lavender (~#E8DFF5); keep warmer highlights alone
  if (lum < 175) return false;
  if (sat > 0.28) return false;
  // lilac / periwinkle bias
  if (b >= g - 8 && r > 170 && g > 160 && b > 175) return true;
  // near-white pale studio wash
  if (lum > 225 && sat < 0.12) return true;
  return false;
}

function isLikelySubject(r, g, b) {
  // warm skin
  if (r > 140 && g > 90 && b > 70 && r > b && r - b > 12) return true;
  // cream / ivory top fabric — warm bright, not lilac-biased
  const lum = (r + g + b) / 3;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (lum > 200 && sat < 0.14 && r >= b && Math.abs(r - g) < 28) return true;
  // dark hair
  if (lum < 95 && sat < 0.35) return true;
  return false;
}

copyFileSync(src, locked);

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height, channels } = info;
const visited = new Uint8Array(width * height);
const stack = [];
const idx = (x, y) => (y * width + x) * channels;

const push = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (isLikelySubject(r, g, b)) return;
  if (!isLilacPlate(r, g, b)) return;
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

// Soft edge residual lilac near transparent neighbors
for (let y = 2; y < height - 2; y++) {
  for (let x = 2; x < width - 2; x++) {
    const i = idx(x, y);
    if (data[i + 3] === 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isLikelySubject(r, g, b)) continue;
    if (!isLilacPlate(r, g, b)) continue;
    let near = false;
    for (const [dx, dy] of [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ]) {
      if (data[idx(x + dx, y + dy) + 3] === 0) near = true;
    }
    if (near) data[i + 3] = Math.min(data[i + 3], 80);
  }
}

await sharp(data, { raw: { width, height, channels } }).png().toFile(out);
console.log("try-on model cleared", out);
