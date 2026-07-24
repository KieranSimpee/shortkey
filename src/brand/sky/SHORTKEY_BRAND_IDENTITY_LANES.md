# ShortKey — Brand Identity Lanes + Benchmark Map

**Status:** **GOR_GOR_REVIEW** · Internal staging · **not production DNA lock**  
**Correction:** ShortKey was missing an **Asian beauty identity system** — not decoration.  
**Calibration:** Gor Gor vibe translate — see [`SHORTKEY_JKC_VIBE_RADAR_GORGOR_REVIEW.md`](./SHORTKEY_JKC_VIBE_RADAR_GORGOR_REVIEW.md)  
**Primary:** Studio `/internal/studio#identity` · port **3003**  
**Secondary:** Creator Circle `/social` · lighter educational strip · port **3004**  
**Related:** [`SHORTKEY_HALLYU_CREATOR_FORMULA.md`](./SHORTKEY_HALLYU_CREATOR_FORMULA.md)

**Motto:** ShortKey 不模仿畫面。ShortKey 捕捉生命力。  
(*ShortKey does not imitate the frame. ShortKey captures the life force.*)

## Identity lanes (calibrated)

| Lane | Calibrated vibe | Focus |
|------|-----------------|--------|
| **J-Beauty** | **Fresh Texture** | natural refinement + first-discovery warmth (soft daylight · macro texture · first makeup · creator rec · LIPS-style community · seishun freshness) — **not only** craft / 職人 / minimal subtraction |
| **K-Beauty** | **Signal Sprint** | content sharing rhythm · routine storytelling · texture demo · creator review · Hallyu / Olive Young–style discovery · beauty tech awareness · fast beauty signal — **avoid** 即時效果 / miracle / exaggerated before–after / skin insecurity |
| **C-Beauty** | **Color Persona** | packaging story · color wave · fantasy product world · swatch culture · viral discovery · Xiaohongshu / Douyin energy · brand personality — **not only** 大女主 / boss; also cute / fantasy / playful / affordable / viral |
| **Pan-Asian** | bridge | across J / K / C without one forced look |
| **Western-Asian Hybrid** | hybrid | diaspora / hybrid market storytelling |

**Studio internal:** J / K / C stay **separate** (intelligence).  
**Public marketing:** Asian Beauty Mix OK as lifestyle energy — each brand keeps DNA.

Do **not** impose one generic Asian style. Do **not** “just make it more colorful.” Do **not** copy reference frames.

## Brand Identity Lane fields

- Brand Identity Lane: J / K / C / Pan-Asian / Hybrid  
- Calibrated vibe: Fresh Texture / Signal Sprint / Color Persona (J/K/C)  
- Visual Vibe: soft / clean / fantasy / bold / editorial / clinical / playful  
- Product Story: routine / shade / texture / packaging / ingredient / creator shop  
- Creator Fit: reviewer / swatcher / routine educator / fashion creator / shop host  

## P0 lightweight preview layers

1. Brand Identity Lanes  
2. Creator Discovery Preview (role slots — **no fake named creators**)  
3. Product Story / Campaign Formula Cards (kept from Hallyu brief)  
4. Beauty Signal content cards  
5. C-Beauty / K-Beauty / J-Beauty benchmark sections  
6. Studio safety checklist (honesty + evidence labels)

## K-Beauty Signal Sprint rhythm

Beauty Signal · Routine story · Creator demos · Texture / usage moment · Ingredient/finish · Trend notes · Campaign formula cards  

Safe: visible texture demo · usage moment · creator first impression · routine-friendly signal.  
Not: 即時效果 · 用完即刻變靚 · miracle · exaggerated before–after · skin insecurity.

## C-Beauty Color Persona concept cards

Shade swatch · packaging story · creator color test · viral makeup trend notes · discovery energy · fantasy / playful / cute / affordable range  

**No** fake reviews · **no** marketplace clone · **no** brand logos without rights.

## J-Beauty Fresh Texture signal

Soft daylight · macro texture · first discovery / first makeup · creator recommendation · community warmth · seishun freshness  

Not only craft / 職人 / minimal subtraction.

## Honesty & evidence language

- Prefer: **transparent beauty discovery** · creator context clearly shown · no fake results · honest product story · real usage moment  
- Avoid: “拒絕濾鏡” / “unfiltered”  
- Prefer labels: **Verified Info** · **Brand-Provided Data** · **Evidence Available** · **Under Review** · **Creator Tested** *(only if real)*  
- Avoid early “真 / guaranteed true” badge  

## Preview sample data

Seed uses **Preview Brand A–E** lane archetypes only — never trademarked partner claims. Educational lane text is allowed without claiming those brands are partners.

## Guardrails (STRICT)

- Do not copy any reference website, app, logo, product image, celebrity, review, or brand asset  
- References = internal benchmark learning only until relationships are real  
- Sample data clearly marked **Preview**  
- No fake creators · no fake reviews · no fake partnerships  
- No production DNA claim · **GOR_GOR_REVIEW** first  
- No celeb names/images without rights  
- No fake “真” verification product flag  

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
| Gor Gor vibe radar | [`SHORTKEY_JKC_VIBE_RADAR_GORGOR_REVIEW.md`](./SHORTKEY_JKC_VIBE_RADAR_GORGOR_REVIEW.md) |
