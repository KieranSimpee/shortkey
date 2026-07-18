/**
 * Verify permanent Shortkey connection chain (no rebuild).
 * See CONNECTIONS.md
 *
 * Usage: npm run connections:check
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const EXPECTED = {
  githubOwner: "KieranSimpee",
  githubRepo: "shortkey",
  remoteIncludes: "KieranSimpee/shortkey",
  vercelUrl: "https://shortkey.vercel.app",
  productsApi:
    "https://app.base44.com/api/apps/69ddc914cfcf229762ac123d/functions/getShortKeyProducts",
  sentiApi:
    "https://app.base44.com/api/apps/6a42029cc124d0206f027335/functions/getShortKeyData",
  shopifyStore: "simplex-ity-dev.myshopify.com",
};

function findGit() {
  const candidates = [
    process.env.GIT_EXE,
    "C:\\Users\\Kieran\\AppData\\Local\\GitHubDesktop\\app-3.6.2\\resources\\app\\git\\cmd\\git.exe",
    "C:\\Program Files\\Git\\cmd\\git.exe",
    "git",
  ].filter(Boolean);
  for (const bin of candidates) {
    try {
      execFileSync(bin, ["--version"], { stdio: "ignore" });
      return bin;
    } catch {
      /* try next */
    }
  }
  return null;
}

const results = [];

function ok(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name} — ${detail}`);
}
function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

console.log("\nShortkey connection chain check\n");

// 1. Git remote
const gitBin = findGit();
if (!gitBin) {
  fail("GitHub remote", "git binary not found (install Git or GitHub Desktop)");
} else {
  try {
    const remote = execFileSync(gitBin, ["-C", root, "remote", "get-url", "origin"], {
      encoding: "utf8",
    }).trim();
    if (remote.includes(EXPECTED.remoteIncludes)) {
      ok("GitHub remote", remote);
    } else {
      fail("GitHub remote", `expected KieranSimpee/shortkey, got ${remote}`);
    }
  } catch (e) {
    fail("GitHub remote", e instanceof Error ? e.message : "git failed");
  }
}

// 2. Base44 products
try {
  const res = await fetch(`${EXPECTED.productsApi}?limit=1`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (res.ok) {
    const json = await res.json().catch(() => ({}));
    const n = json?.products?.length ?? json?.data?.products?.length ?? "?";
    ok("Base44 products API", `HTTP ${res.status} (sample count: ${n})`);
  } else {
    fail(
      "Base44 products API",
      `HTTP ${res.status} — keep app ID; fix auth/public access — do not recreate`,
    );
  }
} catch (e) {
  fail("Base44 products API", e instanceof Error ? e.message : "fetch failed");
}

// 3. Base44 Senti
try {
  const res = await fetch(`${EXPECTED.sentiApi}?type=all`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: "{}",
  });
  if (res.ok) {
    ok("Base44 Senti bridge", `HTTP ${res.status}`);
  } else {
    fail(
      "Base44 Senti bridge",
      `HTTP ${res.status} — keep app 6a42029cc124d0206f027335; fix auth, do not recreate`,
    );
  }
} catch (e) {
  fail("Base44 Senti bridge", e instanceof Error ? e.message : "fetch failed");
}

// 4. Shopify map in repo
const skuMapPath = join(root, "src", "lib", "commerce", "sku-map.ts");
if (existsSync(skuMapPath)) {
  const src = readFileSync(skuMapPath, "utf8");
  const gids = (src.match(/gid:\/\/shopify\/ProductVariant\/\d+/g) || []).length;
  if (gids > 0) {
    ok("Shopify sku-map", `${gids} variant GIDs · store ${EXPECTED.shopifyStore}`);
  } else {
    fail("Shopify sku-map", "no variant GIDs found");
  }
} else {
  fail("Shopify sku-map", "file missing");
}

// 5. CONNECTIONS.md present
if (existsSync(join(root, "CONNECTIONS.md"))) {
  ok("CONNECTIONS.md", "permanent chain documented");
} else {
  fail("CONNECTIONS.md", "missing — restore from git");
}

console.log("\nLocked endpoints (do not recreate):");
console.log(`  GitHub   https://github.com/${EXPECTED.githubOwner}/${EXPECTED.githubRepo}`);
console.log(`  Vercel   ${EXPECTED.vercelUrl}`);
console.log(`  Base44   products + senti app IDs in CONNECTIONS.md`);
console.log(`  Shopify  ${EXPECTED.shopifyStore}`);

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed.\n`);
if (failed) {
  console.log("Note: Base44 403 = auth, not a broken link. Fix access; do not create new apps.\n");
}
process.exit(failed ? 1 : 0);
