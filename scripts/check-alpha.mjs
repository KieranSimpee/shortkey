import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");

async function stats(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  let opaque = 0;
  for (let i = 3; i < data.length; i += info.channels) {
    if (data[i] < 16) transparent++;
    else opaque++;
  }
  console.log(file.split(/[/\\]/).pop(), info.width + "x" + info.height, "transparentpx", transparent, "opaque", opaque);
}

await stats("C:/Users/Kieran/Projects/shortkey/public/images/shortkey-logo-clear.png");
await stats("C:/Users/Kieran/Projects/shortkey/public/images/hero-model-cutout-clear.png");
await stats("C:/Users/Kieran/.cursor/projects/c-Users-Kieran-Projects-shortkey/assets/hero-model-transparent.png");
await stats("C:/Users/Kieran/.cursor/projects/c-Users-Kieran-Projects-shortkey/assets/shortkey-logo-transparent.png");
