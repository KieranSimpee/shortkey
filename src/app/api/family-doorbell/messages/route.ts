import { NextResponse } from "next/server";
import { assertFamilyDoorbellAccess } from "@/lib/familyDoorbellAccess";
import {
  createMessage,
  listMessages,
  StoreValidationError,
} from "@/lib/familyDoorbellStore";
import {
  COMMAND_SENDERS,
  DEFAULT_COMPOSER_MODE,
  isCommandSender,
  isMessageMode,
  TARGET_MEMBER_OPTIONS,
  type MessageMode,
  type TargetMemberOption,
} from "@/lib/familyDoorbellTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/family-doorbell/messages
 * POST /api/family-doorbell/messages
 * Soft staging gate · Internal Staging only · Family Home v0.9.3
 */

export async function GET(request: Request) {
  const access = assertFamilyDoorbellAccess(request);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  try {
    const result = await listMessages();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[family-doorbell] listMessages", err);
    return NextResponse.json(
      { error: "Failed to list doorbell messages.", code: "store_error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const access = assertFamilyDoorbellAccess(request);
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
    body?: unknown;
    sender?: unknown;
    target_members?: unknown;
    mode?: unknown;
    messageType?: unknown;
  };

  const messageBody = typeof raw.body === "string" ? raw.body.trim() : "";
  if (!messageBody || messageBody.length > 8000) {
    return NextResponse.json(
      { error: "Command body is required (max 8000 characters)." },
      { status: 400 },
    );
  }

  if (!isCommandSender(raw.sender)) {
    return NextResponse.json(
      {
        error: `sender must be one of: ${COMMAND_SENDERS.join(" | ")}.`,
      },
      { status: 400 },
    );
  }

  if (!Array.isArray(raw.target_members) || raw.target_members.length === 0) {
    return NextResponse.json(
      { error: "target_members is required." },
      { status: 400 },
    );
  }

  const allowed = new Set<string>(TARGET_MEMBER_OPTIONS);
  const targets: TargetMemberOption[] = [];
  for (const t of raw.target_members) {
    if (typeof t !== "string" || !allowed.has(t)) {
      return NextResponse.json(
        { error: `Invalid target_member: ${String(t)}` },
        { status: 400 },
      );
    }
    targets.push(t as TargetMemberOption);
  }

  let mode: MessageMode = DEFAULT_COMPOSER_MODE;
  if (raw.mode !== undefined || raw.messageType !== undefined) {
    const candidate = raw.mode ?? raw.messageType;
    if (!isMessageMode(candidate)) {
      return NextResponse.json(
        {
          error:
            "mode / messageType must be doorbell | family-meeting | job-assignment | review-request.",
        },
        { status: 400 },
      );
    }
    mode = candidate;
  }

  try {
    const result = await createMessage({
      body: messageBody,
      sender: raw.sender,
      target_members: targets,
      mode,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof StoreValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[family-doorbell] createMessage", err);
    return NextResponse.json(
      { error: "Failed to create doorbell message.", code: "store_error" },
      { status: 500 },
    );
  }
}
