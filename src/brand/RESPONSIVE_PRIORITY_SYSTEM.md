# SHORTKEY RESPONSIVE DESIGN & PRIORITY SYSTEM
**Master Workflow for Cursor · Version 1.0**  
**Locked:** 2026-07-19 · Aligns with Brand Guidelines V2026 · Sky Sifu · Family Charter

Cursor = Chief Art Director of the ShortKey ecosystem.

---

## Purpose
Every design, component, page, logo, CTA, image, and layout maintains:

- Brand consistency  
- Visual hierarchy  
- Conversion effectiveness  
- Responsive quality  
- User experience  

Across: **Desktop · Laptop · Tablet · Mobile**

## Core mission
**Build systems. Not pages.**  
**Build components. Not screens.**  
**Build brand experiences. Not individual websites.**

Every page inherits **SHORTKEY HOMEPAGE DNA**.

---

## Design DNA
**Personality:** Premium · Minimalist · Elegant · Modern · Professional · Trusted · Global · K-Beauty inspired · Apple-level clarity  

**Principles:** Strong typography · spacing · hierarchy · conversion focus · minimal clutter · high readability · fast understanding · maximum simplicity  

*(Simplex-ity heart + ShortKey monochrome product — see `SIMPLEXITY_PHILOSOPHY_LOCKED.md` · `BRAND_GUIDELINES_LOCKED.md`)*

---

## Priority engine

| Level | Role | Weight | Rule |
|-------|------|--------|------|
| **L1 Core** | Protect at all costs | **70%** | Never hide · never sacrifice · never shrink past readability |
| **L2 Supporting** | Adapt | **20%** | Move · stack · collapse · simplify |
| **L3 Decoration** | Sacrifice first | **10%** | Disappear · shrink · hide on mobile |

### L1 examples
Logo · Nav · Headline · Primary CTA · Product name/info · Price · Add to cart · Checkout · Signup · Account · Search · Membership status · Revenue actions  

### L2 examples
Secondary CTA · Ratings · Trust badges · Stats · Filters · Tooltips · Tags  

### L3 examples
Hero artwork · Floating images · Decorative icons · Glow · Background shapes · Particles · Flourish animations  

### Auto-adjust when space is tight
1. Keep Core  
2. Adapt Supporting  
3. Reduce Decoration  

**Never** keep decoration while compromising function.

---

## Logo governance
**Official mark only** — monochrome PNGs (`BRAND_GUIDELINES_LOCKED.md`).  
~~LOGO-001 invented IDs~~ — retired. Production = `/logo/shortkey-primary.png` (+ on-dark).

**Hierarchy:** Logo → Headline → CTA → Hero image → Decoration  

**Logo must:** visible · readable · contrast · proportions · recognizable  
**Logo must NOT:** shadows · glow · blur · opacity tricks · blend · distortion · stretch · recolour  

### Responsive height (targets)
| Breakpoint | Height |
|------------|--------|
| Desktop | 80–140px (hero) · header smaller |
| Tablet | 60–100px |
| Mobile | 40–80px · never below readability |

Live tokens: `Logo.tsx` size map (header / hero / footer / icon).

---

## Homepage priority order
1. Logo  
2. Main headline  
3. Primary CTA  
4. Product story  
5. Hero image  
6. Decoration  

If decoration competes with logo → **decoration loses**.

### Visual weight (hero example)
Logo 20% · Headline 30% · CTA 20% · Hero image 20% · Decoration 10%  
If hero or décor dominates logo → **FAIL**.

---

## Mobile collapse
| Viewport | Show |
|----------|------|
| Desktop | Full experience |
| Tablet | Reduce L3 |
| Mobile | Logo · Headline · Primary CTA · Core nav — collapse décor / BG effects / optional graphics |

---

## Decision filter
Does this improve **Revenue · Navigation · Trust · Conversion · Brand recognition · Understanding**?  
YES → L1 · MAYBE → L2 · NO → L3  

## Scoring targets
Brand visibility 10 · Readability 10 · Responsive 10 · Conversion 9+ · Simplicity 9+ · Logo 10 · Homepage DNA 10  

## Pre-deploy audit (PASS / FAIL each)
1. Brand — logo · colour · type · DNA  
2. Desktop 1440+ / 1920+  
3. Laptop 1024–1440  
4. Tablet 768–1024  
5. Mobile 320–767  

**Checklist:** logo visible + contrast · all breakpoints · DNA · L1 protected · décor controlled · CTA clear · conversion path  

Any FAIL → **DEPLOYMENT BLOCKED**

---

## Final rule
Think: Apple clarity + luxury brand + ecommerce conversion.

Classify every element → **Protect L1 · Adapt L2 · Cut L3 first.**

Never sacrifice: Logo · Nav · Headline · CTA · Products · Pricing · Checkout · Signup · Brand recognition — for decoration.

**Brand first. Function second. Decoration last.**
