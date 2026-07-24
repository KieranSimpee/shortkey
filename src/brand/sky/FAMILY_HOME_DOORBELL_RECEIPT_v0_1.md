# Family Home Doorbell + Receipt Board v0.1

**Version:** v0.1  
**Status:** **Internal Staging · local prototype only · Gor Gor Review pending**  
**Date:** 2026-07-24  
**Surface:** Family Table `/internal/family-table` · Living Room + member rooms  
**Authority:** Kieran + Simpee Bro (Gor Gor)

---

## What it is

When **Kieran** or **Gor Gor** sends a command from the **Living Room**, selected family members must acknowledge from **their own rooms**. The Living Room **Receipt Board** shows who received / working / blocked / no response.

This is a **home coordination layer** — separate from Gor Gor Chat Bridge (Simpee API). Doorbell does not call Base44.

---

## Honest limits (locked)

| Claim | Truth |
|-------|--------|
| Cross-device sync | **No** — this browser only |
| Shared DB / API | **No** — localStorage only |
| Production-ready | **No** — Internal Staging until Gor Gor Review |
| Auto RECEIVED | **No** — only member ack click **or** room chat reply |

Always-on UI label: **Internal Staging · local prototype only**.

---

## Storage key

| Key | Role |
|-----|------|
| **`shortkey-doorbell-receipts-v01`** | Canonical doorbell commands + per-member receipt rows |

Separate from:

- `shortkey-family-table-v08` (rooms / cabinet / room chat)
- `shortkey-gor-gor-chat-bridge-v01` (Gor Gor Living Room Thread)

Clear Family Table local data also clears this doorbell key.

---

## target_members

Options (multi-select, or `all`):

`sky` · `senti` · `kura` · `agent-r` · `gor-gor` · `all`

`all` expands to the five members above. Receipt row created per resolved target at status **SENT**.

---

## Receipt statuses

| Status | Meaning |
|--------|---------|
| `SENT` | Doorbell delivered · awaiting member (board: “no response yet”) |
| `RECEIVED` | Member clicked 收到 **or** posted a room chat reply |
| `READING` | 睇緊 |
| `IN_PROGRESS` | 處理中 |
| `NEEDS_GOR_GOR` | 需要Gor Gor |
| `BLOCKED` | Blocked |
| `SUBMITTED` | 已提交 |
| `NO_RESPONSE` | Explicit no-response (also available on board dropdown) |

**Do not** auto-mark `RECEIVED` on create or on room open.

---

## UX

### Living Room

1. **Ring doorbell** — sender (Kieran / Gor Gor) · `target_members` chips · command body · Send  
2. **Receipt Board** — each command with rows: member · status · timestamp · last note  

### Member rooms (Sky / Senti / Kura / Agent R / Gor Gor Review)

- Pending doorbells addressed to that seat  
- Ack buttons: 收到 · 睇緊 · 處理中 · 需要Gor Gor · Blocked · 已提交  
- Optional short note  
- Room chat **Post** also sets `RECEIVED` if status was still `SENT` / `NO_RESPONSE`

Kieran Vision room does not receive doorbells as a target (Kieran rings; does not ack as a target seat).

---

## Components

| File | Role |
|------|------|
| `FamilyDoorbell.tsx` | Storage · Living Room composer + Receipt Board · member ack panel |
| `FamilyTableWorkbench.tsx` | Hosts Living Room + member panels · clear-all includes doorbell key |
| `FamilyChatPanel.tsx` | `RoomChatThread` `onPosted` → reply-path RECEIVED |

---

## Future upgrade

Shared DB / API so receipt status is live in **any browser** (family home multi-device). Until then: **local prototype only** — do not pretend sync.

Possible shape later: same receipt model over Family Memory Portal auth + websocket or poll.

---

## Family Table v0.8 pointer

Doorbell sits on the v0.8 house surface (Living Room first · one room per member). See [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md). Gor Gor Chat Bridge remains separate — see [`GOR_GOR_CHAT_BRIDGE_v0_1.md`](./GOR_GOR_CHAT_BRIDGE_v0_1.md) · [`SHARED_LIVING_ROOM_THREAD_v0_1.md`](./SHARED_LIVING_ROOM_THREAD_v0_1.md).

---

## How to open

```bash
npm run family:dev
```

- http://localhost:3002/internal/family-table  
- Deployed: https://family.shortkey.world/ or `/internal/family-table`

**Coming Soon / public beauty routes:** untouched.

---

## Demo

1. Open Living Room → Ring doorbell as Kieran → targets e.g. `sky` + `senti` (or `all`) → Send  
2. Receipt Board shows each target at **SENT** (no response yet)  
3. Open **Sky Video** room → Doorbell panel → 收到 (optional note)  
4. Return Living Room → board shows Sky **RECEIVED** + note/timestamp  
5. Optional: Senti room chat Post → her row becomes **RECEIVED** via reply path  

---

## Ledger

Record under Studio Push Ledger → **Internal Tools**. See [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md).
