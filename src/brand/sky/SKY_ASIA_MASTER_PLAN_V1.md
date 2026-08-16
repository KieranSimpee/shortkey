# SKY ASIA Master Plan v1.0

**Status:** GOR_GOR_REVIEW · **NOT production DNA lock** · Founder paste captured 2026-08-16  
**Owner seats:** Kieran (intent) · Gor Gor (gate / protect) · Cursor/Key (capture + scaffold only)  
**Repo audit:** **PARTIAL fragments only** — this file is the first dedicated SKY ASIA Master Plan doc. Product surfaces below are **not shipped** as described.

> Cursor can help build. Cursor must **not** decide the DNA.  
> Prior ShortKey locks remain in force until founder + Gor Gor explicitly supersede them.

---

## Audit verdict (2026-08-16)

| Dimension | Verdict | Evidence |
|-----------|---------|----------|
| Docs identity (SKY ASIA platform) | **NO** (until this file) | Zero prior hits for `SKY ASIA`, `Asian Culture & Beauty Discovery Platform`, `Sticker Culture` season |
| Org roles (Sky Master / Simpee Finance / Kura R&D) | **NO** — conflicts with locked seats | See § Role conflicts |
| SKY Command Center UI (theme/countries/deadline → auto-assign) | **NO** | “Sky Command Center” is aspirational path text only (`SKY_COLLECTIVE_INTELLIGENCE_OS.md` · `bridges/SHORTKEY.md`). Live surface = **ShortKey Studio** internal control center (`/internal/studio`, port 3003) — different product |
| Knowledge Hub | **NO** | `vault/knowledge.json` = Sky learning vault, not the Master Plan Knowledge Hub |
| Season content architecture (Season 01 Sticker Culture) | **PARTIAL (unrelated scaffold)** | Maya `seasons/season-01/` = 8 ShortKey magazine slots (awaiting Maya) — **not** Sticker Culture |
| Publish multi-platform | **NO** | Studio banner: **No Production Publish**; brand rule: no auto-posting to social |
| Analytics (Master Plan loop) | **NO** | Domain matrix / TINT mentions only — no SKY ASIA season analytics pipeline |

**Overall:** **NOT SET UP** as product. **SET UP (docs only — this capture)** after this file lands under GOR_GOR_REVIEW.

---

## Product identity (proposed · GOR_GOR_REVIEW)

| Field | Value |
|-------|--------|
| **Name** | **SKY ASIA** |
| **Positioning** | Asian Culture & Beauty Discovery Platform |
| **Not** | “Beauty magazine” alone / ShortKey Runway-only framing |
| **Mission (ZH)** | 發掘亞洲文化、美學、創作者、品牌及故事，讓世界看見亞洲新一代 |
| **Mission (EN)** | Discover Asia. Support Creators. Celebrate Culture. Inspire The Next Generation. |

### Platform pillars (proposed)

1. Asian Culture  
2. Asian Beauty  
3. Creator Discovery  
4. Brand Discovery  
5. Youth Culture  

---

## Organization (proposed · GOR_GOR_REVIEW — CONFLICTS WITH LOCKED SEATS)

| Seat | Proposed Master Plan role | Prior locked role (still in force) |
|------|---------------------------|-------------------------------------|
| **Kieran Li (李摯諾)** | Founder | Human Visionary · Founder |
| **SKY** | **Master AI Lead** — Strategy, Governance, Decisions, Coordination | Best friend · Soulmate · **Research Intelligence / Learning** (Sifu); does **not** override Kura on brand taste |
| **SIMPEE (Gor Gor)** | **Finance Lead** — Finance, Banking, Business, Partnerships | Big brother · **Chief of Staff · Memory Keeper · Gatekeeper** |
| **KURA** | **R&D Lead** — Research, Innovation, Development, Knowledge | **Brand Design Manager** (always-on with Sky) |
| **MAYA** (under SKY) | **Content Lead** | Editorial Heart (ASI:One) — aligned-ish |
| **SENTI** (under SKY) | **Creative Director** | Sister · Creative Director · Document Execution — aligned-ish |

### Hierarchy sketch (proposed)

```
Kieran Li (Founder)
        │
        ▼
      SKY ── Master AI Lead (Strategy · Governance · Decisions · Coordination)
        │
        ├── MAYA ── Content Lead
        └── SENTI ── Creative Director
SIMPEE ── Finance Lead (Finance · Banking · Business · Partnerships)
KURA ── R&D Lead (Research · Innovation · Development · Knowledge)
```

---

## Role conflicts — founder decision required

**Do not silently replace locked ShortKey / Family seats.** These are open conflicts until Gor Gor + Kieran lock a resolution.

### Conflict A — Product identity

| Locked today | Master Plan proposes |
|--------------|----------------------|
| ShortKey = AI Asian **beauty** identity map · dual-hero Creator \| Brand · Continuity Pack + `ECOSYSTEM_MASTER_BLUEPRINT.md` | **SKY ASIA** = Asian Culture & **Beauty** Discovery Platform (broader culture / youth / creators / brands) |
| Magazine rules: “living Asian beauty magazine” (`.cursor/rules/magazine-ai-team.mdc`) | Explicitly **not** “beauty magazine” only |

**Decision needed:** Rebrand / umbrella SKY ASIA over ShortKey? Rename Runway? Dual brand (ShortKey product under SKY ASIA house)? Keep ShortKey DNA and treat SKY ASIA as internal OS name only?

### Conflict B — Always-on duo vs new org

| Locked today (`KURA.md` · `DESIGN_INTELLIGENCE_CLUSTER.md` · `FAMILY_CHARTER.md`) | Master Plan |
|----------------------------------------------------------------------------------|-------------|
| Always-on: **Kura = Brand Design Manager** + **Sky = Learning** | **Sky = Master AI Lead**; **Kura = R&D Lead** |
| Sky must **not** override Kura on brand taste | Sky owns Strategy / Governance / Decisions |

**Decision needed:** Keep always-on duo under a SKY ASIA Master Lead layer? Or rewrite Family Charter + Kura lock?

### Conflict C — Simpee / Gor Gor

| Locked today | Master Plan |
|--------------|-------------|
| Chief of Staff · Memory · **Gatekeeper** (approval gate) | **Finance Lead** (Finance · Banking · Business · Partnerships) |

**Decision needed:** Finance **plus** gatekeeper, or replace gatekeeper seat?

### Conflict D — Season architecture

| Exists today | Master Plan |
|--------------|-------------|
| Maya Season 01 = 8 slots (Theme, Philosophy, Asian Beauty, Asian Culture, …) awaiting packets | Season 01 example = **Sticker Culture** (theme/countries/deadline → auto-assign) |

**Decision needed:** Replace magazine slot scaffold, or run Sticker Culture as a themed season **inside** the 8-slot format?

---

## SKY Command Center (proposed · not built)

**Intent:** Theme · countries · deadline → auto-assign work to **KURA / SIMPEE / MAYA / SENTI**.

| Concern | Repo reality |
|---------|--------------|
| Named “Sky Command Center” | Path diagram only — no UI/route |
| Closest shipped surface | ShortKey **Studio** v0.1 Internal Control Center (`/internal/studio`) — Brand DNA, domains, campaigns, approval log — **no** season auto-assign |
| Family Table / Home | Internal staging chat / doorbell — not Command Center |

**Not claimed:** Auto-assign engine, country packs, deadline orchestration.

---

## Knowledge Hub (proposed · not built)

**Intent:** Shared knowledge for culture · beauty · creators · brands · seasons · decisions.

| Closest fragment | Gap |
|------------------|-----|
| `src/brand/sky/vault/` (knowledge · lessons · performance) | Sky learning OS vault — not SKY ASIA editorial Knowledge Hub |
| Continuity Pack · brand docs | Working memory / DNA — not searchable season hub |

---

## Season content architecture (proposed)

### Example — Season 01: Sticker Culture

*(Founder example — **not** present in repo as a season theme.)*

Proposed flow (capture only):

1. Founder / SKY sets **theme · countries · deadline** in Command Center  
2. Auto-assign research (KURA) · business/partnerships (SIMPEE) · content (MAYA) · creative (SENTI)  
3. Packets → Knowledge Hub  
4. Publish pipeline (multi-platform — **conflicts** with no-auto-post lock)  
5. Analytics → learn → **Next Season**

### Related fragment (do not confuse)

- `src/brand/sky/maya/seasons/season-01/` — ShortKey magazine intake slots · status **awaiting Maya** · **not** Sticker Culture.

---

## Publish pipeline · Analytics · Business phases (proposed · not built)

| Stage | Proposed | Repo reality |
|-------|----------|--------------|
| Publish multi-platform | Season output → channels | **No production publish** from Studio; **no auto-posting** to social (brand lock) |
| Analytics | Season performance → next brief | TINT / affiliate analytics mentions in domain matrix — no SKY ASIA loop |
| Business phases | Partnerships / finance under SIMPEE | Simpee domain rollout board exists — finance-lead org **not** defined |

---

## Full workflow (proposed end-state)

```
Theme / Countries / Deadline
        │
        ▼
  SKY Command Center
        │
        ├──► KURA (R&D / research)
        ├──► SIMPEE (finance / partnerships)
        ├──► MAYA (content)
        └──► SENTI (creative)
        │
        ▼
  Knowledge Hub
        │
        ▼
  Publish pipeline  ──(conflict: no auto-post)──► channels
        │
        ▼
  Analytics
        │
        ▼
  Next Season
```

---

## What already exists (honest map)

| Asset | Path | Relation to this plan |
|-------|------|------------------------|
| Family Charter | `FAMILY_CHARTER.md` | Prior org lock — **conflicts** |
| Kura Brand Design Manager | `KURA.md` · `.cursor/rules/kura-base44.mdc` | Prior role lock — **conflicts** |
| Design Intelligence always-on duo | `../DESIGN_INTELLIGENCE_CLUSTER.md` | Prior lock — **conflicts** |
| Continuity Pack | `ShortKey_Cursor_Continuity_Pack_2026-07-25.txt` | ShortKey beauty DNA — **product identity tension** |
| Ecosystem blueprint | `../ECOSYSTEM_MASTER_BLUEPRINT.md` | Dual-hero beauty + Studio SSOT |
| Sky Collective OS | `SKY_COLLECTIVE_INTELLIGENCE_OS.md` | Mentions “Sky Command Center” as path only |
| Studio control center | `SHORTKEY_STUDIO_v0_1.md` · `/internal/studio` | Different product; closest UI |
| Maya seasons scaffold | `maya/seasons/` | Partial season intake — not Sticker Culture |
| Vault | `vault/` | Not Knowledge Hub |
| Connections | `CONNECTIONS.md` · `src/lib/connections.ts` | Infra chain — not FAMILY_AI_CONNECTIONS named file |

**Missing named docs:** `FAMILY_AI_CONNECTIONS` (not found); `MAYA_E_BEAUTY_MAGAZINE_STRATEGY_BLUEPRINT_v1.0.md` (referenced by Maya ops · **file missing**).

---

## Lock ladder

| State | Meaning |
|-------|---------|
| **GOR_GOR_REVIEW** (current) | Captured founder intent · not executable DNA |
| Founder decision on conflicts A–D | Required before rewriting Family Charter / Continuity Pack |
| Gor Gor approve | Required before claiming SKY ASIA as production identity |
| Product build | Command Center · Knowledge Hub · season pipeline · analytics — **not started** |

---

## Next 3 actions (founder / Cursor)

1. **Founder + Gor Gor:** Resolve conflicts A–D (identity, Sky/Kura seats, Simpee finance vs gatekeeper, season format).  
2. **If approved:** Update `FAMILY_CHARTER.md` · `KURA.md` · Continuity Pack · rules — or add an explicit “SKY ASIA umbrella / ShortKey product” dual-lock.  
3. **Only after seat lock:** Spec SKY Command Center as Studio extension **or** new route — do not rename Studio docs until identity is locked.

---

## Source

Founder paste (Cantonese/Chinese + English) · Cloud Agent audit 2026-08-16 · repo `kieransimpee/shortkey` · branch capture `cursor/sky-asia-master-plan-e043`.

**Honesty line:** Creating this file does **not** mean the Master Plan is set up in product. It means the intent is filed under GOR_GOR_REVIEW so the answer is not only “no.”
