# LOGO GOVERNANCE — Brand Guidelines V2026

**Parent:** [`BRAND_GUIDELINES_LOCKED.md`](./BRAND_GUIDELINES_LOCKED.md)  
**PDF:** `ShortKey_Brand_Guidelines_V2026.pdf`

## ACTIVE LOGO PATH

```
Homepage / Header → Logo surface=light → /logo/shortkey-primary.png
Homepage / Hero   → Logo surface=dark  → /logo/shortkey-primary-on-dark.png
Footer            → Logo surface=light → /logo/shortkey-primary.png
```

## Visual lock (before extract)

Master composition (full plate, do not publish raw):  
`src/brand/logo-locked/Shortkey_Logo_lilac_visual-lock-1024.png`

Extract light primary (gentle white→alpha + trim + 2× retina):  
`node scripts/extract-logo-from-visual-lock.mjs`

Full pack (lilac + on-dark + alternates):  
`node scripts/install-official-logo-pack.mjs`

## Deleted (do not restore as truth)
- Invented `/logo/*.svg` keycap pack  
- `/brand/LOGO-001.*`  
- `/images/shortkey-logo*.png`  
- Root `Shortkey-Logo.png`

## Archive only
`public/logo/archive/` — lilac, blue, rainbow, original (scarlet)
