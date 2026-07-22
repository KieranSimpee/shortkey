# SHORTKEY BRAND GUIDELINES — LOCKED
**Authority:** `ShortKey_Brand_Guidelines_V2026.pdf` (this folder) · Simplex-ity lilac registration  
**Philosophy parent:** [`SIMPLEXITY_PHILOSOPHY_LOCKED.md`](./SIMPLEXITY_PHILOSOPHY_LOCKED.md)  
**Mark meaning:** [`MARK_MEANING_LOCKED.md`](./MARK_MEANING_LOCKED.md)  
**AI doctrine:** [`AI_IS_NOT_A_TOOL_LOCKED.md`](./AI_IS_NOT_A_TOOL_LOCKED.md)  
**Logo colour decision:** [`sky/CONSENSUS_SKY_BRAND_019.md`](./sky/CONSENSUS_SKY_BRAND_019.md)  
**Locked:** 2026-07-19 · Sky Collective OS sync · **Lilac production**

## Production identity (ONLY)

> Production ShortKey = **lilac** `ctrl + alt +` · shortkey.beauty  
> Matches **Simplex-ity** registered colour · warmer than harsh white / cold mono.

| Asset | Path | Use |
|-------|------|-----|
| Primary (light surfaces) | `/logo/shortkey-primary.png` | Header, footer, white UI — **lilac** |
| Primary (dark surfaces) | `/logo/shortkey-primary-on-dark.png` | Hero Dark Luxury — **soft lilac** |
| Icon / Sky S+ cluster | `/logo/shortkey-icon.png` | Favicon, app, Sky mark |
| Favicons | `/logo/shortkey-favicon-{32…512}.png` | Browser |

**Mark anatomy (do not redesign):**  
`[ctrl] + [alt] +` · **`del` removed** · **`+` / S+** · **shortkey** · **YOUR STYLE. YOUR CTRL.**

## Alternate (utility — not default)

| Asset | Path | Use |
|-------|------|-----|
| Black mono | `/logo/alternate/shortkey-primary-black.png` | High-contrast print / legal mono |
| Black on-dark | `/logo/alternate/shortkey-primary-black-on-dark.png` | Mono invert when needed |

## Not production (archive only)

| Variant | Status | Path |
|---------|--------|------|
| Lilac | **PRODUCTION** (also archived copy) | `logo-locked/Shortkey_Logo_lilac.png` |
| Black & White | Alternate | `logo/alternate/` + `logo-locked/Shortkey_Logo_black.png` |
| Original (Scarlet) | Archive | `logo/archive/shortkey-original.png` |
| Blue Accent | Not approved | `logo/archive/shortkey-blue.png` |
| Rainbow | Not approved | `logo/archive/shortkey-rainbow.png` |

## Typography

| Role | Face |
|------|------|
| Logo / display | Geometric sans — **Montserrat** (Bold / SemiBold) |
| Body | **Inter** Regular |
| Numbers / technical | **Space Grotesk** |

Logo is always the **PNG asset**, never redrawn in CSS text.

## Sky AI mark

Sky does **not** get a separate invented logo.  
**S+** in the official Shortkey mark **is** the Sky signifier.  
UI seals (S+ → +5) stay brand-neutral and never replace the primary logo.

## UI accent

Lilac `#8C82FC` (and brand tokens) may align buttons with the registered mark.

## Install

```bat
node scripts/install-official-logo-pack.mjs
```

## Forbidden

- Invented SVG keycaps  
- Harsh pure-white full mark as default identity  
- LOGO-001 / shortkey-logo-clear legacy paths  
- Filters, glow, drop-shadow on the logo mark  
- Stretching / recolouring via CSS  
