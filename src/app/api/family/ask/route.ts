import { NextResponse } from "next/server";
import { verifyDeskPassword } from "@/lib/deskAccess";
import {
  askFamilyAgent,
  FamilyAskError,
  isFamilyAskAgentKey,
  isFamilyAskConfigured,
} from "@/lib/familyAsk";
import { checkGorGorRateLimit, getClientIp } from "@/lib/gorGorChatRateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/family/ask
 * Body: { agent: "kura"|"gorgor"|"senti"|"agent-r", message: string, password?: string }
 *
 * Soft password (if SITE_ACCESS_PASSWORD / DESK_ACCESS_PASSWORD set).
 * Calls Base44 with server KURA_API_KEY / BASE44_API_KEY only — never expose keys to HTML.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkGorGorRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: "Too many family ask requests. Try again in a few minutes.",
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
    agent?: unknown;
    message?: unknown;
    password?: unknown;
  };

  const access = verifyDeskPassword(raw.password);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error, code: "unauthorized" },
      { status: access.status },
    );
  }

  if (!isFamilyAskAgentKey(raw.agent)) {
    return NextResponse.json(
      {
        error: 'Invalid agent. Use "kura" | "gorgor" | "senti" | "agent-r".',
      },
      { status: 400 },
    );
  }

  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  if (!message || message.length > 8000) {
    return NextResponse.json(
      { error: "Message is required (max 8000 characters)." },
      { status: 400 },
    );
  }

  if (!isFamilyAskConfigured()) {
    return NextResponse.json(
      {
        error:
          "Family ask is not connected. Add KURA_API_KEY (or BASE44_API_KEY) on the server (Vercel env).",
        code: "not_configured",
      },
      { status: 503 },
    );
  }

  try {
    const result = await askFamilyAgent(raw.agent, message);
    return NextResponse.json({
      ok: true,
      agent: result.agent,
      label: result.label,
      reply: result.reply,
      conversation_id: result.conversation_id,
      passwordRequired: access.passwordRequired,
    });
  } catch (err) {
    if (err instanceof FamilyAskError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: "Family ask failed unexpectedly.", code: "unknown" },
      { status: 500 },
    );
  }
}
