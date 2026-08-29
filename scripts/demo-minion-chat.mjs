/**
 * Smoke-test Minion Chat Box (shared family thread via HTTP API).
 *
 * Prefers Beauty server on :3005. Does not print API keys.
 *
 *   node c:/Users/Kieran/Projects/shortkey/scripts/demo-minion-chat.mjs
 *   node .../demo-minion-chat.mjs "your message"
 *   node .../demo-minion-chat.mjs --persist-only
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const persistOnly = args.includes("--persist-only");
const message =
  args.filter((a) => a !== "--persist-only").join(" ").trim() ||
  "Platform development status — each seat update your area in this Minion Chat Box. GOR_GOR_REVIEW.";

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

const base =
  process.env.MINION_CHAT_BASE_URL?.trim() || "http://127.0.0.1:3005";
const password =
  process.env.DESK_ACCESS_PASSWORD?.trim() ||
  process.env.SITE_ACCESS_PASSWORD?.trim() ||
  "";

console.log("Minion Chat Box smoke");
console.log("base=", base);
console.log("persistOnly=", persistOnly);
console.log("message=", message.slice(0, 120));

let res;
try {
  res = await fetch(`${base}/api/minion/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      password: password || undefined,
      persistOnly,
    }),
  });
} catch (err) {
  console.error("FAIL: cannot reach", `${base}/api/minion/chat`);
  console.error("Start Beauty first: npm run dev  (port 3005)");
  console.error(String(err && err.message ? err.message : err));
  process.exit(1);
}

const text = await res.text();
let data;
try {
  data = JSON.parse(text);
} catch {
  console.error("FAIL: non-JSON", res.status, text.slice(0, 300));
  process.exit(1);
}

if (!res.ok) {
  console.error("FAIL", res.status, data.error || data.code);
  process.exit(1);
}

console.log("ok=", data.ok);
console.log("relay_root_id=", data.relay_root_id);
console.log("review_status=", data.review_status);
console.log("warnings=", data.warnings || []);
console.log(
  "seats=",
  (data.seats || []).map((s) => ({
    seat: s.seat,
    ok: s.ok,
    preview: String(s.reply || "").slice(0, 80),
  })),
);
console.log(
  "thread=",
  (data.thread || []).map((b) => ({
    from: b.from_seat,
    role: b.role,
    type: b.message_type,
    preview: String(b.content || "").slice(0, 60),
  })),
);

if (data.relay_root_id) {
  const reload = await fetch(
    `${base}/api/minion/chat?root_id=${encodeURIComponent(data.relay_root_id)}`,
  );
  const reloadData = await reload.json();
  const count = (reloadData.thread || []).length;
  console.log("reload_ok=", reload.ok);
  console.log("reload_count=", count);
  console.log("co_visible=", count >= 3);
  console.log("open=", `${base}/desk/#family`);
  console.log(
    "thread_api=",
    `${base}/api/minion/chat?root_id=${data.relay_root_id}`,
  );
}

process.exit(data.relay_root_id ? 0 : 1);

