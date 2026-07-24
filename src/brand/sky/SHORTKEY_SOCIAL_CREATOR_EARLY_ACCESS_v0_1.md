# ShortKey Social — Creator Circle Early Access v0.2

**Status:** **GOR_GOR_REVIEW** · Internal staging / public-preview polish · **not production-ready**  
**Host:** `shortkey.social` (attach later — see CONNECTIONS.md)  
**Local:** `npm run social:dev` → **http://localhost:3004** (`SHORTKEY_SURFACE=social`)  
**Route:** `/social` (`noindex`) · root on social surface redirects here  
**DNA source:** ShortKey Studio v0.1 Brand DNA (`src/lib/studio/seed.ts`)

## Purpose

Creators can:

1. Understand **Why ShortKey**
2. See **How creators get discovered**
3. Review **Collaboration types**
4. See **Preferred payout bands** (placeholders)
5. Submit the **Early access form** to join the Creator Circle interest list

## Hero

**Join the ShortKey Creator Circle**

## Safety (Studio-approved)

> Registration does not guarantee selection, paid campaigns, income, or sales results. There is no payment system on this surface.

Payout bands are **placeholders only** — no payment system in this surface.

## Submission statuses

| Status | Meaning |
|--------|---------|
| **Submitted** | Default for every new form entry |
| **Under Review** | Internal staging review |
| **Invited** | Invited into next step (manual) |

## Ports (lock)

| Port | Surface |
|------|---------|
| 3001 | Beauty (`npm run dev`) — do not touch Coming Soon |
| 3002 | Family Table (`npm run family:dev`) |
| 3003 | Studio (`npm run studio:dev`) |
| **3004** | **Social** (`npm run social:dev`) |

## UI

- Soft pearl / light lilac · Studio DNA tokens (`silk` / `brand` / `ink` / `font-display`)
- Banner: **Internal staging / Gor Gor Review — not production-ready**
- Footer: **Powered by our AI family**
- Component: `src/components/social/CreatorEarlyAccessPortal.tsx`
- Page: `src/app/social/page.tsx`

## Form fields

| Field | Required | Options / notes |
|-------|----------|-----------------|
| Name | yes | free text |
| Email | yes | free text |
| Country | yes | free text |
| Platform | yes | Instagram · TikTok · YouTube · Other |
| Handle | yes | free text |
| Follower range | yes | &lt;1k · 1–10k · 10–50k · 50–100k · 100k+ |
| Beauty category | yes | Beauty · Skincare · Makeup · Lifestyle · Other |
| Preferred collaboration type | yes | Gifted · Paid · Affiliate · Hybrid |
| Preferred payout band | yes | Placeholder ranges · “Not sure yet” · gifted-only |
| Portfolio / media kit link | no | URL |
| Notes | no | free text |

## Storage (honest)

| Mode | When | Label |
|------|------|--------|
| **File store** | Dev / `SOCIAL_FILE_STORE=1` | `data/social-early-access.json` via `POST /api/social/early-access` |
| **Ephemeral** | Non-dev without file flag | In-memory · lost on restart |
| **localStorage fallback** | API down | Key `shortkey-social-early-access-v02` · this device only |

**No Upstash required.** GET returns count + honesty meta only (no public dump of contacts).  
New API submissions always store `status: "Submitted"`.

## Explicitly NOT

- Production domain launch automation
- Studio Deploy Center as one-click publisher
- Secrets in repo / frontend
- Marketplace matching / campaign assignment
- Payment processing or income guarantees
- Selection guarantees

## Middleware

- `shortkey.social` / `www.shortkey.social` → rewrite `/` → `/social` (same pattern as live → `/live`)
- `SHORTKEY_SURFACE=social` → redirect `/` → `/social`

## Studio registry

Domain `shortkey.social` status in Studio seed: **GOR_GOR_REVIEW**.

## Preview

```bash
npm run social:dev
# → http://localhost:3004/  (redirects to /social)
# → http://localhost:3004/social
```

Domain attach later — do **not** treat this commit as production publish.
