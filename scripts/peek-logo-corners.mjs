import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");

const { data, info } = await sharp(
  "C:/Users/Kieran/Projects/shortkey/public/images/shortkey-logo-clear.png",
)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const c = (x, y) => {
  const i = (y * info.width + x) * info.channels;
  return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
};

console.log(info.width, "x", info.height);
console.log("TL", c(0, 0));
console.log("TR", c(info.width - 1, 0));
console.log("BL", c(0, info.height - 1));
console.log("BR", c(info.width - 1, info.height - 1));
