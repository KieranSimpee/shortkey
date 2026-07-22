/**
 * Fix-zone build: locked master → clear plate + strip keycap drop-shadows.
 * Output: ./shortkey-logo-noshadow-clear.png (+ updates public when --install)
 */
import { createRequire } from "node:module";
import path from "node:path";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const locked = path.join(here, "original/shortkey-logo-locked.png");
const outFix = path.join(here, "shortkey-logo-noshadow-clear.png");
const outPublic = path.join(root, "public/images/shortkey-logo-clear.png");
const outWorking = path.join(root, "public/images/shortkey-logo.png");
const metaPath = path.join(root, "src/generated/logoMeta.ts");
const install = process.argv.includes("--install");

if (!existsSync(locked)) {
  console.error("missing original lock", locked);
  process.exit(1);
}

const { data, info } = await sharp(locked).ensureAlpha().raw().toBuffer({
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

const isKeyFace = (r, g, b, a) => {
  if (a < 16 || isBrandInk(r, g, b)) return false;
  const L = lum(r, g, b);
  const s = sat(r, g, b);
  return L >= 210 && s < 0.2;
};

const isPlateDark = (r, g, b) => r < 36 && g < 36 && b < 36;

const isDropShadow = (r, g, b, a) => {
  if (a < 16 || isBrandInk(r, g, b) || isKeyFace(r, g, b, a)) return false;
  const L = lum(r, g, b);
  const s = sat(r, g, b);
  // Soft gray under keys (and leftover vignette)
  return s <= 0.22 && L <= 205;
};

// 1) Edge-clear dark plate
const visited = new Uint8Array(width * height);
const stack = [];
const pushPlate = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  const i = idx(x, y);
  if (!isPlateDark(data[i], data[i + 1], data[i + 2])) return;
  visited[p] = 1;
  stack.push([x, y]);
};
for (let x = 0; x < width; x++) {
  pushPlate(x, 0);
  pushPlate(x, height - 1);
}
for (let y = 0; y < height; y++) {
  pushPlate(0, y);
  pushPlate(width - 1, y);
}
while (stack.length) {
  const [x, y] = stack.pop();
  data[idx(x, y) + 3] = 0;
  pushPlate(x + 1, y);
  pushPlate(x - 1, y);
  pushPlate(x, y + 1);
  pushPlate(x, y - 1);
}

// 2) Clear ALL drop-shadow pixels (not key faces, not brand ink)
let shadows = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y);
    if (data[i + 3] === 0) continue;
    if (!isDropShadow(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
    data[i + 3] = 0;
    shadows++;
  }
}
console.log("shadows cleared", shadows);

const buf = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
const meta = await sharp(buf).trim({ threshold: 4 }).png().toFile(outFix);
console.log("fix-zone clear →", outFix, `${meta.width}×${meta.height}`);

if (install) {
  copyFileSync(outFix, outPublic);
  copyFileSync(locked, outWorking);
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  mkdirSync(path.dirname(metaPath), { recursive: true });
  writeFileSync(
    metaPath,
    `/** Auto-written by fix-zone logo-no-shadow build — do not edit by hand. */
export const logoMeta = {
  src: "/images/shortkey-logo-clear.png",
  width: ${meta.width},
  height: ${meta.height},
  /** Query bust so browser reload picks up a new plate clear without Ctrl+F5 */
  v: "${stamp}",
} as const;
`,
  );
  console.log("installed →", outPublic, `v=${stamp}`);
}
