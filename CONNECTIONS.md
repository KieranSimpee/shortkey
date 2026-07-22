# Shortkey permanent connection chain

**Do not rebuild these links.** They are the OS backbone for `shortkey.beauty`.

```
Local repo (shortkey)
        │  git remote origin
        ▼
GitHub  KieranSimpee/shortkey
        │  Git integration (auto deploy on push to main)
        ▼
Vercel  shortkey project → https://shortkey.vercel.app
        │  env vars + bridge fetch
        ▼
Base44  ShortKey apps (products + Senti data bridges)
        │  commerce IDs / catalog sync
        ▼
Shopify simplex-ity-dev.myshopify.com
```

---

## 1. Repo → GitHub (KieranSimpee) — LOCKED

| Field | Value |
|-------|--------|
| Owner | [KieranSimpee](https://github.com/KieranSimpee) |
| Repo | [KieranSimpee/shortkey](https://github.com/KieranSimpee/shortkey) |
| Remote | `https://github.com/KieranSimpee/shortkey.git` |
| Default branch | `main` |
| Homepage | `https://shortkey.vercel.app` |

Verify:

```bash
git remote -v
# origin  https://github.com/KieranSimpee/shortkey.git
```

Never change `origin` to another account unless intentionally migrating.

---

## 2. GitHub → Vercel — LOCKED (one-time dashboard)

| Field | Value |
|-------|--------|
| Production URL | https://shortkey.vercel.app |
| Git provider | GitHub → `KieranSimpee/shortkey` |
| Deploy trigger | Push to `main` |

**One-time setup (already done if deploys appear after push):**

1. Vercel → Add New Project → Import `KieranSimpee/shortkey`
2. Keep GitHub app installed on the **KieranSimpee** org/user
3. Production branch = `main`
4. Do **not** disconnect Git — reconnecting is what “rebuilds” the link

**Vercel env (keep forever on the project, not only local):**

- `SITE_ACCESS_PASSWORD`
- `SHORTKEY_PRODUCTS_API_URL` (optional override)
- `SHOPIFY_STORE_DOMAIN` = `simplex-ity-dev.myshopify.com`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- `COMMERCE_PROVIDER` / Stripe keys as needed
- `COMING_SOON` (= `false` only when launching)

Secrets live in Vercel. Code only stores stable IDs/URLs.

---

## 3. GitHub / Vercel → Base44 — LOCKED app IDs

These Base44 function URLs are hardcoded as defaults in the bridge layer. Changing app IDs = breaking the OS.

| Bridge | Base44 app ID | Function |
|--------|---------------|----------|
| Products API | `69ddc914cfcf229762ac123d` | `getShortKeyProducts` |
| Senti data | `6a42029cc124d0206f027335` | `getShortKeyData` |
| Kura Superagent | `6a54198bebbee048f44e1378` | Agent API (conversations/messages) |

Canonical URLs:

```
https://app.base44.com/api/apps/69ddc914cfcf229762ac123d/functions/getShortKeyProducts
https://app.base44.com/api/apps/6a42029cc124d0206f027335/functions/getShortKeyData
https://app.base44.com/api/agents/6a54198bebbee048f44e1378
```

Code refs:

- `src/lib/products.ts`
- `src/lib/senti-bridge.ts`
- `src/lib/bridges/hub.ts`
- `src/lib/connections.ts` · `scripts/ask-kura.mjs` · `src/brand/sky/KURA.md`

**Base44 one-time:** Keep these apps under the Shortkey / Kieran account. Make functions publicly callable from Vercel (or pass API key via `BASE44_API_KEY` / `KURA_API_KEY` if you lock them down). Do not recreate apps — reuse these IDs.

**Kura:** Key stays in `.env.local` only (`KURA_API_KEY`). Cursor rule/skill — not Custom API as a chat model.

---

## 4. Base44 → Shopify store — LOCKED

| Field | Value |
|-------|--------|
| Store | `simplex-ity-dev.myshopify.com` |
| Variant map | `src/lib/commerce/sku-map.ts` (45 live GIDs) |
| Sync script | `npm run sync:shopify` |

**One-time Shopify Custom App** (Admin + Storefront tokens) stays on this store. Tokens go in Vercel env — never recreate the Custom App unless tokens rotate.

Base44 product entities should keep `shopify_sku` / variant IDs aligned with `sku-map.ts`. Senti bridge overlays live gateway IDs when available.

---

## Verify chain (no rebuild)

```bash
npm run connections:check
```

This confirms:

1. `origin` = `KieranSimpee/shortkey`
2. Base44 product + Senti endpoints respond (or report auth status)
3. Shopify domain / mapped SKU count from repo config

Health in running app:

```
GET /api/bridges/status
```

---

## Rule: never rebuild — only rotate secrets

| Change | OK? |
|--------|-----|
| Rotate Shopify / Stripe / Base44 API keys in Vercel | Yes |
| Push code to `main` (Vercel redeploys) | Yes |
| Create a **new** GitHub repo / Vercel project / Base44 app / Shopify store | **No** — breaks the chain |
| Point `origin` at another GitHub user | **No** |

If a token expires, **update the env var**. Do not create a parallel project.
