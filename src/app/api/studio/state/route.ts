import { NextResponse } from "next/server";
import {
  loadStudioState,
  saveStudioState,
} from "@/lib/studio/store";
import type { StudioState } from "@/lib/studio/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET/POST /api/studio/state
 * ShortKey Studio v0.1 — local/dev file store or ephemeral memory.
 * No Upstash required. Not production publish.
 */

export async function GET() {
  try {
    const result = await loadStudioState();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[studio] loadStudioState", err);
    return NextResponse.json(
      { error: "Failed to load Studio state.", code: "store_error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as { state?: unknown };
  if (!raw.state || typeof raw.state !== "object") {
    return NextResponse.json(
      { error: "Body must include { state: StudioState }." },
      { status: 400 },
    );
  }

  try {
    const result = await saveStudioState(raw.state as StudioState);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[studio] saveStudioState", err);
    return NextResponse.json(
      { error: "Failed to save Studio state.", code: "store_error" },
      { status: 500 },
    );
  }
}
