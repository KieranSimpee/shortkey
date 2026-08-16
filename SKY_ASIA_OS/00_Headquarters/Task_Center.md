# Task Center

Family task board for SKY ASIA OS. Machine-readable: [`tasks/tasks.json`](./tasks/tasks.json).

**Statuses:** `todo` · `doing` · `done`  
**Mode:** Publisher Mode · Phase 9 Launch Season 01

## AI Team KPI stubs (status fields only — no new agents)

| ID | Owner | KPI / Task | Status | Notes |
|----|-------|------------|--------|-------|
| TASK-SKY-01 | Sky | Coordination — Season 01 publish path + HQ sync | `doing` | Cover Story draft live; route Gor Gor → Kieran |
| TASK-SIMPEE-10 | Simpee | 10 partners pipeline (internal shortlist from Brand DB) | `todo` | Status stub only; no outreach automation |
| TASK-KURA-100 | Kura | 100 research units (topics + QC across DB/Knowledge Hub) | `doing` | Batch 001+002 pending QC; culture notes in Hub |
| TASK-MAYA-TPL | Maya | Templates (Article · Interview · Artist · Brand) | `todo` | Stub — structure only until founder go |
| TASK-SENTI-ID | Senti | Identity (Visual · Logo · Colour · Cover style) | `todo` | Stub — Season 01 identity direction |

## Active / open

| ID | Owner | Task | Status | Phase |
|----|-------|------|--------|-------|
| TASK-001 | Kura | QC Batch 001 + Batch 002 (Artists · Creators · Brands · Culture · Festivals) | `todo` | 1–9 |
| TASK-002 | Maya | Editorial templates + Cover Story polish pass after Gor Gor | `todo` | 9 |
| TASK-003 | Senti | Creative direction notes for Artist/Brand Discovery packaging | `todo` | 9 |
| TASK-004 | Simpee | Gor Gor gate on Cover Story `READY_TO_PUBLISH.md` | `doing` | 9 |

## Notes

- **Ask Kura live:** Needs `KURA_API_KEY` / `BASE44_API_KEY` in `.env.local`. Script: `npm run ask:kura -- "…"`. Current cloud run: **Needs key**.
- No Maya / Senti / Simpee production calls yet — stubs only.
- No auto-social posting. No public pricing in outputs.
- Cover Story path: `SKY_ASIA_OS/04_Season01/content/COVER_STORY.md`
