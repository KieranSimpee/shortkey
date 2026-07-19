import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");

async function stats(label, file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  let opaque = 0;
  let clear = 0;
  let blackOpaque = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const a = data[i + 3];
    if (a === 0) clear++;
    else {
      opaque++;
      if (data[i] < 36 && data[i + 1] < 36 && data[i + 2] < 36) blackOpaque++;
    }
  }
  const total = info.width * info.height;
  console.log(label, {
    w: info.width,
    h: info.height,
    clearPct: ((clear / total) * 100).toFixed(1),
    opaquePct: ((opaque / total) * 100).toFixed(1),
    blackStillOpaque: blackOpaque,
  });
}

await stats("locked", "C:/Users/Kieran/Projects/shortkey/public/images/shortkey-logo-locked.png");
await stats("clear", "C:/Users/Kieran/Projects/shortkey/public/images/shortkey-logo-clear.png");
await stats("src", "C:/Users/Kieran/Projects/shortkey/public/images/shortkey-logo.png");
