/**
 * NEW SUBMIT workflow (no clone of old assets):
 * 1) Visual-lock submitted master FIRST
 * 2) Clear white plate only — keys / X / wordmark / tagline untouched
 * 3) --install → replace live clear PNG → scripts/install-logo-001.mjs (LOGO-001)
 */
import { createRequire } from "node:module";
import path from "node:path";
import { copyFileSync, existsSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const submitted =
  process.argv[2] && !process.argv[2].startsWith("--")
    ? path.resolve(process.argv[2])
    : path.join(root, "Shortkey-Logo.png");

const lockedPath = path.join(root, "public/images/shortkey-logo-locked.png");
const workingPath = path.join(root, "public/images/shortkey-logo.png");
const clearPath = path.join(root, "public/images/shortkey-logo-clear.png");
const fixClear = path.join(here, "shortkey-logo-clear.png");
const install = process.argv.includes("--install");

if (!existsSync(submitted)) {
  console.error("missing submitted master", submitted);
  process.exit(1);
}

console.log("source (new submit) →", submitted);

// 1) VISUAL LOCK FIRST — never edit the lock
copyFileSync(submitted, lockedPath);
copyFileSync(lockedPath, workingPath);
console.log("1/4 visual lock →", lockedPath);

const { data, info } = await sharp(lockedPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height, channels } = info;
const idx = (x, y) => (y * width + x) * channels;

const corner = (x, y) => {
  const i = idx(x, y);
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

/** Flat plate only — never touch lilac ink or key faces */
const isPlate = (r, g, b) => {
  if (plateIsWhite) {
    const lum = (r + g + b) / 3;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (lum < 242) return false;
    if (sat > 0.045) return false;
    return true;
  }
  return r < 36 && g < 36 && b < 36;
};

const visited = new Uint8Array(width * height);
const stack = [];
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

// Soft fringe on plate-adjacent plate pixels only
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

console.log("3/4 plate cleared (logo mark unchanged)");

const clearedBuf = await sharp(data, { raw: { width, height, channels } })
  .png()
  .toBuffer();
const trimMeta = await sharp(clearedBuf)
  .trim({ threshold: 6 })
  .png()
  .toFile(fixClear);
console.log("4/4 →", fixClear, `${trimMeta.width}×${trimMeta.height}`);

if (install) {
  if (existsSync(clearPath)) unlinkSync(clearPath);
  copyFileSync(fixClear, clearPath);
  console.log("REPLACE live clear →", clearPath);
  // Governance: clear PNG is input only — LOGO-001 is the authority
  const { spawnSync } = await import("node:child_process");
  const installLogo = spawnSync(
    process.execPath,
    [path.join(root, "scripts", "install-logo-001.mjs")],
    { stdio: "inherit" },
  );
  if (installLogo.status !== 0) process.exit(installLogo.status ?? 1);
}
