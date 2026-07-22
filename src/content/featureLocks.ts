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
  /**
   * Creator / Brand signup pages — appointment booking only.
   * Hide rates, founding fees, CTRL Twin pricing until launch unlock.
   */
  signupAppointmentOnly: true,
  /**
   * Header category nav + /kbeauty · /jbeauty · /cbeauty
   * Locked until category pages are display-ready.
   */
  categorySurface: true,
} as const;

export const PRODUCT_SURFACE_LOCKED = featureLocks.productSurface;
export const SIGNUP_APPOINTMENT_ONLY = featureLocks.signupAppointmentOnly;
export const CATEGORY_SURFACE_LOCKED = featureLocks.categorySurface;
