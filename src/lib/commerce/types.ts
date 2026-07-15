export type CommerceProvider = "mock" | "stripe" | "shopify" | "dual";

export type CartLine = {
  sku: string;
  name: string;
  image: string;
  quantity: number;
  /** Unit price in major currency units (e.g. USD dollars) for display */
  unitPrice: number;
  currency: "USD";
  /** Optional Shopify variant GID once catalog is synced */
  shopifyVariantId?: string;
  /** Optional Stripe Price ID once catalog is synced */
  stripePriceId?: string;
};

export type CheckoutLineInput = {
  sku: string;
  quantity: number;
  name?: string;
  unitPrice?: number;
  shopifyVariantId?: string;
  stripePriceId?: string;
};

export type CheckoutRequest = {
  provider?: "stripe" | "shopify";
  lines: CheckoutLineInput[];
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  /** Founding-brand one-time fee flow */
  mode?: "cart" | "founding_brand";
  brandCompany?: string;
};

export type CheckoutResponse =
  | {
      ok: true;
      provider: "stripe" | "shopify" | "mock";
      checkoutUrl: string;
      sessionId?: string;
    }
  | {
      ok: false;
      error: string;
      code: "NOT_CONFIGURED" | "INVALID_CART" | "PROVIDER_ERROR";
    };
