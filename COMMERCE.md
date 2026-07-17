# Commerce wiring — Stripe + Shopify

Shortkey is ready for dual checkout:

| Flow | Preferred gateway | Entry |
|------|-------------------|--------|
| Retail bag (PDP → cart) | Shopify **or** Stripe | `/checkout` → `POST /api/checkout` |
| Founding brand fee | Stripe Checkout | `/brands` → `POST /api/checkout/brand` |
| Order events | Webhooks | `/api/webhooks/stripe`, `/api/webhooks/shopify` |

Without secrets, APIs fall back to **mock** success URLs so the UI stays testable.

## 1. Env setup

1. Copy `.env.example` → `.env.local`
2. Fill Stripe and/or Shopify values
3. Set `NEXT_PUBLIC_SITE_URL` to your deployed origin
4. Restart `npm run dev`

Check readiness:

```http
GET /api/checkout
```

Returns `{ provider, stripeConfigured, shopifyConfigured, ... }`.

## 2. Stripe

1. Create products/prices in Stripe Dashboard (or use ad-hoc `price_data` already implemented)
2. Optional map: `STRIPE_FOUNDING_BRAND_PRICE_ID` for the USD 5,000 fee
3. Webhook endpoint: `https://<domain>/api/webhooks/stripe`
   - Event: `checkout.session.completed`
4. Install official SDK when going live and verify signatures in the webhook route (stub is in place)

Recommended split:

- **Stripe** → platform fees (founding brand), tip jars, one-off services  
- **Shopify** → physical beauty SKUs, inventory, streaming checkout

## 3. Shopify

### Push first product batch (catalog → Shopify)

Shop products live in `src/content/shopCatalog.ts` (`syncReady: true` = first wave).

```bash
npm run sync:shopify              # dry-run → scripts/shopify-sync-payload.json
npm run sync:shopify -- --push    # create draft products (needs Admin token)
```

After `--push`, paste printed variant GIDs into `src/lib/commerce/sku-map.ts`.

1. Create a Custom App with **Storefront API** (+ **Admin API** write_products for sync)
2. Set `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (+ `SHOPIFY_ADMIN_ACCESS_TOKEN` for push)
3. Map each Shortkey SKU → variant GID in `src/lib/commerce/sku-map.ts`:

```ts
"SK-M003": {
  shopifyVariantId: "gid://shopify/ProductVariant/1234567890",
  stripePriceId: "price_xxx", // optional dual mapping
},
```

4. Webhook endpoint: `https://<domain>/api/webhooks/shopify`  
   Topics: `orders/paid`, `products/update` (verify HMAC before production)

Shopify checkout requires mapped `shopifyVariantId` per line. Until mapped, choose **Stripe** on `/checkout` or stay in mock mode.

## 4. Suggested production order

1. Stripe test keys → founding brand fee on `/brands`
2. Shopify Storefront → map top SKUs → retail checkout
3. Enable webhook verification + fulfillment emails
4. Flip `NEXT_PUBLIC_COMMERCE_MODE=live`

## Bridge sync (always-on)

Shortkey keeps commerce/data bridges aligned through `src/lib/bridges/hub.ts`:

| Bridge | Role |
|--------|------|
| Base44 products API | Live shop products (`src/lib/products.ts`) |
| Senti data bridge | Products + SKU→Shopify/Stripe map (`src/lib/senti-bridge.ts`) |
| Static catalog / sku-map | Offline fallback |

Live sources revalidate every **30s**. If a live bridge fails, static catalog fills the gap so `/shop` and checkout never go empty.

Health check:

```http
GET /api/bridges/status
```

Checkout enrichment uses `resolveGatewayIdsForSku()` so Senti SKU maps stay applied without manual sku-map edits when Senti has IDs.

 
