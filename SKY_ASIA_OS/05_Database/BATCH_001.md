# BATCH_001 — Database V1 first fill

**Date:** 2026-08-16  
**Source:** CURSOR_RESEARCH (live web verification)  
**Gate:** GOR_GOR_REVIEW  
**Kura:** pending QC — live `npm run ask:kura` **Needs key** (`KURA_API_KEY` / `BASE44_API_KEY` not set in this environment)

## Counts

| DB | Added | Target |
|----|------:|-------:|
| Artists | 10 | 10 |
| Creators | 10 | 10 |
| Brands | 10 | 10 |
| Culture | 10 | 10 |
| Festivals | 4 | optional |

## What was added

### Artists (10)
Japan: Aiko Fukawa (@aikofukawa verified via Cozyca), Midori Asano (IG unknown)  
Taiwan: Chin/Loidesign (@loi_design), Pion, Some Sort of Fern, Chamil Garden, Hsinyi/GENBOKU, OURS Studio  
Hong Kong: Oh Mankee (@oh.mankee), Missquai (@missquai)

Unverified Instagram → `unknown` (never invented).

### Creators (10)
Culture amplifiers and research-adjacent creators/shops (Sticky Rice Sisters, Pinky Elephant, Yoseka, Zenpop, Konbini, Daebak, Meowashi, Japan Stationery, Sumthings of Mine, TaiwaneseAmerican Next 100 profile).  
**Followers:** all `null` — no invented exact counts.

### Brands (10)
mt · Mind Wave (`mindwave.co.jp`) · Cozyca · Loidesign · OURS · Pion · Some Sort of Fern · Kakao Friends · LINE Friends · ARTBOX

### Culture topics (10)
Techo · washi/mt origin · Kamoi story · Dakku · Polco · Kakao sticker→IP · Taiwan PET/kiss-cut · collage export · Pinkoi · HK character IP (HOKO)

### Festivals (4)
Taiwan Creative Expo · Design Festa · Comic World · HK Book Fair (creative side)

## Status marking

- Artists: `Status` = `CURSOR_RESEARCH · pending KURA_QC`
- Brands: `Notes` include same tag
- Festivals: `Description` includes same tag
- Creators / Culture: covered by this batch log + Task Center TASK-001

## Pending Kura QC checklist

1. Confirm or correct every Instagram (especially those marked `unknown`)
2. Drop or rename any row that fails brand-taste / accuracy QC
3. Add better References where Culture URLs are secondary/summary sources
4. Decide whether retailers-as-Creators should stay or be split into a Shop index later
5. After QC → Simpee Gor Gor gate (Phase 2)

## Task

→ HQ Task Center **TASK-001** — Kura QC Batch 001
