/**
 * LOGO-001 install — ShortKey Logo Governance Standard v1.0
 * Copies approved clear mark → public/brand/LOGO-001.png + LOGO-001.svg
 * Updates src/generated/logoMeta.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = path.join(root, "public", "brand");
const clearPng = path.join(root, "public", "images", "shortkey-logo-clear.png");
const sourcePng = path.join(
  root,
  "src",
  "fix-zone",
  "logo-lilac-clear",
  "original",
  "Shortkey-Logo-Lilac-source.png",
);
const logo001Png = path.join(brandDir, "LOGO-001.png");
const logo001Svg = path.join(brandDir, "LOGO-001.svg");
const logo001Source = path.join(brandDir, "LOGO-001-SOURCE.png");
const metaPath = path.join(root, "src", "generated", "logoMeta.ts");

fs.mkdirSync(brandDir, { recursive: true });

if (!fs.existsSync(clearPng)) {
  console.error("Missing approved clear PNG:", clearPng);
  process.exit(1);
}

fs.copyFileSync(clearPng, logo001Png);
if (fs.existsSync(sourcePng)) {
  fs.copyFileSync(sourcePng, logo001Source);
}

const png = fs.readFileSync(logo001Png);
const b64 = png.toString("base64");
const width = 818;
const height = 505;
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title">
  <title id="title">ShortKey Primary Logo (LOGO-001)</title>
  <image width="${width}" height="${height}" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
fs.writeFileSync(logo001Svg, svg);

const v = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);

fs.writeFileSync(
  metaPath,
  `/** LOGO-001 — ShortKey Primary Logo (governance-locked). Do not edit by hand; run scripts/install-logo-001.mjs */
export const logoMeta = {
  id: "LOGO-001",
  name: "ShortKey Primary Logo",
  src: "/brand/LOGO-001.svg",
  fallbackSrc: "/brand/LOGO-001.png",
  width: ${width},
  height: ${height},
  v: "${v}",
} as const;
`,
);

console.log("Installed LOGO-001");
console.log("  PNG:", logo001Png, png.length, "bytes");
console.log("  SVG:", logo001Svg, Buffer.byteLength(svg), "bytes");
console.log("  meta v:", v);
