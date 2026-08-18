import { NextResponse } from "next/server";
import { airtableConfigured, loadPortalStories } from "@/lib/portal/airtable";
import { isPortalLane } from "@/lib/portal/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const laneRaw = searchParams.get("lane") ?? "";

  if (!isPortalLane(laneRaw)) {
    return NextResponse.json(
      {
        ok: false,
        error: "lane must be brand, creator, or soul",
      },
      { status: 400 },
    );
  }

  const { source, stories } = await loadPortalStories(laneRaw);

  return NextResponse.json({
    ok: true,
    source,
    airtableConfigured: airtableConfigured(),
    lane: laneRaw,
    stories,
  });
}
