/**
 * Gor Gor Chat Bridge — server-side Base44 Superagent helpers.
 * Secrets stay on the server. Never import this into client components for keys.
 *
 * Preferred env: BASE44_AGENT_API_KEY
 * Fallbacks: BASE44_API_KEY · KURA_API_KEY (shared Base44 key patterns in this repo)
 *
 * Agent: SIMPEE_AGENT_ID (default 69ddc914cfcf229762ac123d — override via env)
 * Base: BASE44_AGENT_API_BASE_URL (default https://app.base44.com/api/agents)
 */

export const DEFAULT_SIMPEE_AGENT_ID = "69ddc914cfcf229762ac123d";
export const DEFAULT_AGENT_API_BASE = "https://app.base44.com/api/agents";

export function getBase44AgentApiKey(): string | undefined {
  const key =
    process.env.BASE44_AGENT_API_KEY?.trim() ||
    process.env.BASE44_API_KEY?.trim() ||
    process.env.KURA_API_KEY?.trim() ||
    "";
  return key.length > 0 ? key : undefined;
}

export function getSimpeeAgentId(): string {
  return process.env.SIMPEE_AGENT_ID?.trim() || DEFAULT_SIMPEE_AGENT_ID;
}

/** Full agent base: `{BASE}/{agentId}` */
export function getSimpeeAgentBaseUrl(): string {
  const root =
    process.env.BASE44_AGENT_API_BASE_URL?.trim().replace(/\/$/, "") ||
    DEFAULT_AGENT_API_BASE;
  return `${root}/${getSimpeeAgentId()}`;
}

export function isGorGorBridgeConfigured(): boolean {
  return Boolean(getBase44AgentApiKey());
}

export type Base44Headers = {
  api_key: string;
  "Content-Type": "application/json";
};

export function base44Headers(apiKey: string): Base44Headers {
  return {
    api_key: apiKey,
    "Content-Type": "application/json",
  };
}

/** Extract assistant text from Base44 message POST payload (same shape as ask-kura). */
export function extractAssistantReply(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  const messages = (p.messages ?? (p.data as Record<string, unknown> | undefined)?.messages) as
    | unknown[]
    | undefined;

  if (Array.isArray(messages) && messages.length) {
    const reversed = [...messages].reverse();
    const lastAssistant =
      reversed.find((m) => {
        if (!m || typeof m !== "object") return false;
        return (m as { role?: string }).role === "assistant";
      }) ?? messages[messages.length - 1];

    if (lastAssistant && typeof lastAssistant === "object") {
      const m = lastAssistant as {
        content?: unknown;
        message?: { content?: unknown };
      };
      const content = m.content ?? m.message?.content;
      if (typeof content === "string" && content.trim()) return content.trim();
    }
  }

  if (typeof p.content === "string" && p.content.trim()) return p.content.trim();
  const nested = p.message as { content?: unknown } | undefined;
  if (typeof nested?.content === "string" && nested.content.trim()) {
    return nested.content.trim();
  }

  return null;
}

export async function createBase44Conversation(
  agentBase: string,
  headers: Base44Headers,
): Promise<string> {
  const res = await fetch(`${agentBase}/conversations`, {
    method: "POST",
    headers,
    body: "{}",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new GorGorBridgeError(
      "upstream_create_failed",
      `Could not start Gor Gor conversation (${res.status}).`,
      res.status,
    );
  }
  let conv: Record<string, unknown>;
  try {
    conv = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new GorGorBridgeError(
      "upstream_invalid",
      "Gor Gor conversation response was invalid.",
      502,
    );
  }
  const id = (conv.id ?? conv.conversation_id) as string | undefined;
  if (!id || typeof id !== "string") {
    throw new GorGorBridgeError(
      "upstream_invalid",
      "Gor Gor conversation id missing.",
      502,
    );
  }
  return id;
}

export async function sendBase44Message(
  agentBase: string,
  headers: Base44Headers,
  conversationId: string,
  content: string,
): Promise<string> {
  const res = await fetch(`${agentBase}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify({ content }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new GorGorBridgeError(
      "upstream_message_failed",
      `Gor Gor did not accept the message (${res.status}).`,
      res.status >= 500 ? 502 : 400,
    );
  }
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    if (text.trim()) return text.trim();
    throw new GorGorBridgeError(
      "upstream_invalid",
      "Gor Gor reply was empty or invalid.",
      502,
    );
  }
  const reply = extractAssistantReply(payload);
  if (reply) return reply;
  // Last resort: stringify safely without leaking headers/keys
  return typeof payload === "object" && payload !== null
    ? "Gor Gor replied, but the message format was unexpected. Check Base44 agent logs."
    : String(payload);
}

export class GorGorBridgeError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 500) {
    super(message);
    this.name = "GorGorBridgeError";
    this.code = code;
    this.status = status;
  }
}

/** Room ids accepted by the bridge (align with Family Table rooms). */
export const GOR_GOR_CHAT_ROOMS = [
  "living",
  "kieran",
  "gorgor",
  "sky",
  "senti",
  "kura",
  "agent-r",
] as const;

export type GorGorChatRoomId = (typeof GOR_GOR_CHAT_ROOMS)[number];

export function isGorGorChatRoomId(value: unknown): value is GorGorChatRoomId {
  return typeof value === "string" && (GOR_GOR_CHAT_ROOMS as readonly string[]).includes(value);
}

/** Prefix user content with room context so Gor Gor knows which house room. */
export function formatRoomAwareMessage(room: GorGorChatRoomId, message: string): string {
  const labels: Record<GorGorChatRoomId, string> = {
    living: "Living Room",
    kieran: "Kieran Vision Room",
    gorgor: "Gor Gor Review Room",
    sky: "Sky Room",
    senti: "Senti Room",
    kura: "Kura Room",
    "agent-r": "Agent R Room",
  };
  return `[Family Home · ${labels[room]}]\n\n${message}`;
}
