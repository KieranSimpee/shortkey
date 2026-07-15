import { createRequire } from "node:module";
import path from "node:path";
import { copyFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = "C:/Users/Kieran/Projects/shortkey/public/images";

/**
 * Visual-lock originals first, then edge flood-fill only —
 * protects logo keys/wordmark and the model's white collar.
 */

async function lockThenClearLogo() {
  const locked = path.join(root, "shortkey-logo.png");
  const lockedCopy = path.join(root, "shortkey-logo-locked.png");
  copyFileSync(locked, lockedCopy);

  const { data, info } = await sharp(locked).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const stack = [];

  const isBlackPlate = (r, g, b) => r < 36 && g < 36 && b < 36;
  const idx = (x, y) => (y * width + x) * channels;
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    const i = idx(x, y);
    if (!isBlackPlate(data[i], data[i + 1], data[i + 2])) return;
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

  const out = path.join(root, "shortkey-logo-clear.png");
  await sharp(data, { raw: { width, height, channels } }).png().toFile(out);
  console.log("logo locked + cleared", out);
}

function isLilacPlate(r, g, b) {
  const lum = (r + g + b) / 3;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  // Soft lavender plate (not white collar fabric which is cooler/bright but tighter to body)
  if (lum < 200) return false;
  if (sat > 0.2) return false;
  // lilac bias: blue-ish and pale
  return b >= g - 5 && r > 195 && g > 185 && b > 200;
}

function isLikelyCollarOrSkin(r, g, b) {
  // warm skin
  if (r > 145 && g > 95 && b > 75 && r > b && r - b > 15) return true;
  // white fabric collar — bright, low sat, but keep if not lilac-biased
  const lum = (r + g + b) / 3;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (lum > 220 && sat < 0.08 && Math.abs(r - b) < 12) return true;
  return false;
}

async function lockThenClearModel() {
  const locked = path.join(root, "hero-model-solo.png");
  const lockedCopy = path.join(root, "hero-model-locked.png");
  copyFileSync(locked, lockedCopy);

  const { data, info } = await sharp(locked).ensureAlpha().raw().toBuffer({
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
    if (isLikelyCollarOrSkin(r, g, b)) return;
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
    const i = idx(x, y);
    data[i + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  // Light soft-edge around already clear lilac residuals (never collar whites)
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const i = idx(x, y);
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isLikelyCollarOrSkin(r, g, b)) continue;
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
      if (near) data[i + 3] = Math.min(data[i + 3], 90);
    }
  }

  const out = path.join(root, "hero-model-cutout-clear.png");
  await sharp(data, { raw: { width, height, channels } }).png().toFile(out);
  console.log("model locked + collar-preserved clear", out);
}

await lockThenClearLogo();
await lockThenClearModel();
