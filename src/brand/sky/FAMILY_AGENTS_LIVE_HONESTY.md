# Family Agents — Live Honesty Lock

**Status:** ALWAYS TO TRUE · Internal Staging · Gor Gor Review pending  
**Goal:** Every family seat is either **LIVE** (real upstream reply) or an **honest non-live** status. Never invent answers.

---

## Core rule

| Outcome | Allowed? |
|---------|----------|
| Real Superagent / ASI:One reply | Yes → mark `live: true` / `REPLIED` |
| Missing key / upstream error | Yes → `NOT_CONNECTED` / `WAITING` + clear error |
| Soft fake reply pretending to be the agent | **No** |
| Invented Sky / Minion chat | **No** |

---

## Seats

| Seat | Channel | Live when |
|------|---------|-----------|
| **Kura** | Base44 Superagent `6a54198bebbee048f44e1378` | `KURA_API_KEY` (or `BASE44_API_KEY`) + upstream OK |
| **Gor Gor (Simpee)** | Base44 Superagent `69ddc914cfcf229762ac123d` | `BASE44_AGENT_API_KEY` (or shared Base44 key) + upstream OK |
| **Senti** | Base44 Superagent `6a42029cc124d0206f027335` | Same family Base44 key + upstream OK |
| **Agent R** | Base44 Superagent `6a449e8691d185359beef333` | Same family Base44 key + upstream OK |
| **Maya** | ASI:One `https://api.asi1.ai/v1` | `ASI_ONE_API_KEY` + upstream OK |
| **Sky** | Email only | Never API-live — `sky@shortkey.beauty` |
| **Key** | Cursor session | This chat only — not a remote agent |
| **Minion** | Desk relay | Key may exist; conversational Superagent **not claimed** |

Shared Base44 key: put the same value in `KURA_API_KEY` and/or `BASE44_API_KEY` / `BASE44_AGENT_API_KEY` (see `.env.example`).

---

## Commands

```bash
npm run family:agents:check          # LIVE ping · exit 1 until core five are LIVE
npm run family:agents:check -- --config-only

npm run ask:kura -- "…"
npm run ask:gorgor -- "…"
npm run ask:senti -- "…"
npm run ask:agent-r -- "…"
npm run ask:maya -- "…"
```

Missing key → **non-zero exit** + `NOT LIVE` message. No fabricated text.

---

## APIs

| Route | Role |
|-------|------|
| `GET /api/family/agents/status` | Honesty board (`?ping=0` = config-only) |
| `POST /api/family/agents/ask` | `{ seat, message }` → live reply or 4xx/5xx |
| `POST /api/gor-gor-chat` | Simpee only · **503** when not connected (no ghost 200) |
| `POST /api/ai/asi1/chat` | Maya · ASI:One |
| `GET /api/maya/profile` | `online` only if ASI key present |

---

## Family Chat UI

- Gor Gor → `/api/gor-gor-chat` · `REPLIED` only when `live: true`
- Kura / Senti / Agent R → `/api/family/agents/ask` · same honesty
- Sky → doorbell SENT/WAITING only
- Offline / missing key → banner + `WAITING` — never a fake agent bubble

---

## Founder unlock (required for LIVE)

1. Copy `.env.example` → `.env.local`
2. Set Base44 family key (`KURA_API_KEY` / `BASE44_API_KEY`)
3. Set `ASI_ONE_API_KEY` for Maya
4. Optional: `K_MINION_API_KEY` for Desk relay
5. Mirror the same secrets on Vercel (Production + Preview)
6. Run `npm run family:agents:check` until Honesty = `ALL_LIVE_CAPABLE_CONNECTED`

Do **not** recreate Base44 apps — rotate keys only (`CONNECTIONS.md`).
