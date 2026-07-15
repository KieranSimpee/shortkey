import { getCommerceConfig } from "@/lib/commerce/config";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/commerce/types";
import { getUnitPriceUsd } from "@/lib/commerce/pricing";

type StripeSessionResponse = {
  id: string;
  url: string | null;
  error?: { message?: string };
};

/**
 * Creates a Stripe Checkout Session when STRIPE_SECRET_KEY is set.
 * Uses Price IDs when provided; otherwise creates ad-hoc price_data lines.
 */
export async function createStripeCheckout(
  request: CheckoutRequest,
): Promise<CheckoutResponse> {
  const config = getCommerceConfig();
  if (!config.stripe.configured || !config.stripe.secretKey) {
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      error: "Stripe is not configured. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
    };
  }

  const successUrl =
    request.successUrl ?? `${config.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = request.cancelUrl ?? `${config.siteUrl}/checkout/cancel`;

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", successUrl);
  body.set("cancel_url", cancelUrl);
  body.set("billing_address_collection", "required");
  if (request.customerEmail) body.set("customer_email", request.customerEmail);

  if (request.mode === "founding_brand") {
    if (config.stripe.foundingBrandPriceId) {
      body.append("line_items[0][price]", config.stripe.foundingBrandPriceId);
      body.append("line_items[0][quantity]", "1");
    } else {
      body.append("line_items[0][quantity]", "1");
      body.append("line_items[0][price_data][currency]", "usd");
      body.append(
        "line_items[0][price_data][unit_amount]",
        String(Math.round(config.foundingBrandFeeUsd * 100)),
      );
      body.append(
        "line_items[0][price_data][product_data][name]",
        "Shortkey Founding Brand Slot",
      );
      body.append(
        "line_items[0][price_data][product_data][description]",
        request.brandCompany
          ? `Founding registration for ${request.brandCompany}`
          : "One-time founding brand fee",
      );
    }
    body.set("metadata[flow]", "founding_brand");
    if (request.brandCompany) body.set("metadata[company]", request.brandCompany);
  } else {
    if (!request.lines.length) {
      return { ok: false, code: "INVALID_CART", error: "Cart is empty." };
    }

    request.lines.forEach((line, index) => {
      const qty = Math.max(1, Math.min(99, line.quantity));
      body.append(`line_items[${index}][quantity]`, String(qty));

      if (line.stripePriceId) {
        body.append(`line_items[${index}][price]`, line.stripePriceId);
        return;
      }

      const unit = line.unitPrice ?? getUnitPriceUsd(line.sku);
      body.append(`line_items[${index}][price_data][currency]`, "usd");
      body.append(
        `line_items[${index}][price_data][unit_amount]`,
        String(Math.round(unit * 100)),
      );
      body.append(
        `line_items[${index}][price_data][product_data][name]`,
        line.name ?? line.sku,
      );
      body.append(
        `line_items[${index}][price_data][product_data][metadata][sku]`,
        line.sku,
      );
    });
    body.set("metadata[flow]", "cart");
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.stripe.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = (await response.json()) as StripeSessionResponse;
  if (!response.ok || !json.url) {
    return {
      ok: false,
      code: "PROVIDER_ERROR",
      error: json.error?.message ?? "Stripe Checkout session failed.",
    };
  }

  return {
    ok: true,
    provider: "stripe",
    checkoutUrl: json.url,
    sessionId: json.id,
  };
}
