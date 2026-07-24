# Family Home v0.9.1 — Doorbell & Receipt Board

**Version:** Family Home **v0.9.1**  
**Status:** **Internal Staging · local prototype only · Gor Gor Review pending**  
**Date:** 2026-07-24  
**Surface:** Family Table `/internal/family-table` · Living Room + member rooms  
**Authority:** Kieran + Simpee Bro (Gor Gor)

> Replaces prior framing **Family Home Doorbell + Receipt Board v0.1**. Same coordination feature; version lock is **v0.9.1**. Legacy doc: [`FAMILY_HOME_DOORBELL_RECEIPT_v0_1.md`](./FAMILY_HOME_DOORBELL_RECEIPT_v0_1.md) (superseded).

---

## What it is

When **Kieran** or **Gor Gor** sends a command from the **Living Room**, selected family members must acknowledge from **their own rooms**. The Living Room **Receipt Board** shows who received / working / blocked / no response.

Home coordination layer — separate from Gor Gor Chat Bridge (Simpee API). Doorbell does not call Base44.

---

## Honest limits (locked)

| Claim | Truth |
|-------|--------|
| Cross-device sync | **No** — this browser only · **not shared across devices** |
| Shared DB / API | **No** — localStorage only |
| Production-ready | **No** — Internal Staging until Gor Gor Review |
| Auto RECEIVED | **No** — only member ack click **or** reply from that member room |

Always-on UI: **Family Home v0.9.1 · Internal Staging · local prototype only**.

---

## Storage key

| Key | Role |
|-----|------|
| **`shortkey-family-doorbell-v091`** | Canonical v0.9.1 doorbell commands + per-member receipt rows |
| `shortkey-doorbell-receipts-v01` | Legacy v0.1 — **read once** then migrated into v091 and removed |

Separate from `shortkey-family-table-v08` and `shortkey-gor-gor-chat-bridge-v01`. Clear Family Table local data also clears doorbell keys.

---

## target_members

`sky` · `senti` · `kura` · `agent-r` · `gor-gor` · `all`

`all` expands to the five members. Receipt row per target at **SENT** (not auto RECEIVED).

---

## Receipt statuses

`SENT` · `RECEIVED` · `READING` · `IN_PROGRESS` · `NEEDS_GOR_GOR` · `BLOCKED` · `SUBMITTED` · `NO_RESPONSE`

| Status | Meaning |
|--------|---------|
| `SENT` | Delivered · awaiting member (board: “no response yet”) |
| `RECEIVED` | 收到 **or** room chat reply from that member |
| `READING` | 睇緊 |
| `IN_PROGRESS` | 處理中 |
| `NEEDS_GOR_GOR` | 需要Gor Gor |
| `BLOCKED` | Blocked |
| `SUBMITTED` | 已提交 |
| `NO_RESPONSE` | Explicit no-response (board dropdown) |

---

## UX

### Living Room

1. Ring doorbell — sender (Kieran / Gor Gor) · `target_members` · command · Send  
2. Receipt Board — member · status · timestamp · last note  

### Member rooms (Sky / Senti / Kura / Agent R / Gor Gor Review)

Ack: 收到 · 睇緊 · 處理中 · 需要Gor Gor · Blocked · 已提交 (+ optional note).  
Room chat Post also → `RECEIVED` if still `SENT` / `NO_RESPONSE`.

Kieran Vision is not a doorbell target seat.

---

## Components

| File | Role |
|------|------|
| `FamilyDoorbell.tsx` | Storage · Living Room composer + Receipt Board · member ack |
| `FamilyTableWorkbench.tsx` | Hosts panels · clear-all includes doorbell |
| `FamilyChatPanel.tsx` | `onPosted` → reply-path RECEIVED |

---

## Future upgrade

Shared DB / API so receipt status is live in **any browser**. Until then: **local prototype only** — do not pretend sync.

---

## Family Table pointer

Sits on v0.8 house surface. See [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md). Gor Gor Chat Bridge remains separate.

---

## How to open

```bash
npm run family:dev
```

- http://localhost:3002/internal/family-table  
- https://family.shortkey.world/ or `/internal/family-table`

**Coming Soon / public beauty:** untouched.

---

## Demo

1. Living Room → ring as Kieran → targets `sky` (+ others or `all`) → Send  
2. Board shows **SENT** (no response yet)  
3. Sky Video → 收到 (+ note)  
4. Living Room board → Sky **RECEIVED**  
5. Optional: Senti room chat Post → RECEIVED via reply  

---

## Ledger

Studio Push Ledger → **Internal Tools**. See [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md).
