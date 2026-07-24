import { NextResponse } from "next/server";
import { assertFamilyDoorbellAccess } from "@/lib/familyDoorbellAccess";
import {
  StoreNotFoundError,
  StoreValidationError,
  updateReceipt,
} from "@/lib/familyDoorbellStore";
import {
  isCompleteSelfCheck,
  isReceiptStatus,
  isSupportStatus,
  isTargetMember,
  type FamilySelfCheck,
} from "@/lib/familyDoorbellTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/family-doorbell/messages/:id/receipt
 * Body: { member, status?, note?, supportStatus?, selfCheck?, evidence_url?, blocker? }
 * SUBMITTED requires complete selfCheck (6 fields).
 * Never auto-marks RECEIVED — client must send explicit status.
 */

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const access = assertFamilyDoorbellAccess(request);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Message id is required." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as {
    member?: unknown;
    status?: unknown;
    note?: unknown;
    supportStatus?: unknown;
    selfCheck?: unknown;
    self_check?: unknown;
    evidenceUrl?: unknown;
    evidence_url?: unknown;
    blocker?: unknown;
  };

  if (!isTargetMember(raw.member)) {
    return NextResponse.json({ error: "Valid member is required." }, { status: 400 });
  }

  if (raw.status !== undefined && !isReceiptStatus(raw.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  if (raw.supportStatus !== undefined && !isSupportStatus(raw.supportStatus)) {
    return NextResponse.json({ error: "Invalid supportStatus." }, { status: 400 });
  }

  if (raw.note !== undefined && typeof raw.note !== "string") {
    return NextResponse.json({ error: "note must be a string." }, { status: 400 });
  }

  const evidenceRaw = raw.evidenceUrl ?? raw.evidence_url;
  if (evidenceRaw !== undefined && evidenceRaw !== null && typeof evidenceRaw !== "string") {
    return NextResponse.json({ error: "evidence_url must be a string." }, { status: 400 });
  }

  if (raw.blocker !== undefined && raw.blocker !== null && typeof raw.blocker !== "string") {
    return NextResponse.json({ error: "blocker must be a string." }, { status: 400 });
  }

  const selfCheckRaw = raw.selfCheck ?? raw.self_check;
  let selfCheck: FamilySelfCheck | null | undefined;
  if (selfCheckRaw !== undefined) {
    if (selfCheckRaw === null) {
      selfCheck = null;
    } else if (isCompleteSelfCheck(selfCheckRaw)) {
      selfCheck = {
        whatIDid: selfCheckRaw.whatIDid.trim(),
        evidence: selfCheckRaw.evidence.trim(),
        purposeFulfilled: selfCheckRaw.purposeFulfilled.trim(),
        whatCouldBeBetter: selfCheckRaw.whatCouldBeBetter.trim(),
        blockers: selfCheckRaw.blockers.trim(),
        supportNeeded: selfCheckRaw.supportNeeded.trim(),
      };
    } else {
      return NextResponse.json(
        {
          error:
            "selfCheck must include all six non-empty fields: whatIDid, evidence, purposeFulfilled, whatCouldBeBetter, blockers, supportNeeded.",
        },
        { status: 400 },
      );
    }
  }

  if (raw.status === "SUBMITTED" && !isCompleteSelfCheck(selfCheck)) {
    return NextResponse.json(
      {
        error:
          "SUBMITTED requires a complete self-check (what I did, evidence, purpose fulfilled, what could be better, blockers, support needed).",
      },
      { status: 400 },
    );
  }

  try {
    const result = await updateReceipt(id.trim(), {
      member: raw.member,
      status: raw.status,
      note: raw.note,
      supportStatus: raw.supportStatus,
      selfCheck,
      evidenceUrl:
        evidenceRaw === undefined
          ? undefined
          : evidenceRaw === null
            ? null
            : String(evidenceRaw).trim(),
      blocker:
        raw.blocker === undefined
          ? undefined
          : raw.blocker === null
            ? null
            : String(raw.blocker).trim(),
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof StoreValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof StoreNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error("[family-doorbell] updateReceipt", err);
    return NextResponse.json(
      { error: "Failed to update receipt.", code: "store_error" },
      { status: 500 },
    );
  }
}
