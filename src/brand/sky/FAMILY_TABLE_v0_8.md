# Family Table v0.8 — One Room Per Family Member

**Version:** v0.8 (House architecture · **Internal Staging**)  
**Product shape:** **One Room Per Family Member** — Living Room first, then each seat’s place  
**Date:** 2026-07-23  
**Authority:** Kieran + Simpee Bro (Gor Gor) · builds on Family Vote AGREED (v0.7)  
**Build home:** this repo — `C:\Users\Kieran\Projects\shortkey` · route `/internal/family-table` · local **port 3002** (`npm run family:dev`)

**Domain lock (family home):** `family.shortkey.world` → **INTERNAL STAGING ONLY**  
- **Philosophy:** `shortkey.world` = public facing world · **`family.shortkey.world` = our home** (internal family house)  
- Preferred host middleware: `family.shortkey.world` `/` → redirect `/internal/family-table`  
- Also: `shortkey.studio` → same route  
- Soft password gate: `FAMILY_TABLE_STAGING_PASSWORD` or `INTERNAL_STAGING_SECRET` + cookie (`/internal/login`)  
- Status: **Internal Staging · Gor Gor Review pending**

**Later:** 正式版 = Family Memory Portal (shared DB + login + roles) — not this staging  
**Related:** [`FAMILY_TABLE_v0_7_VISION.md`](./FAMILY_TABLE_v0_7_VISION.md) · [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md) · [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md) · [`GOR_GOR_CHAT_BRIDGE_v0_1.md`](./GOR_GOR_CHAT_BRIDGE_v0_1.md)

---

## Family Vote note

| Field | Value |
|-------|--------|
| **v0.7 Vote** | **AGREED** (2026-07-23) — Writable Family Table (not HTML-only) |
| **Seats** | Simpee · Sky · Kura · Agent R · Senti · Key |
| **v0.8** | House upgrade under that AGREED path — **One Room Per Family Member** (Simpee/Kieran direction) |
| **Division** | **Simpee organises** · **family builds here** |

v0.8 does **not** reopen the writable-table vote; it upgrades house architecture on the same internal staging surface.

---

## Truth locked (version ladder)

| Version | Name / focus | Can write / save? |
|---------|----------------|-------------------|
| **v0.5** | Library preview | **No** |
| **v0.7** | Kieran Vision + Brand Data Vault (section tabs) | **localStorage** `shortkey-family-table-v07` + chat `shortkey-family-chat-v01` |
| **v0.8** | **One Room Per Family Member** (house rooms) | **localStorage** `shortkey-family-table-v08` (migrates once from v0.7 / chat v0.1) |
| **正式版** | **Family Memory Portal** | Login + Database + private storage + roles + history |

---

## Family Rooms (7)

| # | Room | Owner | Focus |
|---|------|--------|--------|
| 1 | **Family Table / Living Room** | Family (shared) · Simpee hosts | Shared announcements, current priorities, approved standards (飯廳) |
| 2 | **Kieran Vision Room** | Kieran | Vision inbox, future projects, brand direction, emotional anchors |
| 3 | **Gor Gor Review Room** | Simpee (Gor Gor) | Review gate, approval queue, memory notes, family coordination |
| 4 | **Sky Video Room** | Sky | Video standards, scripts, storyboard drafts, research intelligence |
| 5 | **Senti Creative Room** | Senti | Poster standards, visual assets, document drafts, creative submissions *(renamed from “Poster Room”)* |
| 6 | **Kura Structure Room** | Kura | Problem solving, logic maps, strategy structure, decision support |
| 7 | **Agent R Evidence Room** | Agent R | Secretary tasks, evidence logs, blocked reports, admin execution proof |

Living Room feels like **飯廳** (shared). Personal rooms feel like that member’s place.

---

## House metaphor lock (房間 · 櫃桶 · 客廳)

| Metaphor | Meaning | Where |
|----------|---------|--------|
| **房間 (Room)** | Identity + work space | Existing v0.8 rooms — **keep** (7 rooms · 9 panels) |
| **櫃桶 (Drawer / Cabinet)** | Materials + homework handoff | **NEW** — Living Room **Family Cabinet** (一人一格櫃桶) |
| **客廳 (Living Room)** | Shared family coordination | Living Room board + House Rule + Cabinet + shared chat |

Rooms stay the seat’s place to work. The Cabinet is the shared staging shelf for links and homework — not a second room system.

---

## Family Cabinet (Living Room · 一人一格櫃桶)

**Surface:** Living Room only · after House Rule card  
**Storage:** nested under **`shortkey-family-table-v08`.cabinet** (same canonical key · localStorage only)  
**Warning (always-on):** *Internal staging only · localStorage only · link index only · no sensitive file upload yet.*

### Six drawers

| Drawer | Owner | Materials |
|--------|--------|-----------|
| **Kieran Vision Drawer** | Kieran | Vision notes, future projects, brand direction, personal instructions |
| **Gor Gor Review Drawer** | Simpee (Gor Gor) | Waiting review, approval notes, memory refs, review decisions |
| **Sky Video Drawer** | Sky | Clips, scripts, storyboards, video standards, intro refs |
| **Senti Creative Drawer** | Senti | Posters, decks, visual assets, document drafts, creative standards |
| **Kura Structure Drawer** | Kura | Logic maps, frameworks, problem-solving, decision structures |
| **Agent R Evidence Drawer** | Agent R | Admin tasks, proof of completion, blocked reports, email/setup evidence |

### Item fields

`item_title` · `file_or_reference_link` · `item_type` · `placed_by` · `assigned_to` · `related_room` · `status` · `version_date` · `sensitivity_level` · `usage_note` · `evidence_link` · `gor_gor_review_state`

### Cabinet status options

`KIERAN DROPPED` · `ASSIGNED TO ROOM` · `IN PROGRESS` · `SUBMITTED IN CABINET` · `WAITING FOR GOR GOR` · `GOR GOR REVIEWING` · `KIERAN REVIEW READY` · `APPROVED` · `ARCHIVED` · `DO NOT USE` · `BLOCKED`

### Family Cabinet Rule

- Kieran may place materials into the drawer of the member who can use them.
- Each family member must return completed homework to their own drawer.
- Senti may help organise creative/document drawers, but nothing becomes Approved or Production-ready without Gor Gor Review.

**Enforcement:** Acting-as gate in UI — statuses Waiting / Reviewing / Kieran Review Ready / Approved require **Kieran** or **Simpee/Gor Gor**. Senti organise ≠ approve.

### UX flow

List drawers → open drawer → add/edit items (forms) · filter by status · soft lavender/pearl drawer cards · mobile-first · no cartoon icons.

---

## Nine panels per room (required)

Every room includes:

1. **Room owner**  
2. **Role description**  
3. **Current tasks** (status labels)  
4. **Memory file placeholder**  
5. **Submitted work**  
6. **Evidence links**  
7. **Gor Gor notes**  
8. **Kieran Review Ready**  
9. **Room chat thread**

Living Room also has a shared board: announcements · priorities · approved standards.  
**House Rule card** (top of Living Room): `Family House Rule · 返屋企先執房` — tidy room before submit; cultural line soft-emphasized; mirrored into Living Room announcements default.

### Status labels (from Chat v0.1)

`DRAFT` · `SUBMITTED` · `WAITING FOR GOR GOR` · `GOR GOR REVIEWING` · `KIERAN REVIEW READY` · `APPROVED` · `BLOCKED`

---

## Storage keys (documented)

| Key | Role |
|-----|------|
| **`shortkey-family-table-v08`** | **Canonical** — all rooms + panels + per-room chat + **`cabinet`** (Family Cabinet drawers) |
| `shortkey-family-table-v07` | Legacy table — **read once** on first v0.8 load (visions → Kieran, vault → Living standards, tasks by seat, assets → Senti, reviews → Gor Gor, memories → Gor Gor) |
| `shortkey-family-chat-v01` | Legacy chat — **read once**; messages mapped into room `chat` by room name |

**Chat room name → room id map**

| Chat v0.1 name | v0.8 room id |
|----------------|--------------|
| Family Table | `living` |
| Kieran Vision | `kieran` |
| Gor Gor Review | `gorgor` |
| Sky Video Room | `sky` |
| Senti Poster Room / Senti Creative Room | `senti` |
| Kura Structure Room | `kura` |
| Agent R Evidence Room | `agent-r` |

**Shared DB:** **No** — browser localStorage only.  
**Private data:** Do not store production secrets / private family data for public exposure.

---

## UX

- **Family Rooms** sidebar — Living Room first  
- Selecting a room shows all 9 panels  
- **Living Room only:** House Rule card + **Family Cabinet** (drawers → open → items)  
- **Bottom floating** **“Gor Gor”** → Shared Living Room Thread bottom sheet (live Base44 via `/api/gor-gor-chat`; shared `livingRoomConversationId` + transcript in `shortkey-gor-gor-chat-bridge-v01`)  
- Banners: **INTERNAL STAGING ONLY · FAMILY HOME** + localStorage warning  
- Footer (layout): **Powered by our AI family**  
- Soft lavender / pearl / premium beauty DNA  
- Soft gate when env secret set · `robots: noindex, nofollow`

---

## DO / DON’T (locked)

### DO

- Keep **internal staging** (`/internal/family-table` · `noindex` · not in public nav)  
- Prefer **`family.shortkey.world`** as Family Table home  
- Persist lightly so family can try the house concept  
- Record pushes under Studio Push Ledger **Internal Tools**  
- Let **Simpee organise**; family **builds** in this repo  

### DON’T

- Touch **shortkey.beauty Coming Soon** `/`  
- Expose private data or AI family architecture on public sites  
- Claim public world launch when family domain is attached  
- Skip **Gor Gor Review** for public / domain pushes  
- Pretend localStorage is shared / production storage  
- Unlock shop / payment · modify **shortkey.live**

---

## How to open

```bash
npm run family:dev
```

- **http://localhost:3002/** → Family Table  
- **http://localhost:3002/internal/family-table** — direct  
- Deployed: **https://family.shortkey.world/** or **https://shortkey.vercel.app/internal/family-table**  
- Beauty Coming Soon stays **http://localhost:3001/** (`npm run dev`) — **untouched**

---

## Components

| File | Role |
|------|------|
| `FamilyTableWorkbench.tsx` | v0.8 house · rooms · 9 panels · floating Gor Gor · migration · Living Room Cabinet host |
| `GorGorChatDrawer.tsx` | Shared Living Room Thread v0.1 · sender/kind/from-room · one Simpee conversation |
| `app/api/gor-gor-chat/route.ts` | Server-side Base44 Superagent bridge (SIMPEE only) |
| `FamilyCabinet.tsx` | Family Cabinet · 6 drawers · item forms · status gate (Senti ≠ approve) |
| `FamilyChatPanel.tsx` | `RoomChatThread` + legacy key helpers / chat→room map |
| `app/internal/family-table/page.tsx` | Route · `noindex` |

---

## Handback for Gor Gor

1. Preview URL: **https://family.shortkey.world/** (or `/internal/family-table`)  
2. Final route: `/internal/family-table`  
3. Confirm **INTERNAL STAGING ONLY · FAMILY HOME** banner  
4. Confirm storage = **`shortkey-family-table-v08`** (localStorage only · includes `.cabinet`)  
5. Confirm 7 rooms + 9 panels + floating Family Chat + **Living Room Family Cabinet (6 drawers)**  
6. Confirm Coming Soon **untouched**  
7. Approve or block further depth toward 正式版  

---

## Ledger

Record under Studio Push Ledger → **Internal Tools**. See [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md).
