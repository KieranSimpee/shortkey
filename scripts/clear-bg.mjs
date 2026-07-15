import { createRequire } from "node:module";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve("C:/Users/Kieran/Projects/shortkey");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("sharp not found");
    process.exit(1);
  }

  const assets = "C:/Users/Kieran/.cursor/projects/c-Users-Kieran-Projects-shortkey/assets";
  const outDir = path.join(root, "public/images");

  // Logo: make near-black pixels transparent
  const logoSrc = path.join(outDir, "shortkey-logo.png");
  const logoOut = path.join(outDir, "shortkey-logo-clear.png");
  const logo = sharp(logoSrc).ensureAlpha();
  const { data, info } = await logo.raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // black / near-black plate → transparent
    if (r < 40 && g < 40 && b < 40) {
      data[i + 3] = 0;
    }
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toFile(logoOut);
  console.log("wrote", logoOut);

  // Model: remove light lilac/lavender plate from solo portrait
  const modelSrc = path.join(outDir, "hero-model-solo.png");
  const modelOut = path.join(outDir, "hero-model-cutout-clear.png");
  const model = sharp(modelSrc).ensureAlpha();
  const m = await model.raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < m.data.length; i += m.info.channels) {
    const r = m.data[i];
    const g = m.data[i + 1];
    const b = m.data[i + 2];
    // soft lilac / near-white lavender backdrop
    const isLilac =
      r > 200 &&
      g > 190 &&
      b > 210 &&
      b >= g &&
      Math.abs(r - g) < 45 &&
      b - Math.min(r, g) < 55;
    const isPale =
      r > 230 && g > 225 && b > 230 && Math.max(r, g, b) - Math.min(r, g, b) < 25;
    if (isLilac || isPale) {
      m.data[i + 3] = 0;
    }
  }
  await sharp(m.data, {
    raw: { width: m.info.width, height: m.info.height, channels: m.info.channels },
  })
    .png()
    .toFile(modelOut);
  console.log("wrote", modelOut);

  // Also try generated transparent assets if present
  const genModel = path.join(assets, "hero-model-transparent.png");
  if (existsSync(genModel)) {
    copyFileSync(genModel, path.join(outDir, "hero-model-transparent-raw.png"));
  }
  const genLogo = path.join(assets, "shortkey-logo-transparent.png");
  if (existsSync(genLogo)) {
    copyFileSync(genLogo, path.join(outDir, "shortkey-logo-transparent-raw.png"));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
