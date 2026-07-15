import { getCommerceConfig } from "@/lib/commerce/config";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/commerce/types";

type ShopifyCartCreate = {
  data?: {
    cartCreate?: {
      cart?: { id: string; checkoutUrl: string };
      userErrors?: { message: string }[];
    };
  };
  errors?: { message: string }[];
};

/**
 * Creates a Shopify Storefront cart + checkout URL when tokens are set.
 * Lines must include shopifyVariantId (GID) after catalog sync.
 */
export async function createShopifyCheckout(
  request: CheckoutRequest,
): Promise<CheckoutResponse> {
  const config = getCommerceConfig();
  if (!config.shopify.configured || !config.shopify.storeDomain || !config.shopify.storefrontToken) {
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      error:
        "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    };
  }

  if (!request.lines.length) {
    return { ok: false, code: "INVALID_CART", error: "Cart is empty." };
  }

  const missingVariant = request.lines.find((line) => !line.shopifyVariantId);
  if (missingVariant) {
    return {
      ok: false,
      code: "INVALID_CART",
      error: `SKU ${missingVariant.sku} is missing shopifyVariantId. Map catalog SKUs to Shopify variants before live checkout.`,
    };
  }

  const lines = request.lines.map((line) => ({
    merchandiseId: line.shopifyVariantId as string,
    quantity: Math.max(1, Math.min(99, line.quantity)),
  }));

  const endpoint = `https://${config.shopify.storeDomain}/api/${config.shopify.apiVersion}/graphql.json`;
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.shopify.storefrontToken,
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          lines,
          buyerIdentity: request.customerEmail
            ? { email: request.customerEmail }
            : undefined,
        },
      },
    }),
  });

  const json = (await response.json()) as ShopifyCartCreate;
  const payload = json.data?.cartCreate;
  const userError = payload?.userErrors?.[0]?.message ?? json.errors?.[0]?.message;

  if (!response.ok || !payload?.cart?.checkoutUrl) {
    return {
      ok: false,
      code: "PROVIDER_ERROR",
      error: userError ?? "Shopify cartCreate failed.",
    };
  }

  return {
    ok: true,
    provider: "shopify",
    checkoutUrl: payload.cart.checkoutUrl,
    sessionId: payload.cart.id,
  };
}
