// lib/products.ts
// ShortKey Master Product Library
// Live source: Base44 getShortKeyProducts
// Always falls back to bridged/static catalog so the shop never goes empty.

import { getCatalogProducts } from "@/lib/catalog";
import { productsApiUrl } from "@/lib/connections";
import { productImg } from "@/lib/images";

const BACKEND_URL = productsApiUrl();

export interface ShortKeyProduct {
  id: string;
  shopify_sku: string;
  name: string;
  brand_name: string;
  category: string;
  price_usd: number;
  image_url: string;
  description?: string;
  stock_status: string;
  status: string;
  notes?: string;
  region?: string;
}

function staticAsProducts(): ShortKeyProduct[] {
  return getCatalogProducts().map((p) => ({
    id: p.sku,
    shopify_sku: p.sku,
    name: p.name,
    brand_name: "Shortkey",
    category: p.type || p.category || "Beauty",
    price_usd: p.priceUsd ?? 24,
    image_url: p.image || productImg(p.sku),
    description: p.description,
    stock_status: "in_stock",
    status: p.syncReady === false ? "coming_soon" : "active",
    notes: [p.region, p.category, p.syncReady ? "made-the-edit" : ""]
      .filter(Boolean)
      .join(", "),
    region: p.region,
  }));
}

export async function getProducts(): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(`${BACKEND_URL}?limit=100`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`Backend fetch failed: ${res.status}`);
    const data = await res.json();
    const products = (data.products ?? []) as ShortKeyProduct[];
    if (products.length > 0) return products;
    console.warn("[ShortKey] products API empty — using static bridge fallback");
    return staticAsProducts();
  } catch (err) {
    console.error("[ShortKey] Failed to fetch products:", err);
    return staticAsProducts();
  }
}

export async function getProductsByCategory(category: string): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(`${BACKEND_URL}?category=${encodeURIComponent(category)}&limit=100`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`Backend fetch failed: ${res.status}`);
    const data = await res.json();
    const products = (data.products ?? []) as ShortKeyProduct[];
    if (products.length > 0) return products;
  } catch (err) {
    console.error("[ShortKey] Failed to fetch products by category:", err);
  }
  return (await getProducts()).filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
}

export async function getProductBySku(sku: string): Promise<ShortKeyProduct | null> {
  try {
    const res = await fetch(`${BACKEND_URL}?sku=${encodeURIComponent(sku)}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      const hit = data.products?.[0] as ShortKeyProduct | undefined;
      if (hit) return hit;
    }
  } catch {
    /* fall through */
  }
  return (await getProducts()).find((p) => p.shopify_sku.toUpperCase() === sku.toUpperCase()) ?? null;
}

export async function getCategories(): Promise<string[]> {
  const all = await getProducts();
  return [...new Set(all.map((p) => p.category))].sort();
}

export const CATEGORIES = {
  LIP: "Lip",
  FACE: "Face",
  EYES: "Eyes",
  MASKS: "Masks & Treatments",
  PREP_HYDRATE: "Prep & Hydrate",
  PREP_FINISH: "Prep & Finish",
  CLEANSE: "Cleanse & Remove",
  LIP_EYE: "Lip & Eye Care",
} as const;
