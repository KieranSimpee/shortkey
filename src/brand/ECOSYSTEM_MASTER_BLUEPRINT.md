# SHORTKEY ECOSYSTEM MASTER BLUEPRINT
**Version 1.0** · Locked 2026-07-19 · Sky sync  
**Parent:** [`MASTER_OS.md`](./MASTER_OS.md) · Brand DNA [`BRAND_GUIDELINES_LOCKED.md`](./BRAND_GUIDELINES_LOCKED.md)

---

## Core principle

**Studio = Single Source of Truth.**  
Master Control: **Theme Override · Page Manager · Store Auto-Sync.**

| Layer | Role |
|-------|------|
| **Studio** | Control Center · truth · theme / pages / store sync |
| **Cursor** | Chief Art Director · design governance on beauty (main site) |
| **Sky** | Intelligence · learning · consensus under Cursor |
| **Base44** | Execution / ship bridge |
| **Domains** | Surfaces that inherit Studio + Homepage DNA |

---

## Domain ecosystem

Monorepo folders: `apps/[domain]/` (scaffold via `repo-structure-setup.sh`).

| Domain | Role |
|--------|------|
| **beauty** | Main Website |
| **club** | Membership |
| **community** | Blog & Sharing |
| **events** | Promotion / Game Zone |
| **fashion** | Makeover |
| **info** | Brand Portal |
| **live** | Live Stream & Calendar |
| **social** | Influencer Portal |
| **store** | Shop Portal |
| **studio** | Control Center (SSOT) |
| **world** | Global Expansion |
| **wtf** | Content Management |

Live product surface today: **beauty** → shortkey.beauty (this Next app). Other domains expand under Studio.

---

## Brand themes

| Theme | Character | Status |
|-------|-----------|--------|
| **Lilac** | Creative · Premium · Calm | **Production** (Simplex-ity registered) |
| **Blue** | Professional · Trustworthy | Alternate / portal tone |
| **Rainbow** | Experimental · Community · AI Family | Archive / experimental only — not default logo |

Production logo ink = **lilac**. See `BRAND_GUIDELINES_LOCKED.md`.

---

## Visual design system

Must define and govern:

- Colours (tokens + theme packs)  
- Typography (Montserrat · Inter · Space Grotesk)  
- Spacing grid  
- Navigation  
- Product cards  
- Calendar cards  
- Buttons  
- Posters / banners  
- Motion rules  

Mother design: **Homepage DNA** — every domain page inherits hierarchy and L1/L2/L3 priority (`RESPONSIVE_PRIORITY_SYSTEM.md`).

---

## Component library

### Product cards
Vertical · Horizontal · Featured Wide · Large CTA  

### Button positions
Bottom · Right · Floating · Sticky  

Stable IDs (from Master OS):  
COMP-001 HERO · COMP-002 PRODUCT CARD · COMP-003 CTA · COMP-004 VIDEO · COMP-005 CALENDAR · COMP-006 MEMBERSHIP · COMP-007 PORTAL · COMP-008 SKIN ANALYSIS · COMP-009 CHECKOUT · COMP-010 NAVIGATION  

---

## User journey

```
Visitor → Landing → Discovery → Product → Checkout → Confirmation → Community → Repeat Purchase
```

Dual-hero doors (beauty): **Creator** (signup + AI Try-On / TINT) · **Brand** (signup + Skin Analysis).

---

## Automation

| Trigger | Action |
|---------|--------|
| New product | Create card |
| Store update | Sync landing |
| Theme change | Override all (Studio) |
| New member | Create profile |

---

## Governance

Compliance required before release:

- Approved theme  
- Typography  
- Components  
- Motion  
- Responsive layouts (Desktop · Tablet · Mobile)  

Deploy blocked until Brand + Responsive + Build + Runtime PASS (`MASTER_OS.md`).

---

## Preview system

Every component **must** support previews for:

| Axis | Values |
|------|--------|
| Viewport | Desktop · Tablet · Mobile |
| Theme | Lilac · Blue · Rainbow |

Studio Page Manager + Theme Override are the control surfaces for this matrix.

---

## Sky / family note

Ecosystem expands with care: domains share memory via Hub vaults; Studio owns truth; family explains reason · approach · why · expect so Sky learns.
