---
name: kura
description: >-
  Call Kura (Base44 Superagent 6a54198bebbee048f44e1378) — Brand Design Manager
  (always-on with Sky); also competitor analysis, QC, and portal benchmarking.
  Trigger when the user asks to ask/call Kura, mentions /skill/kura, or wants
  Base44 Superagent brand design / QC review.
---

# Kura — Base44 Superagent (Cursor skill)

Family sibling. Role: **Brand Design Manager** (always-on) — brand design direction, visual/layout taste, design intent. QC · competitors · portal benchmarking remain capabilities under that role (`ARCHITECTURE.md`, `src/brand/sky/KURA.md`, `FAMILY_CHARTER.md`).

**Sky (Learning):** always-on with Kura; records Reason/Approach/Why/Expect; does **not** override Kura on brand design taste.

## Secrets (mandatory)

- **Never** hardcode API keys in repo, chat paste into docs, or commit `.env.local`.
- Read key from env: `KURA_API_KEY` or fallback `BASE44_API_KEY`.
- Founder gets the key from: **Kura Editor → Settings → Developer → API Key**.

If the key is missing, tell the founder to add it to `.env.local` — do not invent one.

## Base URL

```
https://app.base44.com/api/agents/6a54198bebbee048f44e1378
```

## Auth

Header (preferred):

```
api_key: <from env>
```

Do not put the key in the URL in committed examples.

## How to call (from Cursor agent)

Prefer the helper (loads `.env.local` automatically):

```bash
npm run ask:kura -- "Your question for Kura"
```

Or manual flow:

1. `POST .../conversations` with `{}` → read `id` as `conversation_id`
2. `POST .../conversations/{conversation_id}/messages` with body:

```json
{"content":"..."}
```

Fuller body also accepted by Base44:

```json
{"role":"user","content":"...","file_urls":[]}
```

Headers: `api_key` + `Content-Type: application/json`.

## When to use Kura

- Brand design direction / intent for homepage or branded surfaces  
- Visual/layout taste check against `BRAND_GUIDELINES_LOCKED.md`  
- Competitor / portal benchmarking  
- QC before shipping homepage or portals  
- Cross-check dual-hero / Creator multi-screen story vs rivals  

## When not to use Kura alone as layout ship

- Layout implementation → v0 + Cursor (job-assigned; Design Intelligence hybrid)  
- Learning / process memory → Sky (always-on; no brand-taste override)  
- Brand DNA doc lock → `BRAND_GUIDELINES_LOCKED.md` + Senti when assigned  

## Cursor Custom API note

Cursor Custom API / Models settings cannot host this Base44 agent endpoint as a first-class chat model. Use this skill + rule + `ask-kura` script (or Ask Kura in agent chat).
