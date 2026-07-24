# ShortKey Studio v0.1 — Internal Control Center

**Status:** Internal staging · **not production ready** · Gor Gor Review pending  
**Local:** `npm run studio:dev` → **http://localhost:3003** (`SHORTKEY_SURFACE=studio`)  
**Route:** `/internal/studio` (`noindex`) · hash pages `#dashboard` … `#preview`  
**Host:** `shortkey.studio` → Studio control center (Family Table stays on `family.shortkey.world`)  
**Predecessor:** [`SHORTKEY_STUDIO_P0_DNA_CONTROL.md`](./SHORTKEY_STUDIO_P0_DNA_CONTROL.md)

## Concept

**Studio = source of truth. Domains = future consumers.**

v0.1 = data structure + dashboard + preview + status + version history only.  
No actual publish to production domains · no real scheduler · no production deploy APIs · no secrets in frontend.

## Ports (lock)

| Port | Surface |
|------|---------|
| 3000 | Sky |
| 3001 | Beauty (`npm run dev`) — **do not touch Coming Soon** |
| 3002 | Family Table (`npm run family:dev`) — **do not touch doorbell** |
| **3003** | **Studio** (`npm run studio:dev`) |
| **3004** | **Social** (`npm run social:dev`) — Creator Early Access |

## P0 scope (shipped in v0.1)

1. Brand DNA Center (P0 DNA Control Room content)
2. Domain Registry
3. Country Registry (JP / KR / TW-HK 繁 / Global)
4. Asset Library metadata
5. Campaign Registry
6. Approval status workflow → `StudioApprovalLog`
7. Version snapshot records
8. Preview cards
9. Deployment plan records (status only)
10. Rollback reference records (no automated rollback)

## Required statuses

`DRAFT` · `IN_REVIEW` · `GOR_GOR_REVIEW` · `KIERAN_REVIEW_READY` · `APPROVED` · `SCHEDULED` · `PUBLISHED` · `ARCHIVED` · `ROLLBACK_READY` · `DO_NOT_USE`

Review ladder (assets / campaigns / deployment plans): **Gor Gor Review** (`GOR_GOR_REVIEW`) → **Kieran Review Ready** (`KIERAN_REVIEW_READY`) → `APPROVED` (etc.). Rollback refs are **view-only** in v0.1.

## Entities

`BrandDNA` · `StudioAsset` · `StudioCampaign` (+ optional `hallyuFormula`) · `StudioDomain` · `StudioCountry` · `StudioDeploymentPlan` · `StudioVersionSnapshot` · `StudioApprovalLog` (+ `StudioRollbackRef` records)

Types: `src/lib/studio/types.ts` · seed: `src/lib/studio/seed.ts` · Hallyu formula: `src/lib/studio/hallyuFormula.ts` · doc: [`SHORTKEY_HALLYU_CREATOR_FORMULA.md`](./SHORTKEY_HALLYU_CREATOR_FORMULA.md)

## UI pages (nav)

1. Studio Dashboard  
2. Brand DNA Center  
3. Asset Library  
4. Campaign Manager  
5. Domain Manager (domains + countries)  
6. Deployment Plans (plans + rollback refs)  
7. Version History  
8. Preview Mode  

Shell: `src/components/internal/studio/StudioShell.tsx`

## Storage (honest)

| Mode | When | Label |
|------|------|--------|
| **File store** | Dev / `STUDIO_FILE_STORE=1` | `data/studio-v01.json` via `GET/POST /api/studio/state` — local/dev shared on this machine |
| **Ephemeral** | Non-dev without file flag | In-memory · `shared:false` |
| **localStorage fallback** | API down / browser-only | Key `shortkey-studio-v01` · **this device only** |

**No Upstash required for v0.1.**

Approval actor (staging): manual select **Kieran** / **Gor Gor**.

## Explicitly NOT

- Publish to production domains  
- Real scheduler automation  
- Production deployment / Vercel deploy buttons that call APIs  
- Secrets in frontend  
- Production-ready claim  

## Safety

`noindex` · **INTERNAL STAGING ONLY** banner · footer `Powered by our AI family` · pearl/lilac control-room DNA (not consumer site).
