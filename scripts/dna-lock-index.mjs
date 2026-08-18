/**
 * ShortKey DNA Lock indexer.
 * Scans canonical IP / DNA / family / Maya / AI-logic files and writes
 * core/index.json (Markdown/JSON inventory). Does not invent DNA.
 *
 * Usage:
 *   node scripts/dna-lock-index.mjs          # write core/index.json
 *   node scripts/dna-lock-index.mjs --check  # fail if index is stale
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "core", "index.json");
const checkMode = process.argv.includes("--check");

const TEXT_FORMATS = new Set([".md", ".json", ".txt", ".mdc"]);
const BINARY_FORMATS = new Set([".png", ".jpeg", ".jpg", ".webp", ".svg"]);

const SCAN_DIRS = [
  "src/brand",
  "MASTER_REFERENCE",
  ".cursor/rules",
  ".cursor/skills",
  "core",
];

const SCAN_FILES = [
  "ARCHITECTURE.md",
  "CONNECTIONS.md",
  "COMMERCE.md",
  "src/data/shortkey-platform-manifest.json",
  ".cursor/mcp.json",
];

const SCAN_LOGO_DIRS = ["public/logo"];

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".next",
  "archive",
  "alternate",
]);

const SKIP_FILE_NAMES = new Set(["index.json"]);

function posixPath(p) {
  return p.split(sep).join("/");
}

function walk(absDir, acc) {
  if (!existsSync(absDir)) return;
  for (const name of readdirSync(absDir)) {
    if (SKIP_DIR_NAMES.has(name)) continue;
    const abs = join(absDir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walk(abs, acc);
      continue;
    }
    if (SKIP_FILE_NAMES.has(name) && posixPath(relative(root, abs)) === "core/index.json") {
      continue;
    }
    acc.push(abs);
  }
}

function categoryFor(rel) {
  const p = rel.toLowerCase();
  if (p.startsWith("core/")) return "control_center";
  if (p.startsWith("public/logo/")) return "logo_asset";
  if (p.startsWith(".cursor/rules/") || p.startsWith(".cursor/skills/")) {
    return "ai_logic";
  }
  if (p === ".cursor/mcp.json") return "ai_logic";
  if (p.includes("/maya/")) return "maya_stories";
  if (p.startsWith("master_reference/")) return "master_reference";
  if (
    p.includes("family_") ||
    p.includes("node_family") ||
    p.includes("perspective_protocol") ||
    p.includes("/pool/") ||
    p.includes("collaborative_ecosystem") ||
    p.includes("coeur_")
  ) {
    return "family_os";
  }
  if (
    p.includes("families.json") ||
    p.includes("capability-registry") ||
    p.includes("/vault/") ||
    p.includes("learning-log") ||
    p.includes("orchestrator.ts") ||
    p.includes("collective_intelligence") ||
    p.includes("master_os") ||
    p.includes("sky_intelligence")
  ) {
    return "ai_logic";
  }
  if (
    p.includes("architecture") ||
    p.includes("connections") ||
    p.includes("commerce") ||
    p.includes("blueprint") ||
    p.includes("ecosystem") ||
    p.includes("platform-manifest") ||
    p.includes("domain_feature")
  ) {
    return "architecture";
  }
  if (p.endsWith(".ts") || p.endsWith(".tsx") || p.endsWith(".mjs")) {
    return "implementation";
  }
  return "brand_dna";
}

function formatFor(rel) {
  const ext = extname(rel).toLowerCase();
  if (ext === ".md" || ext === ".mdc") return "markdown";
  if (ext === ".json") return "json";
  if (ext === ".txt") return "text";
  if (BINARY_FORMATS.has(ext)) return ext.slice(1);
  if (ext === ".ts" || ext === ".tsx") return "typescript";
  if (ext === ".mjs" || ext === ".js") return "javascript";
  return ext.replace(".", "") || "unknown";
}

function isCanonicalStorage(format) {
  return format === "markdown" || format === "json" || format === "text";
}

function hashFile(abs) {
  return createHash("sha256").update(readFileSync(abs)).digest("hex");
}

function collect() {
  const absFiles = [];
  for (const dir of SCAN_DIRS) {
    walk(join(root, dir), absFiles);
  }
  for (const dir of SCAN_LOGO_DIRS) {
    walk(join(root, dir), absFiles);
  }
  for (const file of SCAN_FILES) {
    const abs = join(root, file);
    if (existsSync(abs)) absFiles.push(abs);
  }

  const unique = [...new Set(absFiles)];
  const assets = [];

  for (const abs of unique) {
    const rel = posixPath(relative(root, abs));
    if (rel === "core/index.json") continue;
    const ext = extname(rel).toLowerCase();
    const keepText = TEXT_FORMATS.has(ext) || ext === ".ts" || ext === ".tsx" || ext === ".mjs";
    const keepBinary = BINARY_FORMATS.has(ext) && rel.startsWith("public/logo/");
    if (!keepText && !keepBinary) continue;

    const st = statSync(abs);
    const format = formatFor(rel);
    const category = categoryFor(rel);
    const sha256 = hashFile(abs);

    if (format === "json") {
      JSON.parse(readFileSync(abs, "utf8"));
    }

    assets.push({
      path: rel,
      category,
      format,
      canonicalStorage: isCanonicalStorage(format),
      bytes: st.size,
      sha256,
    });
  }

  assets.sort((a, b) => a.path.localeCompare(b.path));
  return assets;
}

function buildIndex(assets) {
  const categories = {};
  let canonicalCount = 0;
  for (const asset of assets) {
    categories[asset.category] = (categories[asset.category] ?? 0) + 1;
    if (asset.canonicalStorage) canonicalCount += 1;
  }

  return {
    schema: "shortkey.dna.lock.v1",
    workspace: "shortkey-core",
    role: "Control Center",
    sourceRepo: "KieranSimpee/shortkey",
    intendedPrivateRepo: "KieranSimpee/shortkey-core",
    lock: "ShortKey DNA Lock — platform-agnostic Markdown/JSON for canonical IP",
    status: "GOR_GOR_REVIEW",
    authority: "Cursor indexes and backs up. Cursor does not decide DNA.",
    assetCount: assets.length,
    canonicalStorageCount: canonicalCount,
    categories,
    assets,
  };
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const assets = collect();
const index = buildIndex(assets);
const serialized = stableStringify(index);

if (checkMode) {
  if (!existsSync(outPath)) {
    console.error("DNA lock index missing. Run: npm run dna:lock");
    process.exit(1);
  }
  const current = readFileSync(outPath, "utf8");
  if (current !== serialized) {
    console.error("DNA lock index is stale. Run: npm run dna:lock");
    process.exit(1);
  }
  console.log(`DNA lock OK — ${index.assetCount} assets indexed.`);
  process.exit(0);
}

mkdirSync(join(root, "core"), { recursive: true });
writeFileSync(outPath, serialized);
console.log(`Wrote ${posixPath(relative(root, outPath))} (${index.assetCount} assets).`);
