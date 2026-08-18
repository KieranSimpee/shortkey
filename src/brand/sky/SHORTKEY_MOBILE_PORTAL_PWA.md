# ShortKey Mobile Portal PWA — 30-second soul demo

**Status:** Internal staging · **GOR_GOR_REVIEW** · not the public Coming Soon homepage  
**Route:** `/portal` (`noindex`)  
**Local:** `npm run dev` → http://localhost:3001/portal  
**Phone:** same path on the Vercel preview / `shortkey.vercel.app/portal` after merge  
**Does not touch:** `/` Coming Soon · :3002 Family · :3003 Studio · :3004 Social

## Why this surface

Sky asked for a **mobile-first web app** Kieran can open in 30 seconds — face-to-face or remote — without App Store review.

Flow:

1. Rice-paper silk entrance + one trigger: **體驗 ShortKey 生命力**
2. Three doors: Brand Story · Creator Hub · AI Soul Lab
3. Door opens → stories load from Airtable, or from DNA seed if keys are unset

## DNA lock (colors)

Sky’s Composer prompt used magazine-demo **Rice Paper `#F5F0E6`** and **Sake Gold `#C9A962`**.

Those hexes live in `public/magazine-demo/` as **editorial art**, not production Brand DNA.

This portal uses the **locked lilac system** (`SHORTKEY_BRAND_DNA.md` / `tokens.ts`):

- Surface: silk `#F7F5FF` (the rice-paper *feel*, not the magazine hex)
- Accent: brand `#8C82FC`
- Type: Montserrat + Inter

Cursor does not decide DNA. The 30-second UX is adopted. The gold palette is not.

## Instant update (no stale PWA cache)

There is **no service worker**. Add-to-Home-Screen uses `public/portal/manifest.webmanifest` only.

Why: a caching SW would fight “edit in Cursor → GitHub → phone updates.” Vercel deploy is the update. Network-first is the point.

## Airtable

Key stays in `.env.local` / Vercel env. Never in git.

| Env | Purpose |
|-----|---------|
| `AIRTABLE_API_KEY` | Personal access token (server only) |
| `AIRTABLE_BASE_ID` | Base `ShortKey_Database` (`app…`) |
| `AIRTABLE_TABLE_NAME` | Default `Stories` |

Schema: [`AIRTABLE_SHORTKEY_DATABASE.md`](./AIRTABLE_SHORTKEY_DATABASE.md)

Until keys exist, `/api/portal/stories` serves `src/data/portal-seed.json` (locked motto, J/K/C, family seats — **no fake creators**).

## Explicitly not

- New GitHub project `ShortKey-Mobile-Portal` (this repo already deploys on Vercel)
- Wix / App Store
- Public pricing
- Auto-post to social
- Replacing Coming Soon
