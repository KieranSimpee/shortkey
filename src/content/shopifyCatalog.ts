/* Auto-generated from data/shopify-products-export.csv — do not edit by hand.
 * Re-run: npm run import:shopify-csv -- "path/to/export.csv"
 */
import catalogJson from "../../data/shopify-catalog.json";

export type ShopifyCatalogProduct = {
  sku: string;
  handle: string;
  name: string;
  title: string;
  vendor: string;
  type: string;
  category: "Makeup" | "Skin Care";
  region: "K-Beauty" | "J-Beauty" | "C-Beauty" | "Multi";
  priceUsd: number;
  image: string;
  images: string[];
  tags: string[];
  optionName: string;
  optionValue: string;
  status: string;
  published: boolean;
  description: string;
  bodyHtml: string;
  whyItMadeTheEdit: string;
  howToUse: string;
  bestFor: string[];
  syncReady: boolean;
};

export const shopifyCatalog = catalogJson.products as ShopifyCatalogProduct[];

export function getShopifyCatalogProduct(sku: string): ShopifyCatalogProduct | undefined {
  const key = sku.toLowerCase();
  return shopifyCatalog.find((p) => p.sku.toLowerCase() === key || p.handle.toLowerCase() === key);
}

export function getSyncReadyShopifyProducts(): ShopifyCatalogProduct[] {
  return shopifyCatalog.filter((p) => p.syncReady);
}
