/**
 * SHORTKEY V3.0 — install official logo pack under public/logo/
 * Strict: CTRL + ALT + SHORTKEY wordmark + tagline (Lilac Edition).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoDir = path.join(root, "public", "logo");
fs.mkdirSync(logoDir, { recursive: true });

/** Shared geometry — keycaps + wordmark + tagline */
function primarySvg({ mode }) {
  const dark = mode === "dark";
  // Transparent plate — composites on Dark Luxury / White surfaces
  const keyFace = dark ? "#FFFFFF" : "#161226";
  const keyText = dark ? "#161226" : "#FFFFFF";
  const word = dark ? "#FFFFFF" : "#161226";
  const accent = "#8C82FC";
  const tag = dark ? "#B9B3FF" : "#8C82FC";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200" viewBox="0 0 480 200" role="img" aria-labelledby="title">
  <title id="title">Shortkey — CTRL + ALT</title>
  <!-- CTRL -->
  <rect x="48" y="28" width="100" height="56" rx="10" fill="${keyFace}"/>
  <text x="98" y="63" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="22" font-weight="600" fill="${keyText}">ctrl</text>
  <!-- + -->
  <text x="168" y="64" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="28" font-weight="600" fill="${accent}">+</text>
  <!-- ALT -->
  <rect x="188" y="28" width="100" height="56" rx="10" fill="${keyFace}"/>
  <text x="238" y="63" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="22" font-weight="600" fill="${keyText}">alt</text>
  <!-- WORDMARK -->
  <text x="48" y="128" font-family="Montserrat, Arial, sans-serif" font-size="42" font-weight="600" letter-spacing="1" fill="${word}">SHORTKEY</text>
  <!-- TAGLINE -->
  <text x="48" y="162" font-family="Montserrat, Arial, sans-serif" font-size="14" font-weight="500" letter-spacing="2.2" fill="${tag}">YOUR STYLE. YOUR CTRL.</text>
</svg>
`;
}

function iconSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-labelledby="title">
  <title id="title">Shortkey icon — CTRL + ALT</title>
  <rect width="256" height="256" rx="48" fill="#161226"/>
  <rect x="28" y="92" width="84" height="52" rx="10" fill="#FFFFFF"/>
  <text x="70" y="125" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="20" font-weight="600" fill="#161226">ctrl</text>
  <text x="128" y="126" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="26" font-weight="600" fill="#8C82FC">+</text>
  <rect x="144" y="92" width="84" height="52" rx="10" fill="#FFFFFF"/>
  <text x="186" y="125" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="20" font-weight="600" fill="#161226">alt</text>
</svg>
`;
}

const darkPath = path.join(logoDir, "shortkey-primary-dark.svg");
const lightPath = path.join(logoDir, "shortkey-primary-light.svg");
const iconPath = path.join(logoDir, "shortkey-icon.svg");

fs.writeFileSync(darkPath, primarySvg({ mode: "dark" }));
fs.writeFileSync(lightPath, primarySvg({ mode: "light" }));
fs.writeFileSync(iconPath, iconSvg());

const iconBuf = fs.readFileSync(iconPath);
for (const size of [32, 64, 128, 256, 512]) {
  const out = path.join(logoDir, `shortkey-favicon-${size}.png`);
  await sharp(iconBuf).resize(size, size).png().toFile(out);
  console.log("favicon", size, out);
}

const metaPath = path.join(root, "src", "generated", "logoMeta.ts");
const v = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);

fs.writeFileSync(
  metaPath,
  `/** SHORTKEY V3.0 Lilac Edition — official logo pack. Run scripts/install-v3-logo-pack.mjs */
export const logoMeta = {
  id: "V3-LILAC",
  name: "Shortkey CTRL + ALT",
  edition: "Lilac",
  dark: "/logo/shortkey-primary-dark.svg",
  light: "/logo/shortkey-primary-light.svg",
  icon: "/logo/shortkey-icon.svg",
  /** Default for hero / dark surfaces */
  src: "/logo/shortkey-primary-dark.svg",
  fallbackSrc: "/logo/shortkey-primary-light.svg",
  width: 480,
  height: 200,
  v: "${v}",
} as const;
`,
);

console.log("V3 logo pack installed →", logoDir);
console.log("logoMeta v=", v);
