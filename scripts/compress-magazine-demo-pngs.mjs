/**
 * Compress magazine-demo PNGs so Vercel Hobby deploy stays under size limits.
 * Local-only utility — not part of runtime.
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "magazine-demo", "issue-01");

let before = 0;
let after = 0;

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".png"))) {
  const p = path.join(dir, f);
  const buf = fs.readFileSync(p);
  before += buf.length;
  // Blueprints are dense UI chrome — allow more palette compression.
  const isBlueprint = f.startsWith("blueprint-");
  const out = await sharp(buf)
    .png({
      compressionLevel: 9,
      palette: true,
      quality: isBlueprint ? 70 : 82,
      effort: 10,
    })
    .toBuffer();
  fs.writeFileSync(p, out);
  after += out.length;
  console.log(
    `${f}: ${(buf.length / 1e6).toFixed(2)}MB -> ${(out.length / 1e6).toFixed(2)}MB`,
  );
}

console.log(
  `TOTAL: ${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB`,
);
