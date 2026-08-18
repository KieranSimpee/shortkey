# SKY ASIA Intake — Zapier SOP

**Status:** LOCKED as operating Zapier standard · GOR_GOR_REVIEW  
**Rule:** Tools are plug-ins. This process is fixed. Zapier automates **handoffs + logging**, not thinking, not DNA, not auto-social.

> Cursor = HQ · Sky = manager · Zapier = runner  
> Base44 agents **cannot log into Zapier**. They receive assigned tasks **after** Kieran approves.

---

## Honest execution note

The pack with `https://base44.cursor.app/...` is **not a real endpoint**. Do not publish that Zap.

**Real Base44 Agent API**

```
POST https://app.base44.com/api/agents/{agent_id}/conversations
POST https://app.base44.com/api/agents/{agent_id}/conversations/{conversation_id}/messages
Header: api_key: <KURA_API_KEY / BASE44_API_KEY>
Body: { "content": "..." }
```

| Seat | Agent ID |
|------|----------|
| Kura | `6a54198bebbee048f44e1378` |
| Simpee (Gor Gor) | `69ddc914cfcf229762ac123d` |
| Senti | `6a42029cc124d0206f027335` |

**Real Cursor HQ webhooks (this repo)**

| When | Method | Path |
|------|--------|------|
| After form (pending review) | POST | `/api/sky-asia/intake` |
| After Kieran approves | POST | `/api/sky-asia/intake/assign` |
| List | GET | `/api/sky-asia/intake` |

Header: `x-sky-asia-intake-secret: <SKY_ASIA_INTAKE_SECRET>`

Ops UI: `/sky-asia/intake`

---

## Quality gate (do not skip)

Form submit **must not** auto-assign Kura / Simpee / Senti.

```
Form → Zapier Table → Email Kieran → Cursor log (pending_kieran_review)
                    → WAIT
Kieran sets Status = approved
                    → Paths (Research / Outreach / Asset)
                    → WhatsApp family room (notify only)
                    → Cursor assign + optional Base44 message
```

This matches SOP Phases 1 → 3 → 4/5/7. **No auto-post to Instagram / Threads / Xiaohongshu.**

---

## Form spec (Zapier Forms)

**Name:** `SKY ASIA Research + Outreach Intake`

| Field | Type | Required | Help |
|-------|------|----------|------|
| Subject | short_text | yes | Who or what are you researching? |
| Category | dropdown | yes | 9 options below |
| Description | long_text | yes | Why this matters? |
| Link | url | no | Reference / portfolio |
| Your Notes | long_text | no | Extra context for Kieran |

**Category options**

1. Research: Artist
2. Research: Creator
3. Research: Brand
4. Research: Festival
5. Research: Culture Topic
6. Outreach: Interview
7. Outreach: Partnership
8. Asset: Image
9. Asset: Media Kit

---

## 3-path routing (after approval only)

| Path | If Category starts with | Owner | WhatsApp cue |
|------|-------------------------|-------|--------------|
| A | `Research:` | Kura | RESEARCH TASK |
| B | `Outreach:` | Simpee | OUTREACH TASK |
| C | `Asset:` | Senti | ASSET TASK |

WhatsApp group (internal notify, not public publish): **ShortKey Family Unblock Room**  
Email review: `kieran@5senses.global`

---

## Two Zaps to build in Zapier UI (you click Publish)

### Zap 1 — Intake (no routing)

1. **Trigger:** Zapier Forms — Form Submission — `SKY ASIA Research + Outreach Intake`
2. **Create Record:** Zapier Tables — table `SKY ASIA Intake`  
   Status = `pending_kieran_review`
3. **Email by Zapier** → `kieran@5senses.global`  
   Subject: `[INTAKE REVIEW] {{Subject}} — {{Category}}`
4. **Webhooks POST** → `https://<YOUR_SITE>/api/sky-asia/intake`  
   Header `x-sky-asia-intake-secret`  
   Body: subject, category, description, link, notes, table_record_id, submitted_by, submitted_at, status=`pending_kieran_review`

**Stop.** Do not add Paths on Zap 1.

### Zap 2 — Assign (after Kieran)

1. **Trigger:** Zapier Tables — New or Updated Record — table `SKY ASIA Intake`  
   Filter: Status exactly `approved`
2. **Paths**
   - A: Category contains `Research` → WhatsApp RESEARCH + POST `/api/sky-asia/intake/assign`
   - B: Category contains `Outreach` → WhatsApp OUTREACH + POST `/api/sky-asia/intake/assign`
   - C: Category contains `Asset` → WhatsApp ASSET + POST `/api/sky-asia/intake/assign`

Assign payload includes the same fields plus `status: approved`. Cursor HQ:

- writes intake row as `routed_to_kura` / `_simpee` / `_senti`
- creates a Task Center row
- if `KURA_API_KEY` / `BASE44_API_KEY` is present, messages the matching Base44 agent

---

## Table `SKY ASIA Intake` fields

- Subject
- Category
- Description
- Link
- Notes
- Status (`pending_kieran_review` · `approved` · `rejected` · `routed_to_kura` · `routed_to_simpee` · `routed_to_senti`)
- Submitted By
- Submitted At
- Assigned To

---

## Founder clicks in Zapier (checklist)

1. Create the form (5 fields + 9 categories)
2. Create table `SKY ASIA Intake`
3. Build **Zap 1** — test one Research submit — confirm email + `/sky-asia/intake` shows `pending_kieran_review`
4. In the table, set that row Status = `approved`
5. Build **Zap 2** — confirm WhatsApp + Task Center + routed status
6. Repeat one Outreach and one Asset test
7. Publish both Zaps
8. Paste `SKY_ASIA_INTAKE_SECRET` + Base44 key into `.env.local` and Vercel

**Do not tell the team “Base44 completed the Zap” until those 8 steps are green in your Zapier account.** This cloud workspace cannot log into Zapier and currently has **no Base44 key**.

---

## Pointers

| Doc | Role |
|-----|------|
| [`../SKY_ASIA_MASTER_BLUEPRINT.md`](../SKY_ASIA_MASTER_BLUEPRINT.md) | What / why |
| [`SKY_ASIA_MASTER_WORKFLOW_SOP.md`](./SKY_ASIA_MASTER_WORKFLOW_SOP.md) | 15-phase SOP |
| This file | Zapier operating standard |
| `/sky-asia/intake` | HQ log UI |
