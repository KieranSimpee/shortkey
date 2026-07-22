/**
 * Public surface locks — unfinished / bad-ratio UIs stay closed
 * until Design + Gor Gor unlock (SHORTKEY_MASTER_BLUEPRINT_v1).
 */
export const featureLocks = {
  /**
   * Product / Shop tab + /shop + /shop/[sku]
   * Locked: product page aspect ratio / display not ready.
   */
  productSurface: true,
} as const;

export const PRODUCT_SURFACE_LOCKED = featureLocks.productSurface;
