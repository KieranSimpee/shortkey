import { NextResponse } from "next/server";
import { assertGorGorChatAccess } from "@/lib/gorGorChatAccess";
import { askFamilyAgent } from "@/lib/family/askFamilyAgent";
import type { FamilyAgentSeat } from "@/lib/family/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: FamilyAgentSeat[] = [
  "kura",
  "gor-gor",
  "senti",
  "agent-r",
  "maya",
  "sky",
];

/**
 * POST /api/family/agents/ask
 * Body: { seat, message, conversation_id? }
 * LIVE reply only. Fail-closed — never soft-fake an agent answer.
 */
export async function POST(request: Request) {
  const access = assertGorGorChatAccess(request);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as {
    seat?: unknown;
    message?: unknown;
    conversation_id?: unknown;
  };

  const seat = typeof raw.seat === "string" ? (raw.seat.trim() as FamilyAgentSeat) : null;
  if (!seat || !ALLOWED.includes(seat)) {
    return NextResponse.json(
      {
        live: false,
        code: "invalid_seat",
        error: `seat must be one of: ${ALLOWED.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const message = typeof raw.message === "string" ? raw.message : "";
  const conversationId =
    typeof raw.conversation_id === "string" && raw.conversation_id.trim()
      ? raw.conversation_id.trim()
      : undefined;

  const result = await askFamilyAgent({ seat, message, conversationId });
  if (!result.live) {
    return NextResponse.json(
      {
        live: false,
        seat: result.seat,
        label: result.label,
        code: result.code,
        error: result.error,
      },
      { status: result.status },
    );
  }

  return NextResponse.json({
    live: true,
    seat: result.seat,
    label: result.label,
    reply: result.reply,
    conversation_id: result.conversation_id,
    provider: result.provider,
  });
}
