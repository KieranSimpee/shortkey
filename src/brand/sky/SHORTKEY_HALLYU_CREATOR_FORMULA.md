# ShortKey — Hallyu → Creator Formula + Product Story Readiness

**Status:** **GOR_GOR_REVIEW** · Internal staging · **not production-ready**  
**Source brief:** Founder / Gor Gor chat direction (addendum file not found on disk)  
**Primary surface:** ShortKey Studio v0.1 · Campaign Manager / Brand DNA / Preview  
**Secondary:** Creator Circle `/social` — light educational strip only

## Direction (learn — do not copy)

### Historical K-beauty pattern (educational only)

`Cute packaging + Effective product + Hallyu stars`

Flow: **Brand → Celebrity → Consumer**

### ShortKey modern formula

`Visual product story + clear product signal + creator trust + AI matching + localized commerce`

Flow: **Brand → Creator Circle → Community → Consumer**

## Explicitly NOT

- Copy Etude House, Holika Holika, celebrity photos, ad images, or article text  
- Celebrity names/images without rights  
- Fake endorsements or exaggerated product results  
- Production deploy / Deploy Center publish  
- Overbuilt marketplace

## Concepts (UI + light data)

| Concept | Role |
|---------|------|
| **CampaignFormulaCard** | Old vs ShortKey formula — educational contrast |
| **ProductStoryReadinessCard** | Score checklist: packaging · product signal · creator fit · content angle · local market |
| **CreatorFitSignal** | Fit tags (skincare routine, makeup swatch, GRWM, J-beauty mood, K-beauty review, creator shop…) |
| **LocalMarketSignal** | HK · Japan · Korea · US · Philippines · SEA |

## Where to preview

| Surface | Port | URL |
|---------|------|-----|
| Studio (source of truth) | **3003** | `http://localhost:3003/internal/studio#campaigns` · also `#brand-dna` · `#preview` |
| Creator Circle (lighter strip) | **3004** | `http://localhost:3004/social` |

```bash
npm run studio:dev   # :3003
npm run social:dev   # :3004
```

## Data model

- Types / helpers: `src/lib/studio/hallyuFormula.ts`
- Optional on `StudioCampaign.hallyuFormula` (`src/lib/studio/types.ts`)
- Seed campaign: `cmp_hallyu_creator_formula` · status **GOR_GOR_REVIEW** (`src/lib/studio/seed.ts`)
- Store migrate: if persisted state lacks the seed campaign or `hallyuFormula`, `normalizeState` in `src/lib/studio/store.ts` appends / fills gracefully

## UI components

- `src/components/studio/CampaignFormulaCard.tsx`
- `src/components/studio/ProductStoryReadinessCard.tsx`
- `src/components/studio/CreatorFitSignal.tsx`
- `src/components/studio/LocalMarketSignal.tsx`
- `src/components/studio/HallyuFormulaStudioPanel.tsx` (Studio wiring)
- `src/components/social/CreatorFormulaEducationStrip.tsx` (Creator Circle)

## Design DNA

Pearl / soft lilac ShortKey DNA · editorial · no red/black TV · no emoji spam · no celeb scrapes.

## Ledger

Append entry in [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md) (Internal Tools table).
