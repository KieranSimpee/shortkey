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
- `FAMILY_TABLE_STAGING_PASSWORD` (or `INTERNAL_STAGING_SECRET`) — soft gate for family.shortkey.world / shortkey.studio / Family Table
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

---

## 5. shortkey.live — attach to same Vercel project (manual)

**Host:** `shortkey.live` (and `www.shortkey.live`)  
**App surface:** Coming Soon gate at `/live` · middleware rewrites `shortkey.live/` → `/live`  
**Full Rebuild preview (family):** `/control/live.html`  
**Do not** create a second Vercel project for `.live` — same chain as beauty.

**One-time dashboard steps (Kieran):**

1. Vercel → ShortKey project → **Settings → Domains**
2. Add `shortkey.live` and optionally `www.shortkey.live`
3. At the domain registrar, set the DNS records Vercel shows (usually A / CNAME)
4. Wait for SSL + “Valid Configuration”
5. Open `https://shortkey.live` — should show **ShortKey Live · Coming Soon** (not the beauty homepage)

Code already treats `.live` separately from `.beauty`. Until the domain is attached, preview locally at `http://localhost:3001/live`.

---

## 6. shortkey.studio — attach to same Vercel project (manual · INTERNAL STAGING ONLY)

**Host:** `shortkey.studio` (and `www.shortkey.studio`)  
**App surface:** Studio P0 DNA Control Room at `/internal/studio`  
**Local port:** **3003** (`npm run studio:dev` · `SHORTKEY_SURFACE=studio`)  
**Middleware:** `shortkey.studio/` → redirect `/internal/studio`  
**Status lock:** **可以上 domain · 只係 internal staging · 不是 public launch**  
**Do not** create a second Vercel project for `.studio` — same chain as beauty / live.  
**Family Table** stays on `family.shortkey.world` / `npm run family:dev` (:3002) — not on `.studio`.

**Soft access gate:** set `FAMILY_TABLE_STAGING_PASSWORD` (or `INTERNAL_STAGING_SECRET`) in Vercel env. Cookie unlock via `/internal/login`. Localhost + `npm run studio:dev` / `family:dev` bypass. Soft shared-secret only — not 正式版 login/roles.

**One-time dashboard steps (Kieran):**

1. Vercel → ShortKey project → **Settings → Domains**
2. Add `shortkey.studio` and optionally `www.shortkey.studio`
3. At the domain registrar, set the DNS records Vercel shows (usually A / CNAME)
4. Wait for SSL + “Valid Configuration”
5. Set `FAMILY_TABLE_STAGING_PASSWORD` on the Vercel project (Production + Preview if needed)
6. Open `https://shortkey.studio` — should land on **DNA Control Room** (`/internal/studio`) · INTERNAL STAGING ONLY (not beauty Coming Soon, not Family Table, not public launch)

Until the domain is attached, use:
- Local Studio: `npm run studio:dev` → `http://localhost:3003/` (or `/internal/studio`)
- Local Family Table: `npm run family:dev` → `http://localhost:3002/` (or `/internal/family-table`)
- Deployed path on beauty/vercel host: `https://shortkey.vercel.app/internal/studio` (still `noindex`; soft gate if env set)

Doc: `src/brand/sky/SHORTKEY_STUDIO_P0_DNA_CONTROL.md`

---

## 7. family.shortkey.world — Family Table home (preferred · INTERNAL STAGING ONLY)

**Philosophy lock**

| Host | Role |
|------|------|
| **shortkey.world** | Public facing world |
| **family.shortkey.world** | Our home — internal family house |

**Host:** `family.shortkey.world` (optional `www.family.shortkey.world`)  
**App surface:** Family Table v0.7 at `/internal/family-table`  
**Middleware:** `family.shortkey.world/` → redirect `/internal/family-table`  
**Studio separate:** `shortkey.studio` → DNA Control Room (CONNECTIONS §6 · port 3003) — not Family Table  
**Status lock:** **INTERNAL STAGING ONLY · not public world launch**  
**Do not** create a second Vercel project — same ShortKey project as beauty / live / studio.

**Soft access gate:** set `FAMILY_TABLE_STAGING_PASSWORD` (or `INTERNAL_STAGING_SECRET`) in Vercel env. Cookie unlock via `/internal/login`. Applies to family/studio host `/` and `/internal/*`. Localhost + `npm run family:dev` / `studio:dev` bypass.

### DNS record (shortkey.world zone) — copy for registrar

| Type | Name / Host | Value / Target | TTL |
|------|-------------|----------------|-----|
| **CNAME** | `family` | `cname.vercel-dns.com` | Auto / 3600 |

Notes:
- If the registrar UI asks for FQDN, use `family.shortkey.world` as the name and still CNAME to `cname.vercel-dns.com`.
- If Vercel Domains UI shows a **different** CNAME target after you add the domain, use **that** target instead (Vercel is source of truth).
- Do **not** point `family` at the apex `shortkey.world` A record unless Vercel instructs otherwise.

### Vercel — CLI (if logged in / linked)

```bash
# from repo root, after `npx vercel link` to the ShortKey project
npx vercel domains add family.shortkey.world
```

If CLI is not authenticated (`vercel login` / `VERCEL_TOKEN` missing), use the dashboard steps below.

### Vercel — manual dashboard (Kieran / Simpee)

1. Vercel → **ShortKey** project → **Settings → Domains**
2. Add **`family.shortkey.world`**
3. Confirm the DNS instruction Vercel shows (usually CNAME `family` → `cname.vercel-dns.com`)
4. At the **shortkey.world** DNS provider, add that CNAME
5. Wait for SSL + **Valid Configuration**
6. Confirm `FAMILY_TABLE_STAGING_PASSWORD` is set on the Vercel project (Production)
7. Open **https://family.shortkey.world/** — should land on **Family Table** with **INTERNAL STAGING ONLY · FAMILY HOME** banner (`noindex`) — not beauty Coming Soon, not public world launch

Until DNS / domain is valid, use:
- Local: `npm run family:dev` → `http://localhost:3002/`
- Deployed path: `https://shortkey.vercel.app/internal/family-table`

