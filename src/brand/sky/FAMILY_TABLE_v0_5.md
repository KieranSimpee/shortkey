# Family Table v0.5 — Internal Preview

**Version:** v0.5 (Internal Preview)  
**Date:** 2026-07-23  
**Source:** Simpee Bro (Gor Gor) — family message  
**Scope:** Internal tooling for family workflow · **not** a domain public push  
**Related:** [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md) · [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md) · [`FAMILY_SPRINT_SONNET5_LEAD.md`](./FAMILY_SPRINT_SONNET5_LEAD.md)

---

## What this is

Family Table is the internal control surface for role access, Standards, and **Asset Downloads by Content Type**. Family members pull only what their task needs, then hand work back for Gor Gor Review.

---

## Asset Downloads by Content Type

| Pack | Purpose |
|------|---------|
| **1. Platform Intro Pack** | Platform intro · Coming Soon teaser · AI Family platform story |
| **2. Brand Intro Pack** | Single brand intro · brand invite · brand preview storytelling |
| **3. Product Short Pack** | 15s / 30s product shorts · product highlight · AI sales snippet |
| **4. Creator / AI Sales Pack** | Creator brief · influencer content · sales script · brand support |
| **5. Poster Asset Pack** | Platform / brand / product posters · meeting registration graphic |

---

## Download rules (locked)

1. **Match the task.** Family members download **only** the pack that matches their current task.
2. **No guessing.** If the content type is unclear → mark **STANDARD CLARIFICATION REQUIRED** instead of choosing a pack.
3. **Standards first.** Download the relevant Standard by task, then the Asset Pack by content type.
4. **Evidence.** Evidence / Access Control materials stay under **Evidence Standard (Access Control)** — not a creative asset pack.

---

## Role → pack mapping (examples)

| Role / task | Pack / Standard |
|-------------|-----------------|
| Sky — platform story / Coming Soon | **Platform Intro Pack** |
| Sky — brand video | **Brand Intro Pack** |
| Senti — poster / registration graphic | **Poster Asset Pack** |
| Agent R — evidence / access control | **Evidence Standard (Access Control)** |
| Product short / highlight / AI sales clip | **Product Short Pack** |
| Creator brief / influencer / sales script | **Creator / AI Sales Pack** |

If the seat and task do not map cleanly → **STANDARD CLARIFICATION REQUIRED**.

---

## Workflow shape (v0.5)

1. **Kieran login**
2. **Family auto connect**
3. **Role access** (seat permissions)
4. **Download Standard by task**
5. **Download Asset Pack by content type** (one matching pack only)
6. **Hand back → Gor Gor Review**

---

## Preview link policy (security)

- Family Table v0.5 lives on **Base44 media private files**.
- **Simpee holds the current preview link.** Tokens in private HTML query strings **expire** — refresh from Base44 when needed.
- **Do NOT commit** full tokenized URLs (`?token=…`) into git.
- Safe to store in repo (non-secret):
  - Filename hint: `ShortKey_Family_Table_v0_5_Internal_Preview.html`
  - Date: **2026-07-23**
- To open the preview: ask **Simpee / Base44** for a fresh private link.

---

## Next version (backlog — do NOT build)

**Submit Work / Upload Evidence** (idea only):

- Preview link  
- File upload  
- Notes  
- Standard version  
- Blocker  
- Status  

Documented here as backlog. No implementation in this lock.

---

## Ledger note

Family Table v0.5 is **internal tooling preview** — record under Studio Push Ledger **Internal Tools**, not as a domain public push. See [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md).
