import { NextResponse } from "next/server";
import { askAsiOneLive, AsiOneError, getAsiOneApiKey } from "@/lib/ai/asi1";
import {
  LOVART_CANVAS_URL,
  mayaToolSystemPrompt,
} from "@/lib/maya/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/maya/tools/lovart
 * Writes a brief via ASI:One when keyed. Never claims auto-render.
 * Art handoff remains founder-confirmed in the Lab UI.
 */
export async function POST(request: Request) {
  if (!getAsiOneApiKey()) {
    return NextResponse.json(
      {
        ok: false,
        live: false,
        code: "not_connected",
        error: "Needs ASI_ONE_API_KEY — not inventing a Lovart brief.",
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
      system: mayaToolSystemPrompt("lovart"),
      userMessage: brief,
    });
    return NextResponse.json({
      ok: true,
      live: true,
      mayaOutput: result.reply,
      canvasUrl: LOVART_CANVAS_URL,
      honesty:
        "Brief only · open Lovart after content reviewed & confirmed · no auto-render claimed",
    });
  } catch (err) {
    if (err instanceof AsiOneError) {
      return NextResponse.json(
        { ok: false, live: false, code: err.code, error: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { ok: false, live: false, error: "Lovart brief failed." },
      { status: 502 },
    );
  }
}
