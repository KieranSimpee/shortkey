import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/** Studio SSOT — Ecosystem Master Blueprint (machine-readable). */
export async function GET() {
  try {
    const file = path.join(
      process.cwd(),
      "src",
      "brand",
      "ecosystem-domains.json",
    );
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return NextResponse.json({
      ok: true,
      blueprint: data,
      docs: {
        md: "/src/brand/ECOSYSTEM_MASTER_BLUEPRINT.md",
        masterOs: "/src/brand/MASTER_OS.md",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "read failed" },
      { status: 500 },
    );
  }
}
