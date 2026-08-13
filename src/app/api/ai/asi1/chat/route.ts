import { NextResponse } from "next/server";
import { askAsiOneLive, AsiOneError, getAsiOneApiKey, getAsiOneModel } from "@/lib/ai/asi1";
import type { AsiOneMessage } from "@/lib/ai/asi1";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/ai/asi1/chat
 * Maya seat · ASI:One provider · LIVE only (no ghost replies).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body.", live: false }, { status: 400 });
  }

  const raw = body as {
    message?: unknown;
    messages?: unknown;
    system?: unknown;
  };

  const messagesIn = Array.isArray(raw.messages)
    ? (raw.messages as AsiOneMessage[])
    : undefined;
  const userMessage = typeof raw.message === "string" ? raw.message : undefined;

  try {
    const result = await askAsiOneLive({
      messages: messagesIn,
      userMessage,
      system: typeof raw.system === "string" ? raw.system : undefined,
      seatLabel: "Maya",
    });
    return NextResponse.json({
      live: true,
      seat: "maya",
      provider: "asi1",
      model: result.model,
      reply: result.reply,
    });
  } catch (err) {
    if (err instanceof AsiOneError) {
      return NextResponse.json(
        {
          live: false,
          seat: "maya",
          code: err.code,
          error: err.message,
          keyConfigured: Boolean(getAsiOneApiKey()),
          model: getAsiOneModel(),
        },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { live: false, seat: "maya", code: "bridge_error", error: "ASI:One chat failed." },
      { status: 502 },
    );
  }
}
