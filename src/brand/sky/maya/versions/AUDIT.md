# Maya magazine — AUDIT / CHANGELOG

**Status:** Living log · GOR_GOR_REVIEW  
**Parent lock:** [`../MAYA_MAGAZINE_FILE_LOCK.md`](../MAYA_MAGAZINE_FILE_LOCK.md)

How to see **who changed** anything: read this file top-down, then open the versioned sibling named in the entry. Every future edit must add a new row **before** saving a `v0.x` copy.

| Date | Version | Author / seat | What changed | Prior | Evidence / notes |
|------|---------|---------------|--------------|-------|------------------|
| 2026-08-08 | **scaffold** | Key-Cursor (founder ask: anticipate Maya season topics) | Additive docs only: `maya/seasons/` intake + Season One slots 1–8 empty/awaiting. Wired pipeline/operate/README + Lab Local work note + profile inventory. **No** magazine PNG/Issue copy · **no** Beauty V1 claim | v0.1 | Format may change later per team. Beauty :3005 untouched. |
| 2026-08-07 | **v0.1** | Key-Cursor (founder ask: Maya interactive e-magazine) | Additive interactive sibling: `public/magazine-demo/emagazine.{html,js,css}` — readable overlays for locked titles, soft garble masks, page-turn chrome (keys/swipe/edges). Docs + Maya Lab links point to emagazine as primary. **No** PNG overwrite · **no** invented EN/JP body | v0.0 LOCKED | Strange symbols are mostly **baked into Lovart PNGs** (body columns). Overlay marks awaiting where body not approved. Beauty :3005 untouched. |
| 2026-08-06 | **v0.0 LOCKED** | Key-Cursor (on founder lock order) · Founder Kieran requested | Created lock docs + inventory; **no** overwrite of magazine art, `pages.ts`, Maya PDF, or magazine-demo | — (first lock) | Flip magazine still **12** pages; Prev/Next present in `magazine-demo.js` + `index.html`. Workspace **not git** — no commit author. Maya PDF / KURA.md are docs (no flip pages) — not evidence of loss. Downloads magazine HTML/PNG archives still on disk. Beauty V1 untouched. |

---

## Template for next entry

```md
| YYYY-MM-DD | v0.1 | <seat> | <what> | v0.0 LOCKED | <paths + reason> |
```
