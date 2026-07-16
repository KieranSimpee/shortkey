// lib/products.ts
// ShortKey Master Product Library
// Source of Truth: Base44 Product Entity
// Last updated: 16 Jul 2026
// DO NOT hardcode products here — always fetch from Base44

const BASE44_APP_ID = '69ddc914cfcf229762ac123d'
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}/entities/Product`

export interface ShortKeyProduct {
  id: string
  shopify_sku: string
  name: string
  brand_name: string
  category: string
  price_usd: number
  image_url: string
  description?: string
  stock_status: string
  status: string
  notes?: string
}

// Fetch all live products from Base44
export async function getProducts(): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(`${BASE44_API}?status=Live&limit=100`, {
      next: { revalidate: 60 }, // cache for 60 seconds, auto-refresh
    })
    if (!res.ok) throw new Error(`Base44 fetch failed: ${res.status}`)
    const data = await res.json()
    return data.records ?? []
  } catch (err) {
    console.error('[ShortKey] Failed to fetch products from Base44:', err)
    return []
  }
}

// Fetch products by category
export async function getProductsByCategory(category: string): Promise<ShortKeyProduct[]> {
  const all = await getProducts()
  return all.filter(p => p.category === category)
}

// Fetch a single product by Shopify SKU
export async function getProductBySku(sku: string): Promise<ShortKeyProduct | null> {
  const all = await getProducts()
  return all.find(p => p.shopify_sku === sku) ?? null
}

// Get all unique categories
export async function getCategories(): Promise<string[]> {
  const all = await getProducts()
  return [...new Set(all.map(p => p.category))].sort()
}

// Category constants (from Shopify master)
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
