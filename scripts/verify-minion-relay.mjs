/**
 * Verify Minion Relay → Base44 Message persistence (no key print).
 *
 * Usage: npm run minion:verify
 * Or:    node scripts/verify-minion-relay.mjs
 *
 * Writes one persistOnly relay cycle (6 hops) then lists recent message_types.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[trimmed.slice(0, eq).trim()] = val;
  }
}

loadEnvLocal();

const key =
  process.env.K_MINION_API_KEY?.trim() || process.env.KMINION?.trim() || "";
if (!key) {
  console.error("FAIL: K_MINION_API_KEY missing in .env.local");
  process.exit(1);
}

const { createClient } = await import(
  pathToFileURL(join(root, "node_modules", "@base44", "sdk", "dist", "index.js"))
    .href
);

const APP_ID = "6a5f20ace942aedd542584a2";
const base44 = createClient({
  appId: APP_ID,
  headers: { api_key: key },
});

const stamp = new Date().toISOString();
const events = [
  "kieran_message",
  "minion_hop",
  "simpee_instruction",
  "family_response",
  "review_status",
  "final_answer",
];

let parentId = null;
const saved = [];

for (const event of events) {
  const row = await base44.entities.Message.create({
    sender_name:
      event === "kieran_message"
        ? "Kieran"
        : event === "simpee_instruction" || event === "review_status"
          ? "Simpee"
          : event === "family_response"
            ? "gorgor"
            : "K Minion",
    recipient_name: event === "kieran_message" ? "K Minion" : "Kieran",
    recipient_id:
      event === "kieran_message" ? "6a5f20afe942aedd542584a4" : null,
    content: `[verify] ${event} @ ${stamp}`,
    message_type: event,
    workflow_steps: JSON.stringify({
      event,
      at: stamp,
      verify: true,
    }),
    parent_id: parentId,
  });
  if (!parentId) parentId = row.id;
  saved.push({ event, id: row.id, message_type: row.message_type });
}

console.log("ok=true");
console.log("app_id=", APP_ID);
console.log("env=K_MINION_API_KEY");
console.log("entity=Message");
console.log("relay_root_id=", parentId);
console.log(
  "hops=",
  saved.map((s) => `${s.event}:${s.id.slice(-6)}`).join(" | "),
);

const recent = await base44.entities.Message.list("-created_date", 8);
const types = (recent || []).map((m) => m.message_type);
console.log("recent_types=", types.join(","));
console.log(
  "verify=GET http://localhost:3005/api/minion/relay  (or Desk → POST /api/minion/relay)",
);
