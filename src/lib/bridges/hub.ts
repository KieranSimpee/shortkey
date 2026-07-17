/**
 * Shortkey Bridge Hub
 * Keeps product / commerce bridges aligned at all times:
 *   1) Live Base44 products API
 *   2) Senti data bridge (SKU map + catalog metadata)
 *   3) Static shopCatalog + skuGatewayMap fallback
 *
 * Call `getBridgedProducts()` / `resolveGatewayIdsForSku()` from server code.
 * Never trust a single bridge alone — always merge + fall back.
 */

import { getCatalogProducts, type CatalogProduct } from "@/lib/catalog";
import {
  getSentiData,
  getSentiProducts,
  getSentiSkuMap,
  toCatalogProduct,
  toSkuGatewayMap,
  type SentiProduct,
} from "@/lib/senti-bridge";
import {
  getGatewayIdsForSku,
  skuGatewayMap,
  type SkuGatewayMap,
} from "@/lib/commerce/sku-map";
import { getProducts, type ShortKeyProduct } from "@/lib/products";
import { productImg } from "@/lib/images";

export type BridgeName = "products-api" | "senti" | "static-catalog" | "static-sku-map";

export type BridgeStatus = {
  name: BridgeName;
  ok: boolean;
  count?: number;
  error?: string;
  checkedAt: string;
};

const REVALIDATE_SECONDS = 30;

/** Shared short cache hint for bridge fetches */
export const bridgeFetchInit = {
  next: { revalidate: REVALIDATE_SECONDS },
} as const;

function toCatalogFromProductsApi(p: ShortKeyProduct): CatalogProduct {
  const sku = (p.shopify_sku || p.id || "").toUpperCase();
  return {
    sku,
    name: p.name,
    type: p.category,
    image: p.image_url || productImg(sku),
    href: `/shop/${sku}`,
    category: /skin|spf|cream|cleanser|essence|ampoule|mask/i.test(p.category)
      ? "Skin Care"
      : "Makeup",
    priceUsd: p.price_usd,
    syncReady: p.status === "active" || p.stock_status === "in_stock",
    description: p.description,
  };
}

function mergeCatalog(...lists: CatalogProduct[][]): CatalogProduct[] {
  const map = new Map<string, CatalogProduct>();
  for (const list of lists) {
    for (const product of list) {
      const key = product.sku.toUpperCase();
      if (!key) continue;
      const prev = map.get(key);
      map.set(key, prev ? { ...prev, ...product, sku: key } : { ...product, sku: key });
    }
  }
  return Array.from(map.values());
}

function mergeSkuMaps(...maps: Record<string, SkuGatewayMap>[]): Record<string, SkuGatewayMap> {
  const out: Record<string, SkuGatewayMap> = {};
  for (const map of maps) {
    for (const [sku, value] of Object.entries(map)) {
      const key = sku.toUpperCase();
      const prev = out[key] ?? {};
      out[key] = {
        shopifyVariantId: value.shopifyVariantId || prev.shopifyVariantId,
        stripePriceId: value.stripePriceId || prev.stripePriceId,
      };
    }
  }
  return out;
}

function nonEmptyStaticSkuMap(): Record<string, SkuGatewayMap> {
  const out: Record<string, SkuGatewayMap> = {};
  for (const [sku, value] of Object.entries(skuGatewayMap)) {
    if (value.shopifyVariantId || value.stripePriceId) {
      out[sku.toUpperCase()] = {
        shopifyVariantId: value.shopifyVariantId || undefined,
        stripePriceId: value.stripePriceId || undefined,
      };
    }
  }
  return out;
}

/**
 * Live product list with static fallback — always returns something usable.
 */
export async function getBridgedProducts(): Promise<CatalogProduct[]> {
  const staticProducts = getCatalogProducts();

  const [liveProducts, sentiProducts] = await Promise.all([
    getProducts().catch(() => [] as ShortKeyProduct[]),
    getSentiProducts().catch(() => [] as SentiProduct[]),
  ]);

  const fromApi = liveProducts.map(toCatalogFromProductsApi);
  const fromSenti = sentiProducts.map((p) => ({
    ...toCatalogProduct(p),
    category: /skin|spf|cream|cleanser|essence|ampoule/i.test(p.category)
      ? ("Skin Care" as const)
      : ("Makeup" as const),
    region: p.region,
    priceUsd: p.price_usd,
    syncReady: p.status === "active",
  }));

  // Prefer live bridges, keep static fields for anything missing
  return mergeCatalog(staticProducts, fromSenti, fromApi);
}

export async function getBridgedProduct(sku: string): Promise<CatalogProduct | undefined> {
  const key = sku.toUpperCase();
  const all = await getBridgedProducts();
  return all.find((p) => p.sku.toUpperCase() === key);
}

/**
 * SKU → gateway IDs: Senti live map overlays static map.
 */
export async function getBridgedSkuMap(): Promise<Record<string, SkuGatewayMap>> {
  const sentiMap = await getSentiSkuMap().catch(() => ({} as Awaited<ReturnType<typeof getSentiSkuMap>>));
  const fromSenti = toSkuGatewayMap(sentiMap) as Record<string, SkuGatewayMap>;
  return mergeSkuMaps(nonEmptyStaticSkuMap(), fromSenti);
}

export async function resolveGatewayIdsForSku(sku: string): Promise<SkuGatewayMap> {
  const key = sku.toUpperCase();
  const bridged = await getBridgedSkuMap();
  if (bridged[key]?.shopifyVariantId || bridged[key]?.stripePriceId) {
    return bridged[key];
  }
  return getGatewayIdsForSku(key);
}

/** Probe every bridge and report readiness */
export async function getBridgeStatus(): Promise<{
  ok: boolean;
  revalidateSeconds: number;
  bridges: BridgeStatus[];
  productCount: number;
  mappedSkuCount: number;
}> {
  const checkedAt = new Date().toISOString();
  const bridges: BridgeStatus[] = [];

  let productsApiCount = 0;
  try {
    const products = await getProducts();
    productsApiCount = products.length;
    bridges.push({
      name: "products-api",
      ok: products.length > 0,
      count: products.length,
      checkedAt,
      error: products.length ? undefined : "empty response",
    });
  } catch (err) {
    bridges.push({
      name: "products-api",
      ok: false,
      checkedAt,
      error: err instanceof Error ? err.message : "fetch failed",
    });
  }

  let sentiCount = 0;
  try {
    const data = await getSentiData("all");
    sentiCount =
      (data?.products?.length ?? 0) +
      (data?.influencers?.length ?? 0) +
      (data?.brands?.length ?? 0);
    bridges.push({
      name: "senti",
      ok: Boolean(data),
      count: sentiCount,
      checkedAt,
      error: data ? undefined : "null payload",
    });
  } catch (err) {
    bridges.push({
      name: "senti",
      ok: false,
      checkedAt,
      error: err instanceof Error ? err.message : "fetch failed",
    });
  }

  const staticCatalog = getCatalogProducts();
  bridges.push({
    name: "static-catalog",
    ok: staticCatalog.length > 0,
    count: staticCatalog.length,
    checkedAt,
  });

  const staticMapped = Object.values(nonEmptyStaticSkuMap()).length;
  bridges.push({
    name: "static-sku-map",
    ok: true,
    count: staticMapped,
    checkedAt,
  });

  const bridgedProducts = await getBridgedProducts();
  const bridgedSkuMap = await getBridgedSkuMap();

  return {
    ok: bridges.some((b) => b.name !== "static-catalog" && b.name !== "static-sku-map" && b.ok) || staticCatalog.length > 0,
    revalidateSeconds: REVALIDATE_SECONDS,
    bridges,
    productCount: bridgedProducts.length,
    mappedSkuCount: Object.keys(bridgedSkuMap).length,
  };
}
