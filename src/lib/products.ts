// lib/products.ts
// ShortKey Master Product Library
// Source of Truth: Senti ShortKeyProduct Entity (Base44)
// Last updated: 16 Jul 2026
// DO NOT hardcode products here — always fetch from Base44

const BASE44_APP_ID = '6a42029cc124d0206f027335'
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}/entities/ShortKeyProduct`

export interface ShortKeyProduct {
  id: string
  shopify_sku: string
  name: string
  brand_name: string
  region: string
  category: string
  product_type: string
  price_usd: number
  image_url: string
  status: string
  phase: string
}

// Fetch all live products from Senti
export async function getProducts(): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(`${BASE44_API}?status=active&limit=100`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Base44 fetch failed: ${res.status}`)
    const data = await res.json()
    return data.records ?? []
  } catch (err) {
    console.error('[ShortKey] Failed to fetch products from Base44:', err)
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

export const CATEGORIES = {
  LIP: 'Lip',
  FACE: 'Face',
  EYES: 'Eyes',
  MASKS: 'Masks & Treatments',
  HYDRATE: 'Prep & Hydrate',
  FINISH: 'Prep & Finish',
  CLEANSE: 'Cleanse & Remove',
  LIP_EYE: 'Lip & Eye Care',
} as const
