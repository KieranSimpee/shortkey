import { getCatalogProduct } from "@/lib/catalog";
import { getShopCatalogRecord } from "@/content/shopCatalog";

/**
 * Per-SKU price overrides.
 * Step 1: fill these manually for mock/demo.
 * Step 2: replace with Shopify Storefront product query once keys are set.
 * Format: SKU (uppercase) → USD price in dollars
 */
export const PRICE_OVERRIDES: Record<string, number> = {
  "SK-M001": 28,
  "SK-M002": 32,
  "SK-M003": 24,
  "SK-M004": 26,
  "SK-M005": 22,
  "SK-M006": 34,
  "SK-M007": 29,
  "SK-M008": 27,
  "SK-M009": 31,
  "SK-M010": 25,
  "SK-M011": 23,
  "SK-M012": 30,
  "SK-M013": 28,
  "SK-M014": 26,
  "SK-M015": 24,
  "SK-M016": 32,
  "SK-M017": 29,
  "SK-M018": 27,
  "SK-B001": 38,
  "SK-B002": 42,
  "SK-B003": 35,
  "SK-D001": 45,
  "SK-D002": 52,
  "SK-D003": 48,
  "SK-G001": 36,
  "SK-G002": 33,
  "SK-G003": 39,
  "SK-H001": 44,
  "SK-H002": 41,
  "SK-H003": 38,
  "SK-Z001": 29,
  "SK-Z002": 26,
};

const DEFAULT_UNIT_PRICE_USD = 24;

/**
 * Returns USD price for a SKU.
 * Priority: shopCatalog → PRICE_OVERRIDES → catalog priceUsd → default $24
 */
export function getUnitPriceUsd(sku: string): number {
  const key = sku.toUpperCase();
  const shop = getShopCatalogRecord(key);
  if (shop) return shop.priceUsd;
  if (PRICE_OVERRIDES[key] != null) return PRICE_OVERRIDES[key];
  const product = getCatalogProduct(sku);
  if (product?.priceUsd != null) return product.priceUsd;
  return DEFAULT_UNIT_PRICE_USD;
}

export function formatMoney(amount: number, currency: "USD" = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
