# Maya Editorial Pipeline · Port 3008

**Status:** GOR_GOR_REVIEW · Staging scaffold · ALWAYS TO TRUE  
**Date:** 2026-08-07  
**Founder ask:** Isolate Maya work on **3008** for stability; wire Maya output → Cursor format → Lovart draft → local → domain.

---

## Art gate (founder lock · ALWAYS TO TRUE)

**Do NOT generate any pictures until content is reviewed and confirmed** (founder or Gor Gor).

- Maya may **write** briefs / prompts anytime.
- Lovart / Midjourney / any image gen = **only after** content packet review + confirm.
- Empty season slots stay awaiting — do not invent topic copy or generate art for them.
- Lab Tools UI requires checkbox: *Content reviewed & confirmed — allow art handoff* before open/copy handoff.
- GOR_GOR_REVIEW · do not invent DNA.

## Pipeline (locked shape)

```
Maya portal / packet → 輸出資料
        ↓
Content review & confirm (founder / Gor Gor)  ← art gate
        ↓
Cursor (中間層) → POST /api/maya/ingest · /api/maya/format
        ↓
Lovart brief JSON → src/brand/sky/maya/pipeline/lovart-briefs/
        ↓
Local (:3008) → /internal/maya · /magazine-demo/emagazine.html#/cover
        ↓
Domain → external showcase (aspirational · not live)
```

## Honesty

| Claim | Truth |
|-------|--------|
| **Founder 2026-08-07** | **One Maya** · **ASI:One API only** · **Base44 Maya portal DELETED** |
| Live chat | `npm run ask:maya` · Lab :3008 · `POST /api/ai/asi1/chat` |
| Key | `ASI_ONE_API_KEY` in `.env.local` · never commit |
| Deleted | `MAYA_PORTAL_URL` · Base44 portal HTML · portal message desk |
| Translations | Do not invent EN/JP — mark awaiting when missing |
| Beauty | **:3005 untouched** |
| Boot | `npm run maya:dev` — not in `locals:dev` |

## Local URLs

| Surface | URL |
|---------|-----|
| Maya Lab | http://127.0.0.1:3008/internal/maya |
| Magazine demo (isolated process) | http://127.0.0.1:3008/magazine-demo/emagazine.html#/cover |
| Magazine baseline flip | http://127.0.0.1:3008/magazine-demo/index.html#/cover |
| Pipeline JSON | http://127.0.0.1:3008/api/maya/pipeline |

Start:

```bash
npm run maya:dev
```

## Tools for Maya

| Tool | Route | Mode |
|------|-------|------|
| Lovart | `POST /api/maya/tools/lovart` | Brief + open `https://www.lovart.ai/canvas?projectId=pnMAt6CTYc` |
| Midjourney | `POST /api/maya/tools/midjourney` | Prompt pack · copy/paste (no official MJ API) |

Lab UI **Tools** tab: http://127.0.0.1:3008/internal/maya

Flow:

```
Maya (ASI:One) → brief / prompts  (writing OK)
        ↓
Content reviewed & confirmed (founder / Gor Gor)
        ↓
Lovart canvas  OR  Midjourney Imagine/Discord  (art handoff)
        ↓
Approved art → public/magazine-demo/issue-01/
        ↓
Local 3008 magazine preview
```

**Honesty / auth lock:** Founder connects Lovart + Midjourney via **Google Pro SSO on their websites** (browser login — founder’s Google Pro account). ShortKey does not store Google passwords or claim server-side Lovart/MJ OAuth. Maya writes briefs/prompts → **after content confirm** you run them in the already-logged-in (Google Pro) Lovart/MJ tabs → approved art returns to `magazine-demo/`.

## Season topics intake (anticipation)

Founder brief: Maya will send **8 topics per season**. Season One format + empty slots live under:

- Intake lock: [`seasons/SEASON_TOPICS_INTAKE.md`](./seasons/SEASON_TOPICS_INTAKE.md)
- Season One slots: [`seasons/season-01/`](./seasons/season-01/)

**Status:** awaiting Maya packets — do not invent topic copy; not claimed live on Beauty V1.  
When a packet arrives, file into `seasons/season-01/slot-0N-*.md` (or ask Cursor to map). Art handoff only **after** that content is reviewed & confirmed — separate from (and before) Lovart/MJ.

## Related

- Strategy blueprint (v1.0 · GOR_GOR_REVIEW): [`MAYA_E_BEAUTY_MAGAZINE_STRATEGY_BLUEPRINT_v1.0.md`](./MAYA_E_BEAUTY_MAGAZINE_STRATEGY_BLUEPRINT_v1.0.md)
- Season topics intake: [`seasons/SEASON_TOPICS_INTAKE.md`](./seasons/SEASON_TOPICS_INTAKE.md)
- Port lock: `.cursor/rules/shortkey-local-ports.mdc`
- Maya human path: `.cursor/skills/maya/SKILL.md`
- ALWAYS TO TRUE: [`ALWAYS_TO_TRUE.md`](../ALWAYS_TO_TRUE.md)
