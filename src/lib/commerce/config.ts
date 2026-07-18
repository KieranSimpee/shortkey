import type { CommerceProvider } from "@/lib/commerce/types";
import { shopifyStoreDomain } from "@/lib/connections";

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getCommerceConfig() {
  const stripeSecretKey = env("STRIPE_SECRET_KEY");
  const stripePublishableKey = env("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  const stripeWebhookSecret = env("STRIPE_WEBHOOK_SECRET");
  const stripeFoundingPriceId = env("STRIPE_FOUNDING_BRAND_PRICE_ID");

  const shopifyStoreDomainValue =
    env("SHOPIFY_STORE_DOMAIN") ?? env("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN") ?? shopifyStoreDomain();
  const shopifyStorefrontToken = env("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  const shopifyAdminToken = env("SHOPIFY_ADMIN_ACCESS_TOKEN");
  const shopifyWebhookSecret = env("SHOPIFY_WEBHOOK_SECRET");

  const stripeConfigured = Boolean(stripeSecretKey && stripePublishableKey);
  const shopifyConfigured = Boolean(shopifyStoreDomainValue && shopifyStorefrontToken);

  const requested = (env("COMMERCE_PROVIDER") ?? "dual").toLowerCase() as CommerceProvider;
  let provider: CommerceProvider = requested;
  if (requested === "dual") {
    if (stripeConfigured && shopifyConfigured) provider = "dual";
    else if (stripeConfigured) provider = "stripe";
    else if (shopifyConfigured) provider = "shopify";
    else provider = "mock";
  } else if (requested === "stripe" && !stripeConfigured) {
    provider = "mock";
  } else if (requested === "shopify" && !shopifyConfigured) {
    provider = "mock";
  }

  const publicMode = (env("NEXT_PUBLIC_COMMERCE_MODE") ?? "mock").toLowerCase();

  return {
    provider,
    publicMode: publicMode === "live" ? ("live" as const) : ("mock" as const),
    siteUrl: env("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
    foundingBrandFeeUsd: Number(env("FOUNDING_BRAND_FEE_USD") ?? "5000"),
    stripe: {
      configured: stripeConfigured,
      secretKey: stripeSecretKey,
      publishableKey: stripePublishableKey,
      webhookSecret: stripeWebhookSecret,
      foundingBrandPriceId: stripeFoundingPriceId,
    },
    shopify: {
      configured: shopifyConfigured,
      storeDomain: shopifyStoreDomainValue.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      storefrontToken: shopifyStorefrontToken,
      adminToken: shopifyAdminToken,
      webhookSecret: shopifyWebhookSecret,
      apiVersion: env("SHOPIFY_API_VERSION") ?? "2025-01",
    },
  };
}

export type CommerceConfig = ReturnType<typeof getCommerceConfig>;
