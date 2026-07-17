import { NextResponse } from "next/server";
import { getBridgeStatus } from "@/lib/bridges/hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Live bridge health — products API, Senti, static catalog/sku-map */
export async function GET() {
  const status = await getBridgeStatus();
  return NextResponse.json(status, { status: status.ok ? 200 : 503 });
}
