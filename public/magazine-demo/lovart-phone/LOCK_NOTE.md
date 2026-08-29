# Lovart phone showcase · local assets

**Status:** DEMO · founder phone review · **GOR_GOR_REVIEW** · NOT LIVE BEAUTY V1  
**Date saved:** 2026-08-08  
**Serve:** Maya Lab preferred — `http://127.0.0.1:3008/magazine-demo/lovart-phone/index.html`  
**Sibling entry:** `index.html` in this folder (relative PNGs → offline / Add to Home Screen friendly)  
**Note:** On Next Maya `:3008`, use the explicit `index.html` path — bare `/lovart-phone` returns 404.

## Local files (canonical)

| Role | Local path | Bytes (saved) |
|------|------------|---------------|
| Phone Wallpaper | `phone-wallpaper.png` | 1,456,861 |
| One Page Pitch | `one-page-pitch.png` | 3,598,536 |
| All 11 Pages | `all-11-pages.png` | 3,235,225 |

## Source URLs (may expire — do not rely on remote alone)

| Role | Lovart artifact URL |
|------|---------------------|
| Phone Wallpaper | https://a.lovart.ai/artifacts/agent/WZWtrzDBbwCEnO75.png |
| One Page Pitch | https://a.lovart.ai/artifacts/agent/dsqAwDiT3jJQyz6X.png |
| All 11 Pages | https://a.lovart.ai/artifacts/agent/741PL00CP8BMJL4d.png |

**Download check (2026-08-08):** all three returned valid PNG magic (`89 50 4E 47`) via browser-like User-Agent.

## Phone open / save

1. Maya running: `npm run maya:dev` → port **3008**
2. Same Wi‑Fi bookmark: `http://<LAN-IPv4>:3008/magazine-demo/lovart-phone/index.html`
3. Or open `index.html` from this folder on the phone (relative PNGs) · Share → Add to Home Screen (manifest present; icon = wallpaper PNG)
4. Offline: save the whole `lovart-phone/` folder; open `index.html` — no remote Lovart URLs required

## Honesty

- Labels = founder-given roles + filenames. No invented DNA / JP / pitch copy.
- This folder does **not** overwrite locked magazine flip baselines (`index.html` / `magazine-demo.js` / issue-01 PNGs).
- Showcase interactivity (phone frame, swipe, zoom, parallax) is UI chrome only — art remains Lovart PNG as saved.
- Bare `/magazine-demo/lovart-phone` on Next → **404**; always use `…/index.html`.
