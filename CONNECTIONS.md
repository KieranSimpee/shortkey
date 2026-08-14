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

Code already treats `.live` separately from `.beauty`. Until the domain is attached, preview locally at `http://127.0.0.1:3005/live`.

---

## 6. shortkey.studio — attach to same Vercel project (manual · INTERNAL STAGING ONLY)

**Host:** `shortkey.studio` (and `www.shortkey.studio`)  
**App surface:** Studio v0.1 Internal Control Center at `/internal/studio` (P0 DNA Control Room predecessor → Brand DNA Center)
**Local port:** **3003** (`npm run studio:dev` · `SHORTKEY_SURFACE=studio`)
**Middleware:** `shortkey.studio/` → redirect `/internal/studio`
**Store:** `GET/POST /api/studio/state` → `data/studio-v01.json` (dev) · localStorage `shortkey-studio-v01` fallback · no Upstash required
**Status lock:** **可以上 domain · 只係 internal staging · 不是 public launch**  
**Do not** create a second Vercel project for `.studio` — same chain as beauty / live.  
**Family Table** stays on `family.shortkey.world` / `npm run family:dev` (:3002) — not on `.studio`.

**Soft access gate:** set `FAMILY_TABLE_STAGING_PASSWORD` (or `INTERNAL_STAGING_SECRET`) in Vercel env. Cookie unlock via `/internal/login`. Also gates private magazine/showcase (`/showcase`, `/magazine-demo`, `/control-center/magazine-demo`). Localhost + `npm run studio:dev` / `family:dev` bypass. Soft shared-secret only — not 正式版 login/roles.

**One-time dashboard steps (Kieran):**

1. Vercel → ShortKey project → **Settings → Domains**
2. Add `shortkey.studio` and optionally `www.shortkey.studio`
3. At the domain registrar, set the DNS records Vercel shows (usually A / CNAME)
4. Wait for SSL + “Valid Configuration”
5. Set `FAMILY_TABLE_STAGING_PASSWORD` on the Vercel project (Production + Preview if needed)
6. Open `https://shortkey.studio` — should land on **Studio v0.1 Control Center** (`/internal/studio`) · INTERNAL STAGING ONLY (not beauty Coming Soon, not Family Table, not public launch)

Until the domain is attached, use:
- Local Studio: `npm run studio:dev` → `http://localhost:3003/` (or `/internal/studio`)
- Local magazine flip (same Studio process): `http://localhost:3003/magazine-demo/#/cover`
- Local Lovart copies gallery: `http://localhost:3003/shortkey-assets/`
- Local Family Table: `npm run family:dev` → `http://localhost:3002/` (or `/internal/family-table`)
- Deployed path on beauty/vercel host: `https://shortkey.vercel.app/internal/studio` (still `noindex`; soft gate if env set)
- **Honest (2026-08-06):** `shortkey.studio` is still Squarespace parking — **not** Vercel. `…/magazine-demo` and `…/shortkey-assets` are **404** on beauty + vercel.app until those `public/` folders are in the deployed build.

Doc: `src/brand/sky/SHORTKEY_STUDIO_P0_DNA_CONTROL.md`

---

## 7b. Founder Desk + Minion Chat (INTERNAL)

| Field | Value |
|-------|--------|
| **Phone bookmark (INTERNAL)** | `https://shortkey.beauty/desk/#family` |
| Soft PIN | `SITE_ACCESS_PASSWORD` or `DESK_ACCESS_PASSWORD` |
| Minion env | `K_MINION_API_KEY` |
| Vercel fallback | `https://shortkey.vercel.app/desk/#family` |
| Local | `http://localhost:3005/desk/#family` |
| Optional host (later) | `desk.shortkey.world` → rewrite `/` → `/desk` (DNS CNAME pending) |
| **Not yet** | `shortkey.world/desk` — apex still Squarespace parking |

**Env for remote Desk / Minion:** `SITE_ACCESS_PASSWORD` + `K_MINION_API_KEY` + `KURA_API_KEY`  
**Constant:** `src/lib/minionChatBookmark.ts`  
Docs: `src/brand/sky/command-center/FOUNDER_DESK_REMOTE.md`

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

**Soft access gate:** set `FAMILY_TABLE_STAGING_PASSWORD` (or `INTERNAL_STAGING_SECRET`) in Vercel env. Cookie unlock via `/internal/login`. Applies to family/studio host `/` and `/internal/*`, plus private magazine/showcase paths. Localhost + `npm run family:dev` / `studio:dev` bypass.

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

---

## 8. shortkey.social — Creator Circle Early Access (staging · GOR_GOR_REVIEW · attach later)

**Host:** `shortkey.social` (and `www.shortkey.social`) — **domain attach later**; do not treat local preview as production launch.  
**App surface:** Creator Circle Early Access at `/social`  
**Hero:** Join the ShortKey Creator Circle  
**Local port:** **3004** (`npm run social:dev` · `SHORTKEY_SURFACE=social`)  
**Middleware:** `shortkey.social/` → rewrite `/social` (same pattern as live → `/live`)  
**Store:** `POST /api/social/early-access` → `data/social-early-access.json` (dev) · localStorage `shortkey-social-early-access-v02` fallback · no Upstash required  
**Submission statuses:** Submitted (default) · Under Review · Invited  
**Status lock:** **GOR_GOR_REVIEW · staging / public-preview polish · not production-ready**  
**Motion (v0.3):** AI Beauty Signal / Creator Wave — CSS-only hero sweep, preview panel, marquee, logo flash · no copyrighted video · no autoplay audio · `prefers-reduced-motion`  
**Do not** use Studio Deploy Center as one-click publisher for this surface.  
**Do not** add secrets for this portal.  
**Do not** copy third-party TV channel identity (beautychannel.net = motion inspiration only).  
**Beauty (:3005) / Family (:3002) / Studio (:3003) untouched when working Social.**

Until the domain is attached, use:
- Local Social: `npm run social:dev` → `http://127.0.0.1:3004/` (or `/social`)
- Boot all four: `npm run locals:dev`
- Beauty path (separate surface): `http://127.0.0.1:3005/` — not 3001

Doc: `src/brand/sky/SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md`

---

## 9. Family agents — live honesty (ALWAYS TO TRUE)

Do **not** mark an agent LIVE without a real upstream reply. Doc: `src/brand/sky/FAMILY_AGENTS_LIVE_HONESTY.md`

| Check | Command / route |
|-------|-----------------|
| Live ping board | `npm run family:agents:check` |
| Ask seat | `npm run ask:kura` · `ask:gorgor` · `ask:senti` · `ask:agent-r` · `ask:maya` |
| Status API | `GET /api/family/agents/status` |
| Ask API | `POST /api/family/agents/ask` |

**Required secrets (`.env.local` + Vercel):**

- Shared Base44 family key → `KURA_API_KEY` and/or `BASE44_API_KEY` / `BASE44_AGENT_API_KEY` (Kura · Gor Gor · Senti · Agent R)
- Maya → `ASI_ONE_API_KEY`
- Optional Minion Desk → `K_MINION_API_KEY`

**Honesty locks:**

- Sky = email only (`SKY_EMAIL`) — no invented Sky chat API
- Gor Gor missing key → **503** `not_connected` (no soft fake reply)
- Family Chat marks `REPLIED` only when `live: true`

