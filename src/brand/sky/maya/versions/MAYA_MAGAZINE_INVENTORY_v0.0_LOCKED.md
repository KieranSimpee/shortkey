```text
Version: v0.0 LOCKED
Date: 2026-08-06
Author / seat: Key-Cursor (inventory) · Founder Kieran (lock order)
Prior version: — (baseline lock)
Reason: Founder scared pages were lost; honest inventory + file lock so Maya magazine baselines cannot be silently overwritten.
```

# Maya magazine inventory — v0.0 LOCKED

Honest counts only. Do not invent pages.

## 1. Flip magazine (page-turn YES)

- **URL:** `http://localhost:3005/magazine-demo/#/cover`
- **Engine:** `public/magazine-demo/magazine-demo.js` → `const PAGES = [ … ]` (**12** entries)
- **Chrome:** Prev / Next buttons · interactive strip · ArrowLeft / ArrowRight
- **Local art folder:** `public/magazine-demo/issue-01/`

| # | id | local file (present at lock) |
|---|-----|------------------------------|
| 01 | cover | cover.png |
| 02 | editors-letter | editors-letter.png |
| 03 | heritage | heritage.png |
| 04 | ingredient | ingredient.png |
| 05 | brand | brand.png |
| 06 | discovery | discovery.png |
| 07 | try-on | try-on-skin-next.png |
| 08 | skin-analysis | try-on-skin-next.png (shared frame) |
| 09 | creator | creator.png |
| 10 | culture | culture.png |
| 11 | whats-next | try-on-skin-next.png (shared frame) |
| 12 | overview | overview.png |

Blueprints (not in `PAGES` strip): blueprint-global-elements · blueprint-zone-map · blueprint-modal-overlays · blueprint-developer-handoff.

HTTP check 2026-08-06: `magazine-demo/index.html` 200 · `magazine-demo.js` 200 · `issue-01/cover.png` 200 (Content-Length 1785627).

## 2. Next.js spreads (TOC / hotspot nav — not the same flipper)

Config: `src/content/magazine/pages.ts` — **7** MagPage entries.  
Interior routes: `/magazine/trends` · `/makeover` · `/creators` · `/looks` · `/tutorial` · `/dna`.  
Art: `public/images/magazine/page-{cover,trends,makeover,creators,looks,tutorial,dna}.png` — **7** files present.

## 3. Lovart stills

`public/shortkey-assets/magazine-pages/` — P1–P8 (**8** PNGs). Gallery / export — not the magazine-demo flipper.

## 4. Maya editorial packs (no flip pages)

| File | Approx size / note |
|------|--------------------|
| `maya-message-master-dna-directive-v2-2026-08-05.pdf` | ~118 KB · short confirmation message |
| `MAYA_PDF_WORKING_COPY_2026-08-05.md` | text extract |
| `MAYA_DNA_DESIGN_AUTHORITY.md` | authority |

## 5. Kura “file” (not emptied magazine)

`src/brand/sky/KURA.md` — Brand Design Manager identity. **Never** had magazine page-turn. Seeing “no pages” here is correct file type, not loss.

## 6. Recovery notes

- Workspace **not a git repo** at lock time → no `git checkout` recovery from this folder alone.
- Offline copies still in `C:\Users\Kieran\Downloads\` (multiple `*MAGAZINE*.html`, Maya portal HTML, Digital Magazine Page PNGs, `maya html.pdf`).
- No evidence at lock time that `magazine-demo` `PAGES[]` or issue-01 PNGs were gutted.

## 7. Beauty V1

Not modified by this lock. Magazine demo is a **separate** route from Beauty Coming Soon home.
