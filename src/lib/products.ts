// lib/products.ts
// ShortKey Master Product Library
// Source of Truth: Base44 Backend Function (getShortKeyProducts)
// Last updated: 16 Jul 2026 - Updated by Simpee (Gor Gor)

const BACKEND_URL = "https://app.base44.com/api/apps/69ddc914cfcf229762ac123d/functions/getShortKeyProducts"

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

export async function getProducts(): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(`${BACKEND_URL}?limit=100`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Backend fetch failed: ${res.status}`)
    const data = await res.json()
    return data.products ?? []
  } catch (err) {
    console.error("[ShortKey] Failed to fetch products:", err)
    return []
  }
}

export async function getProductsByCategory(category: string): Promise<ShortKeyProduct[]> {
  try {
    const res = await fetch(`${BACKEND_URL}?category=${encodeURIComponent(category)}&limit=100`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Backend fetch failed: ${res.status}`)
    const data = await res.json()
    return data.products ?? []
  } catch (err) {
    console.error("[ShortKey] Failed to fetch products by category:", err)
    return []
  }
}

export async function getProductBySku(sku: string): Promise<ShortKeyProduct | null> {
  try {
    const res = await fetch(`${BACKEND_URL}?sku=${encodeURIComponent(sku)}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.products?.[0] ?? null
  } catch {
    return null
  }
}

export async function getCategories(): Promise<string[]> {
  const all = await getProducts()
  return [...new Set(all.map(p => p.category))].sort()
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
} as const
