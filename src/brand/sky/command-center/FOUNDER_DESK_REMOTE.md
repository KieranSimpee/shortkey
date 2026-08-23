# Founder Desk · Remote bookmark (INTERNAL Minion Chat)

**Phone bookmark (INTERNAL only):** https://shortkey.beauty/desk/#family  

**Chi (刊 + picture review · off Wi‑Fi after deploy):** https://shortkey.beauty/desk/#chi  
Same-origin: `/magazine-demo/#/cover` · `/magazine-demo/review.html` · `/discovery`. No `127.0.0.1`. Coming Soon `/` untouched.

Unlock: enter `SITE_ACCESS_PASSWORD` (or `DESK_ACCESS_PASSWORD`) on the Work tab → Unlock.  
Chat needs server env `K_MINION_API_KEY` (alias `KMINION`). Do not put keys in the browser.

| Role | URL |
|------|-----|
| **Canonical INTERNAL** | https://shortkey.beauty/desk/#family |
| Vercel fallback | https://shortkey.vercel.app/desk/#family |
| Local | http://localhost:3005/desk/#family |
| Optional later | https://desk.shortkey.world/#family (only after CNAME → Vercel) |
| **Do not use yet** | https://shortkey.world/desk/ — apex is still Squarespace parking (not this Next app) |

English-only phone desk for remote founder work. Does **not** change Beauty Coming Soon `/`. Not a public product surface.

## Live inventory (honest · 2026-08-06)

| Host | Status |
|------|--------|
| `shortkey.beauty` | On Vercel · Beauty Coming Soon live · **use `/desk/#family` here** |
| `shortkey.vercel.app` | Same project fallback |
| `family.shortkey.world` | On Vercel · Family Table internal staging (`/desk` also available after deploy) |
| `shortkey.world` | Squarespace “under construction” — **not** Vercel yet |
| `desk.shortkey.world` | DNS not resolving — optional later; do not wait |
| `shortkey.live` | Squarespace parking / frozen reference |

If `/desk` returns **404** on beauty: production deploy is behind this repo. Push to GitHub → wait for Vercel → re-open the bookmark. Code + `public/desk/` + `/api/minion/chat` are already in the monorepo.

## Soft gate (required for remote INTERNAL use)

| Env | Purpose |
|-----|---------|
| `SITE_ACCESS_PASSWORD` | Soft PIN for desk unlock + Minion Chat + Family ask (or `DESK_ACCESS_PASSWORD`) |
| `K_MINION_API_KEY` | Minion Relay — without it, Chat Box shows “not connected” |
| `KURA_API_KEY` | Shared Base44 key (or `BASE44_API_KEY`) — family seat replies |
| `ASI_ONE_API_KEY` | Optional — ASI1 online in Family status |

Optional agent overrides: `KURA_AGENT_ID`, `GOR_GOR_AGENT_ID`, `SENTI_AGENT_ID`, `AGENT_R_AGENT_ID`, conversation IDs.

## Founder steps (phone ready)

1. Confirm latest Desk code is on the branch Vercel deploys (push if `/desk` 404s).
2. Vercel → Project → Settings → Environment Variables → set `SITE_ACCESS_PASSWORD` + `K_MINION_API_KEY` (+ `KURA_API_KEY` for seats). Redeploy if vars were missing.
3. Phone Safari/Chrome → open **https://shortkey.beauty/desk/#family** once (or install guide **https://shortkey.beauty/minion-app/**).
4. **Install as app (PWA — no App Store / Play Console):**
   - **iPhone:** Safari → Share → **Add to Home Screen** → name “Minion Desk”.
   - **Android:** Chrome → ⋮ → **Install app** / **Add to Home screen**.
5. Work tab → type access password → **Unlock** → Family tab → send.  
   Chi tab → Magazine / Pictures (same server). Not same-Wi‑Fi only after this Desk is deployed.

### Local / LAN (PC still running Beauty)

Phone cannot use `localhost`. Same Wi‑Fi: `http://<PC-LAN-IP>:3005/desk/#family` while `npm run dev` is on. Chrome Android often allows LAN HTTP; iOS usually wants HTTPS for a reliable home-screen app — prefer `shortkey.beauty` for iPhone. OneDrive / file:// HTML will not run Minion APIs.

### Honest product choice

**PWA Add to Home Screen** is the path. No Apple Developer / Play Console. Capacitor sideload APK was **not** added (scope / iOS without Apple ID). Manifest: `/desk/manifest.webmanifest` · SW: `/desk/sw.js` (shell only; chat needs network).

## Optional DNS later (not required for Minion)

Same pattern as `family.shortkey.world`:

1. Vercel → Project Domains → add **`desk.shortkey.world`**
2. At DNS for **shortkey.world**, add CNAME `desk` → `cname.vercel-dns.com`
3. Only then is https://desk.shortkey.world/#family a valid alternate

Pointing **shortkey.world** apex at Vercel would also enable https://shortkey.world/desk/#family — until then, stay on **shortkey.beauty**.

## Humans (not API agents)

- **Maya** — ASI:One Editorial Heart (`ASI_ONE_API_KEY` · Lab :3008 · Base44 portal deleted)
- **Sky** — email `sky@shortkey.beauty` (`SKY_EMAIL`)

## Related paths

- Founder desk: `/desk/` · INTERNAL bookmark on `shortkey.beauty`
- PWA: `/desk/manifest.webmanifest` · `/desk/sw.js` · icons `/desk/icons/`
- Install guide: `/minion-app/` (how-to · LAN note · no store)
- Brand Preview: `/app/?mode=marketing&share=client#showcase`
- Alias: `/shortkey-app.html` → `/desk/`
- Family online status: `GET /api/family/status`
- Constant: `src/lib/minionChatBookmark.ts`
