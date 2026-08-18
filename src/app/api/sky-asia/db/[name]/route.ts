import { NextRequest, NextResponse } from "next/server";
import {
  appendDb,
  DB_COLUMNS,
  readDb,
  type JsonRecord,
} from "@/lib/sky-asia/data";
import type { DbName } from "@/lib/sky-asia/paths";

export const runtime = "nodejs";

const ALLOWED = new Set<DbName>([
  "artists",
  "creators",
  "brands",
  "festivals",
  "culture",
]);

function isDbName(value: string): value is DbName {
  return ALLOWED.has(value as DbName);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  if (!isDbName(name)) {
    return NextResponse.json({ error: "Unknown database" }, { status: 400 });
  }

  let body: JsonRecord;
  try {
    body = (await request.json()) as JsonRecord;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const columns = DB_COLUMNS[name];
  const row: JsonRecord = {};
  for (const col of columns) {
    if (!(col in body)) {
      return NextResponse.json(
        { error: `Missing field: ${col}` },
        { status: 400 },
      );
    }
    row[col] = body[col];
  }

  const rows = await appendDb(name, row);
  return NextResponse.json({ ok: true, count: rows.length, row });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  if (!isDbName(name)) {
    return NextResponse.json({ error: "Unknown database" }, { status: 400 });
  }
  const rows = await readDb(name);
  return NextResponse.json({ count: rows.length, rows });
}
