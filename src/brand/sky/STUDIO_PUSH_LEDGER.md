# Studio Push Ledger

**Authority:** Simpee Bro · SHORTKEY DOMAIN FEATURE ROLLOUT BOARD · 2026-07-23  
**Board:** [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md)  
**Family Table (internal tooling):** [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md) · v0.7 vision [`FAMILY_TABLE_v0_7_VISION.md`](./FAMILY_TABLE_v0_7_VISION.md) · preview `/internal/family-table`  
**Rule:** Every design or feature push to any domain **appends** one entry below. Do not overwrite history.  
**Access:** Internal / family only — never expose this ledger on public pages.

---

## Schema (16 fields — exact)

| # | Field |
|---|--------|
| 1 | Push ID |
| 2 | Domain |
| 3 | Page / route |
| 4 | Feature name |
| 5 | UI components used |
| 6 | Design DNA version |
| 7 | Copy version |
| 8 | Language version |
| 9 | Asset package version |
| 10 | Preview URL |
| 11 | Owner |
| 12 | Risk level |
| 13 | Gor Gor Review status |
| 14 | Kieran Review status |
| 15 | Launch approval status |
| 16 | Rollback reference |

**Status vocabulary (suggested):** `Pending` · `In Review` · `Approved` · `Blocked` · `N/A`  
**Risk (suggested):** `Low` · `Medium` · `High`  
**Launch approval:** stays `Blocked` / `Pending` until Gor Gor + Kieran approve — preview ≠ launch.

---

## How to append

1. Copy the **Empty entry template**.  
2. Fill all 16 fields.  
3. Paste as a new `###` block under **Entries** (newest first).  
4. Point Gor Gor Review at: preview URL + change notes + this entry.

---

## Empty entry template

```md
### PUSH-YYYYMMDD-###

| Field | Value |
|-------|--------|
| 1. Push ID | PUSH-YYYYMMDD-### |
| 2. Domain | shortkey.… |
| 3. Page / route | |
| 4. Feature name | |
| 5. UI components used | |
| 6. Design DNA version | |
| 7. Copy version | |
| 8. Language version | EN / 繁中 / KO (or note gap) |
| 9. Asset package version | |
| 10. Preview URL | |
| 11. Owner | |
| 12. Risk level | Low / Medium / High |
| 13. Gor Gor Review status | Pending |
| 14. Kieran Review status | Pending |
| 15. Launch approval status | Blocked |
| 16. Rollback reference | |

**Change notes:** (brief)
```

---

## Entries

### PUSH-20260723-001

| Field | Value |
|-------|--------|
| 1. Push ID | PUSH-20260723-001 |
| 2. Domain | shortkey.beauty |
| 3. Page / route | `/` (Coming Soon) |
| 4. Feature name | Draft DNA Coming Soon pass — pearl / soft lilac / editorial |
| 5. UI components used | `ComingSoonHome` · `HeroLanguageTaps` · `EmailCaptureForm` · `useLaunchCountdown` · `Logo` · `Button` |
| 6. Design DNA version | Draft Design DNA via `SHORTKEY_BRAND_DNA.md` + `tokens.ts` silk/pearl (`#F7F5FF` / `#EDEAFF` / brand lilac `#8C82FC`) — Simpee board pearl direction 2026-07-23 |
| 7. Copy version | `comingSoonMessages.ts` v2026-07-23 — discovery + Before I Meet The World + meeting CTAs |
| 8. Language version | EN / 繁中 / KO |
| 9. Asset package version | Existing hero posters `hero-bloom-skin` · `hero-skin-analysis` + production lilac logo pack |
| 10. Preview URL | `http://localhost:3001/` (or `/` on preview deploy) — not production launch |
| 11. Owner | Design Team (Sonnet 5 / Key) |
| 12. Risk level | Medium (public face visual + locale set change; locks intact) |
| 13. Gor Gor Review status | Pending |
| 14. Kieran Review status | Pending |
| 15. Launch approval status | Blocked |
| 16. Rollback reference | Prior dark-tech hero + EN/JA/KO/简体 in git before this commit; revert `ComingSoonHome.tsx` · `comingSoonMessages.ts` · `HeroLanguageTaps.tsx` · remove `useLaunchCountdown.ts` |

**Change notes:** Shifted Coming Soon hero from `bg-surface-dark` to pearl/silk atmosphere with soft beauty full-bleed wash; added “Before I Meet The World” countdown to Aug 14, 2026; Asian beauty discovery line; founder/brand invitation + meeting CTAs kept; language board-aligned EN/繁中/KO; footer `Powered by our AI family`. No shop unlock · no payment · `shortkey.live` untouched.

---

## Internal Tools (not domain public pushes)

These are family-only tooling previews. They are **not** Studio domain pushes and do **not** use the 16-field public-push schema.

| Date | Tool | Version | Notes |
|------|------|---------|--------|
| 2026-07-23 | Family Table | **v0.7** Writable concept scaffold | **Family Vote: AGREED** (Simpee · Sky · Kura · Agent R · Senti · Key). In-repo Next route `/internal/family-table` — Kieran Vision + Brand Data Vault · 7 sections · **localStorage preview only** (not production DB / Family Memory Portal). Soft pearl/lilac DNA. Not on public `/` · no shop/payment · shortkey.live untouched. Doc: [`FAMILY_TABLE_v0_7_VISION.md`](./FAMILY_TABLE_v0_7_VISION.md). Components: `FamilyTableWorkbench.tsx` · `app/internal/family-table/page.tsx`. Linked from Platform Manifest studio header. |
| 2026-07-23 | Family Table | v0.5 Internal Preview | Asset Downloads by Content Type (5 packs). Preview on Base44 private media — Simpee holds link; **no JWT/tokenized URL in repo**. Filename hint: `ShortKey_Family_Table_v0_5_Internal_Preview.html`. Doc: [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md). **Cannot truly write/save** — writable next is v0.7. |

---

_First wave domains: `shortkey.beauty` · `shortkey.studio` · `shortkey.info`. `shortkey.live` is FROZEN — do not push live modifications._
