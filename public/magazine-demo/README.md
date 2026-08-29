# Magazine Demo · Nihon Sakura Issue 01

**Status:** DEMO · CONTROL PANEL EXAMPLE · **GOR_GOR_REVIEW** · NOT LIVE BEAUTY V1  
**Maya magazine file lock (2026-08-06):** [`LOCK_NOTE.md`](./LOCK_NOTE.md) · [`MAYA_MAGAZINE_FILE_LOCK.md`](../../src/brand/sky/maya/MAYA_MAGAZINE_FILE_LOCK.md) — do not overwrite baselines; version as v0.1+  
**Master prompt:** [`src/brand/sky/SHORTKEY_MASTER.txt`](../../src/brand/sky/SHORTKEY_MASTER.txt)  
**Lovart lock:** canvas `pnMAt6CTYc` · [`LOVART_SCOPE_LOCK.md`](../../src/brand/sky/issue-01/LOVART_SCOPE_LOCK.md)

## Serve (LAN phone)

```bash
node scripts/serve-public-static.mjs
# or Beauty Next: npm run dev → :3005
# or Studio Next: npm run studio:dev → :3003 (same public/ routes)
```

Binds `0.0.0.0:3005` → `public/` when using the static script.

## ALWAYS TO TRUE — uploaded?

| Surface | Status (checked 2026-08-07) |
|---------|------------------------------|
| Local disk `public/magazine-demo/` + `issue-01/` | **YES** — 12 flip pages + 4 blueprints on disk (web-compressed ~10MB) |
| Localhost flip / gallery | **YES** when :3005 / :3003 / :3008 is running (localhost bypasses gate) |
| Private showcase hub | `/showcase` · `/showcase/magazine` — production cookie gate (fail-closed) |
| `https://www.shortkey.beauty/control` | **YES** — Control Panel stays public (usable founder bookmark) |
| `https://www.shortkey.beauty/magazine-demo/` | On domain · **PRIVATE** (redirect → `/internal/login` without cookie) |
| `https://www.shortkey.beauty/showcase` | On domain · **PRIVATE** (same gate) |
| `https://shortkey.vercel.app/magazine-demo/` | Same private gate |

**Disk ≠ domain.** Early pushes failed Vercel until `distDir` used `.next` on `VERCEL` (see `next.config.ts`). Magazine PNGs were also compressed so Hobby deploy stays under size pressure.

**Unlock (required on Vercel):** set `FAMILY_TABLE_STAGING_PASSWORD` (or `INTERNAL_STAGING_SECRET`) in Vercel → Settings → Environment Variables (Production + Preview), **then Redeploy**. Typing the password only on `/internal/login` does **not** create the server secret — without the env, `POST /api/internal/staging-auth` returns **503** and unlock cannot set the cookie. Cookie: `sk_internal_staging`. Never commit the password.

### Private share links (password required · not public browse)

| Entry | URL |
|-------|-----|
| Staging login | https://www.shortkey.beauty/internal/login |
| Showcase hub | https://www.shortkey.beauty/showcase |
| Magazine showcase | https://www.shortkey.beauty/showcase/magazine |
| Magazine direct | https://www.shortkey.beauty/magazine-demo/#/cover |
| Control Center magazine | https://www.shortkey.beauty/control-center/magazine-demo |
| Control Panel (public) | https://www.shortkey.beauty/control |

### Founder unlock steps

1. Vercel → Project **shortkey** → Settings → Environment Variables → set `FAMILY_TABLE_STAGING_PASSWORD` (Production + Preview). Redeploy if the var was just added.
2. Open https://www.shortkey.beauty/internal/login — enter the same password → cookie set for 14 days.
3. Then open private URLs above (or login `?next=/showcase/magazine`).
4. Confirm without cookie: `/showcase`, `/magazine-demo`, `/control-center/magazine-demo` → **3xx** to `/internal/login`.
5. Confirm `/control` and Beauty Coming Soon `/` still **200** without cookie — do not unlock `/`.

## Founder review (Maya :3008 preferred)

| Entry | URL |
|-------|-----|
| **Issues hub · Maya vs Copilot tabs** | http://127.0.0.1:3008/magazine-demo/issues.html |
| **Issue 1 · Maya / ShortKey** (interactive e-magazine) | http://127.0.0.1:3008/magazine-demo/emagazine.html#/cover |
| **Copilot · Hidden Gems (scroll)** | http://127.0.0.1:3008/magazine-demo/copilot-hidden-gems-magazine.html#cover |
| **Hidden Gems · One Page** (prefer explicit index) | http://127.0.0.1:3008/magazine-demo/copilot-onepage/index.html |
| Magazine review HTML (sibling strip) | http://127.0.0.1:3008/magazine-demo/review.html |
| **Lovart phone showcase** (wallpaper · pitch · 11 pages) | http://127.0.0.1:3008/magazine-demo/lovart-phone/index.html |
| Locked baseline flip | http://127.0.0.1:3008/magazine-demo/index.html#/cover |
| Lovart asset gallery | http://127.0.0.1:3008/shortkey-assets/ |

**Use:** Next / Prev · click page edges · ArrowLeft / ArrowRight · Space · swipe · `C` toggles readable copy panel. Keys Home / End → Cover / Overview.

`review.html` uses relative paths — can also open the file directly (`file://…/public/magazine-demo/review.html`) when Next is flaky. Start Maya: `npm run maya:dev`.

## Local bookmarks (Beauty :3005)

| Entry | URL |
|-------|-----|
| Control entry (simple) | http://localhost:3005/control/ |
| Control Panel hub · Magazine panel | http://localhost:3005/control/hub.html#magazine |
| Control Center redirect | http://localhost:3005/control-center/magazine-demo/ |
| Magazine demo cover (start) | http://localhost:3005/magazine-demo/#/cover |
| **Makeup try-on SIM** | http://localhost:3005/magazine-demo/#/try-on → open **Try-On · SIM** hotspot or product card CTA |

## Makeup try-on (SIMULATOR)

Brand has **makeup available for try-on** in this demo:

| Slot | Items (SKU) |
|------|-------------|
| Lip | Rose Oil Lip Tint `SK-M003` · Glass Lip Gloss `SK-M001` · Berry Water Tint `SK-M014` |
| Blush | Peach Flush Stick `SK-M015` · Cherry Lip Cheek Tint `SK-M013` |
| Eye | Soft Sakura Eye Duo `SK-M019` *(editorial placeholder)* · Precision Felt Liner `SK-M004` |
| Base | Skin Fit Cushion `SK-M010` · Mask Fit Red Cushion `SK-M104` *(editorial / Runway)* |

- Overlay = local CSS on face placeholder — **not** live Banuba / TINT camera CRM.
- Source of truth for Next surfaces: `src/content/makeupTryOnDemo.ts` (keep magazine JS in sync).
- Full app page: `/try-on` · Runway phone grid: `/runway` · Control Center: `/control/center`

### Live vs simulator (ALWAYS TO TRUE)

| Surface | Status | Needs for live |
|---------|--------|----------------|
| Magazine demo TryOnModal | **SIMULATOR** | Founder Banuba/TINT merchant key + mount |
| `/try-on` makeup picker | **SIMULATOR** + catalog links | `NEXT_PUBLIC_TINT_MERCHANT_ID` + `TintVtoProvider` mount + SKU map |
| Runway Try On overlay | **SIMULATOR** | Same TINT gate (Simpee) |
| Skin Analysis modal | **SIMULATOR** · not clinical | Never claim medical diagnosis |
| External TINT vendor demo | Vendor sandbox ≠ ShortKey CRM | Separate from guest beauty records |

## Phone (same Wi‑Fi)

Use PC LAN IPv4 (example): `http://192.168.99.149:3005/magazine-demo/#/cover`  
Also: `http://192.168.99.149:3005/control/`

**Production:** `https://shortkey.beauty/magazine-demo/` is **404 until deploy** — local/LAN only for now.

Motto: ShortKey 不模仿畫面。ShortKey 捕捉生命力。
