import { getCatalogProduct } from "@/lib/catalog";

/** Temporary catalog pricing until Shopify/Stripe price maps are connected */
const DEFAULT_UNIT_PRICE_USD = 24;

const PRICE_OVERRIDES: Record<string, number> = {
  // Fill per-SKU overrides here or load from Stripe/Shopify later
};

export function getUnitPriceUsd(sku: string): number {
  const key = sku.toUpperCase();
  if (PRICE_OVERRIDES[key] != null) return PRICE_OVERRIDES[key];
  const product = getCatalogProduct(sku);
  if (!product) return DEFAULT_UNIT_PRICE_USD;
  return DEFAULT_UNIT_PRICE_USD;
}

export function formatMoney(amount: number, currency: "USD" = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
