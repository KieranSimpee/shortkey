# ShortKey Lovart assets (GOR_GOR_REVIEW)

**Live visual scope (canonical):** [LOVART_SCOPE_LOCK](../../src/brand/sky/issue-01/LOVART_SCOPE_LOCK.md) — canvas `https://www.lovart.ai/canvas?projectId=pnMAt6CTYc` (**THIS IS ALL WE WILL DO**). This folder is a prior production-candidate export, not a substitute for the live canvas; do not invent DNA; Beauty V1 unchanged.

**Source of truth for serving:** `public/shortkey-assets/`  
Beauty Next.js on **port 3005** serves these as static files — do **not** run `npx serve … -p 3005` (that fights the app).

## Open (no coding)

- Gallery: http://localhost:3005/shortkey-assets/index.html
- Hero video: http://localhost:3005/shortkey-assets/videos/V1-flagship-60s-homepage.mp4
- Cover: http://localhost:3005/shortkey-assets/magazine-pages/P1-cover.png
- Logo: http://localhost:3005/shortkey-assets/logos/logo-full.png

## Folders

| Folder | Count |
|--------|------:|
| videos | 4 |
| magazine-pages | 8 |
| posters | 4 |
| dna-cards | 10 |
| audio | 6 |
| logos | 3 |
| **Total** | **35** |

(Pack echo said “38”; the curl list is 35 files.)

## Code

`src/content/shortkeyAssets.ts` exports `ASSETS` with `/shortkey-assets/...` paths.

Optional repo-root `shortkey-assets/` mirror is **not** required — prefer `public/` only.
