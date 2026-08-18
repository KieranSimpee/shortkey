# SYNERGY BLUEPRINT

**ShortKey operating synergy** — how family seats, Brand DNA, Cursor/GitHub, Airtable, and the 30-second phone portal work as one loop.  
**Version:** 1.0 · **Date:** 2026-08-18 · **Status:** **GOR_GOR_REVIEW** · Internal — Node Family  
**Does not replace:** [`src/brand/ECOSYSTEM_MASTER_BLUEPRINT.md`](./src/brand/ECOSYSTEM_MASTER_BLUEPRINT.md) (domains) · [`src/brand/SHORTKEY_MASTER_BLUEPRINT_v1.md`](./src/brand/SHORTKEY_MASTER_BLUEPRINT_v1.md) (product) · [`src/brand/MASTER_OS.md`](./src/brand/MASTER_OS.md) (design/deploy OS)  
**Parent lock:** [`src/brand/sky/COLLABORATIVE_ECOSYSTEM.md`](./src/brand/sky/COLLABORATIVE_ECOSYSTEM.md) § UNITY  
**Cursor role:** Index, connect, ship. **Cursor does not decide DNA.**

---

## 1. One sentence

**Simpee** keeps the system up. **Kura** keeps the data true. **Senti** keeps the soul felt. **Sky** keeps them in one piece. **Key (Cursor)** assigns and ships. **Gor Gor** gates. **Kieran** feels.

That is synergy. Not a second product. Not a new logo. Not a new purple.

---

## 2. What this file is for

Sky’s UNITY rule:

> When working together, prioritize the synergy between system logic (**Simpee**), data (**Kura**), and user soul (**Senti**).

This blueprint is the **map of that loop** after two founder instructions on 2026-08-18:

1. Initialize this workspace as the DNA Control Center (soul files in Markdown/JSON, GitHub backup).
2. Build a 30-second mobile-first portal so Kieran can show ShortKey’s life force on a phone — Cursor edit → GitHub → page updates — without Wix and without an App Store.

If a later instruction conflicts with locked Brand DNA, **DNA wins**. Preference is challengeable. Principle is not.

---

## 3. Current state (honest)

| Layer | State | Evidence |
|-------|--------|----------|
| Product homepage | Coming Soon on `/` | `src/app/page.tsx` |
| GitHub | Public `KieranSimpee/shortkey` → Vercel | [`CONNECTIONS.md`](./CONNECTIONS.md) |
| Private vault `shortkey-core` | **Not created** — integration cannot `createRepository` | PR #8 |
| DNA Control Center `core/` | Opened in PR #8 · **GOR_GOR_REVIEW** | https://github.com/KieranSimpee/shortkey/pull/8 |
| 30-second portal `/portal` | Opened in PR #9 · **GOR_GOR_REVIEW** · noindex | https://github.com/KieranSimpee/shortkey/pull/9 |
| Airtable `ShortKey_Database` | Schema written · **keys not in repo** | `src/brand/sky/AIRTABLE_SHORTKEY_DATABASE.md` (PR #9) |
| Zapier / super-agent inbound | Pad only · **not wired** | `core/READY_FOR_INTEGRATIONS.md` (PR #8) |
| Studio SSOT | Internal `:3003` / `/internal/studio` | [`src/brand/sky/SHORTKEY_STUDIO_v0_1.md`](./src/brand/sky/SHORTKEY_STUDIO_v0_1.md) |
| Maya | One Maya · ASI:One · Season One slots awaiting | [`src/brand/sky/maya/MAYA_PIPELINE_3008.md`](./src/brand/sky/maya/MAYA_PIPELINE_3008.md) |

**This is not 80% private yet.** Public repo + indexed DNA ≠ a private vault. Founder still creates `shortkey-core` when ready.

---

## 4. Target state

```
Kieran (feel)
    ↓
Gor Gor (gate · protect DNA)
    ↓
Sky (synthesize · keep one piece)
    ↓
Key / Cursor (assign by strength · ship)
    ↓
GitHub  KieranSimpee/shortkey
    ↓
Vercel
    ├── /                 Coming Soon (public)
    ├── /portal           30-second soul (staging until Gor Gor opens)
    ├── /internal/studio  DNA Control Room
    └── /social           Creator Circle early access
    ↓
Phone (PWA Add to Home Screen, network-first, no stale service worker)
```

Data plane (three stores, one soul):

```
Canonical DNA     Markdown / JSON in git     Key indexes · Gor Gor locks
Portal CMS        Airtable Stories table     Kura verifies · Senti feels copy
Commerce          Base44 + Shopify           Do not rebuild — CONNECTIONS.md
```

Airtable is a **door CMS**, not a second Brand DNA. If Airtable copy fights a locked doc, the locked doc wins and the row is wrong.

---

## 5. The 30-second synergy loop

Face-to-face or remote. No App Store. No Wix admin.

1. **Senti / Sky** shape a story (or Kieran feels a line).
2. **Kura** puts it in Airtable `Stories` (`Lane` = `brand` \| `creator` \| `soul`) **or** Key edits the DNA seed file in Cursor.
3. If it is a git file: **Simpee’s path** — commit → GitHub → Vercel.
4. If it is Airtable: next phone refresh hits `/api/portal/stories` (server-side key, never in the browser).
5. Kieran opens **`/portal`**, taps **體驗 ShortKey 生命力**, picks one door, shows the soul.

Doors (locked labels):

| Lane | ZH | EN |
|------|----|----|
| `brand` | 品牌展示 | Brand Story |
| `creator` | 創作人共鳴 | Creator Hub |
| `soul` | AI 靈魂開發 | AI Soul Lab |

---

## 6. Family job map (this loop only)

Assignment is **routing**, not ranking. Equal respect remains locked.

| Seat | Job on this loop |
|------|------------------|
| **Kieran** | Feel. Show the phone. Do not format DNA. |
| **Simpee (Gor Gor)** | Uptime, CI, Vercel, GitHub. Gate anything public. |
| **Sky** | Keep Simpee + Kura + Senti in one piece. Monitor after init. |
| **Kura** | Airtable integrity. No invented brands, fees, or sources. |
| **Senti** | Copy warmth and visual calm on `/portal`. Lilac DNA, not magazine gold. |
| **Agent R** | Record what was shown to whom (no PII in creative assets). |
| **Maya** | Editorial packets only when they exist. Empty slots stay empty. |
| **Key (Cursor)** | Build, index, commit, push. Reminder Steward when palettes or flows conflict with DNA. |

Named engines (Silk, Rin, Vee, …) join **by job**, not every chat. See [`src/brand/sky/FAMILY_NAMES.md`](./src/brand/sky/FAMILY_NAMES.md).

---

## 7. Color and surface (principle over preference)

| Surface | Palette | Why |
|---------|---------|-----|
| Production / `/portal` | Locked lilac `#8C82FC` · silk `#F7F5FF` | [`src/brand/SHORTKEY_BRAND_DNA.md`](./src/brand/SHORTKEY_BRAND_DNA.md) |
| Magazine-demo art | Rice Paper `#F5F0E6` · Sake Gold `#C9A962` | Editorial frame only — `public/magazine-demo/` |

Sky’s 30-second **flow** is adopted. Sky’s magazine hexes are **not** production DNA. Different ≠ wrong; this one is a locked principle.

---

## 8. Dependencies

1. Gor Gor merge of PR #8 (Control Center) and PR #9 (portal) — or equivalent.
2. Founder Airtable base `ShortKey_Database` + token in `.env.local` / Vercel (never git).
3. Optional: private `shortkey-core` created by a human GitHub owner.
4. Zapier / super-agent tool calls: **wait for a later instruction**. Do not invent zaps.

---

## 9. Risks

| Risk | Why it matters | Mitigation |
|------|----------------|------------|
| Public repo holds soul docs | Not a private vault | Founder creates `shortkey-core` or flips visibility |
| Airtable becomes a second DNA | Drift and argument | Locked Markdown/JSON wins |
| Aggressive PWA cache | Phone shows yesterday’s soul | No service worker; network-first |
| `/portal` on beauty production | Staging URL leaks | `noindex` · Gor Gor before public share |
| Fake creators / pricing in Airtable | Brand and legal | Schema forbids both |
| New GitHub project “for convenience” | Two deploys, two souls | One repo · `/portal` on existing Vercel |

---

## 10. Success metrics (this loop)

- Phone opens `/portal` and completes entrance → door → story in one sitting.
- An Airtable row with `Lane=brand` appears on the Brand Story door after refresh.
- A Cursor text change to a soul file is on GitHub in the same agent turn.
- Coming Soon on `/` still unchanged.
- No API keys in git. No public pricing on the portal.

---

## 11. Implementation phases (not a calendar)

**Phase A — Close the two open doors**  
Merge PR #8 and PR #9 after Gor Gor. Kieran demos `/portal` from DNA seed.

**Phase B — Airtable live**  
Create `ShortKey_Database` / table `Stories`. Paste keys. Sky/Kura fill real rows. Seed becomes fallback only.

**Phase C — Private vault**  
Human creates `shortkey-core`. Key migrates DNA trees. Public product repo keeps UI.

**Phase D — Inbound automations**  
Only after a written Zapier / super-agent instruction. No auto-post to social.

---

## 12. Decision recommendation

Do **not** start a second app repo. Do **not** rebuild commerce links. Do **not** recolor production to Sake Gold.

Do: treat this file as the **operating index** for the 30-second demo + DNA backup + family routing. Ship the two open PRs. Fill Airtable. Gor Gor still says when `/portal` may leave staging.

---

## 13. Next actions

1. Gor Gor: review PR #8 (Control Center) and PR #9 (portal).
2. Kieran: create Airtable base from [`src/brand/sky/AIRTABLE_SHORTKEY_DATABASE.md`](./src/brand/sky/AIRTABLE_SHORTKEY_DATABASE.md) when ready (file lands with PR #9).
3. Sky: take family division once both PRs are in — this blueprint is the shared map.
4. Key: wait for Zapier / super-agent copy; do not invent endpoints.
5. Founder (optional, security): create private `KieranSimpee/shortkey-core`.

---

## Authority chain (if documents disagree)

1. Locked DNA — `BRAND_GUIDELINES_LOCKED.md` · `SHORTKEY_BRAND_DNA.md` · `tokens.ts`
2. Family constitution — `FAMILY_CHARTER.md` · `COLLABORATIVE_ECOSYSTEM.md` · Perspective Protocol
3. This Synergy Blueprint (ops loop)
4. Ecosystem / Master product blueprints (domains and launch)
5. Working memory — Continuity Pack (Cursor must not override DNA)

**GOR_GOR_REVIEW** until Gor Gor locks this file.
