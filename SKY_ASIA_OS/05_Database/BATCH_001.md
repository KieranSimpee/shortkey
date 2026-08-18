# BATCH_001 — Database V1 first fill (+ expansion)

**Date:** 2026-08-16  
**Source:** CURSOR_RESEARCH (live web verification)  
**Gate:** GOR_GOR_REVIEW  
**Kura:** pending QC — live `npm run ask:kura` **Needs key** (`KURA_API_KEY` / `BASE44_API_KEY` not set in this environment)  
**Schema:** Founder fields (see `SCHEMA.md`)

## Counts (live JSON)

| DB | Rows | Notes |
|----|------:|-------|
| Artists | 20 | Batch 001 (10) + expansion (10) · pending KURA_QC |
| Creators | 20 | Batch 001 (10) + expansion (10) |
| Brands | 20 | Batch 001 (10) + expansion (10) |
| Culture | 20 | Batch 001 (10) + expansion (10) |
| Festivals | 20 | Seed (4) + expansion |

## Founder field map

| DB | Keys |
|----|------|
| Artists | Name, Country, Instagram, Category, Website, Story Potential, Status |
| Creators | Name, Country, Platform, Followers, Niche, Contact |
| Brands | Brand, Country, Beauty/Fashion/Lifestyle, Website, Potential Collaboration |
| Festivals | Festival, Country, Date, Story Angle, Content Ready |

## Status marking

- Artists: `Status` includes `CURSOR_RESEARCH · pending KURA_QC` (some tagged BATCH_002)
- Brands: `Potential Collaboration` includes QC tag
- Festivals: `Content Ready` = `no` until slots assigned
- Unverified Instagram → `unknown` (never invented)
- Followers → `null` unless verified

## Knowledge Hub

Research notes under `00_Headquarters/knowledge/` · index `KNOWLEDGE_HUB/INDEX.md`

## Pending Kura QC checklist

1. Confirm or correct every Instagram (especially `unknown`)
2. Drop or rename rows that fail accuracy / brand-taste QC
3. Improve Culture References where secondary
4. After QC → Simpee Gor Gor gate

## MVP

→ `/sky-asia` displays live counts from these JSON files  
→ Task Center **TASK-001** — Kura QC Batch 001 (+ expansion)
