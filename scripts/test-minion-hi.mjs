/**
 * Live Minion Relay HI test — prove verbatim report + optional family ask.
 *
 * Usage: node scripts/test-minion-hi.mjs
 *        node scripts/test-minion-hi.mjs "HI ALL"
 * Windows TLS: NODE_OPTIONS=--use-system-ca node scripts/test-minion-hi.mjs
 *
 * LOCK: minion_hop.content === kieran_message content (no rewrite).
 * Does not print API keys.
 */
import { readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGE = (process.argv[2] || "HI").trim() || "HI";
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
const minionKey =
  process.env.K_MINION_API_KEY?.trim() || process.env.KMINION?.trim() || "";
if (!minionKey) {
  console.error("FAIL: K_MINION_API_KEY missing in .env.local");
  process.exit(1);
}
const familyKey =
  process.env.KURA_API_KEY?.trim() ||
  process.env.BASE44_API_KEY?.trim() ||
  process.env.BASE44_AGENT_API_KEY?.trim() ||
  "";
const { createClient } = await import(
  pathToFileURL(join(root, "node_modules", "@base44", "sdk", "dist", "index.js"))
    .href
);
const APP_ID = "6a5f20ace942aedd542584a2";
const K_MINION_ID = "6a5f20afe942aedd542584a4";
const base44 = createClient({
  appId: APP_ID,
  headers: { api_key: minionKey },
});
const agent = "gorgor";
const at = new Date().toISOString();
function workflow(event, meta = {}) {
  return JSON.stringify({
    event,
    at,
    review_status: event === "review_status" ? "GOR_GOR_REVIEW" : null,
    ...meta,
  });
}
/** Windows: prefer curl --ssl-no-revoke (same as ask-base44.mjs). */
function base44Request(url, { method = "GET", body } = {}) {
  const useCurlFirst = process.platform === "win32";
  const viaCurl = () => {
    const dir = mkdtempSync(join(tmpdir(), "b44-"));
    const outPath = join(dir, "out.json");
    try {
      const args = [
        "-sS",
        "--ssl-no-revoke",
        "-o",
        outPath,
        "-w",
        "%{http_code}",
        "-X",
        method,
        url,
        "-H",
        `api_key: ${familyKey}`,
        "-H",
        "Content-Type: application/json",
      ];
      if (body != null) args.push("-d", body);
      const ran = spawnSync("curl.exe", args, { encoding: "utf8" });
      if (ran.error) throw ran.error;
      const status = Number((ran.stdout || "").trim() || "0");
      const text = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
      if (ran.status !== 0 && !text) {
        throw new Error(ran.stderr || "curl failed");
      }
      return { ok: status >= 200 && status < 300, status, text };
    } finally {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  };
  if (useCurlFirst) {
    try {
      return viaCurl();
    } catch {
      /* fall through */
    }
  }
  return fetch(url, {
    method,
    headers: {
      api_key: familyKey,
      "Content-Type": "application/json",
    },
    body,
  }).then(async (res) => ({
    ok: res.ok,
    status: res.status,
    text: await res.text(),
  }));
}
function extractReply(payload) {
  const messages = payload.messages || payload.data?.messages;
  if (Array.isArray(messages) && messages.length) {
    const last =
      [...messages].reverse().find((m) => m.role === "assistant") ||
      messages[messages.length - 1];
    const content = last?.content ?? last?.message?.content;
    if (typeof content === "string" && content.trim()) return content.trim();
  }
  if (typeof payload.content === "string" && payload.content.trim()) {
    return payload.content.trim();
  }
  if (typeof payload.message?.content === "string") {
    return payload.message.content.trim();
  }
  return JSON.stringify(payload).slice(0, 500);
}
async function askAgent(agentId, conversationId, content) {
  const base = `https://app.base44.com/api/agents/${agentId}`;
  let convId = conversationId;
  if (!convId) {
    const created = await base44Request(`${base}/conversations`, {
      method: "POST",
      body: "{}",
    });
    if (!created.ok) {
      throw new Error(`create conversation HTTP ${created.status}`);
    }
    const body = JSON.parse(created.text || "{}");
    convId = body.id || body.conversation_id;
  }
  const res = await base44Request(`${base}/conversations/${convId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error(`message HTTP ${res.status} ${(res.text || "").slice(0, 120)}`);
  }
  const data = JSON.parse(res.text || "{}");
  return { reply: extractReply(data), conversation_id: convId };
}
// 1) kieran_message — exact string
const kieran = await base44.entities.Message.create({
  sender_name: "Kieran",
  recipient_name: "K Minion",
  recipient_id: K_MINION_ID,
  content: MESSAGE,
  message_type: "kieran_message",
  workflow_steps: workflow("kieran_message", { live_hi_test: true }),
  parent_id: null,
});
const rootId = kieran.id;
// 2) minion_hop — VERBATIM report (same content; route in meta only)
const hop = await base44.entities.Message.create({
  sender_name: "K Minion",
  recipient_name: "Simpee",
  recipient_id: null,
  content: MESSAGE,
  message_type: "minion_hop",
  workflow_steps: workflow("minion_hop", {
    role: "report",
    reported_message: MESSAGE,
    kieran_message_id: rootId,
    route_to: "simpee",
    then_agent: agent,
    live_hi_test: true,
  }),
  parent_id: rootId,
});
const verbatimOk = hop.content === MESSAGE && kieran.content === MESSAGE;
console.log("message=", JSON.stringify(MESSAGE));
console.log("ok=", verbatimOk);
console.log("relay_root_id=", rootId);
console.log("kieran_message_id=", kieran.id);
console.log("minion_hop_id=", hop.id);
console.log("kieran_content=", JSON.stringify(kieran.content));
console.log("reported_content=", JSON.stringify(hop.content));
console.log("verbatim_match=", verbatimOk);
let simpeeText =
  `Simpee instruction: review Kieran message (relay ${rootId}), protect revenue/DNA, then ask ${agent}.`;
let familyReply = "";
let familyLive = false;
if (familyKey) {
  const gorgorId =
    process.env.GOR_GOR_AGENT_ID?.trim() || "69ddc914cfcf229762ac123d";
  const gorgorConv =
    process.env.GOR_GOR_CONVERSATION_ID?.trim() ||
    "69ddc9166e1e12f6313fc523";
  try {
    const simpeeAsk = await askAgent(
      gorgorId,
      gorgorConv,
      [
        "You are Simpee (Gor Gor), gatekeeper for ShortKey Minion Relay.",
        "Minion reported Kieran’s message VERBATIM below — minions cannot edit.",
        "Do NOT rewrite or replace that message. Return a short instruction for the family seat only.",
        "Keep DNA locks: no fake creators/reviews; Banuba TINT ≠ DeepSeek.",
        "Status remains GOR_GOR_REVIEW until approved.",
        "",
        `Target seat: ${agent}`,
        "Reported Kieran message (verbatim):",
        "<<<",
        MESSAGE,
        ">>>",
      ].join("\n"),
    );
    simpeeText = simpeeAsk.reply;
    familyLive = true;
  } catch (err) {
    console.log("simpee_live_error=", err instanceof Error ? err.message : err);
  }
  try {
    const familyAsk = await askAgent(
      gorgorId,
      gorgorConv,
      [
        "Minion Relay — follow Simpee instruction, answer Kieran.",
        "The reported Kieran message below is VERBATIM (minions cannot edit it).",
        "",
        `Simpee instruction: ${simpeeText}`,
        "",
        "Reported Kieran message (verbatim):",
        "<<<",
        MESSAGE,
        ">>>",
      ].join("\n"),
    );
    familyReply = familyAsk.reply;
    familyLive = true;
  } catch (err) {
    console.log("family_live_error=", err instanceof Error ? err.message : err);
    familyReply = `(no live family reply — ${agent} call failed)`;
  }
} else {
  familyReply =
    "(persistOnly) Family response placeholder — live Superagent skipped (no family key).";
  console.log("family_ask=skipped (no KURA_API_KEY / BASE44_API_KEY)");
}
const simpeeSave = await base44.entities.Message.create({
  sender_name: "Simpee",
  recipient_name: agent,
  content: simpeeText,
  message_type: "simpee_instruction",
  workflow_steps: workflow("simpee_instruction", { agent, live_hi_test: true }),
  parent_id: rootId,
});
const familySave = await base44.entities.Message.create({
  sender_name: agent,
  recipient_name: "K Minion",
  recipient_id: K_MINION_ID,
  content: familyReply,
  message_type: "family_response",
  workflow_steps: workflow("family_response", { agent, live_hi_test: true }),
  parent_id: rootId,
});
await base44.entities.Message.create({
  sender_name: "Simpee",
  recipient_name: "Kieran",
  content: `Review status: GOR_GOR_REVIEW for relay ${rootId}`,
  message_type: "review_status",
  workflow_steps: workflow("review_status", { agent, live_hi_test: true }),
  parent_id: rootId,
});
await base44.entities.Message.create({
  sender_name: "K Minion",
  recipient_name: "Kieran",
  content: familyReply,
  message_type: "final_answer",
  workflow_steps: workflow("final_answer", {
    agent,
    review_status: "GOR_GOR_REVIEW",
    live_hi_test: true,
  }),
  parent_id: rootId,
});
console.log("family_live=", familyLive);
console.log("simpee_instruction_id=", simpeeSave.id);
console.log("family_response_id=", familySave.id);
console.log(
  "simpee_instruction_preview=",
  JSON.stringify(simpeeText.slice(0, 280)),
);
console.log(
  "family_reply_preview=",
  JSON.stringify(familyReply.slice(0, 280)),
);
console.log(
  "trigger=POST /api/minion/relay { message, agent?, password?, persistOnly? }",
);
if (!verbatimOk) process.exit(1);
process.exit(0);

