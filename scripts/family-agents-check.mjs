/**
 * Family agents live honesty check.
 * Marks LIVE only after a real upstream reply. Never invents answers.
 *
 * Usage: npm run family:agents:check
 *        npm run family:agents:check -- --config-only
 */

import { loadEnvLocal, firstEnv, repoRootFrom } from "./lib/load-env-local.mjs";
import { randomUUID } from "node:crypto";

const root = repoRootFrom(import.meta.url);
loadEnvLocal(root);

const configOnly = process.argv.includes("--config-only");

const SEATS = [
  {
    seat: "kura",
    label: "Kura",
    channel: "base44",
    agentId: process.env.KURA_AGENT_ID?.trim() || "6a54198bebbee048f44e1378",
    keys: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
  },
  {
    seat: "gor-gor",
    label: "Gor Gor (Simpee)",
    channel: "base44",
    agentId:
      process.env.SIMPEE_AGENT_ID?.trim() ||
      process.env.GOR_GOR_AGENT_ID?.trim() ||
      "69ddc914cfcf229762ac123d",
    keys: ["BASE44_AGENT_API_KEY", "BASE44_API_KEY", "KURA_API_KEY"],
  },
  {
    seat: "senti",
    label: "Senti",
    channel: "base44",
    agentId: process.env.SENTI_AGENT_ID?.trim() || "6a42029cc124d0206f027335",
    keys: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
  },
  {
    seat: "agent-r",
    label: "Agent R",
    channel: "base44",
    agentId:
      process.env.AGENT_R_AGENT_ID?.trim() || "6a449e8691d185359beef333",
    keys: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
  },
  {
    seat: "maya",
    label: "Maya",
    channel: "asi1",
    keys: ["ASI_ONE_API_KEY", "ASI1_API_KEY"],
  },
  {
    seat: "sky",
    label: "Sky",
    channel: "email_only",
    keys: [],
  },
  {
    seat: "key",
    label: "Key (Cursor)",
    channel: "session_only",
    keys: [],
  },
  {
    seat: "minion",
    label: "Minion Relay",
    channel: "minion",
    keys: ["K_MINION_API_KEY", "KMINION"],
  },
];

function extractAssistantReply(payload) {
  if (!payload || typeof payload !== "object") return null;
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
  return null;
}

async function pingBase44(agentId, apiKey) {
  const base = `https://app.base44.com/api/agents/${agentId}`;
  const headers = { api_key: apiKey, "Content-Type": "application/json" };
  const convRes = await fetch(`${base}/conversations`, {
    method: "POST",
    headers,
    body: "{}",
  });
  if (!convRes.ok) {
    return { live: false, detail: `create conversation HTTP ${convRes.status}` };
  }
  const conv = await convRes.json().catch(() => null);
  const conversationId = conv?.id || conv?.conversation_id;
  if (!conversationId) {
    return { live: false, detail: "no conversation id" };
  }
  const msgRes = await fetch(
    `${base}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        content:
          "ShortKey family honesty ping. Reply with exactly one word: LIVE.",
      }),
    },
  );
  if (!msgRes.ok) {
    return { live: false, detail: `message HTTP ${msgRes.status}` };
  }
  const payload = await msgRes.json().catch(() => null);
  const reply = extractAssistantReply(payload);
  if (!reply) {
    return { live: false, detail: "empty/unparseable reply — not inventing" };
  }
  return {
    live: true,
    detail: "live Superagent reply",
    preview: reply.slice(0, 80),
  };
}

async function pingMaya(apiKey) {
  const model = process.env.ASI1_MODEL?.trim() || "asi1";
  const res = await fetch("https://api.asi1.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-session-id": randomUUID(),
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        {
          role: "user",
          content:
            "ShortKey family honesty ping. Reply with exactly one word: LIVE.",
        },
      ],
    }),
  });
  if (!res.ok) {
    return { live: false, detail: `ASI:One HTTP ${res.status}` };
  }
  const payload = await res.json().catch(() => null);
  const reply = payload?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return { live: false, detail: "ASI:One empty reply — not inventing" };
  }
  return { live: true, detail: `live ASI:One (${model})`, preview: reply.slice(0, 80) };
}

console.log("\nShortKey family agents — honesty check");
console.log(
  configOnly
    ? "(config-only · no live ping)\n"
    : "(LIVE ping when keys exist · no ghost LIVE)\n",
);

const rows = [];
for (const seat of SEATS) {
  if (seat.channel === "email_only") {
    const email = process.env.SKY_EMAIL?.trim() || "sky@shortkey.beauty";
    rows.push({
      seat: seat.seat,
      label: seat.label,
      status: "EMAIL_ONLY",
      live: false,
      detail: `email seat · ${email}`,
    });
    continue;
  }
  if (seat.channel === "session_only") {
    rows.push({
      seat: seat.seat,
      label: seat.label,
      status: "SESSION_ONLY",
      live: false,
      detail: "this Cursor session · not a remote API",
    });
    continue;
  }
  if (seat.channel === "minion") {
    const key = firstEnv(seat.keys);
    rows.push({
      seat: seat.seat,
      label: seat.label,
      status: key ? "RELAY_ONLY" : "NOT_CONNECTED",
      live: false,
      detail: key
        ? "key set · conversational Superagent not claimed"
        : `missing ${seat.keys.join(" | ")}`,
    });
    continue;
  }

  const key = firstEnv(seat.keys);
  if (!key) {
    rows.push({
      seat: seat.seat,
      label: seat.label,
      status: "NOT_CONNECTED",
      live: false,
      detail: `missing ${seat.keys.join(" | ")}`,
    });
    continue;
  }

  if (configOnly) {
    rows.push({
      seat: seat.seat,
      label: seat.label,
      status: "KEY_PRESENT",
      live: false,
      detail: "key present · ping skipped (--config-only)",
    });
    continue;
  }

  const result =
    seat.channel === "asi1"
      ? await pingMaya(key)
      : await pingBase44(seat.agentId, key);

  rows.push({
    seat: seat.seat,
    label: seat.label,
    status: result.live ? "LIVE" : "UPSTREAM_ERROR",
    live: result.live,
    detail: result.preview
      ? `${result.detail} · “${result.preview}”`
      : result.detail,
  });
}

for (const row of rows) {
  const mark = row.live ? "✓ LIVE" : row.status === "EMAIL_ONLY" || row.status === "SESSION_ONLY" || row.status === "RELAY_ONLY" || row.status === "KEY_PRESENT" ? "·" : "✗";
  console.log(
    `  ${mark} ${row.label.padEnd(18)} ${row.status.padEnd(14)} — ${row.detail}`,
  );
}

const core = rows.filter((r) =>
  ["kura", "gor-gor", "senti", "agent-r", "maya"].includes(r.seat),
);
const coreLive = core.filter((r) => r.live).length;
const honesty =
  coreLive === core.length
    ? "ALL_LIVE_CAPABLE_CONNECTED"
    : coreLive > 0
      ? "PARTIAL"
      : "NONE_LIVE";

console.log(`\nHonesty: ${honesty}`);
console.log(`Core live: ${coreLive}/${core.length} (Kura · Gor Gor · Senti · Agent R · Maya)`);
console.log(
  "Sky = email-only · Key = session · Minion = relay — never fake their live chat.\n",
);

if (honesty !== "ALL_LIVE_CAPABLE_CONNECTED") {
  console.log("Next: set missing keys in .env.local + Vercel, then re-run.\n");
  process.exit(1);
}
process.exit(0);
