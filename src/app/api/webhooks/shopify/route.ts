import { NextResponse } from "next/server";
import { getCommerceConfig } from "@/lib/commerce/config";

export const runtime = "nodejs";

/**
 * Shopify webhook endpoint — verify HMAC with SHOPIFY_WEBHOOK_SECRET.
 * Typical topics: orders/paid, checkouts/create, products/update.
 */
export async function POST(req: Request) {
  const config = getCommerceConfig();
  const payload = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic");

  if (!config.shopify.webhookSecret) {
    console.warn("[shopify webhook] SHOPIFY_WEBHOOK_SECRET not set — wiring stub only");
    return NextResponse.json({
      received: true,
      verified: false,
      topic,
      note: "Set SHOPIFY_WEBHOOK_SECRET and verify HMAC before production.",
      bytes: payload.length,
      hasHmac: Boolean(hmac),
    });
  }

  return NextResponse.json({
    received: true,
    verified: false,
    topic,
    note: "Implement HMAC verification with crypto.createHmac('sha256', secret).",
    hasHmac: Boolean(hmac),
  });
}
