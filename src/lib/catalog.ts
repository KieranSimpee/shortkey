import { siteContent } from "@/content/homepage";

export type CatalogProduct = {
  sku: string;
  name: string;
  type?: string;
  image: string;
  href: string;
};

/** Unique products drawn from Beauty OS folders + influencer shops */
export function getCatalogProducts(): CatalogProduct[] {
  const map = new Map<string, CatalogProduct>();

  for (const folder of siteContent.beautyOs.folders) {
    for (const product of folder.products) {
      if (!map.has(product.sku)) {
        map.set(product.sku, {
          sku: product.sku,
          name: product.name,
          type: product.type,
          image: product.image,
          href: `/shop/${product.sku}`,
        });
      }
    }
  }

  for (const host of siteContent.aiLab.hosts) {
    for (const product of host.shopProducts) {
      if (!map.has(product.sku)) {
        map.set(product.sku, {
          sku: product.sku,
          name: product.name,
          image: product.image,
          href: `/shop/${product.sku}`,
        });
      }
    }
  }

  return Array.from(map.values());
}

export function getCatalogProduct(sku: string): CatalogProduct | undefined {
  const normalized = sku.toUpperCase();
  return getCatalogProducts().find((p) => p.sku.toUpperCase() === normalized);
}
