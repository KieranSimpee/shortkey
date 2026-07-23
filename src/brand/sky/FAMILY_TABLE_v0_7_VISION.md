# Family Table v0.7 — Kieran Vision + Brand Data Vault

> **Superseded for house UI by [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md)** — One Room Per Family Member (localStorage key `shortkey-family-table-v08`). This v0.7 doc remains the **Family Vote AGREED** + writable-concept authority; v0.8 builds on it.

**Version:** v0.7 (Writable concept scaffold · **Internal Staging**)  
**Suggested product name:** **Kieran Vision + Brand Data Vault**  
**Date locked:** 2026-07-23  
**Authority:** Kieran + Simpee Bro (Gor Gor) · Family Vote  
**Build home:** this repo — `C:\Users\Kieran\Projects\shortkey` · route `/internal/family-table` · local **port 3002** (`npm run family:dev`)  

**Domain lock (family home):** `family.shortkey.world` → **INTERNAL STAGING ONLY**  
- **Philosophy:** `shortkey.world` = public facing world · **`family.shortkey.world` = our home** (internal family house)  
- 可以上 domain · 只係 internal staging · **不是 public world launch**  
- Preferred host middleware: `family.shortkey.world` (and `www.family.shortkey.world` if used) `/` → redirect `/internal/family-table`  
- Also kept: `shortkey.studio` / `www.shortkey.studio` → same route (both may point here)  
- Attach domain in Vercel — see [`CONNECTIONS.md`](../../../CONNECTIONS.md) §7  
- Soft password gate: `FAMILY_TABLE_STAGING_PASSWORD` or `INTERNAL_STAGING_SECRET` + cookie (`/internal/login`) on family/studio host `/` and `/internal/*`  
- Status: **Internal Staging · Gor Gor Review pending**

**Later:** 正式版 = Family Memory Portal (shared DB + login + roles) — not this staging  
**Related:** [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md) · [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md) · [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md)

---

## Family Vote: AGREED

| Field | Value |
|-------|--------|
| **Decision** | **AGREED** — build a **Writable Family Table** (not HTML-only preview) |
| **Date** | **2026-07-23** |
| **Where first** | **This ShortKey repo** (internal Next route) — family domain later optional |
| **Division of labour** | **Simpee organises** · **family builds here** — Simpee must **not** have to think and build at the same time |

### Seats recorded (Node Family + Key)

| Seat | Vote |
|------|------|
| **Simpee** (Gor Gor) | AGREED — organises · Review gate |
| **Sky** | AGREED |
| **Kura** | AGREED |
| **Agent R** | AGREED |
| **Senti** | AGREED |
| **Key** | AGREED — Cursor house builds scaffold in-repo |

---

## Truth locked (version ladder)

| Version | Name / focus | Can write / save? |
|---------|----------------|-------------------|
| **v0.5** | Library preview (view UI · download Standard / Asset Packs · see workflow) | **No** — cannot truly write/save |
| **v0.6** | Submit workflow preview | Backlog only |
| **v0.7** | Write / Store / Upload **concept** — **Kieran Vision + Brand Data Vault** | **Local / preview persistence only** (browser localStorage) — **not** production DB |
| **正式版** | **Family Memory Portal** | Login + Database + private storage + role access + version history + status labels |

**v0.5 cannot write. v0.7 starts the brain → work system here.**

---

## What v0.7 is

**Kieran Brain → Family Work System** — an internal workbench where family can *see* the future shape:

1. Capture Kieran’s vision / intent  
2. Hold brand data for work (internal)  
3. Bank future projects  
4. Request AI Family tasks by seat  
5. Upload / stage assets (placeholder OK)  
6. Queue items for **Gor Gor Review**  
7. Keep light personal memory files (placeholder OK)

Goal: family can **SEE** this is the future workbench — not only pretty UI. Staging on domain ≠ public launch.

---

## Seven sections (scaffold) + Family Chat v0.1

| # | Section | v0.7 behaviour |
|---|---------|----------------|
| 1 | **Kieran Vision Inbox** | Form + list — title, note, priority; local persist |
| 2 | **Brand Data Vault** | Key / value / notes entries; local persist |
| — | **Family Chat** (v0.1) | Room picker + messages · **separate** localStorage key · beside Vision / Vault tabs |
| 3 | **Future Project Bank** | Name, domain hint, status; local persist |
| 4 | **AI Family Task Request** | Task → seat (Simpee / Sky / Kura / Agent R / Senti / Key); local persist |
| 5 | **Asset Upload Library** | **Placeholder** — filename + note only (no real upload pipeline) |
| 6 | **Gor Gor Review Queue** | Submit item → Pending / In Review / Approved / Blocked; local persist |
| 7 | **Personal Memory Files** | **Placeholder / light** — short private notes list; local persist |

### Family Chat v0.1 (local prototype)

| Field | Value |
|-------|--------|
| **Surface** | Tab on `/internal/family-table` — **Family Chat** |
| **Storage key** | **`shortkey-family-chat-v01`** (separate from table v0.7 — migrate-safe; does **not** nest under `shortkey-family-table-v07`) |
| **Shared DB** | **No** — browser localStorage only |
| **Rooms** | Family Table · Kieran Vision · Gor Gor Review · Sky Video Room · Senti Poster Room · Kura Structure Room · Agent R Evidence Room |
| **Message fields** | `sender_name` · `sender_role` · `room` · `message` · `status` · `timestamp` · optional `evidence_url` |
| **Status options** | DRAFT · SUBMITTED · WAITING FOR GOR GOR · GOR GOR REVIEWING · KIERAN REVIEW READY · APPROVED · BLOCKED |
| **Roles** | Kieran · Simpee/Gor Gor · Sky · Kura · Agent R · Senti · Key |
| **Warning (always on)** | *Internal staging only · localStorage only · not shared database · no private data yet.* |
| **Component** | `FamilyChatPanel.tsx` |

---

## Persistence honesty (v0.7)

| Layer | Status |
|-------|--------|
| **Browser localStorage** | **Yes** — table key `shortkey-family-table-v07` · chat key `shortkey-family-chat-v01` (separate · migrate-safe) — preview / staging only |
| **Shared / production database** | **No** — 正式版 (Family Memory Portal) |
| **Login / roles / private cloud storage / version history** | **No** — 正式版 |
| **Soft staging password** | **Yes when env set** — `FAMILY_TABLE_STAGING_PASSWORD` / `INTERNAL_STAGING_SECRET` + cookie; localhost / `family:dev` bypass |
| **Public Coming Soon `/` (beauty)** | **Not linked** · Family Table **not** on `shortkey.beauty` `/` |
| **shortkey.live** | **Do not modify** |
| **Shop / payment** | **Do not unlock** |

Clear banner on UI: *INTERNAL STAGING ONLY · localStorage only · not Family Memory Portal yet.*

---

## Access gate (soft staging)

| Host / path | Gate |
|-------------|------|
| `family.shortkey.world` `/` and `/internal/*` | Cookie required when env secret set → `/internal/login` |
| `shortkey.studio` `/` and `/internal/*` | Same (kept wiring; same Family Table route) |
| Any host `/internal/family-table` | Same soft gate when env secret set |
| `localhost` / `npm run family:dev` | Bypass (local workbench) |
| Env unset | **No password required** — routes still `noindex` / not in public nav (honest soft staging) |

---

## DO / DON’T (locked)

### DO

- Keep this **internal staging** (`/internal/family-table` · `noindex` · not in public nav)
- Prefer **`family.shortkey.world`** as Family Table home host; keep **shortkey.studio** if already wired
- Treat as **family home / workbench** — organise → assign → Gor Gor Review — **not** public world
- Persist lightly so family can try Write / Store / Upload **concept**
- Document that 正式版 = login + DB + private storage + roles + history + status
- Record pushes under Studio Push Ledger **Internal Tools** — status **Internal Staging · Gor Gor Review pending**
- Let **Simpee organise**; family **builds** in this repo

### DON’T

- Claim **public launch** / public world when family domain is attached
- Confuse **`shortkey.world`** (public) with **`family.shortkey.world`** (home)
- Put Family Table / Memory Portal on **public** Coming Soon `shortkey.beauty` `/`
- Expose **public brand content** from this vault
- Expose **AI family architecture** on public sites
- Skip **Gor Gor Review** gate for public or domain pushes
- Add **payment** / unlock shop from this surface
- Modify **shortkey.live**
- Pretend localStorage is shared / production storage
- Make Simpee both architect and sole builder for the same task

---

## How to open (local) — ports locked

| Surface | Port | npm script | What you get |
|---------|------|------------|--------------|
| **ShortKey public** (Coming Soon / beauty) | **3001** | `npm run dev` | `/` = Coming Soon — **do not change** |
| **Family Table** (internal workbench) | **3002** | `npm run family:dev` | `/` → redirects to Family Table |

**3000** is reserved for other apps on this machine — never bind ShortKey or Family Table there.

### Family Table (use this)

```bash
npm run family:dev
```

Then open either:

- **http://localhost:3002** — lands on the workbench (`SHORTKEY_SURFACE=family` redirects `/` → `/internal/family-table`)
- **http://localhost:3002/internal/family-table** — direct path

Same Next app as ShortKey; same wasm / `NEXT_TEST_WASM_DIR` / chdir-to-repo pattern as `:3001`. Localhost bypasses staging password. Routes are `noindex` and not linked from public nav.

### family.shortkey.world (preferred family home)

- After Vercel Domains + DNS: **https://family.shortkey.world/** → `/internal/family-table`
- Unlock at `/internal/login` when `FAMILY_TABLE_STAGING_PASSWORD` is set
- DNS (shortkey.world zone): **CNAME** `family` → `cname.vercel-dns.com` (or Vercel-shown target)
- Fallback until DNS: **https://shortkey.vercel.app/internal/family-table**

### shortkey.studio (kept · same route)

- **https://shortkey.studio** → same `/internal/family-table` (optional alternate host)
- Soft gate identical when env secret set

### ShortKey public (unchanged)

```bash
npm run dev
```

→ **http://localhost:3001/** (Coming Soon)

---

## Handback for Gor Gor

1. Preview URL: **https://family.shortkey.world/** (or `/internal/family-table`)  
2. Final route: `/internal/family-table`  
3. Confirm **INTERNAL STAGING ONLY · FAMILY HOME** banner  
4. Confirm storage = **localStorage** (not shared DB)  
5. Confirm soft password gate (env + cookie) honesty  
6. Confirm DNS / Vercel domain status  
7. Approve or block further depth toward 正式版  
8. Lock: **INTERNAL STAGING — family home, not public world launch**  

---

## Ledger

Record under Studio Push Ledger → **Internal Tools**. See [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md).
