# SHORTKEY MASTER DESIGN, BUILD, RESPONSIVE & DEPLOYMENT OS
**Version 1.1** — Cursor = Chief Art Director (design quality). **Studio = Single Source of Truth** (deploy + theme + pages + store sync).

**Ecosystem blueprint:** [`ECOSYSTEM_MASTER_BLUEPRINT.md`](./ECOSYSTEM_MASTER_BLUEPRINT.md) · [`ecosystem-domains.json`](./ecosystem-domains.json)  
**Shareable Brand DNA sheet (share across pages):** [`SHORTKEY_BRAND_DNA.md`](./SHORTKEY_BRAND_DNA.md) · tokens: [`tokens.ts`](./tokens.ts)

## Chain of command
Kieran Li (Founder) → Cursor (Design Authority) → Design Registry → GitHub → **ShortKey Studio (SSOT)** → Deployment → Production  
Sky learns under Cursor; Base44 executes.

## Brand DNA
Premium · Minimalist · Elegant · Modern · Professional · Trustworthy · K-Beauty · Apple-level clarity  
Mother design: **Homepage**. Every page / domain inherits Homepage DNA.  
Full distilled sheet (essence, color, type, logo, hero budget, keycap CTA, L1/L2/L3): [`SHORTKEY_BRAND_DNA.md`](./SHORTKEY_BRAND_DNA.md).

## Priority engine
| Level | Role | Weight | Rule |
|-------|------|--------|------|
| 1 | Core (Logo, Nav, Headline, CTA, revenue) | 70% | Never sacrifice |
| 2 | Supporting | 20% | Adapt / stack / shrink |
| 3 | Decorations | 10% | Hide first on small screens |

## Logo
**Production lilac** — LOCKED. See `BRAND_GUIDELINES_LOCKED.md` · `LOGO_GOVERNANCE.md`.  
Responsive height: Desktop 80–140px · Tablet 60–100px · Mobile 40–80px.

## Homepage hierarchy
1 Logo → 2 Headline → 3 Primary CTA → 4 Product story → 5 Hero image → 6 Decorations  
If decoration or hero image competes with logo/CTA — they lose.

## Responsive gates
Every page: Brand → Desktop 1440+ → Laptop 1024–1440 → Tablet 768–1024 → Mobile 320–767.

## Components
Stable IDs (update in place, never duplicate):  
COMP-001 HERO · COMP-002 PRODUCT CARD · COMP-003 CTA · COMP-004 VIDEO · COMP-005 CALENDAR · COMP-006 MEMBERSHIP · COMP-007 PORTAL · COMP-008 SKIN ANALYSIS · COMP-009 CHECKOUT · COMP-010 NAVIGATION  

Preview matrix (Studio): Desktop · Tablet · Mobile × Lilac · Blue · Rainbow — see Ecosystem Blueprint.

## Build / runtime
Must pass: build, no runtime/chunk/hydration errors, routes + assets OK, logo OK.  
ChunkLoadError → verify layout imports → clear `.next` → rebuild → verify localhost.

## Deploy gate
No deploy until **Brand + Responsive + Build + Runtime** all PASS.  
Cursor designs. **Studio** releases (theme override · page manager · store auto-sync).
