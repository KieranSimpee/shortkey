// lib/products.ts
// ShortKey Master Product Library
// Source of Truth: Senti ShortKeyProduct Entity (mirrored from Simpee)
// Field mapping matches Simpee Product entity exactly
// Last synced: 16 Jul 2026 — 51 products

const SENTI_FUNCTION_URL = 'https://superagent-6f027335.base44.app/functions/getShortKeyProducts'

export interface ShortKeyProduct {
  id: string
  name: string
  brand_name: string
  brand_id?: string
  shopify_sku: string           // e.g. romand-zero-velvet-tint-01
  category: string              // Lip / Face / Eye / Prep & Hydrate / Masks & Treatments
  price_usd: number
  image_url: string
  description?: string
  notes?: string                // comma-separated tags: 'bestseller, creator-pick, made-the-edit'
  status: string                // Live / Draft / Archived
  stock_status?: string         // 'In Stock' / null
  featured?: boolean
  influencer_id?: string
  influencer_name?: string
  external_shopify_url?: string
  shopify_variant_id?: string
  stripe_price_id?: string
  tint_sku?: string
  try_on_enabled?: boolean
  region?: string
  phase?: string
}

// Fetch all live products from Senti backend function
export async function getProducts(): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(SENTI_FUNCTION_URL, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Senti fetch failed: ${res.status}`)
    const data = await res.json()
    const records: ShortKeyProduct[] = data.records ?? []
    return records.filter((p) => p.status === 'Live')
  } catch (err) {
    console.error('[ShortKey] Failed to fetch products from Senti:', err)
    return []
  }
}

export async function getProductsByCategory(category: string): Promise<ShortKeyProduct[]> {
  const all = await getProducts()
  return all.filter(p => p.category === category)
}

export async function getProductBySku(sku: string): Promise<ShortKeyProduct | null> {
  const all = await getProducts()
  return all.find(p => p.shopify_sku === sku) ?? null
}

export async function getCategories(): Promise<string[]> {
  const all = await getProducts()
  return [...new Set(all.map(p => p.category))].sort()
}

export async function getFeaturedProducts(): Promise<ShortKeyProduct[]> {
  const all = await getProducts()
  return all.filter(p => p.featured === true || (p.notes ?? '').includes('bestseller'))
}

export async function getProductsByTag(tag: string): Promise<ShortKeyProduct[]> {
  const all = await getProducts()
  return all.filter(p => (p.notes ?? '').includes(tag))
}

export const CATEGORIES = {
  LIP: 'Lip',
  FACE: 'Face',
  EYE: 'Eye',
  CHEEK: 'Cheek',
  PREP_HYDRATE: 'Prep & Hydrate',
  MASKS: 'Masks & Treatments',
} as const
