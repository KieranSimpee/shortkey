/**
 * Family Ask — server-side Base44 Superagent caller for Founder Desk.
 * Shared key: KURA_API_KEY / BASE44_API_KEY / BASE44_AGENT_API_KEY (never to browser).
 * Maya = ASI:One (not this map). Sky = Learning vault / ask:sky (not this map).
 *
 * Mirrors scripts/ask-base44.mjs agent map; uses Node fetch (Vercel-safe).
 */

import {
  base44Headers,
  extractAssistantReply,
  getBase44AgentApiKey,
  joinUrl,
} from "@/lib/gorGorChatBridge";

export const FAMILY_ASK_AGENTS = {
  kura: {
    label: "Kura",
    role: "Brand Design Manager",
    agentEnv: "KURA_AGENT_ID",
    defaultAgentId: "6a54198bebbee048f44e1378",
    conversationEnv: null as string | null,
    defaultConversationId: null as string | null,
  },
  gorgor: {
    label: "Gor Gor",
    role: "Gatekeeper · Chief of Staff",
    agentEnv: "GOR_GOR_AGENT_ID",
    defaultAgentId: "69ddc914cfcf229762ac123d",
    conversationEnv: "GOR_GOR_CONVERSATION_ID",
    defaultConversationId: "69ddc9166e1e12f6313fc523",
  },
  senti: {
    label: "Senti",
    role: "Creative Director",
    agentEnv: "SENTI_AGENT_ID",
    defaultAgentId: "6a42029cc124d0206f027335",
    conversationEnv: "SENTI_CONVERSATION_ID",
    defaultConversationId: "6a42029ee7bbd796cda145e3",
  },
  "agent-r": {
    label: "Agent R",
    role: "Secretary · customer care",
    agentEnv: "AGENT_R_AGENT_ID",
    defaultAgentId: "6a449e8691d185359beef333",
    conversationEnv: "AGENT_R_CONVERSATION_ID",
    defaultConversationId: "6a449e88110fe595b96cbb05",
  },
} as const;

export type FamilyAskAgentKey = keyof typeof FAMILY_ASK_AGENTS;

export function isFamilyAskAgentKey(value: unknown): value is FamilyAskAgentKey {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(FAMILY_ASK_AGENTS, value)
  );
}

const DEFAULT_AGENT_ROOT = "https://app.base44.com/api/agents";

function agentBaseUrl(agentId: string): string {
  let root =
    process.env.BASE44_AGENT_API_BASE_URL?.trim() || DEFAULT_AGENT_ROOT;
  root = root.replace(/\/+$/, "");
  root = root.replace(/\/api\/api(\/|$)/gi, "/api$1");
  root = root.replace(/\/api\/apps(\/|$)/gi, "/api/agents$1");

  if (root.toLowerCase().endsWith(`/${agentId.toLowerCase()}`)) return root;
  if (/\/api\/agents\/[a-f0-9]{24}$/i.test(root)) {
    return root.replace(/\/[a-f0-9]{24}$/i, `/${agentId}`);
  }
  if (/\/api\/agents$/i.test(root)) return joinUrl(root, agentId);
  return joinUrl(root, agentId);
}

function resolveAgentId(key: FamilyAskAgentKey): string {
  const cfg = FAMILY_ASK_AGENTS[key];
  const fromEnv = process.env[cfg.agentEnv]?.trim();
  return (fromEnv || cfg.defaultAgentId).trim();
}

function resolveFixedConversationId(key: FamilyAskAgentKey): string | undefined {
  const cfg = FAMILY_ASK_AGENTS[key];
  if (!cfg.conversationEnv) return undefined;
  const fromEnv = process.env[cfg.conversationEnv]?.trim();
  const id = (fromEnv || cfg.defaultConversationId || "").trim();
  return id || undefined;
}

export function isFamilyAskConfigured(): boolean {
  return Boolean(getBase44AgentApiKey());
}

export type FamilyAskResult = {
  agent: FamilyAskAgentKey;
  label: string;
  reply: string;
  conversation_id: string;
};

export class FamilyAskError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 500) {
    super(message);
    this.name = "FamilyAskError";
    this.code = code;
    this.status = status;
  }
}

async function createConversation(
  agentBase: string,
  headers: ReturnType<typeof base44Headers>,
): Promise<string> {
  const url = joinUrl(agentBase, "conversations");
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: "{}",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new FamilyAskError(
      "upstream_create_failed",
      `Could not start conversation (${res.status}).`,
      res.status >= 400 && res.status < 600 ? res.status : 502,
    );
  }
  let conv: Record<string, unknown>;
  try {
    conv = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new FamilyAskError("upstream_invalid", "Conversation response invalid.", 502);
  }
  const id = (conv.id ?? conv.conversation_id) as string | undefined;
  if (!id) {
    throw new FamilyAskError("upstream_invalid", "Conversation id missing.", 502);
  }
  return id;
}

async function sendMessage(
  agentBase: string,
  headers: ReturnType<typeof base44Headers>,
  conversationId: string,
  content: string,
): Promise<string> {
  const url = joinUrl(agentBase, "conversations", conversationId, "messages");
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      role: "user",
      content,
      file_urls: [],
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new FamilyAskError(
      "upstream_message_failed",
      `Agent did not accept the message (${res.status}).`,
      res.status >= 500 ? 502 : 400,
    );
  }
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    if (text.trim()) return text.trim();
    throw new FamilyAskError("upstream_invalid", "Reply empty or invalid.", 502);
  }
  const reply = extractAssistantReply(payload);
  if (reply) return reply;
  return "Agent replied, but the message format was unexpected.";
}

/**
 * Ask a Base44 family agent. Secrets never leave the server.
 */
export async function askFamilyAgent(
  agent: FamilyAskAgentKey,
  message: string,
): Promise<FamilyAskResult> {
  const apiKey = getBase44AgentApiKey();
  if (!apiKey) {
    throw new FamilyAskError(
      "not_configured",
      "Base44 API key not set. Add KURA_API_KEY (or BASE44_API_KEY) on the server.",
      503,
    );
  }

  const cfg = FAMILY_ASK_AGENTS[agent];
  const agentId = resolveAgentId(agent);
  const agentBase = agentBaseUrl(agentId);
  const headers = base44Headers(apiKey);

  let conversationId = resolveFixedConversationId(agent);
  if (!conversationId) {
    conversationId = await createConversation(agentBase, headers);
  }

  const reply = await sendMessage(agentBase, headers, conversationId, message);
  return {
    agent,
    label: cfg.label,
    reply,
    conversation_id: conversationId,
  };
}
