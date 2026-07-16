// lib/category-map.ts
// ShortKey Unique Category Mapping
// Maps ShortKey UI navigation → Shopify product types
// Source of Truth: Base44 Product Entity
// Last updated: 16 Jul 2026

// ─────────────────────────────────────────────
// SHOPIFY CATEGORIES (exact match in Base44)
// ─────────────────────────────────────────────
export const SHOPIFY_CATEGORIES = [
  'Lip',
  'Face',
  'Eyes',
  'Masks & Treatments',
  'Prep & Hydrate',
  'Prep & Finish',
  'Cleanse & Remove',
  'Lip & Eye Care',
] as const

export type ShopifyCategory = typeof SHOPIFY_CATEGORIES[number]

// ─────────────────────────────────────────────
// SHORTKEY UNIQUE CATEGORIES
// These are ShortKey's own editorial groupings
// Each maps to one or more Shopify categories
// ─────────────────────────────────────────────
export const SHORTKEY_CATEGORIES = {

  // CTRL + L — Lip Edit
  // All lip products across every finish
  'ctrl-l': {
    label: 'LIP EDIT',
    shortcut: 'CTRL + L',
    description: 'Every lip finish. Satin, matte, glass.',
    shopify_types: ['Lip'],
    tags: ['lips'],
  },

  // CTRL + F — Face Studio
  // Foundation, cushion, blush, powder
  'ctrl-f': {
    label: 'FACE STUDIO',
    shortcut: 'CTRL + F',
    description: 'Base, blush, finish. Build your face.',
    shopify_types: ['Face', 'Prep & Finish'],
    tags: ['face', 'prep-and-finish'],
  },

  // CTRL + E — Eye Lab
  // Eye palettes, shadows, liner
  'ctrl-e': {
    label: 'EYE LAB',
    shortcut: 'CTRL + E',
    description: 'Palette. Shadow. Drama.',
    shopify_types: ['Eyes'],
    tags: ['eyes'],
  },

  // CTRL + S — Skin First
  // All skincare: hydration, treatments, cleanse
  'ctrl-s': {
    label: 'SKIN FIRST',
    shortcut: 'CTRL + S',
    description: 'Prep. Treat. Hydrate.',
    shopify_types: ['Masks & Treatments', 'Prep & Hydrate', 'Cleanse & Remove', 'Lip & Eye Care'],
    tags: ['skincare', 'masks-and-treatments', 'prep-and-hydrate', 'cleanse-and-remove'],
  },

  // CTRL + N — New Arrivals
  // Products tagged "new" in Shopify
  'ctrl-n': {
    label: 'NEW ARRIVALS',
    shortcut: 'CTRL + N',
    description: 'Just dropped.',
    shopify_types: [], // filter by tag instead
    tags: ['new'],
  },

  // CTRL + H — Made The Edit
  // Editor picks / bestsellers
  'ctrl-h': {
    label: 'MADE THE EDIT',
    shortcut: 'CTRL + H',
    description: 'ShortKey curated picks.',
    shopify_types: [],
    tags: ['made-the-edit', 'bestseller', 'creator-pick'],
  },

  // CTRL + K — K-Beauty
  // Korean brands only
  'ctrl-k': {
    label: 'K-BEAUTY',
    shortcut: 'CTRL + K',
    description: 'Korean beauty. Glass skin to idol lip.',
    shopify_types: [],
    brands: ['HERA', 'JUNGSAEMMOOL', 'rom&nd', 'Anua', 'MUZIGAE MANSION',
             'su:m37°', 'DEMAR3', 'Cosme Chef', 'Biodance', 'TOXNFILL',
             'YUNJAC', 'REJURAN', 'LBB', 'RETURNITY', 'Fully', 'Easydew',
             'AHC', 'a;t fox', 'The Whoo', 'nobev', 'dasique', 'Giverny',
             'OBgE', 'O HUI', 'Portré'],
  },

  // CTRL + J — J-Beauty
  // Japanese brands only
  'ctrl-j': {
    label: 'J-BEAUTY',
    shortcut: 'CTRL + J',
    description: 'Japanese beauty. Effortless, refined.',
    shopify_types: [],
    brands: ['RMK', 'SURRATT'],
  },

  // CTRL + C (shop context) — C-Beauty
  // Chinese / Chinese-inspired brands
  'ctrl-c-beauty': {
    label: 'C-BEAUTY',
    shortcut: 'CTRL + C',
    description: 'Chinese beauty. Bold. Palace-inspired.',
    shopify_types: [],
    brands: ['SIMIHAZE BEAUTY', 'Portré'],
  },

} as const

export type ShortKeyCategory = keyof typeof SHORTKEY_CATEGORIES

// ─────────────────────────────────────────────
// FILTER FUNCTION
// Use this to filter products by ShortKey category
// ─────────────────────────────────────────────
export function filterByShortKeyCategory(
  products: any[],
  categoryKey: ShortKeyCategory
): any[] {
  const cat = SHORTKEY_CATEGORIES[categoryKey]

  return products.filter(p => {
    // Match by Shopify type
    const shopifyTypes = cat.shopify_types as unknown as string[]
    if (shopifyTypes && shopifyTypes.length > 0) {
      if (shopifyTypes.includes(p.category)) return true
    }

    // Match by brand
    if ('brands' in cat) {
      const brands = cat.brands as unknown as string[]
      if (brands.length > 0 && brands.includes(p.brand_name)) return true
    }

    // Match by tag (stored in notes field in Base44)
    if ('tags' in cat && cat.tags && (cat.tags as readonly string[]).length > 0) {
      const productTags = (p.notes || '').split(',').map((t: string) => t.trim())
      if ((cat.tags as readonly string[]).some((tag: string) => productTags.includes(tag))) return true
    }

    return false
  })
}

// ─────────────────────────────────────────────
// SYNC CHECK FUNCTION
// Compare ShortKey categories vs Base44 products
// Returns count per category so you can verify
// ─────────────────────────────────────────────
export function getCategoryProductCount(products: any[]): Record<string, number> {
  const result: Record<string, number> = {}
  for (const key of Object.keys(SHORTKEY_CATEGORIES) as ShortKeyCategory[]) {
    result[key] = filterByShortKeyCategory(products, key).length
  }
  return result
}
