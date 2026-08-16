# SKY ASIA WORKFLOW v1.0

**Status:** LOCKED · GOR_GOR_REVIEW  
**Lock date:** 2026-08-16  
**SSOT:** This file is the shared daily operating way for SKY ASIA OS.  
**Scope:** Operating cadence only — **no new tools · no new roles · no architecture / MVP redesign**.

> Publisher Mode follows this cadence from now.

---

## Operating stack (four levels)

```
Level 1  VISION     ── Kieran
Level 2  STRATEGY   ── Sky（總指揮）
Level 3  DEPARTMENTS── Kura Research · Simpee Business · Maya Editorial · Senti Creative
Level 4  OS / HQ    ── Cursor
```

---

## Level 1 — Vision · Kieran

| Field | Lock |
|-------|------|
| **Seat** | Founder · final vision · final approve |
| **Owns** | Theme lock · mission protect · publish go / hold / revise · Phase start orders |
| **Does not** | Day-to-day department execution · invent new seats mid-season |
| **Outputs** | Theme lock · approve / hold / revise · priority resets |

---

## Level 2 — Strategy · Sky（總指揮）

| Field | Lock |
|-------|------|
| **Seat** | Master AI Lead · **Manager** · QC before founder |
| **Owns** | Weekly / monthly assignments · integrate sibling packs · QC gate · OS coherence |
| **Does not** | Content · design · research · override founder vision · replace department ownership · decide DNA alone |
| **Loop** | Think → Decide → Assign → Review only |
| **Outputs** | Assignments · integrated season pack · QC report · next-cycle handoff |

**Sky-specific SSOT:** [`SKY_WORKFLOW.md`](./SKY_WORKFLOW.md) — Cloud SKY Workflow (INPUT → ANALYZE → PLAN → ASSIGN → MONITOR → REVIEW → REPORT TO KIERAN) · daily routine · Sky Golden Rules · GOR_GOR_REVIEW.

---

## Level 3 — Departments (existing seats only)

### Kura — Research

| Field | Lock |
|-------|------|
| **Role** | Research dept (R&D Lead on SKY ASIA OS seat map) |
| **Owns** | Culture / artists / creators / brands / festivals research · Knowledge Hub notes · DB row proposals |
| **Outputs** | Research packs · source lists · database proposals · QC when keyed |

### Simpee — Business

| Field | Lock |
|-------|------|
| **Role** | Business / finance dept (Finance Lead on SKY ASIA OS seat map) · Gor Gor gatekeeper remains for ShortKey family gates |
| **Owns** | Budget framing · partnership / sponsor logic when asked · GOR_GOR_REVIEW pack routing |
| **Outputs** | Budget notes · spend / partner flags · gate pack for founder |

### Maya — Editorial

| Field | Lock |
|-------|------|
| **Role** | Editorial / content dept (Content Lead) |
| **Owns** | Season slot framing · story outlines · draft copy aligned to discovery mission |
| **Outputs** | Slot outlines · draft frames · content calendar notes |

### Senti — Creative

| Field | Lock |
|-------|------|
| **Role** | Creative dept (Creative Director) |
| **Owns** | Visual language · cover / art direction · aesthetic QC vs discovery vibe |
| **Outputs** | Creative briefs · art direction notes · visual QC |

Seat conflict reminder: ShortKey Family Charter seats stay unchanged for ShortKey work — see `02_Team/CONFLICTS.md`.

---

## Level 4 — OS · Cursor = HQ

| Field | Lock |
|-------|------|
| **Seat** | Headquarters runtime (not a new family role) |
| **Owns** | File OS · integrate packs into `SKY_ASIA_OS/` · Task / Dashboard / Knowledge Hub hygiene · execute assigned builds |
| **Does not** | Decide DNA · add tools/roles · auto-publish to social · redesign MVP unless founder orders |
| **Outputs** | Updated HQ docs · integrated content files · task board sync · learning / roadmap notes |

---

## Content Production Workflow

```
Theme (Kieran lock)
    │
    ▼
Sky assign（總指揮）
    │
    ├──► Kura Research
    ├──► Simpee Business
    ├──► Maya Editorial
    └──► Senti Creative
    │
    ▼
Cursor integrate (HQ)
    │
    ▼
Sky QC
    │
    ▼
Simpee / Gor Gor gate  →  GOR_GOR_REVIEW pack
    │
    ▼
Kieran approve / hold / revise
    │
    ▼
Publish (manual · no auto-social)
```

Hard locks on this path:

- No auto-posting to social  
- No public pricing disclosure  
- No PII in creative assets  
- No placeholders in shippable content  
- No Phase 7 automation build in this cadence  

---

## After Publishing loop

```
Publish
    │
    ▼
Community response (observe · note · no auto-reply bots required)
    │
    ▼
Analytics snapshot (what worked / what stalled)
    │
    ▼
Knowledge Hub write-back (lessons · sources · decisions)
    │
    ▼
Sky brief → next theme / next week / next season
    │
    ▼
Kieran vision check (keep · adjust · hold)
```

Rule: publish without Knowledge Hub write-back is incomplete. Write-back without Sky brief is incomplete for the next cycle.

---

## Weekly Workflow (Mon–Weekend)

| Day | Owner focus | Cadence output |
|-----|-------------|----------------|
| **Mon** | Kieran + Sky | Theme / week priorities lock · task owners for the week |
| **Tue** | Kura (+ Cursor HQ) | Research day · Knowledge Hub notes · DB row proposals |
| **Wed** | Maya | Content day · slot outlines · draft frames |
| **Thu** | Senti | Creative day · visual direction · cover / art notes |
| **Fri** | Simpee + Sky + Kieran | Business / finance notes · GOR_GOR_REVIEW pack · approve / hold / revise |
| **Weekend** | Optional · Cursor tidy | Knowledge Hub tidy · task board hygiene only — **no publish without gate** |

Sky（總指揮） may rebalance mid-week if blockers appear; vision changes still require Kieran.

---

## Monthly Workflow (W1–W4)

| Week | Intent | Primary owners | Exit check |
|------|--------|----------------|------------|
| **W1** | Plan + research | Kieran theme · Sky assign · Kura research · Simpee framing | Priorities locked · research queue live |
| **W2** | Produce | Maya editorial · Senti creative · Cursor integrate drafts | Draft pack in `04_Season*/` (or active season) |
| **W3** | Gate + publish | Sky QC · Simpee / Gor Gor pack · Kieran approve · manual publish | Published or explicit hold |
| **W4** | Learn + reset | Community + analytics · Knowledge Hub · Sky next-month brief | After Publishing loop closed · next W1 ready |

Publisher Mode: Season 01 uses this monthly rhythm without inventing new pipelines.

---

## Golden Rule

**One shared cadence. Four levels. No freelancing outside the stack.**

1. Vision changes only at Level 1 (Kieran).  
2. Strategy / assignment / QC lives at Level 2 (Sky 總指揮).  
3. Departments deliver their outputs — they do not invent parallel workflows.  
4. Cursor is HQ execution — not a new seat, not DNA owner.  
5. Nothing ships past GOR_GOR_REVIEW + Kieran without an explicit hold or approve.  
6. Do not add tools, roles, or architecture in the name of “improving the workflow.” Improve by following this file.

---

## Pointers

| Doc | Role |
|-----|------|
| `03_Workflow/WORKFLOW.md` | Stub → points here (SSOT) |
| `03_Workflow/SKY_WORKFLOW.md` | **Sky-specific** manager loop SSOT (Level 2) |
| `02_Team/TEAM.md` | Seat map — Sky = Manager only |
| `00_Headquarters/Dashboard.md` | Ops status · Sky = Manager cadence |
| `00_Headquarters/Task_Center.md` | Tasks + weekly cadence link |
| `ROADMAP.md` | Phase status · Workflow v1.0 lock note |

---

**Honesty line:** Locking Workflow v1.0 means the team **operates** this way. It does not mean new agents, tools, or MVP routes were built.
