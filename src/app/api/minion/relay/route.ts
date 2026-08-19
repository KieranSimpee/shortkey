import { NextResponse } from "next/server";
import { verifyDeskPassword } from "@/lib/deskAccess";
import { isFamilyAskAgentKey } from "@/lib/familyAsk";
import { checkGorGorRateLimit, getClientIp } from "@/lib/gorGorChatRateLimit";
import {
  isMinionRelayReady,
  runMinionRelay,
} from "@/lib/minion/relay";
import type { RelayReviewStatus } from "@/lib/minion/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REVIEW_STATUSES = new Set<RelayReviewStatus>([
  "PENDING",
  "GOR_GOR_REVIEW",
  "PASS",
  "HOLD",
  "APPROVED",
  "REJECTED",
]);

/**
 * POST /api/minion/relay
 * Body: {
 *   message: string,
 *   agent?: "kura"|"gorgor"|"senti"|"agent-r",
 *   password?: string,
 *   persistOnly?: boolean,
 *   finalAnswer?: string,
 *   reviewStatus?: RelayReviewStatus
 * }
 *
 * Persists every hop to Base44 Minion app Message entity
 * (K_MINION_API_KEY · app 6a5f20ace942aedd542584a2).
 *
 * LOCK: `message` is stored/reported verbatim on kieran_message + minion_hop.
 * Minions cannot rewrite it; family replies are separate hops.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkGorGorRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: "Too many minion relay requests. Try again in a few minutes.",
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
    agent?: unknown;
    password?: unknown;
    persistOnly?: unknown;
    finalAnswer?: unknown;
    reviewStatus?: unknown;
  };

  const access = verifyDeskPassword(raw.password);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error, code: "unauthorized" },
      { status: access.status },
    );
  }

  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  if (!message || message.length > 8000) {
    return NextResponse.json(
      { error: "Message is required (max 8000 characters)." },
      { status: 400 },
    );
  }

  const agent =
    raw.agent === undefined
      ? undefined
      : isFamilyAskAgentKey(raw.agent)
        ? raw.agent
        : null;
  if (agent === null) {
    return NextResponse.json(
      {
        error: 'Invalid agent. Use "kura" | "gorgor" | "senti" | "agent-r".',
      },
      { status: 400 },
    );
  }

  const reviewStatus =
    typeof raw.reviewStatus === "string" &&
    REVIEW_STATUSES.has(raw.reviewStatus as RelayReviewStatus)
      ? (raw.reviewStatus as RelayReviewStatus)
      : undefined;

  const ready = isMinionRelayReady();
  if (!ready.minion) {
    return NextResponse.json(
      {
        error:
          "Minion Relay not connected. Add K_MINION_API_KEY on the server (.env.local / Vercel).",
        code: "not_configured",
      },
      { status: 503 },
    );
  }

  try {
    const result = await runMinionRelay({
      message,
      agent,
      persistOnly: Boolean(raw.persistOnly),
      finalAnswer:
        typeof raw.finalAnswer === "string" ? raw.finalAnswer : undefined,
      reviewStatus,
    });

    return NextResponse.json({
      ...result,
      passwordRequired: access.passwordRequired,
      ready,
    });
  } catch {
    return NextResponse.json(
      { error: "Minion relay failed unexpectedly.", code: "unknown" },
      { status: 500 },
    );
  }
}

/** GET /api/minion/relay — config readiness (no secrets). */
export async function GET() {
  const ready = isMinionRelayReady();
  return NextResponse.json({
    ok: ready.minion,
    app_id: "6a5f20ace942aedd542584a2",
    entity: "Message",
    env: "K_MINION_API_KEY",
    ready,
  });
}
