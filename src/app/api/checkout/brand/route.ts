import { NextResponse } from "next/server";
import { getCommerceConfig } from "@/lib/commerce/config";
import { createStripeCheckout } from "@/lib/commerce/stripe-server";
import type { CheckoutResponse } from "@/lib/commerce/types";

export const runtime = "nodejs";

/** Founding brand fee — Stripe Checkout (preferred for one-time platform fees). */
export async function POST(req: Request) {
  const config = getCommerceConfig();
  let company = "";
  let email = "";
  try {
    const body = (await req.json()) as { company?: string; email?: string };
    company = body.company?.trim() ?? "";
    email = body.email?.trim() ?? "";
  } catch {
    /* optional body */
  }

  if (!config.stripe.configured) {
    const mock: CheckoutResponse = {
      ok: true,
      provider: "mock",
      checkoutUrl: `${config.siteUrl}/brand/confirmation?level=founding&ref=MOCK`,
    };
    return NextResponse.json(mock);
  }

  const result = await createStripeCheckout({
    mode: "founding_brand",
    lines: [],
    brandCompany: company,
    customerEmail: email || undefined,
    successUrl: `${config.siteUrl}/brand/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${config.siteUrl}/brands`,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
