import { NextResponse } from "next/server";
import { getCommerceConfig } from "@/lib/commerce/config";

export const runtime = "nodejs";

/**
 * Stripe webhook endpoint — verify signature once STRIPE_WEBHOOK_SECRET is set.
 * Handle checkout.session.completed for cart + founding_brand flows.
 */
export async function POST(req: Request) {
  const config = getCommerceConfig();
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!config.stripe.webhookSecret) {
    console.warn("[stripe webhook] STRIPE_WEBHOOK_SECRET not set — payload accepted for wiring tests only");
    return NextResponse.json({
      received: true,
      verified: false,
      note: "Set STRIPE_WEBHOOK_SECRET and verify with Stripe SDK before production.",
      bytes: payload.length,
      hasSignature: Boolean(signature),
    });
  }

  // Production: verify with stripe.webhooks.constructEvent(payload, signature, secret)
  // then switch(event.type) { case "checkout.session.completed": ... }
  return NextResponse.json({
    received: true,
    verified: false,
    note: "Install `stripe` package and enable constructEvent verification here.",
    hasSignature: Boolean(signature),
  });
}
