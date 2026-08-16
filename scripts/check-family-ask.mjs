/**
 * Report Base44 family ask CLI wiring (scripts present + key env presence only).
 * Does NOT call Base44 — never claims Connected/live without a probe.
 *
 * Usage: npm run connections:family
 */

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return false;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
  return true;
}

const SEATS = [
  {
    name: "Kura",
    script: "scripts/ask-kura.mjs",
    npm: "ask:kura",
    agentId: "6a54198bebbee048f44e1378",
  },
  {
    name: "Gor Gor (Simpee)",
    script: "scripts/ask-gorgor.mjs",
    npm: "ask:gorgor",
    agentId: "69ddc914cfcf229762ac123d",
  },
  {
    name: "Senti",
    script: "scripts/ask-senti.mjs",
    npm: "ask:senti",
    agentId: "6a42029cc124d0206f027335",
  },
  {
    name: "Agent R",
    script: "scripts/ask-agent-r.mjs",
    npm: "ask:agent-r",
    agentId: "6a449e8691d185359beef333",
  },
];

const envLocalPresent = loadEnvLocal();

const keyVars = [
  "KURA_API_KEY",
  "BASE44_API_KEY",
  "BASE44_AGENT_API_KEY",
];
const keyPresence = Object.fromEntries(
  keyVars.map((k) => [k, Boolean((process.env[k] || "").trim())]),
);
const anyKeySet = Object.values(keyPresence).some(Boolean);

console.log("\nBase44 family ask CLI wiring\n");
console.log(
  `  .env.local: ${envLocalPresent ? "present" : "missing (paste key when ready)"}`,
);
console.log("  Shared key env (presence only — values never printed):");
for (const [k, set] of Object.entries(keyPresence)) {
  console.log(`    ${set ? "✓" : "·"} ${k}${set ? " set" : " unset"}`);
}
console.log(
  `  Shared key usable: ${anyKeySet ? "yes (at least one alias set)" : "no — not live yet"}`,
);
console.log("");

let missingScripts = 0;
for (const seat of SEATS) {
  const path = join(root, seat.script);
  const hasScript = existsSync(path);
  if (!hasScript) missingScripts += 1;
  const status = hasScript ? "script ready" : "SCRIPT MISSING";
  const liveHint = anyKeySet
    ? "key present — run npm to probe (do not assume Connected)"
    : "scaffold only until key pasted";
  console.log(
    `  ${hasScript ? "✓" : "✗"} ${seat.name} · npm run ${seat.npm} · ${status}`,
  );
  console.log(`      agent ${seat.agentId}`);
  console.log(`      ${liveHint}`);
}

console.log(`\nCommands (after key in .env.local):`);
console.log(`  npm run ask:kura -- "…"`);
console.log(`  npm run ask:gorgor -- "…"`);
console.log(`  npm run ask:senti -- "…"`);
console.log(`  npm run ask:agent-r -- "…"`);
console.log(
  `\nHonesty: this checker does not call Base44. Missing key ≠ Connected.\n`,
);

process.exit(missingScripts ? 1 : 0);
