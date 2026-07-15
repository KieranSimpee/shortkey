import fs from "fs";
import path from "path";

const root = "C:/Users/Kieran/Projects/shortkey";
const publicDir = path.join(root, "public");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(publicDir).map((p) => "/" + path.relative(publicDir, p).replace(/\\/g, "/"));
const refs = new Set();

function scanDir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) scanDir(p);
    else if (/\.(ts|tsx|css)$/.test(e.name)) {
      const t = fs.readFileSync(p, "utf8");
      for (const m of t.matchAll(/["'](\/images\/[^"']+)["']/g)) refs.add(m[1]);
      for (const m of t.matchAll(/commandImg\(["']([^"']+)["']\)/g))
        refs.add(`/images/commands/${m[1]}.jpg`);
      for (const m of t.matchAll(/productImg\(["']([^"']+)["']\)/g))
        refs.add(`/images/products/${m[1].toLowerCase()}.jpg`);
      for (const m of t.matchAll(/lookImg\(["']([^"']+)["']\)/g))
        refs.add(`/images/looks/${m[1]}.jpg`);
    }
  }
}

scanDir(path.join(root, "src"));

const missing = [...refs].filter((r) => !files.includes(r)).sort();
const unused = files.filter((f) => !refs.has(f) && f.startsWith("/images/")).sort();
const empty = files.filter((f) => fs.statSync(path.join(publicDir, f.slice(1))).size === 0);

console.log("REFERENCED:", refs.size);
console.log("ON DISK:", files.length);
console.log("MISSING:", missing.length ? missing.join("\n") : "(none)");
console.log("EMPTY:", empty.length ? empty.join("\n") : "(none)");
console.log("UNUSED:", unused.length ? unused.join("\n") : "(none)");
