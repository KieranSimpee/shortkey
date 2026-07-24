# ShortKey — Brand Identity Lanes + Benchmark Map

**Status:** **GOR_GOR_REVIEW** · Internal staging · **not production-ready**  
**Correction:** ShortKey was missing an **Asian beauty identity system** — not decoration.  
**Primary:** Studio `/internal/studio#identity` · port **3003**  
**Secondary:** Creator Circle `/social` · lighter educational strip · port **3004**  
**Related:** [`SHORTKEY_HALLYU_CREATOR_FORMULA.md`](./SHORTKEY_HALLYU_CREATOR_FORMULA.md)

## Identity lanes

| Lane | Focus |
|------|--------|
| **J-Beauty** | mood / fashion / personal creator identity |
| **K-Beauty** | content sharing / routine / product education / Hallyu rhythm |
| **C-Beauty** | packaging / color / brand personality / viral marketplace energy |
| **Pan-Asian** | bridge across J / K / C without one forced look |
| **Western-Asian Hybrid** | diaspora / hybrid market storytelling |

Do **not** impose one generic Asian style. Do **not** “just make it more colorful.”

## Brand Identity Lane fields

- Brand Identity Lane: J / K / C / Pan-Asian / Hybrid  
- Visual Vibe: soft / clean / fantasy / bold / editorial / clinical / playful  
- Product Story: routine / shade / texture / packaging / ingredient / creator shop  
- Creator Fit: reviewer / swatcher / routine educator / fashion creator / shop host  

## P0 lightweight preview layers

1. Brand Identity Lanes  
2. Creator Discovery Preview (role slots — **no fake named creators**)  
3. Product Story / Campaign Formula Cards (kept from Hallyu brief)  
4. Beauty Signal content cards  
5. C-Beauty / K-Beauty / J-Beauty benchmark sections  

## K-Beauty content-sharing rhythm

Beauty Signal · Routine story · Creator demos · Ingredient/finish · Trend notes · Campaign formula cards  

(Not only cute packaging + idol.)

## C-Beauty concept cards only

Shade swatch · packaging story · creator color test · viral makeup trend notes · discovery energy  

**No** fake reviews · **no** YesStyle copy · **no** brand logos without rights.

## Preview sample data

Seed uses **Preview Brand A–E** lane archetypes only — never trademarked partner claims (no JUDYDOLL etc. as if on ShortKey). Educational lane text is allowed (“C-beauty often includes playful packaging…”) without claiming those brands are partners.

## Guardrails (STRICT)

- Do not copy any reference website, app, logo, product image, celebrity, review, or brand asset  
- References = internal benchmark learning only until relationships are real  
- Sample data clearly marked **Preview**  
- No fake creators · no fake reviews · no fake partnerships  
- No production-ready claim · **GOR_GOR_REVIEW** first  
- No celeb names/images without rights  

## Flow (kept)

Historical (learn only): Brand → Celebrity → Consumer  
ShortKey: **Brand → Creator Circle → Community → Consumer**

## Preview URLs

| Surface | URL |
|---------|-----|
| Studio Identity Map | `http://localhost:3003/internal/studio#identity` |
| Studio Campaigns / formula | `http://localhost:3003/internal/studio#campaigns` |
| Studio Preview | `http://localhost:3003/internal/studio#preview` |
| Creator Circle strip | `http://localhost:3004/social` |

```bash
npm run studio:dev   # :3003
npm run social:dev   # :3004
```

## Code

| Piece | Path |
|-------|------|
| Types / seed map | `src/lib/studio/brandIdentityLanes.ts` |
| Hallyu formula (merged) | `src/lib/studio/hallyuFormula.ts` |
| Studio state field | `identityBenchmark` on `StudioState` |
| Studio page | `#identity` · `IdentityBenchmarkMap` |
| Cards | `BrandIdentityLaneCard` · `BeautySignalContentCard` · `LaneBenchmarkSectionCard` · `CreatorDiscoveryPreview` · existing formula/readiness cards |
| Social strip | `CreatorFormulaEducationStrip` |
