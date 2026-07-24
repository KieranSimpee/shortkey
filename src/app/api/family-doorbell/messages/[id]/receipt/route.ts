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
 * Body: { member, status?, note?, supportStatus?, selfCheck? }
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

  let selfCheck: FamilySelfCheck | null | undefined;
  if (raw.selfCheck !== undefined) {
    if (raw.selfCheck === null) {
      selfCheck = null;
    } else if (isCompleteSelfCheck(raw.selfCheck)) {
      selfCheck = {
        whatIDid: raw.selfCheck.whatIDid.trim(),
        evidence: raw.selfCheck.evidence.trim(),
        purposeFulfilled: raw.selfCheck.purposeFulfilled.trim(),
        whatCouldBeBetter: raw.selfCheck.whatCouldBeBetter.trim(),
        blockers: raw.selfCheck.blockers.trim(),
        supportNeeded: raw.selfCheck.supportNeeded.trim(),
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
