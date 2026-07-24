# Family Home v0.9.3 — Family Meeting UI

**Version:** Family Home **v0.9.3**  
**Status:** **Internal Staging · Gor Gor Review pending**  
**Date:** 2026-07-24 HKT  
**Surface:** Family Table `/internal/family-table` · Living Room + member rooms · `family.shortkey.world`  
**Authority:** Kieran + Simpee Bro (Gor Gor)

> **Canonical** for Family Meeting / Job Assignment UI on the shared doorbell board.  
> Predecessor: [`FAMILY_HOME_v0_9_2_SHARED_DOORBELL.md`](./FAMILY_HOME_v0_9_2_SHARED_DOORBELL.md) — **shared Upstash backend preserved** (Redis key `shortkey:family-doorbell:v092` unchanged).

---

## Goal

UI supports a real **Family Meeting** workflow (job assignment + member responses) — **not** a greeting doorbell.

Kieran: *“have our first family meeting… not meeting greeting… then job assign by gor gor and i would love to see family respond at home.”*

---

## What changed from v0.9.2

| v0.9.2 | v0.9.3 |
|--------|--------|
| Generic Shared Doorbell composer | Mode selector: Doorbell / Announcement · **Family Meeting** · Job Assignment · Review Request |
| Senders: Kieran · Gor Gor only | Senders: **Kieran · Gor Gor · Sky · Senti · Kura · Agent R** (exact API strings) |
| Plain body text | Structured **job assignment card** + raw body toggle/copy |
| Receipt Board present | Receipt Board **prominent** under each meeting post |
| Member ack | Member response controls: note required · optional evidence_url / blocker · self-check on SUBMITTED |
| — | **Meeting Thread** section · pin `fd_mryrchhg_gdlx7zrl` |
| API `version: "0.9.2"` | API `version: "0.9.3"` (clients should tolerate both) |

**Do not break:** existing first meeting `message_id: fd_mryrchhg_gdlx7zrl` (Gor Gor → all) must remain visible. Redis key stays **v092**.

---

## Modes (`mode` / `messageType`)

| Value | Label |
|-------|--------|
| `doorbell` | Doorbell / Announcement |
| `family-meeting` | Family Meeting |
| `job-assignment` | Job Assignment |
| `review-request` | Review Request |

- Sprint default composer mode: **`family-meeting`**.
- POST may send `mode` or alias `messageType`.
- Legacy messages without `mode`: Gor Gor + `all` (or all five members) → inferred **`family-meeting`**.

---

## Senders

API accepts exact strings:

`Kieran` · `Gor Gor` · `Sky` · `Senti` · `Kura` · `Agent R`

When Gor Gor posts from UI, payload must be `"sender": "Gor Gor"`.  
Receipt member keys remain `sky` · `senti` · `kura` · `agent-r` · `gor-gor` (unchanged).

---

## Job assignment card

For Family Meeting / Job Assignment posts, parse body headings when possible:

- Meeting title  
- Purpose  
- Assignments by member  
- Deadline guidance  
- Required response statuses  
- Support status key  
- Gor Gor Review reminder  

Freeform bodies still render as a readable card + **Show raw body** / **Copy raw**.

Every Family Meeting post shows:

> Outputs are candidates only until Gor Gor Review. Kieran only reviews KIERAN REVIEW READY work.

---

## Receipt Board

Immediately below each Family Meeting post — per member (Sky · Senti · Kura · Agent R · Gor Gor):

- `status` · `supportStatus` · last updated · `note` · `selfCheck` · optional `evidenceUrl` / `blocker`

Default from API: **SENT**. **Never auto RECEIVED** (only member action or explicit chat-reply ack).

---

## Member room responses

`PATCH /api/family-doorbell/messages/:id/receipt`

```json
{
  "member": "senti",
  "status": "READING",
  "supportStatus": "GREEN",
  "note": "Reading poster standard assignment now.",
  "evidence_url": "optional",
  "blocker": "optional",
  "selfCheck": null
}
```

- **Note required** on status/support response from the room UI.  
- **SUBMITTED** requires complete 6-field self-check (v0.9.2 fields kept).  
- Do **not** fake family responses.

---

## Meeting Thread

Living Room section: **FIRST FAMILY MEETING · JOB ASSIGNMENT**

- Latest / first meeting at top  
- Button **Open Meeting Thread** → scroll/focus that message  
- Prefer pin/highlight `fd_mryrchhg_gdlx7zrl` when present

---

## Storage / API (unchanged backends)

Same as v0.9.2:

1. Upstash Redis REST  
2. Vercel KV REST  
3. Local JSON file (dev)  
4. Ephemeral  

Redis key: **`shortkey:family-doorbell:v092`** (preserve shared data).  
localStorage fallback key: **`shortkey-family-doorbell-v092`**.

| Method | Path |
|--------|------|
| `GET` | `/api/family-doorbell/messages` → `{ shared, mode, version, messages }` |
| `POST` | `/api/family-doorbell/messages` → body · sender · target_members · mode? |
| `PATCH` | `/api/family-doorbell/messages/:id/receipt` |

---

## Honest limits (locked)

| Claim | Truth |
|-------|--------|
| Cross-device sync | Yes when `shared:true` / Upstash · KV · file |
| Auto RECEIVED | **No** |
| Fake member responses | **No** |
| Production-ready | **No** — Internal Staging |
| Public beauty / Coming Soon | **Untouched** |
| Secrets | **Not exposed** |

Always-on: **INTERNAL STAGING ONLY** · noindex · not public shortkey.world launch.

---

## Components / libs

| File | Role |
|------|------|
| `src/lib/familyDoorbellTypes.ts` | Modes · expanded senders · inferMessageMode |
| `src/lib/familyDoorbellStore.ts` | list / create / updateReceipt · version 0.9.3 meta · Redis key v092 |
| `app/api/family-doorbell/messages/route.ts` | GET · POST (+ mode) |
| `app/api/family-doorbell/messages/[id]/receipt/route.ts` | PATCH (+ evidence_url · blocker) |
| `FamilyDoorbell.tsx` | Living Room Meeting UI · member responses · poll |
| `FamilyTableWorkbench.tsx` | Hosts panels |

---

## How to open

```bash
npm run family:dev
```

- http://localhost:3002/internal/family-table  
- https://family.shortkey.world/ or `/internal/family-table`

**Coming Soon / public beauty:** untouched.

---

## Acceptance checklist

| # | Criterion | Expected |
|---|-----------|----------|
| 1 | Gor Gor posts as `"Gor Gor"` | PASS when UI select → API payload |
| 2 | Family Meeting / Job Assignment label | Mode selector present · not “greeting” |
| 3 | Receipts clear per member | Board under each meeting |
| 4 | Members update from room UI | PATCH with note (+ optional fields) |
| 5 | No auto RECEIVED | Only explicit ack |
| 6 | `fd_mryrchhg_gdlx7zrl` visible | Pinned / listed |
| 7 | `shared:true` / `mode:upstash` | After deploy GET |

---

## Ledger

Studio Push Ledger → **Internal Tools**. See [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md).
