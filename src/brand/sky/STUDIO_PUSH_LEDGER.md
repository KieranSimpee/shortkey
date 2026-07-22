# Studio Push Ledger

**Authority:** Simpee Bro · SHORTKEY DOMAIN FEATURE ROLLOUT BOARD · 2026-07-23  
**Board:** [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md)  
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

_No pushes recorded yet. First wave domains: `shortkey.beauty` · `shortkey.studio` · `shortkey.info`. `shortkey.live` is FROZEN — do not push live modifications._
