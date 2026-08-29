/**
 * Shared Base44 Superagent caller for ShortKey AI seats.
 * Shared key: KURA_API_KEY or BASE44_API_KEY (never commit).
 *
 * Usage:
 *   node scripts/ask-base44.mjs --agent=kura "message"
 *   node scripts/ask-base44.mjs --agent=gorgor "message"
 *   node scripts/ask-base44.mjs --agent=senti "message"
 *   node scripts/ask-base44.mjs --agent=agent-r "message"
 *
 * Sky = Learning (ask:sky · SKY_EMAIL · local vault — no Base44 agent).
 * Maya uses ASI:One (ask:maya) — Base44 Maya portal deleted.
 */

import { readFileSync, existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const AGENTS = {
  kura: {
    label: "Kura",
    role: "Research + Hub · Brand Design Manager",
    agentEnv: "KURA_AGENT_ID",
    defaultAgentId: "6a54198bebbee048f44e1378",
    conversationEnv: null,
    defaultConversationId: null, // self — create new conversation
  },
  gorgor: {
    label: "Gor Gor (Simpee)",
    role: "Gatekeeper + Revenue",
    agentEnv: "GOR_GOR_AGENT_ID",
    defaultAgentId: "69ddc914cfcf229762ac123d",
    conversationEnv: "GOR_GOR_CONVERSATION_ID",
    defaultConversationId: "69ddc9166e1e12f6313fc523",
  },
  senti: {
    label: "Senti",
    role: "Creative Room",
    agentEnv: "SENTI_AGENT_ID",
    defaultAgentId: "6a42029cc124d0206f027335",
    conversationEnv: "SENTI_CONVERSATION_ID",
    defaultConversationId: "6a42029ee7bbd796cda145e3",
  },
  "agent-r": {
    label: "Agent R",
    role: "Intelligence + Records",
    agentEnv: "AGENT_R_AGENT_ID",
    defaultAgentId: "6a449e8691d185359beef333",
    conversationEnv: "AGENT_R_CONVERSATION_ID",
    defaultConversationId: "6a449e88110fe595b96cbb05",
  },
};

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
    // Prefer .env.local over inherited shell/Cursor env (stale keys caused false 403s).
    process.env[key] = val;
  }
}

loadEnvLocal();

const argv = process.argv.slice(2);
let agentKey = "";
const rest = [];
for (const a of argv) {
  if (a.startsWith("--agent=")) {
    agentKey = a.slice("--agent=".length).trim().toLowerCase();
    continue;
  }
  if (a === "--agent") continue;
  rest.push(a);
}
// allow: --agent kura  (next token already consumed if passed as =)
if (!agentKey && argv.includes("--agent")) {
  const i = argv.indexOf("--agent");
  agentKey = (argv[i + 1] || "").trim().toLowerCase();
  const drop = new Set([argv[i], argv[i + 1]]);
  rest.length = 0;
  for (const a of argv) {
    if (drop.has(a) || a.startsWith("--agent=")) continue;
    rest.push(a);
  }
}

const message = rest.join(" ").trim();
const cfg = AGENTS[agentKey];

if (!cfg || !message) {
  console.error(`
Ask Base44 · ShortKey AI agents (shared KURA_API_KEY / BASE44_API_KEY)

Usage:
  node scripts/ask-base44.mjs --agent=kura "…"
  node scripts/ask-base44.mjs --agent=gorgor "…"
  node scripts/ask-base44.mjs --agent=senti "…"
  node scripts/ask-base44.mjs --agent=agent-r "…"

npm:
  npm run ask:kura -- "…"
  npm run ask:gorgor -- "…"
  npm run ask:senti -- "…"
  npm run ask:agent-r -- "…"

Other seats:
  npm run ask:maya  → Maya via ASI:One (Base44 portal deleted)
  npm run ask:sky   → Sky Learning packet (local vault · SKY_EMAIL)
  Registry: src/brand/sky/FAMILY_AI_CONNECTIONS.md
`);
  process.exit(1);
}

const apiKey = (process.env.KURA_API_KEY || process.env.BASE44_API_KEY || "").trim();
if (!apiKey) {
  console.error(`
Missing shared Base44 API key.

Set in .env.local:
  KURA_API_KEY=…
  BASE44_API_KEY=…   (same value — shared by Kura / Gor Gor / Senti / Agent R)

Never commit .env.local.
Maya → ASI_ONE_API_KEY (ask:maya). Sky → local vault / ask:sky (no agent key).
`);
  process.exit(1);
}

const agentId = (
  process.env[cfg.agentEnv] ||
  cfg.defaultAgentId ||
  ""
).trim();
const fixedConversationId = cfg.conversationEnv
  ? (process.env[cfg.conversationEnv] || cfg.defaultConversationId || "").trim()
  : "";

const BASE = `https://app.base44.com/api/agents/${agentId}`;
const headers = {
  api_key: apiKey,
  "Content-Type": "application/json",
};

function printReply(payload, conversationId) {
  const messages = payload.messages || payload.data?.messages;
  if (Array.isArray(messages) && messages.length) {
    const last =
      [...messages].reverse().find((m) => m.role === "assistant") ||
      messages[messages.length - 1];
    const content = last?.content ?? last?.message?.content;
    if (content) {
      console.log(content);
      console.error(`\n[${cfg.label} · conversation_id=${conversationId}]`);
      return;
    }
  }
  if (payload.content || payload.message?.content) {
    console.log(payload.content || payload.message.content);
    console.error(`\n[${cfg.label} · conversation_id=${conversationId}]`);
    return;
  }
  console.log(JSON.stringify(payload, null, 2));
  console.error(`\n[${cfg.label} · conversation_id=${conversationId}]`);
}

/** Windows schannel/fetch often fails Base44 auth headers; prefer curl --ssl-no-revoke on win32. */
async function base44Request(url, { method = "GET", body } = {}) {
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
        `api_key: ${apiKey}`,
        "-H",
        "Content-Type: application/json",
      ];
      // Windows: `--data-binary @file` from spawnSync often drops auth; use -d.
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
    } catch (err) {
      console.error("[ask-base44] curl path failed, trying fetch…", err.message || err);
    }
  }

  try {
    const res = await fetch(url, { method, headers, body });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch (err) {
    if (process.platform === "win32") return viaCurl();
    throw err;
  }
}

function authHint(status) {
  if (status !== 403) return;
  console.error(`
Hint: 403 usually means the shared API key is missing access.
Paste a fresh key from any agent Editor → Settings → Developer → API Key
into .env.local as KURA_API_KEY= and BASE44_API_KEY= (same value).
Never commit keys. Rotate if a key was ever pasted in chat.
`);
}

async function main() {
  console.error(`[ask-base44] ${cfg.label} · ${cfg.role}`);

  let conversationId = fixedConversationId;
  if (!conversationId) {
    const convRes = await base44Request(`${BASE}/conversations`, {
      method: "POST",
      body: "{}",
    });
    if (!convRes.ok) {
      console.error(`Create conversation failed (${convRes.status}): ${convRes.text}`);
      authHint(convRes.status);
      process.exit(1);
    }
    let conv;
    try {
      conv = JSON.parse(convRes.text);
    } catch {
      console.error("Create conversation: invalid JSON", convRes.text);
      process.exit(1);
    }
    conversationId = conv.id || conv.conversation_id;
    if (!conversationId) {
      console.error("No conversation id in response:", convRes.text);
      process.exit(1);
    }
  }

  const msgRes = await base44Request(
    `${BASE}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        role: "user",
        content: message,
        file_urls: [],
      }),
    },
  );
  if (!msgRes.ok) {
    console.error(`Send message failed (${msgRes.status}): ${msgRes.text}`);
    authHint(msgRes.status);
    process.exit(1);
  }

  let payload;
  try {
    payload = JSON.parse(msgRes.text);
  } catch {
    console.log(msgRes.text);
    console.error(`\n[${cfg.label} · conversation_id=${conversationId}]`);
    return;
  }
  printReply(payload, conversationId);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
