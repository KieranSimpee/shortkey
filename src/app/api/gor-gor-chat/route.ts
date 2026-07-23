import { NextResponse } from "next/server";
import { assertGorGorChatAccess } from "@/lib/gorGorChatAccess";
import {
  GorGorBridgeError,
  base44Headers,
  createBase44Conversation,
  formatRoomAwareMessage,
  getBase44AgentApiKey,
  getSimpeeAgentBaseUrl,
  isGorGorBridgeConfigured,
  isGorGorChatRoomId,
  sendBase44Message,
} from "@/lib/gorGorChatBridge";
import { checkGorGorRateLimit, getClientIp } from "@/lib/gorGorChatRateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/gor-gor-chat
 * Body: {
 *   message, room, conversation_id?,
 *   sender?, kind?, from_room?  — optional Living Room Thread fields (ignored upstream)
 * }
 * Returns: { reply, conversation_id } · soft { fallback: true, reply } when key missing.
 * Still talks to SIMPEE_AGENT_ID only. Shared Living Room Thread reuses one conversation_id.
 *
 * Env (server only):
 * - BASE44_AGENT_API_KEY (preferred) · BASE44_API_KEY · KURA_API_KEY
 * - BASE44_AGENT_API_BASE_URL (default https://app.base44.com/api/agents)
 * - SIMPEE_AGENT_ID (default 69ddc914cfcf229762ac123d)
 */
export async function POST(request: Request) {
  const access = assertGorGorChatAccess(request);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const ip = getClientIp(request);
  const limit = checkGorGorRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: "Too many Gor Gor chat requests. Try again in a few minutes.",
        code: "rate_limited",
      },
      {
        status: 429,
        headers: limit.retryAfterSec
          ? { "Retry-After": String(limit.retryAfterSec) }
          : undefined,
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as {
    message?: unknown;
    room?: unknown;
    conversation_id?: unknown;
    sender?: unknown;
    kind?: unknown;
    from_room?: unknown;
  };

  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  if (!message || message.length > 8000) {
    return NextResponse.json(
      { error: "Message is required (max 8000 characters)." },
      { status: 400 },
    );
  }

  // Prefer from_room when Living Room Thread sends both; fall back to room.
  const roomCandidate =
    typeof raw.from_room === "string" && raw.from_room.trim()
      ? raw.from_room.trim()
      : raw.room;

  if (!isGorGorChatRoomId(roomCandidate)) {
    return NextResponse.json(
      { error: "Invalid room. Use a Family Home room id." },
      { status: 400 },
    );
  }

  const existingConversationId =
    typeof raw.conversation_id === "string" && raw.conversation_id.trim()
      ? raw.conversation_id.trim()
      : undefined;

  const apiKey = getBase44AgentApiKey();
  if (!apiKey || !isGorGorBridgeConfigured()) {
    return NextResponse.json({
      fallback: true,
      reply:
        "Gor Gor Chat Bridge is not connected yet. Message saved locally only.",
    });
  }

  const agentBase = getSimpeeAgentBaseUrl();
  const headers = base44Headers(apiKey);
  // Living Room Thread frontend already prepends [Family Home · …][Sender:…][Kind:…] —
  // do not double-prefix. Legacy clients still get formatRoomAwareMessage.
  const content = message.startsWith("[Family Home")
    ? message
    : formatRoomAwareMessage(roomCandidate, message);

  try {
    let conversationId = existingConversationId;
    if (!conversationId) {
      conversationId = await createBase44Conversation(agentBase, headers);
    }
    const reply = await sendBase44Message(
      agentBase,
      headers,
      conversationId,
      content,
    );
    return NextResponse.json({ reply, conversation_id: conversationId });
  } catch (err) {
    if (err instanceof GorGorBridgeError) {
      return NextResponse.json(
        {
          error: err.message,
          code: err.code,
          ...(err.diagnostic ? { diagnostic: err.diagnostic } : {}),
        },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Gor Gor Chat Bridge failed. Try again shortly.", code: "bridge_error" },
      { status: 502 },
    );
  }
}
