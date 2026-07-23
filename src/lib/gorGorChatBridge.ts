/**
 * Gor Gor Chat Bridge — server-side Base44 Superagent helpers.
 * Secrets stay on the server. Never import this into client components for keys.
 *
 * Preferred env: BASE44_AGENT_API_KEY
 * Fallbacks: BASE44_API_KEY · KURA_API_KEY (shared Base44 key patterns in this repo)
 *
 * Agent: SIMPEE_AGENT_ID (default 69ddc914cfcf229762ac123d — override via env)
 * Base: BASE44_AGENT_API_BASE_URL
 *   - `https://app.base44.com/api/agents` → append `/{agentId}`
 *   - full agent URL ending with agent id → use as-is (do not double-append)
 */

export const DEFAULT_SIMPEE_AGENT_ID = "69ddc914cfcf229762ac123d";
export const DEFAULT_AGENT_API_BASE = "https://app.base44.com/api/agents";

/** Known typo suffix — never use; force correct default when env matches this pattern. */
const FORBIDDEN_AGENT_ID_SUFFIX = "123f";
const CANONICAL_AGENT_ID_SUFFIX = "123d";

export function getBase44AgentApiKey(): string | undefined {
  const key =
    process.env.BASE44_AGENT_API_KEY?.trim() ||
    process.env.BASE44_API_KEY?.trim() ||
    process.env.KURA_API_KEY?.trim() ||
    "";
  return key.length > 0 ? key : undefined;
}

/**
 * Simpee / Gor Gor Superagent id.
 * Hard default ends in 123d. Rejects env values ending in 123f (common typo).
 */
export function getSimpeeAgentId(): string {
  const fromEnv = process.env.SIMPEE_AGENT_ID?.trim();
  if (!fromEnv) return DEFAULT_SIMPEE_AGENT_ID;
  if (fromEnv.toLowerCase().endsWith(FORBIDDEN_AGENT_ID_SUFFIX)) {
    return DEFAULT_SIMPEE_AGENT_ID;
  }
  return fromEnv;
}

/** Last 4 chars of agent id for safe diagnostics (verify 123d vs 123f). */
export function agentIdSuffix(agentId: string = getSimpeeAgentId()): string {
  return agentId.slice(-4);
}

function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Join base + path without double slashes (preserves `https://`).
 */
export function joinUrl(base: string, ...parts: string[]): string {
  let out = stripTrailingSlashes(base.trim());
  for (const part of parts) {
    const segment = part.replace(/^\/+|\/+$/g, "");
    if (!segment) continue;
    out = `${out}/${segment}`;
  }
  return out;
}

/**
 * Resolve full agent API base: `https://app.base44.com/api/agents/{agentId}`
 *
 * Handles:
 * - root `.../api/agents` → append agent id
 * - full URL already ending with agent id → use as-is (no double-append)
 * - full URL ending with a different 24-hex id → replace with SIMPEE id
 * - mistaken `/api/apps/...` (products app path) → rewrite to `/api/agents/...`
 * - accidental double `/api/api` → collapse once
 */
export function getSimpeeAgentBaseUrl(): string {
  const agentId = getSimpeeAgentId();
  let root =
    process.env.BASE44_AGENT_API_BASE_URL?.trim() || DEFAULT_AGENT_API_BASE;
  root = stripTrailingSlashes(root);
  // Guard common misconfig: .../api/api/agents
  root = root.replace(/\/api\/api(\/|$)/gi, "/api$1");
  // Products app URL must not be used for Superagent conversations
  root = root.replace(/\/api\/apps(\/|$)/gi, "/api/agents$1");

  const rootLower = root.toLowerCase();
  const idLower = agentId.toLowerCase();

  // Full agent URL already includes this agent id → do not append again
  if (rootLower.endsWith(`/${idLower}`)) {
    return root;
  }

  // .../api/agents/{otherId} → swap to canonical Simpee id
  if (/\/api\/agents\/[a-f0-9]{24}$/i.test(root)) {
    return root.replace(/\/[a-f0-9]{24}$/i, `/${agentId}`);
  }

  // .../api/agents → append id
  if (/\/api\/agents$/i.test(root)) {
    return joinUrl(root, agentId);
  }

  // Fallback: append agent id
  return joinUrl(root, agentId);
}

/** Safe fields for upstream failure responses (never includes api_key). */
export type GorGorUpstreamDiagnostic = {
  upstream_status: number;
  agent_id_suffix: string;
  create_path: string;
  message_path_template: string;
  base_host: string;
  base_path_tail: string;
};

export function buildUpstreamDiagnostic(
  agentBase: string,
  upstreamStatus: number,
): GorGorUpstreamDiagnostic {
  let host = "";
  let pathTail = "";
  try {
    const u = new URL(agentBase);
    host = u.host;
    const segments = u.pathname.split("/").filter(Boolean);
    pathTail = segments.slice(-2).join("/");
  } catch {
    host = "invalid_base_url";
    pathTail = agentBase.replace(/\/+$/, "").split("/").slice(-2).join("/");
  }
  return {
    upstream_status: upstreamStatus,
    agent_id_suffix: agentIdSuffix(),
    create_path: "/conversations",
    message_path_template: "/conversations/{id}/messages",
    base_host: host,
    base_path_tail: pathTail,
  };
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
  const url = joinUrl(agentBase, "conversations");
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: "{}",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new GorGorBridgeError(
      "upstream_create_failed",
      `Could not start Gor Gor conversation (${res.status}).`,
      res.status >= 400 && res.status < 600 ? res.status : 502,
      buildUpstreamDiagnostic(agentBase, res.status),
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
      buildUpstreamDiagnostic(agentBase, res.status),
    );
  }
  const id = (conv.id ?? conv.conversation_id) as string | undefined;
  if (!id || typeof id !== "string") {
    throw new GorGorBridgeError(
      "upstream_invalid",
      "Gor Gor conversation id missing.",
      502,
      buildUpstreamDiagnostic(agentBase, res.status),
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
  const url = joinUrl(agentBase, "conversations", conversationId, "messages");
  const res = await fetch(url, {
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
      buildUpstreamDiagnostic(agentBase, res.status),
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
      buildUpstreamDiagnostic(agentBase, res.status),
    );
  }
  const reply = extractAssistantReply(payload);
  if (reply) return reply;
  // Last resort without leaking headers/keys
  return typeof payload === "object" && payload !== null
    ? "Gor Gor replied, but the message format was unexpected. Check Base44 agent logs."
    : String(payload);
}

export class GorGorBridgeError extends Error {
  code: string;
  status: number;
  diagnostic?: GorGorUpstreamDiagnostic;

  constructor(
    code: string,
    message: string,
    status = 500,
    diagnostic?: GorGorUpstreamDiagnostic,
  ) {
    super(message);
    this.name = "GorGorBridgeError";
    this.code = code;
    this.status = status;
    this.diagnostic = diagnostic;
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

/** Dev / test helper: assert suffix is canonical (never 123f). */
export function assertCanonicalSimpeeAgentId(agentId: string = getSimpeeAgentId()): boolean {
  return (
    agentId === DEFAULT_SIMPEE_AGENT_ID ||
    agentId.toLowerCase().endsWith(CANONICAL_AGENT_ID_SUFFIX)
  );
}
