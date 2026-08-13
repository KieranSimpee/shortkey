/**
 * Ask a ShortKey family agent — LIVE only. Fail closed. No ghost answers.
 *
 * Usage:
 *   npm run ask:kura -- "message"
 *   npm run ask:gorgor -- "message"
 *   npm run ask:senti -- "message"
 *   npm run ask:agent-r -- "message"
 *   npm run ask:maya -- "message"
 *   node scripts/ask-family-agent.mjs <seat> "message"
 */

import { loadEnvLocal, firstEnv, repoRootFrom } from "./lib/load-env-local.mjs";
import { randomUUID } from "node:crypto";

const root = repoRootFrom(import.meta.url);
loadEnvLocal(root);

const AGENTS = {
  kura: {
    label: "Kura",
    channel: "base44",
    agentId:
      process.env.KURA_AGENT_ID?.trim() || "6a54198bebbee048f44e1378",
    keys: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
  },
  "gor-gor": {
    label: "Gor Gor (Simpee)",
    channel: "base44",
    agentId:
      process.env.SIMPEE_AGENT_ID?.trim() ||
      process.env.GOR_GOR_AGENT_ID?.trim() ||
      "69ddc914cfcf229762ac123d",
    keys: ["BASE44_AGENT_API_KEY", "BASE44_API_KEY", "KURA_API_KEY"],
  },
  gorgor: undefined, // alias filled below
  senti: {
    label: "Senti",
    channel: "base44",
    agentId: process.env.SENTI_AGENT_ID?.trim() || "6a42029cc124d0206f027335",
    keys: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
  },
  "agent-r": {
    label: "Agent R",
    channel: "base44",
    agentId:
      process.env.AGENT_R_AGENT_ID?.trim() || "6a449e8691d185359beef333",
    keys: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
  },
  "agent-r-alias": undefined,
  maya: {
    label: "Maya",
    channel: "asi1",
    keys: ["ASI_ONE_API_KEY", "ASI1_API_KEY"],
  },
  sky: {
    label: "Sky",
    channel: "email_only",
    keys: [],
  },
};

AGENTS.gorgor = AGENTS["gor-gor"];
AGENTS.simpee = AGENTS["gor-gor"];
AGENTS.agentr = AGENTS["agent-r"];
AGENTS.r = AGENTS["agent-r"];

function die(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

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
  if (payload.message?.content?.trim()) return payload.message.content.trim();
  return null;
}

async function askBase44(agentId, apiKey, message) {
  const base = `https://app.base44.com/api/agents/${agentId}`;
  const headers = {
    api_key: apiKey,
    "Content-Type": "application/json",
  };
  const convRes = await fetch(`${base}/conversations`, {
    method: "POST",
    headers,
    body: "{}",
  });
  const convText = await convRes.text();
  if (!convRes.ok) {
    die(
      `NOT LIVE · create conversation failed (${convRes.status}): ${convText.slice(0, 400)}`,
    );
  }
  let conv;
  try {
    conv = JSON.parse(convText);
  } catch {
    die("NOT LIVE · invalid conversation JSON — not inventing a reply.");
  }
  const conversationId = conv.id || conv.conversation_id;
  if (!conversationId) {
    die("NOT LIVE · no conversation id — not inventing a reply.");
  }

  const msgRes = await fetch(
    `${base}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ content: message }),
    },
  );
  const msgText = await msgRes.text();
  if (!msgRes.ok) {
    die(
      `NOT LIVE · send message failed (${msgRes.status}): ${msgText.slice(0, 400)}`,
    );
  }
  let payload;
  try {
    payload = JSON.parse(msgText);
  } catch {
    if (msgText.trim()) {
      console.log(msgText.trim());
      console.error(`\n[live=true conversation_id=${conversationId}]`);
      return;
    }
    die("NOT LIVE · empty/invalid reply — not inventing content.");
  }
  const reply = extractAssistantReply(payload);
  if (!reply) {
    die(
      `NOT LIVE · could not extract assistant reply — not inventing.\n${JSON.stringify(payload).slice(0, 500)}`,
    );
  }
  console.log(reply);
  console.error(`\n[live=true conversation_id=${conversationId}]`);
}

async function askMaya(apiKey, message) {
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
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are Maya, ShortKey Editorial Heart. ALWAYS TO TRUE · GOR_GOR_REVIEW · no invented DNA · no fake partnerships.",
        },
        { role: "user", content: message },
      ],
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    die(`NOT LIVE · ASI:One failed (${res.status}): ${text.slice(0, 400)}`);
  }
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    die("NOT LIVE · ASI:One invalid JSON — not inventing a reply.");
  }
  const reply = payload?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    die("NOT LIVE · ASI:One empty reply — not inventing content.");
  }
  console.log(reply);
  console.error(`\n[live=true provider=asi1 model=${model}]`);
}

const argv = process.argv.slice(2);
const seatArg = (argv[0] || "").trim().toLowerCase();
const message = argv.slice(1).join(" ").trim();

if (!seatArg || seatArg === "--help" || seatArg === "-h") {
  die(
    `Usage: node scripts/ask-family-agent.mjs <kura|gor-gor|senti|agent-r|maya> "message"\nNo ghost answers: missing keys exit non-zero.`,
  );
}

const agent = AGENTS[seatArg];
if (!agent) {
  die(`Unknown seat "${seatArg}". Use: kura | gor-gor | senti | agent-r | maya`);
}

if (agent.channel === "email_only") {
  const email = process.env.SKY_EMAIL?.trim() || "sky@shortkey.beauty";
  die(
    `NOT LIVE · Sky is email-only (${email}). Do not invent Sky API replies.`,
    1,
  );
}

if (!message) {
  die(`Usage: npm run ask:${seatArg === "gor-gor" ? "gorgor" : seatArg} -- "your message"`);
}

const apiKey = firstEnv(agent.keys);
if (!apiKey) {
  die(
    `NOT LIVE · ${agent.label} missing key (${agent.keys.join(" | ")}).\n` +
      `Add to .env.local (never commit). Then re-run.\n` +
      `Honesty rule: no fabricated family replies.`,
  );
}

if (agent.channel === "base44") {
  await askBase44(agent.agentId, apiKey, message);
} else if (agent.channel === "asi1") {
  await askMaya(apiKey, message);
} else {
  die(`NOT LIVE · unsupported channel for ${agent.label}`);
}
