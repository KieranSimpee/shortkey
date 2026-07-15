import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = "C:/Users/Kieran/Projects/shortkey/public/images";

function isBackdrop(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const lum = (r + g + b) / 3;
  // pale lilac / white studio plate
  if (lum > 215 && sat < 0.18) return true;
  if (r > 210 && g > 200 && b > 215 && sat < 0.22 && b >= r - 10) return true;
  return false;
}

function isSkinish(r, g, b) {
  return r > 140 && g > 90 && b > 70 && r > g && g > b - 20 && r - b > 20;
}

async function rematteModel() {
  const src = path.join(root, "hero-model-solo.png");
  const out = path.join(root, "hero-model-cutout-clear.png");
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const idx = (x, y) => (y * width + x) * channels;

  // Flood fill from edges
  const visited = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    const i = idx(x, y);
    if (!isBackdrop(data[i], data[i + 1], data[i + 2])) return;
    if (isSkinish(data[i], data[i + 1], data[i + 2])) return;
    visited[p] = 1;
    stack.push(p);
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
    const p = stack.pop();
    const x = p % width;
    const y = (p / width) | 0;
    const i = idx(x, y);
    data[i + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  // Soften remaining near-white plate near already-transparent neighbors
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = idx(x, y);
      if (data[i + 3] === 0) continue;
      if (!isBackdrop(data[i], data[i + 1], data[i + 2])) continue;
      if (isSkinish(data[i], data[i + 1], data[i + 2])) continue;
      let nearT = false;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        if (data[idx(x + dx, y + dy) + 3] === 0) nearT = true;
      }
      if (nearT) data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(out);
  console.log("model rematte done", out);
}

async function rematteLogo() {
  const src = path.join(root, "shortkey-logo.png");
  const out = path.join(root, "shortkey-logo-clear.png");
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 48 && g < 48 && b < 48) data[i + 3] = 0;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toFile(out);
  console.log("logo rematte done", out);
}

await rematteModel();
await rematteLogo();
