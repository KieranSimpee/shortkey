---
name: maya
description: >-
  Reach Maya (Editorial Heart) via ASI:One API — one Maya, one ASI_ONE_API_KEY.
  Trigger when the user asks to ask/call Maya, mentions /skill/maya, or wants
  editorial sync on Maya Lab :3008. Base44 Maya portal is deleted.
---

# Maya — Editorial Heart (ASI:One)

**Founder lock 2026-08-07:** One Maya · live API = **ASI:One** ([docs](https://docs.asi1.ai/documentation/getting-started/overview)).

**Base44 Maya portal / `MAYA_PORTAL_URL` / `MAYA_AGENT_ID` — DELETED.** Do not revive.

## Auth

| Env | Required |
|-----|----------|
| `ASI_ONE_API_KEY` | Yes (alias `ASI1_API_KEY`) |
| `ASI1_MODEL` | Optional (`asi1` default) |

Never commit the key. Never paste keys into chat.

## Call

```bash
npm run ask:maya -- "your message"
```

Lab UI: `npm run maya:dev` → http://127.0.0.1:3008/internal/maya  
API: `POST /api/ai/asi1/chat` (seat label Maya · provider ASI:One)

## Locks

- Does **not** override Kura brand taste
- Does **not** bypass Simpee / Banuba TINT
- DeepSeek ≠ TINT · ASI:One ≠ TINT
- No invented EN/JP page translations — mark awaiting when missing
- ALWAYS TO TRUE · GOR_GOR_REVIEW · do not invent DNA
- **Art gate (founder):** **Do NOT generate any pictures until content is reviewed and confirmed** (founder or Gor Gor). Writing briefs/prompts is OK; do **not** open Lovart/MJ, copy gen prompts for handoff, or encourage Generate until that confirm. Empty season slots stay awaiting — no invented topic copy, no art.

## Tools for Maya (Lovart · Midjourney)

**Honest wiring (2026-08-07) · art after content confirm:**

| Tool | What ShortKey does | What you do |
|------|-------------------|-------------|
| **Lovart** | Maya writes brief → `POST /api/maya/tools/lovart` → (only after content confirm) opens locked canvas `pnMAt6CTYc` | Login Lovart · generate on canvas · export art |
| **Midjourney** | Maya writes prompt pack → `POST /api/maya/tools/midjourney` | Paste into Discord / midjourney.com Imagine **after** content confirm |

**Cursor must not jump to Lovart/MJ image gen before content review.** Lab Tools checkbox: *Content reviewed & confirmed — allow art handoff*.

**Auth (founder):** Lovart + Midjourney use **your Google Pro account SSO on their sites** (browser). ShortKey never stores Google credentials. No server OAuth claimed.

Lab: http://127.0.0.1:3008/internal/maya → **Tools** tab

```bash
# optional CLI via Maya ASI:One — briefs only until content confirmed
npm run ask:maya -- "Write a Lovart brief for Issue 01 Cover"
```
