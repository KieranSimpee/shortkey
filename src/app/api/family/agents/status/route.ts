import { NextResponse } from "next/server";
import { assertGorGorChatAccess } from "@/lib/gorGorChatAccess";
import { getFamilyAgentsStatus } from "@/lib/family/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/family/agents/status
 * Live honesty board for family agents.
 * Query: ?ping=0 for config-only (no upstream calls)
 * NEVER marks LIVE without a real upstream reply.
 */
export async function GET(request: Request) {
  const access = assertGorGorChatAccess(request);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const url = new URL(request.url);
  const pingParam = url.searchParams.get("ping");
  const ping = pingParam !== "0" && pingParam !== "false";

  const report = await getFamilyAgentsStatus({ ping });
  return NextResponse.json(report, { status: report.ok ? 200 : 503 });
}
