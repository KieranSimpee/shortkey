import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  intakeKindFromCategory,
  isIntakeCategory,
  readIntake,
  upsertIntake,
  verifyIntakeSecret,
  type IntakeRecord,
} from "@/lib/sky-asia/intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const gate = verifyIntakeSecret(
    request.headers.get("x-sky-asia-intake-secret"),
  );
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }
  const rows = await readIntake();
  return NextResponse.json({ count: rows.length, rows });
}

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
  if (!isIntakeCategory(category) || !intakeKindFromCategory(category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const row: IntakeRecord = {
    id: String(body.record_id ?? body.id ?? randomUUID()),
    subject,
    category,
    description,
    link: String(body.link ?? "").trim(),
    notes: String(body.notes ?? "").trim(),
    status: "pending_kieran_review",
    assignedTo: null,
    submittedBy: String(body.submitted_by ?? "").trim(),
    submittedAt: String(body.submitted_at ?? new Date().toISOString()),
    tableRecordId: String(body.table_record_id ?? ""),
    routedAt: null,
    agentNotify: "awaiting_kieran",
  };

  const rows = await upsertIntake(row);
  return NextResponse.json({
    ok: true,
    row,
    count: rows.length,
    next: "Kieran review required before assign",
  });
}
