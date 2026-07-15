/**
 * SKU → Shopify Variant GID + Stripe Price ID map.
 *
 * HOW TO WIRE SHOPIFY:
 * 1. In Shopify Admin → Products, open each product
 * 2. Copy the variant GID from the URL or via Storefront API
 *    Format: "gid://shopify/ProductVariant/1234567890"
 * 3. Paste it below next to the matching SKU
 *
 * HOW TO WIRE STRIPE:
 * 1. In Stripe Dashboard → Products, create a price per SKU
 * 2. Copy the Price ID (starts with price_)
 * 3. Paste it below
 *
 * Leave fields empty until you have the IDs — checkout falls back to mock mode.
 */
export type SkuGatewayMap = {
  shopifyVariantId?: string;  // gid://shopify/ProductVariant/XXXXX
  stripePriceId?: string;     // price_XXXXXXXXXXXXX
};

export const skuGatewayMap: Record<string, SkuGatewayMap> = {
  // ── MAKEUP ─────────────────────────────────────────────────────────────
  "SK-M001": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M002": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M003": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M004": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M005": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M006": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M007": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M008": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M009": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M010": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M011": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M012": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M013": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M014": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M015": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M016": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M017": { shopifyVariantId: "", stripePriceId: "" },
  "SK-M018": { shopifyVariantId: "", stripePriceId: "" },
  // ── BASE / SKIN ─────────────────────────────────────────────────────────
  "SK-B001": { shopifyVariantId: "", stripePriceId: "" },
  "SK-B002": { shopifyVariantId: "", stripePriceId: "" },
  "SK-B003": { shopifyVariantId: "", stripePriceId: "" },
  // ── DERMA ───────────────────────────────────────────────────────────────
  "SK-D001": { shopifyVariantId: "", stripePriceId: "" },
  "SK-D002": { shopifyVariantId: "", stripePriceId: "" },
  "SK-D003": { shopifyVariantId: "", stripePriceId: "" },
  // ── GLOW ────────────────────────────────────────────────────────────────
  "SK-G001": { shopifyVariantId: "", stripePriceId: "" },
  "SK-G002": { shopifyVariantId: "", stripePriceId: "" },
  "SK-G003": { shopifyVariantId: "", stripePriceId: "" },
  // ── HYDRA ───────────────────────────────────────────────────────────────
  "SK-H001": { shopifyVariantId: "", stripePriceId: "" },
  "SK-H002": { shopifyVariantId: "", stripePriceId: "" },
  "SK-H003": { shopifyVariantId: "", stripePriceId: "" },
  // ── ZONE ────────────────────────────────────────────────────────────────
  "SK-Z001": { shopifyVariantId: "", stripePriceId: "" },
  "SK-Z002": { shopifyVariantId: "", stripePriceId: "" },
};

export function getGatewayIdsForSku(sku: string): SkuGatewayMap {
  return skuGatewayMap[sku.toUpperCase()] ?? skuGatewayMap[sku] ?? {};
}
