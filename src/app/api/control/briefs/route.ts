import { NextResponse } from "next/server";
import { BUILDER_AGENT_BRIEF, SUPER_AGENT_BRIEF } from "@/content/domains";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Paste-ready Base44 Super / Builder agent briefs for the control hub */
export async function GET() {
  return NextResponse.json({
    super: SUPER_AGENT_BRIEF,
    builder: BUILDER_AGENT_BRIEF,
  });
}
