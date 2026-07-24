# ShortKey Social — Creator Early Access v0.1

**Status:** **GOR_GOR_REVIEW** · Internal staging / public-preview polish · **not production-ready**  
**Host:** `shortkey.social` (attach later — see CONNECTIONS.md)  
**Local:** `npm run social:dev` → **http://localhost:3004** (`SHORTKEY_SURFACE=social`)  
**Route:** `/social` (`noindex`) · root on social surface redirects here  
**DNA source:** ShortKey Studio v0.1 Brand DNA (`src/lib/studio/seed.ts`)

## Purpose

Creators can:

1. Understand ShortKey (creator line + DNA points)
2. Register interest for early access
3. Share platform, category, follower range, location, preferred collaboration type, preferred payout band

## Safety (Studio-approved)

> Registration does not guarantee selection, paid campaigns, income, or sales results.

Payout bands are **placeholders only** — no payment system in this surface.

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

## Form fields (required)

| Field | Options |
|-------|---------|
| Name | free text |
| Handle or email | free text |
| Platform | Instagram · TikTok · YouTube · Other |
| Category | Beauty · Skincare · Makeup · Lifestyle · Other |
| Follower range | &lt;1k · 1–10k · 10–50k · 50–100k · 100k+ |
| Location | free text |
| Preferred collaboration | Gifted · Paid · Affiliate · Hybrid |
| Preferred payout band | Placeholder ranges · “Not sure yet” · gifted-only |

## Storage (honest)

| Mode | When | Label |
|------|------|--------|
| **File store** | Dev / `SOCIAL_FILE_STORE=1` | `data/social-early-access.json` via `POST /api/social/early-access` |
| **Ephemeral** | Non-dev without file flag | In-memory · lost on restart |
| **localStorage fallback** | API down | Key `shortkey-social-early-access-v01` · this device only |

**No Upstash required.** GET returns count + honesty meta only (no public dump of contacts).

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
