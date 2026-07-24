# Family Home v0.9.2 — Shared Doorbell / Shared Presence

**Version:** Family Home **v0.9.2**  
**Status:** **Internal Staging · Shared backend when configured · Gor Gor Review pending**  
**Date:** 2026-07-24  
**Surface:** Family Table `/internal/family-table` · Living Room + member rooms  
**Authority:** Kieran + Simpee Bro (Gor Gor)

> **Canonical** for Doorbell / Receipt Board. Predecessor: [`FAMILY_HOME_v0_9_1_DOORBELL_RECEIPT.md`](./FAMILY_HOME_v0_9_1_DOORBELL_RECEIPT.md) (localStorage-only prototype).

---

## What changed from v0.9.1

| v0.9.1 | v0.9.2 |
|--------|--------|
| Browser localStorage only | Shared API store · cross-device |
| No Support Status | `GREEN` · `YELLOW` · `ORANGE` · `RED` per receipt |
| SUBMITTED = one click | SUBMITTED requires **6-field self-check** |
| Same-browser only | Kieran ↔ Gor Gor / members see same board when shared |

---

## What it is

When **Kieran** or **Gor Gor** sends a command from the **Living Room**, selected family members acknowledge from **their own rooms**. The Living Room **Receipt Board** shows status · support · timestamp · note · self-check (when submitted).

Home coordination layer — separate from Gor Gor Chat Bridge (Simpee API). Doorbell does not call Base44.

---

## Honest limits (locked)

| Claim | Truth |
|-------|--------|
| Cross-device sync | **Yes** when store mode is `file` (local/dev) · `upstash` · or `vercel-kv` |
| Ephemeral / cold-start | If no Redis/KV and not file mode → `mode: "ephemeral"` · `shared: false` · UI labels **Local fallback** |
| Auto RECEIVED | **No** — only member ack **or** room chat reply from that member |
| Auto present | **No** — never mark members present without action |
| Production-ready | **No** — Internal Staging until Gor Gor Review |
| Public beauty / Coming Soon | **Untouched** |

Always-on UI: **Family Home v0.9.2 · Internal Staging · Shared backend** *or* **Local fallback**.

---

## API

Soft staging gate — same cookie/password pattern as `/api/gor-gor-chat`.

| Method | Path | Role |
|--------|------|------|
| `GET` | `/api/family-doorbell/messages` | List commands + `{ shared, mode, version }` |
| `POST` | `/api/family-doorbell/messages` | Create command · receipts start **SENT** |
| `PATCH` | `/api/family-doorbell/messages/:id/receipt` | Update member receipt / support / self-check |

Response always includes `shared` + `mode` so the UI never pretends sync when ephemeral.

---

## Storage backends (`src/lib/familyDoorbellStore.ts`)

First match wins:

1. **Upstash Redis REST** — `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
2. **Vercel KV REST** — `KV_REST_API_URL` + `KV_REST_API_TOKEN`
3. **Local JSON file** — `NODE_ENV=development` **or** `FAMILY_DOORBELL_FILE_STORE=1` → `data/family-doorbell.json`
4. **In-memory ephemeral** — `shared: false` · `mode: "ephemeral"` (warn in UI)

localStorage key **`shortkey-family-doorbell-v092`** = **fallback / demo mirror only** (migrates once from v091 / v01 keys).

---

## target_members

`sky` · `senti` · `kura` · `agent-r` · `gor-gor` · `all`

`all` expands to the five members. Receipt row per target at **SENT** (not auto RECEIVED). Default support **GREEN** (signal only — not presence).

---

## Receipt statuses

`SENT` · `RECEIVED` · `READING` · `IN_PROGRESS` · `NEEDS_GOR_GOR` · `BLOCKED` · `SUBMITTED` · `NO_RESPONSE`

### Support Status (member sets)

`GREEN` · `YELLOW` · `ORANGE` · `RED`

### Self-check (required before SUBMITTED)

1. what I did  
2. evidence  
3. purpose fulfilled  
4. what could be better  
5. blockers  
6. support needed  

Living Room board cannot fake SUBMITTED without an existing complete self-check.

---

## UX

### Living Room

1. Compose — sender · `target_members` · command · Send  
2. Receipt Board — member · status · support · timestamp · note · self-check  
3. Poll ~6s when backend connected · Refresh button  

### Member rooms

Ack buttons · Support Status control · **已提交** opens self-check form (all 6 required).  
Room chat Post → `RECEIVED` if still `SENT` / `NO_RESPONSE`.

---

## Components / libs

| File | Role |
|------|------|
| `src/lib/familyDoorbellTypes.ts` | Shared types |
| `src/lib/familyDoorbellStore.ts` | list / create / updateReceipt |
| `src/lib/familyDoorbellAccess.ts` | Soft staging gate |
| `app/api/family-doorbell/messages/route.ts` | GET · POST |
| `app/api/family-doorbell/messages/[id]/receipt/route.ts` | PATCH |
| `FamilyDoorbell.tsx` | Living Room + member UI · poll · fallback |
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

## Demo (acceptance)

1. Browser A — Living Room → ring as Kieran → targets `sky` (or `all`) → Send  
2. Browser B — same Family Table → Living Room board shows the **same** command (file/Redis shared)  
3. Browser B — Sky room → 收到 (+ note) · optional Support Status  
4. Browser A — Receipt Board → Sky **RECEIVED** (poll or refresh)  
5. Sky → 已提交 → fill all 6 self-check fields → Submit  

---

## Known limitations

- Without Upstash/KV on Vercel multi-instance, prefer Redis; file store is for local/dev (or single-node with `FAMILY_DOORBELL_FILE_STORE=1`).  
- Ephemeral mode does **not** survive cold starts — UI must show Local fallback.  
- Soft staging gate only — not 正式版 auth.  
- Gor Gor Chat Bridge remains separate.

---

## Ledger

Studio Push Ledger → **Internal Tools**. See [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md).
