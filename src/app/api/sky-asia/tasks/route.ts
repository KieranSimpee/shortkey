import { NextRequest, NextResponse } from "next/server";
import { appendTask, readTasks, type JsonRecord } from "@/lib/sky-asia/data";

export const runtime = "nodejs";

export async function GET() {
  const rows = await readTasks();
  return NextResponse.json({ count: rows.length, rows });
}

export async function POST(request: NextRequest) {
  let body: JsonRecord;
  try {
    body = (await request.json()) as JsonRecord;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = String(body.id ?? "").trim();
  const owner = String(body.owner ?? "").trim();
  const title = String(body.title ?? "").trim();
  if (!id || !owner || !title) {
    return NextResponse.json(
      { error: "id, owner, and title are required" },
      { status: 400 },
    );
  }

  const row: JsonRecord = {
    id,
    owner,
    title,
    detail: String(body.detail ?? ""),
    status: String(body.status ?? "todo"),
    phase: Number(body.phase ?? 2),
    blockedBy: body.blockedBy ?? null,
    refs: Array.isArray(body.refs) ? body.refs : [],
  };

  const rows = await appendTask(row);
  return NextResponse.json({ ok: true, count: rows.length, row });
}
