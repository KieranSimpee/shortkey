/**
 * Visual-lock → clean extract for light primary.
 * 1) Keep full composition master untouched
 * 2) Gentle white→alpha only (no ink / keycap rewrite)
 * 3) Trim + pad + 2× lanczos for retina header/footer
 *
 * Run: node scripts/extract-logo-from-visual-lock.mjs
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const visualLock = path.join(
  root,
  "src/brand/logo-locked/Shortkey_Logo_lilac_visual-lock-1024.png",
);
const master = path.join(root, "src/brand/logo-locked/Shortkey_Logo_lilac.png");
const outPrimary = path.join(root, "public/logo/shortkey-primary.png");
const outMeta = path.join(root, "src/generated/logoMeta.ts");

if (!fs.existsSync(visualLock) && fs.existsSync(master)) {
  fs.copyFileSync(master, visualLock);
}
if (!fs.existsSync(visualLock)) {
  console.error("Missing visual lock:", visualLock);
  process.exit(1);
}

const lockMeta = await sharp(visualLock).metadata();
console.log("Visual lock:", lockMeta.width, "x", lockMeta.height);

const { data, info } = await sharp(visualLock)
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
  if (r > 248 && g > 248 && b > 248) {
    px[i + 3] = 0;
    continue;
  }
  if (chroma < 8 && r > 245 && g > 245 && b > 245) {
    px[i + 3] = 0;
  }
}

const cleared = await sharp(px, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 4 })
  .extend({
    top: 24,
    bottom: 24,
    left: 24,
    right: 24,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 6, effort: 10 })
  .toBuffer({ resolveWithObject: true });

const hi = await sharp(cleared.data)
  .resize({
    width: cleared.info.width * 2,
    height: cleared.info.height * 2,
    kernel: "lanczos3",
  })
  .png({ compressionLevel: 6 })
  .toBuffer({ resolveWithObject: true });

fs.writeFileSync(outPrimary, hi.data);
console.log("Primary:", hi.info.width, "x", hi.info.height);

const v = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);

let meta = fs.readFileSync(outMeta, "utf8");
meta = meta.replace(/width: \d+/, `width: ${hi.info.width}`);
meta = meta.replace(/height: \d+/, `height: ${hi.info.height}`);
meta = meta.replace(/v: "[^"]+"/, `v: "${v}"`);
fs.writeFileSync(outMeta, meta);
console.log("logoMeta v=", v);
console.log("DONE — light primary from visual lock (gentle extract)");
