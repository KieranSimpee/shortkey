import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "src", "content", "heroLogoPosition.json");

export type HeroLogoPosition = {
  locked: boolean;
  xPercent: number;
  yPercent: number;
  /** Stacked mobile — horizontal seam between panels */
  yPercentMobile?: number;
  scale: number;
  note?: string;
};

function readPosition(): HeroLogoPosition {
  const raw = fs.readFileSync(FILE, "utf8");
  return JSON.parse(raw) as HeroLogoPosition;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, position: readPosition() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "read failed" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<HeroLogoPosition>;
    const next: HeroLogoPosition = {
      locked: Boolean(body.locked),
      xPercent: clamp(Number(body.xPercent ?? 50), 0, 100),
      yPercent: clamp(Number(body.yPercent ?? 26), 0, 100),
      yPercentMobile: clamp(
        Number(body.yPercentMobile ?? 50),
        0,
        100,
      ),
      scale: clamp(Number(body.scale ?? 1), 0.5, 1.8),
      note: "Seam brand bridge. Edit on home with ?editLogo=1 — drag then Lock.",
    };
    fs.writeFileSync(FILE, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    return NextResponse.json({ ok: true, position: next });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "write failed" },
      { status: 500 },
    );
  }
}
