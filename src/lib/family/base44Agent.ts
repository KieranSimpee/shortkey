/**
 * Shared Base44 Superagent client — live conversations only.
 * Never invents replies. Secrets stay server-side / CLI env.
 */

import {
  base44Headers,
  createBase44Conversation,
  extractAssistantReply,
  getBase44AgentApiKey,
  GorGorBridgeError,
  joinUrl,
  sendBase44Message,
  type Base44Headers,
} from "@/lib/gorGorChatBridge";

export { getBase44AgentApiKey, extractAssistantReply, GorGorBridgeError };

const DEFAULT_AGENT_ROOT = "https://app.base44.com/api/agents";

export function agentBaseUrl(agentId: string): string {
  let root =
    process.env.BASE44_AGENT_API_BASE_URL?.trim() || DEFAULT_AGENT_ROOT;
  root = root.replace(/\/+$/, "");
  root = root.replace(/\/api\/api(\/|$)/gi, "/api$1");
  root = root.replace(/\/api\/apps(\/|$)/gi, "/api/agents$1");

  if (root.toLowerCase().endsWith(`/${agentId.toLowerCase()}`)) {
    return root;
  }
  if (/\/api\/agents\/[a-f0-9]{24}$/i.test(root)) {
    return root.replace(/\/[a-f0-9]{24}$/i, `/${agentId}`);
  }
  if (/\/api\/agents$/i.test(root)) {
    return joinUrl(root, agentId);
  }
  return joinUrl(root, agentId);
}

export type LiveBase44AskResult = {
  live: true;
  reply: string;
  conversation_id: string;
  agent_id_suffix: string;
};

/**
 * Create (or reuse) a conversation and send one message.
 * Throws GorGorBridgeError on upstream failure — never returns fake text.
 */
export async function askBase44AgentLive(opts: {
  agentId: string;
  message: string;
  conversationId?: string;
  apiKey?: string;
}): Promise<LiveBase44AskResult> {
  const apiKey = (opts.apiKey || getBase44AgentApiKey() || "").trim();
  if (!apiKey) {
    throw new GorGorBridgeError(
      "not_connected",
      "Base44 Superagent key missing (BASE44_AGENT_API_KEY | BASE44_API_KEY | KURA_API_KEY).",
      503,
    );
  }
  if (!opts.agentId?.trim()) {
    throw new GorGorBridgeError("invalid_agent", "Agent id required.", 400);
  }
  const message = opts.message.trim();
  if (!message) {
    throw new GorGorBridgeError("invalid_message", "Message required.", 400);
  }

  const agentBase = agentBaseUrl(opts.agentId.trim());
  const headers: Base44Headers = base44Headers(apiKey);

  let conversationId = opts.conversationId?.trim() || "";
  if (!conversationId) {
    conversationId = await createBase44Conversation(agentBase, headers);
  }
  const reply = await sendBase44Message(
    agentBase,
    headers,
    conversationId,
    message,
  );
  if (!reply?.trim()) {
    throw new GorGorBridgeError(
      "empty_reply",
      "Upstream returned an empty reply — not inventing content.",
      502,
    );
  }
  return {
    live: true,
    reply: reply.trim(),
    conversation_id: conversationId,
    agent_id_suffix: opts.agentId.slice(-4),
  };
}

/** Honest live ping — requires a real assistant string back. */
export async function pingBase44AgentLive(agentId: string): Promise<{
  live: boolean;
  detail: string;
  sampleReplyPreview?: string;
  conversation_id?: string;
}> {
  try {
    const result = await askBase44AgentLive({
      agentId,
      message:
        "ShortKey family honesty ping. Reply with exactly one word: LIVE. Do not invent product claims.",
    });
    return {
      live: true,
      detail: "Live Superagent reply received.",
      sampleReplyPreview: result.reply.slice(0, 120),
      conversation_id: result.conversation_id,
    };
  } catch (err) {
    if (err instanceof GorGorBridgeError) {
      return {
        live: false,
        detail: `${err.code}: ${err.message}`,
      };
    }
    return {
      live: false,
      detail: err instanceof Error ? err.message : "Base44 ping failed",
    };
  }
}
