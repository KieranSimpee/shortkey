import { NextResponse } from "next/server";
import { askAsiOneLive, AsiOneError, getAsiOneApiKey } from "@/lib/ai/asi1";
import { MIDJOURNEY_WEB, mayaToolSystemPrompt } from "@/lib/maya/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/maya/tools/midjourney
 * Prompt sketches via ASI:One when keyed. No live MJ API claimed.
 */
export async function POST(request: Request) {
  if (!getAsiOneApiKey()) {
    return NextResponse.json(
      {
        ok: false,
        live: false,
        code: "not_connected",
        error: "Needs ASI_ONE_API_KEY — not inventing Midjourney prompts.",
      },
      { status: 503 },
    );
  }

  let brief = "";
  try {
    const body = (await request.json()) as { brief?: unknown };
    brief = typeof body.brief === "string" ? body.brief.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  if (!brief) {
    return NextResponse.json({ ok: false, error: "brief required." }, { status: 400 });
  }

  try {
    const result = await askAsiOneLive({
      system: mayaToolSystemPrompt("midjourney"),
      userMessage: brief,
    });
    return NextResponse.json({
      ok: true,
      live: true,
      mayaOutput: result.reply,
      midjourneyUrl: MIDJOURNEY_WEB,
      honesty:
        "Prompt sketch only · paste into Midjourney after content confirm · no MJ API claimed",
    });
  } catch (err) {
    if (err instanceof AsiOneError) {
      return NextResponse.json(
        { ok: false, live: false, code: err.code, error: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { ok: false, live: false, error: "Midjourney brief failed." },
      { status: 502 },
    );
  }
}
