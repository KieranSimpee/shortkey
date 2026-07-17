import { siteContent } from "@/content/homepage";
import {
  getShopCatalogRecord,
  shopCatalog,
  type ShopCategory,
  type ShopRegion,
} from "@/content/shopCatalog";

export type CatalogProduct = {
  sku: string;
  name: string;
  type?: string;
  image: string;
  href: string;
  category?: ShopCategory;
  region?: ShopRegion;
  priceUsd?: number;
  syncReady?: boolean;
  description?: string;
};

/** Unique products: shop catalog first, then Beauty OS + influencer shops */
export function getCatalogProducts(): CatalogProduct[] {
  const map = new Map<string, CatalogProduct>();

  for (const product of shopCatalog) {
    map.set(product.sku.toUpperCase(), {
      sku: product.sku,
      name: product.name,
      type: product.type,
      image: product.image,
      href: `/shop/${product.sku}`,
      category: product.category,
      region: product.region,
      priceUsd: product.priceUsd,
      syncReady: product.syncReady,
      description: product.description,
    });
  }

  for (const folder of siteContent.beautyOs.folders) {
    for (const product of folder.products) {
      const key = product.sku.toUpperCase();
      if (!map.has(key)) {
        map.set(key, {
          sku: product.sku,
          name: product.name,
          type: product.type,
          image: product.image,
          href: `/shop/${product.sku}`,
          category: key.startsWith("SK-M") ? "Makeup" : "Skin Care",
        });
      }
    }
  }

  for (const host of siteContent.aiLab.hosts) {
    for (const product of host.shopProducts) {
      const key = product.sku.toUpperCase();
      if (!map.has(key)) {
        map.set(key, {
          sku: product.sku,
          name: product.name,
          image: product.image,
          href: `/shop/${product.sku}`,
          category: "Makeup",
        });
      }
    }
  }

  return Array.from(map.values());
}

export function getCatalogProduct(sku: string): CatalogProduct | undefined {
  const normalized = sku.toUpperCase();
  const fromShop = getShopCatalogRecord(normalized);
  if (fromShop) {
    return {
      sku: fromShop.sku,
      name: fromShop.name,
      type: fromShop.type,
      image: fromShop.image,
      href: `/shop/${fromShop.sku}`,
      category: fromShop.category,
      region: fromShop.region,
      priceUsd: fromShop.priceUsd,
      syncReady: fromShop.syncReady,
      description: fromShop.description,
    };
  }
  return getCatalogProducts().find((p) => p.sku.toUpperCase() === normalized);
}
