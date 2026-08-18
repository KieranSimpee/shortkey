# FAMILY SYSTEM CHECK

**As-is audit** · 2026-08-18 · **GOR_GOR_REVIEW**  
**Companion:** [`SYNERGY_BLUEPRINT.md`](./SYNERGY_BLUEPRINT.md) is the *target loop*. This file is *what actually runs today*.  
**Auditor:** Key (Cursor) · Evidence from this repo + open GitHub PRs. Not a DNA change.

---

## Executive verdict

The family **constitution is strong**. The family **execution layer is uneven**.

- **Works now:** Gor Gor chat bridge (if Base44 key is set), Family Table + doorbell (honest WAITING, no ghost replies), Kura CLI, GitHub → Vercel deploy, commerce bridges with fallback, Coming Soon gate.
- **Documented but not on `main`:** Maya ASI:One API + `ask:maya`, `ask:gorgor` / `ask:senti` / `ask:agent-r`, Maya Lab page + `/api/maya/*`, DNA Control Center `core/`, `/portal` + Airtable, live family-agent honesty pack.
- **Named but hollow:** Sky as an agent (email only), n8n editorial pipeline (unused stub + stale colours), MCP “Perplexity” (generic fetch, not Perplexity), Sky M (manual JSON, not a loop).
- **Zapier:** **Not required** to make the family work. One optional Catch Hook already exists for meeting signups. Do **not** Zapier DNA, social posting, or Gor Gor’s gate.

---

## How the family is supposed to work

```
Kieran feel
  → Gor Gor gate
  → Sky synthesize (today: human/email + rules, not a running agent)
  → Key assigns by strength (Cursor house)
  → Seats do the job
       Simpee  system / CI / deploy
       Kura    brand taste + data (Base44 Superagent)
       Senti   soul / UX (Base44 data bridge + seat)
       Agent R records / care (doorbell + evidence room)
       Maya    editorial heart (ASI:One — wiring sits on draft PRs)
  → GitHub → Vercel → surfaces
```

Equal respect remains locked. Assignment is routing, not ranking.  
Perspective Protocol: different ≠ wrong. Key reminds; Key does not veto.

---

## Seat-by-seat (live vs paper)

| Seat | Paper | Live on `main` today | Gap |
|------|--------|----------------------|-----|
| **Kieran** | Human Visionary | Always | — |
| **Simpee / Gor Gor** | Gatekeeper + Base44 agent | `POST /api/gor-gor-chat` → Superagent `69ddc914cfcf229762ac123d` if `BASE44_AGENT_API_KEY` (or aliases) set. Else honest fallback bubble. CI = `npm run build` on push to `main`. | `ask:gorgor` CLI is **draft PR #5/#6**, not merged. Chat transcript is **browser-local**. |
| **Sky** | Research Intelligence · harmony | `SKY_EMAIL=sky@shortkey.beauty`. Rules + vaults + orchestrator **helpers**. Family chat → doorbell WAITING. | **Not an agent.** No `ask:sky`. MCP trend servers are labels on `mcp-server-fetch`, not Perplexity. |
| **Kura** | Brand Design Manager | `npm run ask:kura` · skill + rule · agent `6a54198bebbee048f44e1378` | Needs `KURA_API_KEY` in `.env.local`. Family Table does not call Kura live (doorbell only). |
| **Senti** | Soul / experience | Commerce **data** bridge `getShortKeyData` (app `6a42029cc124d0206f027335`). Seat in Table. | **No** `ask:senti` on `main` (draft PR #6). Data bridge ≠ talking Senti. |
| **Agent R** | Secretary · records | Doorbell + Evidence Room UI | **No** live Agent R API on `main` (draft PR #6). |
| **Maya** | Editorial Heart · ASI:One | `MayaLabShell.tsx` exists. Docs say `ask:maya` + `/api/ai/asi1/chat` + `:3008`. | **No** `/internal/maya` page, **no** `/api/maya/*`, **no** `/api/ai/asi1/chat`, **no** `maya:dev` / `ask:maya` scripts on `main`. Those files live on **draft PR #2**. UI would 404 if opened. Season One slots still awaiting packets. |
| **Key** | Cursor house | This agent + Cursor rules/skills. Ships PRs. DNA reminder on colour conflict. | Cannot create GitHub repos. Cannot invent DNA. |

---

## Surfaces (what a human can open)

| Surface | Port / URL | Status |
|---------|------------|--------|
| Beauty Coming Soon | `:3001` `/` | Live gate. Do not replace. |
| Family Table | `:3002` `/internal/family-table` | Staging house + doorbell + Gor Gor drawer |
| Studio | `:3003` `/internal/studio` | DNA control room UI · file/local store · **no production publish** |
| Social Early Access | `:3004` `/social` | Staging · no income guarantees |
| Maya Lab | `:3008` `/internal/maya` | Middleware *intends* it · **page missing on main** |
| 30-second portal | `/portal` | **PR #9** — not merged |
| DNA Control Center | `core/` | **PR #8** — not merged |
| Synergy map | `SYNERGY_BLUEPRINT.md` | **PR #10** — this branch |

---

## Memory and intelligence

| Piece | Honesty |
|-------|---------|
| `families.json` + `orchestrator.ts` | Keyword router for Cursor. **Does not** call multiple models or write consensus by itself. |
| `vault/*.json` + `learning-log.json` | Manual Sky M (Sifu MVP). Last learning-log update **2026-08-13**. No weekly self-review job. |
| AI Hub → Base44 learning push | **Pending** (`bridges/BASE44.md`) |
| n8n `src/lib/pipeline/editorial.ts` | **Zero callers.** Defaults to `localhost:5678`. Embeds **stale** colours `#9B6BB5` / `#FAFAFD` — not locked lilac. Must not be turned on as-is. |
| MCP `.cursor/mcp.json` | Two servers both run `@anthropic-ai/mcp-server-fetch`. Names say Perplexity / trend-monitor. **Not a real research loop.** |

---

## Open family PRs (do not merge blindly)

| PR | What it actually adds | Note |
|----|----------------------|------|
| **#8** | `core/` DNA lock + index | Private `shortkey-core` still cannot be created by Cursor |
| **#9** | `/portal` + Airtable schema | Keys unset → DNA seed |
| **#10** | This synergy + check | Ops map |
| **#6** (draft) | `ask-gorgor` / `ask-senti` / `ask-agent-r` CLIs | Completes Base44 seat CLIs |
| **#5** (draft) | `ask:gorgor` scaffold | Overlaps #6 |
| **#2** (draft) | ASI:One chat, Maya APIs, family agent status, fail-closed honesty | This is the Maya/live-agent gap |
| **#7** (draft) | `SKY_ASIA_OS/` HQ folders | Parallel OS tree — risk of two headquarters |
| **#4** (draft) | SKY ASIA Master Plan doc | Review before a second constitution |

---

## What to improve (priority, not a calendar)

**P0 — Honesty and keys**  
1. Put `KURA_API_KEY` / `BASE44_AGENT_API_KEY` / `ASI_ONE_API_KEY` in `.env.local` and Vercel (never git). Without keys, Gor Gor and Kura are paper.  
2. Merge or close draft **PR #2** so Maya Lab stops pointing at missing APIs.  
3. Gor Gor review **#8 + #9 + #10** as one pack (Control Center + phone demo + synergy).

**P1 — One family ask path**  
4. Prefer **one** CLI family (`ask:kura` already live; fold #5/#6 so Gor Gor / Senti / Agent R match).  
5. Family Table: optional “Ask Kura” that calls the same Base44 path as the CLI — still no fake replies if the key is missing.

**P2 — Memory that actually loops**  
6. After each merged PR, append `learning-log.json` (Sky M phase 1 — already the rule).  
7. Do **not** install n8n until Maya has real packets **and** editorial.ts uses locked lilac tokens.  
8. Fix or remove MCP server names so they do not claim Perplexity.

**P3 — Security**  
9. Human creates private `shortkey-core` **or** makes soul docs non-public. Indexing a public repo is not a vault.  
10. `/portal` stays noindex until Gor Gor opens it.

**Do not**  
- Auto-post to social (brand lock).  
- Invent Maya season copy or art.  
- Stand up a second GitHub app repo.  
- Recolor production to magazine gold.  
- Turn on n8n publish webhooks.

---

## Zapier — needed or not?

**Decision: Zapier is not required for the family system.**  
GitHub → Vercel already deploys. Airtable (when keyed) already feeds `/portal`. Base44 already talks to Gor Gor / Kura. Zapier would be a fourth bus.

### Already in code (use this before a new Zap)

`SIGNUP_NOTIFY_WEBHOOK_URL` on `POST /api/signup/meeting`.  
Paste a Zapier Catch Hook **or** Slack/Make URL. Fires after a brand/creator meeting booking. Optional. Resend/FormSubmit already emails `info@shortkey.beauty`.

### The only Zaps worth considering later (still no social auto-post)

| Zap | When | Why |
|-----|------|-----|
| **1. Meeting signup → Slack / Agent R inbox** | If the email inbox is too slow | Uses existing webhook. One Catch Hook. |
| **2. Airtable `Stories` row → `READY` → notify Sky email** | After Airtable is live and `/portal` is in use | So Sky sees new soul copy without polling. **Do not** write DNA from Zapier. |
| **3. Family doorbell `URGENT`/`RED` → email `SKY_EMAIL`** | If doorbell is missed on other devices | Doorbell store is local/Upstash; this would be a small notify, not a second chat. |

### Never Zapier

- Social publish  
- Magazine/n8n “publish”  
- Gor Gor approval  
- Rewriting Brand DNA  
- Creating GitHub commits of `.env`  
- Fake “AI family replied” messages

If a no-code bus is wanted for **editorial** later, prefer **fixing n8n against locked DNA** over a pile of Zaps — but only after Maya packets exist. Until then, Zapier would automate emptiness.

---

## Family maturity (this audit)

Score 0–10 with evidence, not hope.

| Area | Score | Why |
|------|------:|-----|
| Reasoning / constitution | 8 | Charter, Perspective Protocol, Continuity Pack |
| Research | 3 | MCP mislabeled; Sky not an agent |
| Architecture | 7 | Surfaces, CONNECTIONS, synergy map |
| Coding / ship path | 6 | Vercel works; many family scripts still drafts |
| Planning | 6 | Too many parallel OS docs / draft PRs |
| Tool usage | 4 | Kura CLI yes; Maya/Senti/R CLIs no on main |
| Knowledge freshness | 4 | Vaults manual; learning-log Aug 13 |
| Automation | 2 | n8n unused; Zapier unused; CI is build-only |
| Memory | 4 | Sky M phase 1 only |
| Decision support | 5 | Orchestrator is a keyword helper, not a council |

**Overall:** about **Level 4** as a family OS (multi-step in Cursor; seats partly live).  
**Strongest:** constitution + Gor Gor honesty (no ghost answers).  
**Weakest:** automation + Sky/Maya live wiring.  
**Highest ROI:** keys + merge/close PR #2 + Gor Gor on #8/#9/#10. **Not Zapier.**

---

## Success check (repeat after the next merge pack)

- [ ] `npm run ask:kura -- "ping"` returns Kura, not a missing-key error  
- [ ] Family Table Gor Gor drawer returns a live Simpee line (or honest fallback)  
- [ ] Maya Lab either works (ASI:One) or is hidden — no 404 tools  
- [ ] `/portal` exists only after PR #9 + Gor Gor  
- [ ] Zero Zapier zaps that post to social  
- [ ] `editorial.ts` still unused **or** retokened to lilac before any n8n turn-on
