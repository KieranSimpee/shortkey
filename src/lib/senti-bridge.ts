/**
 * Senti Data Bridge
 * Fetches live products, influencers, and brands from Senti (Kieran's AI agent database)
 * Drop-in replacement for static homepage.ts data once Shopify variant IDs are added
 *
 * USAGE IN NEXT.JS:
 *   import { getSentiProducts, getSentiSkuMap } from "@/lib/senti-bridge";
 *   const products = await getSentiProducts();   // use instead of getCatalogProducts()
 *   const skuMap = await getSentiSkuMap();        // use instead of static skuGatewayMap
 *
 * API: POST https://app.base44.com/api/apps/6a42029cc124d0206f027335/functions/getShortKeyData
 */

const SENTI_API = "https://app.base44.com/api/apps/6a42029cc124d0206f027335/functions/getShortKeyData";

export type SentiProduct = {
  sku: string;
  name: string;
  brand_name: string;
  region: "K-Beauty" | "J-Beauty" | "C-Beauty";
  category: string;
  product_type: string;
  price_usd: number;
  shopify_variant_id: string;
  stripe_price_id: string;
  try_on_enabled: boolean;
  status: "active" | "coming_soon" | "archived";
  phase: "Phase 1" | "Phase 2" | "Phase 3";
};

export type SentiInfluencer = {
  platform_id: string;
  name: string;
  handle: string;
  region: "K-Beauty" | "J-Beauty" | "C-Beauty";
  status: "live" | "scheduled" | "replay" | "inactive";
  tagline: string;
  product_skus: string[];
  brand_affiliations: string[];
  onboarded: boolean;
};

export type SentiBrand = {
  brand_name: string;
  region: "K-Beauty" | "J-Beauty" | "C-Beauty";
  tier: "Founding" | "Partner" | "Emerging";
  status: "active" | "onboarding" | "pending" | "declined";
  hero_product_sku: string;
  shopify_connected: boolean;
  stripe_connected: boolean;
  onboarding_complete: boolean;
};

export type SentiSkuMap = Record<string, {
  shopifyVariantId: string;
  stripePriceId: string;
  priceUsd: number;
}>;

// ── Fetch all data ──────────────────────────────────────────────────────────
export async function getSentiData(type: "products" | "influencers" | "brands" | "all" = "all") {
  try {
    const res = await fetch(`${SENTI_API}?type=${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }, // cache 5 minutes in Next.js
    });
    if (!res.ok) throw new Error(`Senti API error: ${res.status}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error);
    return json.data;
  } catch (err) {
    console.error("[senti-bridge] fetch failed:", err);
    return null;
  }
}

// ── Typed helpers ───────────────────────────────────────────────────────────
export async function getSentiProducts(): Promise<SentiProduct[]> {
  const data = await getSentiData("products");
  return data?.products ?? [];
}

export async function getSentiInfluencers(): Promise<SentiInfluencer[]> {
  const data = await getSentiData("influencers");
  return data?.influencers ?? [];
}

export async function getSentiBrands(): Promise<SentiBrand[]> {
  const data = await getSentiData("brands");
  return data?.brands ?? [];
}

export async function getSentiSkuMap(): Promise<SentiSkuMap> {
  const data = await getSentiData("products");
  return data?.skuMap ?? {};
}

// ── Convert Senti product to Wilson's CatalogProduct shape ─────────────────
export function toCatalogProduct(p: SentiProduct) {
  return {
    sku: p.sku,
    name: p.name,
    type: p.product_type,
    image: `/images/products/${p.sku.toLowerCase()}.jpg`, // Wilson's image convention
    href: `/shop/${p.sku}`,
  };
}

// ── Convert Senti sku-map to Wilson's skuGatewayMap shape ──────────────────
export function toSkuGatewayMap(skuMap: SentiSkuMap) {
  return Object.fromEntries(
    Object.entries(skuMap).map(([sku, v]) => [
      sku,
      {
        shopifyVariantId: v.shopifyVariantId || undefined,
        stripePriceId: v.stripePriceId || undefined,
      },
    ])
  );
}
