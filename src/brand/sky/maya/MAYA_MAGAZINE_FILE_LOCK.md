# Maya Magazine File Lock

**Status:** LOCKED baseline · Founder lock 2026-08-06 · **GOR_GOR_REVIEW**  
**ALWAYS TO TRUE:** Do not invent Maya pages. Cursor builds; Cursor does not decide DNA.  
**Beauty V1:** Untouched. This lock does **not** unlock or replace Coming Soon on Beauty `/`.

---

## Version header (required on every versioned file)

```text
Version: v0.X
Date: YYYY-MM-DD
Author / seat: Maya | Kura | Key-Cursor | Kieran | Gor Gor | Senti | Agent R | Sky | …
Prior version: v0.(X-1) | LOCKED baseline v0.0
Reason: <one line why this copy exists>
```

---

## Versioning rule (one sentence)

**Never overwrite a locked Maya magazine baseline — every change is saved as a new sibling version (`…_v0.1`, `…_v0.2`, …) or under `versions/`, with date + author/seat + reason + prior-version pointer in the header.**

(Founder “0.1V” = **v0.1**, then v0.2, v0.3…)

---

## What is locked (canonical inventory)

### A — Flip magazine with page-turn (Issue 01 demo)

| Path | Role | Pages (honest count) |
|------|------|----------------------|
| `public/magazine-demo/index.html` | Page-turn chrome | — |
| `public/magazine-demo/magazine-demo.js` | `PAGES[]` + Prev/Next + arrows | **12** navigable pages |
| `public/magazine-demo/magazine-demo.css` | Styles | — |
| `public/magazine-demo/issue-01/*.png` | Spread art (local) | **12** art files + **4** blueprints |
| `public/magazine-demo/README.md` | Serve / URL notes | — |
| `src/app/control-center/magazine-demo/page.tsx` | Control entry iframe | — |

**Open URL (local Beauty :3005):**  
`http://localhost:3005/magazine-demo/#/cover`

**12 page ids (do not invent more):**  
cover · editors-letter · heritage · ingredient · brand · discovery · try-on · skin-analysis · creator · culture · whats-next · overview

### B — Next.js digital magazine spreads (hotspot / TOC nav)

| Path | Role | Count |
|------|------|-------|
| `src/content/magazine/pages.ts` | Spread config | **7** entries (cover + 6 interiors) |
| `src/content/magazine/types.ts` · `index.ts` | Types / exports | — |
| `src/components/magazine/MagazineSpread.tsx` | Spread UI + TOC | — |
| `src/app/magazine/[slug]/page.tsx` | Routes | slugs: trends · makeover · creators · looks · tutorial · dna |
| `public/images/magazine/page-*.png` | Spread art | **7** PNGs on disk |

**Open URLs:**  
`http://localhost:3005/magazine/trends` (and other slugs) · cover lives at `/` art path separately.

### C — Lovart export magazine stills (gallery, not flip engine)

| Path | Count |
|------|-------|
| `public/shortkey-assets/magazine-pages/P1`–`P8` | **8** PNGs |

### D — Maya editorial / DNA packs (not a flip magazine)

| Path | What it is |
|------|------------|
| `src/brand/sky/maya/maya-message-master-dna-directive-v2-2026-08-05.pdf` | Short Maya confirmation message PDF |
| `src/brand/sky/maya/MAYA_PDF_WORKING_COPY_2026-08-05.md` | Extracted text |
| `src/brand/sky/maya/MAYA_DNA_DESIGN_AUTHORITY.md` | Authority handoff |
| `src/brand/sky/sync-inbox/maya-*.json` · `maya-*.md` | Sync packets |

These **do not** have Prev/Next page-turn UI. Opening them and seeing “no pages” is expected — they are docs/PDF, not the flip magazine.

### E — Offline backups (Downloads — do not delete)

Still present on founder machine (examples):  
`C:\Users\Kieran\Downloads\*MAGAZINE*.html` · `maya html.pdf` · Digital Magazine Page 1–4 PNGs · `5fe13858a_maya_portal_v2.html`

---

## What is NOT Maya’s flip magazine

| File / surface | Why “no pages” |
|----------------|----------------|
| `src/brand/sky/KURA.md` | Kura **identity / Brand Design Manager** doc — never a multi-page flip magazine |
| Base44 Kura agent / Maya portal under Kura app file host | Portal / agent config — not Issue 01 `PAGES[]` |
| `public/gold-standards/*.html` | Staging gold-standard **separate HTML pages** (hub links), superseded as creative scope by Lovart lock — not the magazine-demo flipper |
| Beauty `/` Coming Soon | **V1 locked** — separate from magazine-demo route |

---

## Who changed it (attribution)

1. **Primary audit log:** [`versions/AUDIT.md`](./versions/AUDIT.md)  
2. **Baseline snapshot:** [`versions/MAYA_MAGAZINE_INVENTORY_v0.0_LOCKED.md`](./versions/MAYA_MAGAZINE_INVENTORY_v0.0_LOCKED.md)  
3. **Every new version file** must carry the Version header above.  
4. **Git:** This workspace snapshot is **not a git repo** at lock time — no `git log` author available. Use AUDIT.md + file mtimes + version headers.  
5. Seats that may appear: **Maya** (editorial) · **Kura** (taste) · **Key-Cursor** (scaffold) · **Kieran** (founder) · **Gor Gor** (gate) · others when routed.

---

## DO NOT

- Silently overwrite locked baselines in A–D  
- Delete Maya PDF / magazine PNGs / `magazine-demo` pages “to clean up”  
- Replace Beauty V1 Coming Soon with magazine unless founder unlocks a separate route (magazine-demo is already separate)  
- Invent extra Maya pages not in the locked inventories  

## DO

- Copy → rename with `_v0.1` / `_v0.2` or place under `versions/`  
- Log the change in `versions/AUDIT.md` the same day  
- Keep GOR_GOR_REVIEW until Gor Gor approves production DNA  

---

## Cross-links

- Continuity pack: `../ShortKey_Cursor_Continuity_Pack_2026-07-25.txt`  
- ALWAYS TO TRUE: `../ALWAYS_TO_TRUE.md`  
- Issue 01 Lovart scope: `../issue-01/LOVART_SCOPE_LOCK.md`  
- Maya DNA authority: `./MAYA_DNA_DESIGN_AUTHORITY.md`  
- Magazine demo README: `../../../../public/magazine-demo/README.md`
