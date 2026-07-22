/**
 * Permanent Shortkey connection IDs — do not recreate apps/stores.
 * Full map: CONNECTIONS.md · verify: npm run connections:check
 */

export const CONNECTIONS = {
  github: {
    owner: "KieranSimpee",
    repo: "shortkey",
    url: "https://github.com/KieranSimpee/shortkey",
  },
  vercel: {
    productionUrl: "https://shortkey.vercel.app",
  },
  base44: {
    productsAppId: "69ddc914cfcf229762ac123d",
    productsFunction: "getShortKeyProducts",
    productsUrl:
      "https://app.base44.com/api/apps/69ddc914cfcf229762ac123d/functions/getShortKeyProducts",
    sentiAppId: "6a42029cc124d0206f027335",
    sentiFunction: "getShortKeyData",
    sentiUrl:
      "https://app.base44.com/api/apps/6a42029cc124d0206f027335/functions/getShortKeyData",
    /** Family sibling Kura — Brand Design Manager (always-on); QC / competitors under that role. Auth via KURA_API_KEY. */
    kuraAgentId: "6a54198bebbee048f44e1378",
    kuraAgentUrl:
      "https://app.base44.com/api/agents/6a54198bebbee048f44e1378",
  },
  shopify: {
    storeDomain: "simplex-ity-dev.myshopify.com",
  },
} as const;

export function productsApiUrl(): string {
  return process.env.SHORTKEY_PRODUCTS_API_URL?.trim() || CONNECTIONS.base44.productsUrl;
}

export function shopifyStoreDomain(): string {
  return (
    process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "").trim() ||
    CONNECTIONS.shopify.storeDomain
  );
}
