/**
 * Ask Gor Gor / Simpee (Base44 Superagent) — Chief of Staff · Memory · Gatekeeper.
 * Secrets: BASE44_AGENT_API_KEY (preferred) · BASE44_API_KEY · KURA_API_KEY
 * from env / .env.local (never commit).
 *
 * Usage:
 *   npm run ask:gorgor -- "Review this handoff before Gor Gor lock"
 *   node scripts/ask-gorgor.mjs "your message"
 *
 * Scaffold only — exits cleanly if the key is missing (no fake replies).
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_AGENT_ID = "69ddc914cfcf229762ac123d";
const FORBIDDEN_AGENT_ID_SUFFIX = "123f";

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;
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
}

loadEnvLocal();

function resolveAgentId() {
  const fromEnv =
    process.env.SIMPEE_AGENT_ID?.trim() ||
    process.env.GOR_GOR_AGENT_ID?.trim() ||
    "";
  if (!fromEnv) return DEFAULT_AGENT_ID;
  if (fromEnv.toLowerCase().endsWith(FORBIDDEN_AGENT_ID_SUFFIX)) {
    return DEFAULT_AGENT_ID;
  }
  return fromEnv;
}

const agentId = resolveAgentId();
const baseRoot = (
  process.env.BASE44_AGENT_API_BASE_URL?.trim() ||
  "https://app.base44.com/api/agents"
).replace(/\/+$/, "");
const BASE = `${baseRoot}/${agentId}`;

const apiKey = (
  process.env.BASE44_AGENT_API_KEY ||
  process.env.BASE44_API_KEY ||
  process.env.KURA_API_KEY ||
  ""
).trim();
const message = process.argv.slice(2).join(" ").trim();

if (!apiKey) {
  console.error(`
Missing API key for Gor Gor (Simpee).

Step 1 (scaffold ready — no live call yet):
1. Open Simpee / Gor Gor Editor → Settings → Developer → API Key
2. Copy .env.example → .env.local (if needed)
3. Set:  BASE44_AGENT_API_KEY=your_key_here
   (accepted aliases: BASE44_API_KEY · KURA_API_KEY)
4. Optional: SIMPEE_AGENT_ID=${DEFAULT_AGENT_ID}
5. Re-run: npm run ask:gorgor -- "your question"

Never commit .env.local.
`);
  process.exit(1);
}

if (!message) {
  console.error('Usage: npm run ask:gorgor -- "your question for Gor Gor"');
  process.exit(1);
}

const headers = {
  api_key: apiKey,
  "Content-Type": "application/json",
};

async function main() {
  const convRes = await fetch(`${BASE}/conversations`, {
    method: "POST",
    headers,
    body: "{}",
  });
  const convText = await convRes.text();
  if (!convRes.ok) {
    console.error(`Create conversation failed (${convRes.status}): ${convText}`);
    process.exit(1);
  }
  let conv;
  try {
    conv = JSON.parse(convText);
  } catch {
    console.error("Create conversation: invalid JSON", convText);
    process.exit(1);
  }
  const conversationId = conv.id || conv.conversation_id;
  if (!conversationId) {
    console.error("No conversation id in response:", convText);
    process.exit(1);
  }

  const msgRes = await fetch(`${BASE}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify({ content: message }),
  });
  const msgText = await msgRes.text();
  if (!msgRes.ok) {
    console.error(`Send message failed (${msgRes.status}): ${msgText}`);
    process.exit(1);
  }

  let payload;
  try {
    payload = JSON.parse(msgText);
  } catch {
    console.log(msgText);
    return;
  }

  const messages = payload.messages || payload.data?.messages;
  if (Array.isArray(messages) && messages.length) {
    const last =
      [...messages].reverse().find((m) => m.role === "assistant") ||
      messages[messages.length - 1];
    const content = last?.content ?? last?.message?.content;
    if (content) {
      console.log(content);
      console.error(`\n[conversation_id=${conversationId}]`);
      return;
    }
  }

  if (payload.content || payload.message?.content) {
    console.log(payload.content || payload.message.content);
    console.error(`\n[conversation_id=${conversationId}]`);
    return;
  }

  console.log(JSON.stringify(payload, null, 2));
  console.error(`\n[conversation_id=${conversationId}]`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
