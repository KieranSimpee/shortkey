import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");

const file = "C:/Users/Kieran/Projects/shortkey/public/images/hero-tryon-model-clear.png";
const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let transparent = 0;
let total = 0;
for (let i = 3; i < data.length; i += info.channels) {
  total++;
  if (data[i] < 16) transparent++;
}
console.log({
  size: `${info.width}x${info.height}`,
  transparent,
  total,
  ratio: (transparent / total).toFixed(3),
});
