# ShortKey — Hallyu → Creator Formula + Product Story Readiness

**Status:** **GOR_GOR_REVIEW** · Internal staging · **not production-ready**  
**Parent system:** [`SHORTKEY_BRAND_IDENTITY_LANES.md`](./SHORTKEY_BRAND_IDENTITY_LANES.md) — Brand Identity Benchmark Map  
**Source brief:** Founder / Gor Gor chat direction (addendum file not found on disk)  
**Primary surface:** ShortKey Studio · Identity Map + Campaign Manager / Brand DNA / Preview  
**Secondary:** Creator Circle `/social` — light educational strip only

## Direction (learn — do not copy)

### Historical K-beauty pattern (educational only)

`Cute packaging + Effective product + Hallyu stars`

Flow: **Brand → Celebrity → Consumer**

### ShortKey modern formula

`Visual product story + clear product signal + creator trust + AI matching + localized commerce`

Flow: **Brand → Creator Circle → Community → Consumer**

### Correction

ShortKey was missing an **Asian beauty identity system** (J / K / C lanes) — not decoration. Formula cards sit inside that map.

## Explicitly NOT

- Copy Etude House, Holika Holika, celebrity photos, ad images, or article text  
- Celebrity names/images without rights  
- Fake endorsements or exaggerated product results  
- Production deploy / Deploy Center publish  
- Overbuilt marketplace  
- Fake creators / fake reviews / trademarked logos as partners  

## Concepts (UI + light data)

| Concept | Role |
|---------|------|
| **CampaignFormulaCard** | Old vs ShortKey formula — educational contrast |
| **ProductStoryReadinessCard** | Score checklist: packaging · product signal · creator fit · content angle · local market |
| **CreatorFitSignal** | Fit tags (skincare routine, makeup swatch, GRWM, J-beauty mood, K-beauty review, creator shop…) |
| **LocalMarketSignal** | HK · Japan · Korea · US · Philippines · SEA |
| **Brand Identity Lanes** | See Identity Benchmark Map doc |

## Where to preview

| Surface | Port | URL |
|---------|------|-----|
| Studio Identity Map | **3003** | `http://localhost:3003/internal/studio#identity` |
| Studio Campaigns | **3003** | `http://localhost:3003/internal/studio#campaigns` |
| Studio Preview | **3003** | `http://localhost:3003/internal/studio#preview` |
| Creator Circle | **3004** | `http://localhost:3004/social` |

```bash
npm run studio:dev   # :3003
npm run social:dev   # :3004
```

## Data model

- Types / helpers: `src/lib/studio/hallyuFormula.ts` · `src/lib/studio/brandIdentityLanes.ts`
- Optional on `StudioCampaign.hallyuFormula` · `StudioState.identityBenchmark`
- Seed campaign: `cmp_hallyu_creator_formula` · status **GOR_GOR_REVIEW**
- Store migrate fills missing fields gracefully

## UI components

- `src/components/studio/CampaignFormulaCard.tsx`
- `src/components/studio/ProductStoryReadinessCard.tsx`
- `src/components/studio/CreatorFitSignal.tsx`
- `src/components/studio/LocalMarketSignal.tsx`
- `src/components/studio/HallyuFormulaStudioPanel.tsx`
- `src/components/studio/IdentityBenchmarkMap.tsx` (+ lane / signal / discovery cards)
- `src/components/social/CreatorFormulaEducationStrip.tsx`

## Design DNA

Pearl / soft lilac ShortKey DNA · editorial · no red/black TV · no emoji spam · no celeb scrapes.

## Ledger

Append entry in [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md) (Internal Tools table).
