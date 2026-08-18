import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  createAssignedTask,
  intakeKindFromCategory,
  isIntakeCategory,
  notifyOwnerAgent,
  ownerForKind,
  routedStatusForOwner,
  upsertIntake,
  verifyIntakeSecret,
  type IntakeRecord,
} from "@/lib/sky-asia/intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const gate = verifyIntakeSecret(
    request.headers.get("x-sky-asia-intake-secret"),
  );
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subject = String(body.subject ?? "").trim();
  const category = String(body.category ?? "").trim();
  const description = String(body.description ?? "").trim();
  if (!subject || !category || !description) {
    return NextResponse.json(
      { error: "subject, category, and description are required" },
      { status: 400 },
    );
  }
  if (!isIntakeCategory(category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }
  const kind = intakeKindFromCategory(category);
  if (!kind) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const owner = ownerForKind(kind);
  const recordId = String(body.record_id ?? body.id ?? randomUUID());
  const link = String(body.link ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  let agentNotify = "skipped_no_key";
  try {
    agentNotify = await notifyOwnerAgent({
      owner,
      subject,
      category,
      description,
      link,
      notes,
      recordId,
    });
  } catch (error) {
    agentNotify =
      error instanceof Error ? `agent_error:${error.message}` : "agent_error";
  }

  await createAssignedTask({
    owner,
    subject,
    category,
    description,
    recordId,
  });

  const row: IntakeRecord = {
    id: recordId,
    subject,
    category,
    description,
    link,
    notes,
    status: routedStatusForOwner(owner),
    assignedTo: owner,
    submittedBy: String(body.submitted_by ?? "").trim(),
    submittedAt: String(body.submitted_at ?? new Date().toISOString()),
    tableRecordId: String(body.table_record_id ?? ""),
    routedAt: new Date().toISOString(),
    agentNotify,
  };

  const rows = await upsertIntake(row);
  return NextResponse.json({
    ok: true,
    row,
    count: rows.length,
    owner,
    agentNotify,
  });
}
