import { NextResponse } from "next/server";
import { CONNECTIONS } from "@/lib/connections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Permanent connection map — GitHub → Vercel → Base44 → Shopify.
 * See CONNECTIONS.md
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Do not recreate these links — only rotate secrets.",
    chain: CONNECTIONS,
    verify: "npm run connections:check",
    docs: "CONNECTIONS.md",
  });
}
