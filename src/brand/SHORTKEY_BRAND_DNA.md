# SHORTKEY BRAND DNA — Shareable Sheet

**Status:** Distillation, not a new source of truth. If anything here ever reads as contradicting a locked doc below, the locked doc wins and this sheet is wrong — fix this sheet.

**Authority chain (read in this order):**
1. [`MASTER_OS.md`](./MASTER_OS.md) — chain of command, priority engine, deploy gate
2. [`BRAND_GUIDELINES_LOCKED.md`](./BRAND_GUIDELINES_LOCKED.md) — production logo, typography, forbidden list
3. [`LOGO_GOVERNANCE.md`](./LOGO_GOVERNANCE.md) — active logo paths, deleted/archive assets
4. [`RESPONSIVE_PRIORITY_SYSTEM.md`](./RESPONSIVE_PRIORITY_SYSTEM.md) — L1/L2/L3 priority engine, responsive gates
5. [`SIMPLEXITY_PHILOSOPHY_LOCKED.md`](./SIMPLEXITY_PHILOSOPHY_LOCKED.md) — philosophy parent (subtractive design)
6. [`MARK_MEANING_LOCKED.md`](./MARK_MEANING_LOCKED.md) — mark anatomy meaning
7. Tokens: [`tokens.ts`](./tokens.ts) mirrors [`tailwind.config.ts`](../../tailwind.config.ts) — one import for docs, Studio sync, and any non-Tailwind consumer.

**Use this sheet as the single page to hand to design, Studio, or a new page owner** so every route inherits Homepage DNA without re-reading six docs.

---

## 1. Essence

**Premium · Minimalist · Elegant · Modern · Trustworthy · K-Beauty · Apple-level clarity.**

Full personality set (see `RESPONSIVE_PRIORITY_SYSTEM.md` § Design DNA): Premium · Minimalist · Elegant · Modern · Professional · Trusted · Global · K-Beauty inspired · Apple-level clarity.

Philosophy parent is Simplex-ity: *pause · negative space · strip the unnecessary · clarity as strategy* (`SIMPLEXITY_PHILOSOPHY_LOCKED.md`). ShortKey is the **product surface** — monochrome `ctrl+alt+` mark, not a second live logo.

## 2. Mother page

**Homepage is the mother design.** Every route/domain inherits Homepage DNA (`MASTER_OS.md` § Brand DNA).

Homepage hierarchy: **Logo → Headline → Primary CTA → Product story → Hero image → Decorations.**
If a decoration or hero image competes with logo/CTA — decoration and image lose.

## 3. Color

Lilac production system only. **No new purple systems, no ad-hoc hex values** — use the tokens below (mirrored in `tokens.ts` / `tailwind.config.ts`).

| Token | Value | Role |
|-------|-------|------|
| `brand` (DEFAULT) | `#8C82FC` | Primary lilac — CTAs, accents, registered Simplex-ity colour |
| `brand.light` | `#B9B3FF` | Lilac tint |
| `brand.dark` | `#6F66E0` | Lilac shade (hover/active) |
| `brand.muted` | `#F7F5FF` | Lilac-tinted light fill |
| `brand.flare` | `#EDEAFF` | Soft lilac highlight |
| `brand.silver` | `#E8E6F2` | Neutral lilac-adjacent |
| `silk` (DEFAULT) | `#F7F5FF` | Base light surface |
| `silk.light` | `#FFFFFF` | Pure white surface |
| `silk.dark` | `#EDEAFF` | Silk shade |
| `ink` (DEFAULT) | `#242424` | Primary text |
| `ink.muted` | `#5A5A5A` | Secondary text |
| `ink.subtle` | `#8A8A8A` | Tertiary text |
| `surface.dark` | `#161226` | Dark Luxury hero / dark surfaces |

## 4. Type

| Role | Face | Token |
|------|------|-------|
| Display / logo-adjacent headlines | **Montserrat** (Bold / SemiBold) | `font-display` |
| Body | **Inter** Regular | `font-sans` |
| Numbers / technical / mono accents | **Space Grotesk** | `font-mono` |

Logo is always the **PNG asset** — never redrawn in CSS text (`BRAND_GUIDELINES_LOCKED.md`).

## 5. Logo

**Production lilac only.** See `BRAND_GUIDELINES_LOCKED.md` + `LOGO_GOVERNANCE.md` for full asset paths and forbidden list — this is the short version:

- Header (light surfaces) → `/logo/shortkey-primary.png`
- Hero / Dark Luxury (dark surfaces) → `/logo/shortkey-primary-on-dark.png`
- Footer (light surfaces) → `/logo/shortkey-primary.png`
- Icon / favicon → `/logo/shortkey-icon.png` family
- Hero seam (dual-audience layouts) → `Logo` component `size="bridge"` only — a **reduced, optional** bridge mark, not a second primary lockup
- Responsive height targets: Desktop 80–140px (hero) · Tablet 60–100px · Mobile 40–80px, never below readability

**Never:** shadows, glow, blur, opacity tricks, blend, stretch, recolour, invented SVG keycaps, or restoring archived/legacy paths (blue, rainbow, black-as-default, LOGO-001).

## 6. Hero budget

- **One composition per hero.** No stacking multiple competing focal points.
- **No cards in the hero.** Copy lives directly over the image (scrim/gradient), not in a boxed card.
- **No text baked into model imagery** — all copy is live text in the overlay, never flattened into the photo asset.
- Logo, headline, and CTA are L1 — they get a **reserved no-text/no-logo-overlap zone**; hero artwork and decoration are L3 and yield first if space is tight (`RESPONSIVE_PRIORITY_SYSTEM.md` § Visual weight).
- Hero visual weight target: Logo 20% · Headline 30% · CTA 20% · Hero image 20% · Decoration 10%. If hero/decoration dominates logo → **FAIL**.

## 7. Keycap CTA language

CTAs echo the logo's `ctrl+alt+` keypad without inventing a new mark — chrome only, not new iconography:

- Keycap chrome: rounded-`md`, normal-case, tracked-wide, white→`brand-muted` gradient fill, `brand` text, soft double-shadow (see `KEYCAP_CTA` class in `DualAudienceHero.tsx` for the reference implementation).
- Copy stays **subtractive** — action verbs (e.g. "Try On", "Sign Up"), no badge clutter, no more than one primary + one secondary CTA per composition.
- Primary CTA = lilac keycap fill; secondary CTA = quieter keycap/outline treatment. Never two primaries competing in the same view.

## 8. Priority engine (L1 / L2 / L3)

Full detail in `RESPONSIVE_PRIORITY_SYSTEM.md` and `MASTER_OS.md` — summary every page must follow:

| Level | Role | Weight | Rule | Examples |
|-------|------|--------|------|----------|
| **L1 Core** | Protect at all costs | 70% | Never hide, sacrifice, or shrink past readability | Logo · Nav · Headline · Primary CTA · Product name/price · Add to cart · Checkout · Signup · Search · Membership status |
| **L2 Supporting** | Adapt | 20% | Move · stack · collapse · simplify | Secondary CTA · Ratings · Trust badges · Stats · Filters · Tooltips |
| **L3 Decoration** | Sacrifice first | 10% | Disappear · shrink · hide on mobile | Hero artwork · floating images · decorative icons · glow · background shapes · particles |

**Decision filter:** does this improve Revenue · Navigation · Trust · Conversion · Brand recognition · Understanding? YES → L1 · MAYBE → L2 · NO → L3.

**Brand first. Function second. Decoration last.**

---

## Consistency check (this sheet vs. locked docs)

| This sheet | Locked source | Status |
|------------|---------------|--------|
| Essence / personality words | `RESPONSIVE_PRIORITY_SYSTEM.md`, `MASTER_OS.md` | Verbatim subset — no additions |
| Mother page + hierarchy | `MASTER_OS.md` § Homepage hierarchy | Verbatim |
| Color tokens | `tailwind.config.ts` (mirrored in `tokens.ts`) | Exact values, no new hex |
| Type faces | `BRAND_GUIDELINES_LOCKED.md` § Typography | Verbatim |
| Logo rules | `BRAND_GUIDELINES_LOCKED.md`, `LOGO_GOVERNANCE.md` | Distilled, links back for full asset list |
| Priority engine | `RESPONSIVE_PRIORITY_SYSTEM.md`, `MASTER_OS.md` | Verbatim table |

No new colors, no new logo variants, no new priority levels were introduced by this sheet. If a future edit here needs a value not present in the locked docs, update the locked doc first, then this sheet.

**Cross-linked from:** `MASTER_OS.md` § Brand DNA.
