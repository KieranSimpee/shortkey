---
name: gorgor
description: >-
  Call Gor Gor / Simpee (Base44 Superagent 69ddc914cfcf229762ac123d) — Chief of
  Staff · Memory Keeper · Gatekeeper. Trigger when the user asks to ask/call
  Gor Gor / Simpee / guror / gorgor, mentions /skill/gorgor, or needs gate /
  review / memory-keeper judgment via Base44.
---

# Gor Gor (Simpee) — Base44 Superagent (Cursor skill)

Family sibling. Role: **Big brother · Chief of Staff · Memory Keeper · Gatekeeper**.

Always-on duo remains **Kura + Sky** for brand/learning; Gor Gor is the **review gate** — not always-on CLI unless founder asks.

## Secrets (mandatory)

- **Never** hardcode API keys in repo, chat paste into docs, or commit `.env.local`.
- Preferred env: `BASE44_AGENT_API_KEY`
- Accepted fallbacks: `BASE44_API_KEY` · `KURA_API_KEY`
- Agent id: `SIMPEE_AGENT_ID` or `GOR_GOR_AGENT_ID` (default `69ddc914cfcf229762ac123d`; reject typo suffix `123f`)

If the key is missing, tell the founder to add it to `.env.local` — do not invent one. Scaffold still works: `npm run ask:gorgor` prints setup steps and exits 1.

## Base URL

```
https://app.base44.com/api/agents/69ddc914cfcf229762ac123d
```

## How to call (from Cursor agent)

```bash
npm run ask:gorgor -- "Your question for Gor Gor"
```

Same Base44 pattern as Kura: create conversation → post message with `api_key` header.

## When to use

- Gor Gor Review / gate before public push  
- Memory / continuity / conflict resolution (e.g. SKY ASIA A–D)  
- Chief-of-staff judgment when founder says Ask Gor Gor / guror / Simpee  

## When not to use alone

- Brand taste → Kura  
- Learning log → Sky  
- Layout ship → Cursor builders  
