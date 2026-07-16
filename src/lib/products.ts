// lib/products.ts
// ShortKey Master Product Library
// Source of Truth: Senti ShortKeyProduct Entity via backend function
// Last updated: 16 Jul 2026

const SENTI_FUNCTION_URL = 'https://superagent-6f027335.base44.app/functions/getShortKeyProducts'

export interface ShortKeyProduct {
  id: string
  sku: string                // e.g. muzigae-mansion-tinted-lip-balm-01
  name: string
  brand_name: string
  region: string             // K-Beauty / J-Beauty / C-Beauty
  category: string           // Lip / Face / Eyes / Cheek / Skincare etc.
  product_type: string       // sub-type e.g. "Cushion", "Toner"
  price_usd: number
  image_url: string
  shopify_variant_id?: string
  stripe_price_id?: string
  tint_sku?: string
  try_on_enabled?: boolean
  status: string             // active / coming_soon / archived
  phase: string              // Phase 1 / Phase 2 / Phase 3
}

// Fetch all active products from Senti backend function
export async function getProducts(): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(SENTI_FUNCTION_URL, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Senti fetch failed: ${res.status}`)
    const data = await res.json()
    const records: ShortKeyProduct[] = data.records ?? []
    return records.filter((p) => p.status === 'active')
  } catch (err) {
    console.error('[ShortKey] Failed to fetch products from Senti:', err)
    return []
  }
}

export async function getProductsByCategory(category: string): Promise<ShortKeyProduct[]> {
  const all = await getProducts()
  return all.filter(p => p.category === category)
}

export async function getProductBySkuId(sku: string): Promise<ShortKeyProduct | null> {
  const all = await getProducts()
  return all.find(p => p.sku === sku) ?? null
}

export async function getCategories(): Promise<string[]> {
  const all = await getProducts()
  return [...new Set(all.map(p => p.category))].sort()
}

export async function getRegions(): Promise<string[]> {
  const all = await getProducts()
  return [...new Set(all.map(p => p.region))].sort()
}

export const CATEGORIES = {
  LIP: 'Lip',
  FACE: 'Face',
  EYES: 'Eye',
  CHEEK: 'Cheek',
  SKINCARE: 'Skincare',
} as const

export const REGIONS = {
  KBEAUTY: 'K-Beauty',
  JBEAUTY: 'J-Beauty',
  CBEAUTY: 'C-Beauty',
} as const
