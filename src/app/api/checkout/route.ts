import { NextResponse } from "next/server";
import { getCommerceConfig } from "@/lib/commerce/config";
import { getGatewayIdsForSku } from "@/lib/commerce/sku-map";
import { getUnitPriceUsd } from "@/lib/commerce/pricing";
import { createShopifyCheckout } from "@/lib/commerce/shopify-server";
import { createStripeCheckout } from "@/lib/commerce/stripe-server";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/commerce/types";
import { getBridgedProduct } from "@/lib/bridges/hub";

export const runtime = "nodejs";

async function enrichLines(request: CheckoutRequest): Promise<CheckoutRequest> {
  const lines = await Promise.all(
    request.lines.map(async (line) => {
      const catalog = await getBridgedProduct(line.sku);
      const map = await getGatewayIdsForSku(line.sku);
      return {
        ...line,
        name: line.name ?? catalog?.name ?? line.sku,
        unitPrice: line.unitPrice ?? catalog?.priceUsd ?? getUnitPriceUsd(line.sku),
        shopifyVariantId: line.shopifyVariantId ?? map.shopifyVariantId,
        stripePriceId: line.stripePriceId ?? map.stripePriceId,
      };
    }),
  );
  return { ...request, lines };
}

export async function POST(req: Request) {
  let body: CheckoutRequest;
  try {
    body = (await req.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json(
      { ok: false, code: "INVALID_CART", error: "Invalid JSON body." } satisfies CheckoutResponse,
      { status: 400 },
    );
  }

  const enriched = await enrichLines(body);
  const config = getCommerceConfig();
  const preferred =
    body.provider ??
    (config.provider === "dual"
      ? "stripe"
      : config.provider === "mock"
        ? undefined
        : config.provider);

  if (!preferred || config.provider === "mock") {
    const mock: CheckoutResponse = {
      ok: true,
      provider: "mock",
      checkoutUrl: `${config.siteUrl}/checkout/success?mock=1&items=${enriched.lines.length}`,
    };
    return NextResponse.json(mock);
  }

  if (preferred === "shopify") {
    const result = await createShopifyCheckout(enriched);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  const result = await createStripeCheckout(enriched);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function GET() {
  const config = getCommerceConfig();
  return NextResponse.json({
    provider: config.provider,
    publicMode: config.publicMode,
    stripeConfigured: config.stripe.configured,
    shopifyConfigured: config.shopify.configured,
    siteUrl: config.siteUrl,
  });
}
