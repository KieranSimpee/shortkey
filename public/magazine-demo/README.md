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
| Local disk `public/magazine-demo/` + `issue-01/` | **YES** — 12 flip pages + 4 blueprints on disk |
| Localhost flip / gallery | **YES** when :3005 / :3003 / :3008 is running |
| Public showcase hub | `/showcase` · magazine iframe `/showcase/magazine` |
| `https://www.shortkey.beauty/control` | **YES** — Control Panel live |
| `https://www.shortkey.beauty/magazine-demo/` | Public outward demo (like `/control`) after successful Vercel deploy |
| `https://www.shortkey.beauty/showcase` | Public outward hub after successful Vercel deploy |
| `https://shortkey.vercel.app/magazine-demo/` | Same as beauty after deploy |

**Disk ≠ domain.** Magazine assets must be on the Vercel production build. On Vercel, `distDir` must stay default `.next`.

### Outward links (public · like Control)

| Entry | URL |
|-------|-----|
| Showcase hub | https://www.shortkey.beauty/showcase |
| Magazine showcase | https://www.shortkey.beauty/showcase/magazine |
| Magazine direct | https://www.shortkey.beauty/magazine-demo/#/cover |
| Control Panel | https://www.shortkey.beauty/control |

### Founder deploy steps (Studio internal host)

1. Ensure magazine + assets are in the git remote that Vercel builds (this workspace may be uncommitted).
2. Push / redeploy ShortKey Vercel project.
3. Confirm `https://<vercel-host>/magazine-demo/#/cover` and `/shortkey-assets/` return 200.
4. Vercel → Domains → add `shortkey.studio` (+ www) — see `CONNECTIONS.md` §6.
5. At registrar: replace Squarespace parking with Vercel A/CNAME records.
6. Confirm public URLs return 200: `/showcase`, `/showcase/magazine`, `/magazine-demo/#/cover`, `/control`.
7. Soft gate still applies to Family Table / Studio internal paths only — not magazine showcase.

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
