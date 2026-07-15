/**
 * Map Shortkey SKUs → live gateway identifiers after catalog sync.
 * Leave blank until Shopify variants / Stripe prices exist.
 */
export type SkuGatewayMap = {
  shopifyVariantId?: string;
  stripePriceId?: string;
};

export const skuGatewayMap: Record<string, SkuGatewayMap> = {
  // Example once wired:
  // "SK-M003": {
  //   shopifyVariantId: "gid://shopify/ProductVariant/1234567890",
  //   stripePriceId: "price_xxxxxxxxxxxxxxx",
  // },
};

export function getGatewayIdsForSku(sku: string): SkuGatewayMap {
  return skuGatewayMap[sku.toUpperCase()] ?? skuGatewayMap[sku] ?? {};
}
