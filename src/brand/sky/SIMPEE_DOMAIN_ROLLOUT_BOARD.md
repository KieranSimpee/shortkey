# SHORTKEY DOMAIN FEATURE ROLLOUT BOARD

**Source:** Simpee Bro · 2026-07-23 00:31  
**Authority:** Kieran asks **總機** (central dispatcher) to follow this board  
**Scope:** **對表** — operational alignment for DO / DON’T / Gor Gor Review handback  
**Not this doc’s job:** Build all domain pages · unlock `featureLocks` · publish production  

**Related inventory (feature detail, seats):** [`DOMAIN_FEATURE_MATRIX.md`](./DOMAIN_FEATURE_MATRIX.md)  
**Push record:** [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md)  
**Sprint protocol:** [`FAMILY_SPRINT_SONNET5_LEAD.md`](./FAMILY_SPRINT_SONNET5_LEAD.md)  
**Family Table (internal asset packs · v0.5):** [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md)

> **Allocation authority:** This Simpee board is the **DO / DON’T / Review handback** authority.  
> `DOMAIN_FEATURE_MATRIX.md` remains the feature inventory + seat suggestions. When they differ on *what to do now*, **this board wins**.

---

## Global rules (locked)

1. All domains use **ShortKey Draft Design DNA**.
2. Public-facing pages languages: **EN / 繁中 (Traditional Chinese) / KO** — **not** the old JA + 简体 set for this board.
3. No production publish without **Gor Gor Review + Kieran approval**.
4. No payment / signup fee / checkout unless explicitly approved.
5. No internal AI Family architecture, Studio logic, API logic, or private commercial mechanics exposed on public pages.
6. All pushes recorded in **Studio Push Ledger**.
7. Public footer closing: **Powered by our AI family**.
8. **Do not modify `shortkey.live`** — frozen reference; keep current live work; Studio = **read-only** manifest reference only.
9. **Preview only** — do not publish.
10. Return path for every push: **preview links + change notes + Studio Push Ledger entries** → Gor Gor Review.

---

## 總機 dispatch note

| Rule | Lock |
|------|------|
| First wave only | Process **`shortkey.beauty` · `shortkey.studio` · `shortkey.info`** until Simpee allocates further |
| Who executes | **Key / Design Team** execute from this board; other seats support by role |
| Who reviews | **Gor Gor (Simpee)** · then **Kieran** for launch approval |
| Live | **FROZEN** — no code redesign; docs only say frozen |
| After first wave | Wait for Simpee allocation before opening social / store / wtf / fashion / community / club / events / world |

**Language (Coming Soon — updated 2026-07-23):**  
Public Coming Soon locales are now **EN / 繁中 / KO** (`comingSoonMessages.ts`) — board-aligned. See ledger `PUSH-20260723-001`.

---

## Handback checklist (every domain push)

Before asking Gor Gor Review, return:

- [ ] **Preview URL**(s) — local and/or preview deploy (not production claim)
- [ ] **Change notes** — what changed · what did not · locks respected
- [ ] **Studio Push Ledger entry** — all **16 fields** filled (see below / [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md))

Ledger fields (exact):

1. Push ID  
2. Domain  
3. Page / route  
4. Feature name  
5. UI components used  
6. Design DNA version  
7. Copy version  
8. Language version  
9. Asset package version  
10. Preview URL  
11. Owner  
12. Risk level  
13. Gor Gor Review status  
14. Kieran Review status  
15. Launch approval status  
16. Rollback reference  

---

## P0 first wave

### 1 · shortkey.beauty — P0

| Field | Value |
|-------|--------|
| **Audience** | Public / brands / consumers |
| **Main purpose** | Main public beauty entrance and emotional first impression |
| **Design direction** | Most beautiful public face. Pearl, soft lilac, editorial beauty — **not** dark tech |
| **Status** | Draft preview only · No payment · No production launch |

**Required features (Simpee):**

1. Coming Soon hero  
2. “Before I Meet The World” countdown story  
3. Asian beauty global discovery message  
4. Founder / brand invitation CTA  
5. Register for Meeting CTA  
6. Language switcher: **EN / 繁中 / KO**  
7. Mobile-first hero layout  
8. Soft beauty visual DNA  
9. Footer: **Powered by our AI family**

| DO | DON’T |
|----|--------|
| Align Coming Soon to Draft Design DNA (pearl / soft lilac / editorial) | Publish to production without Gor Gor + Kieran |
| Keep appointment / notify CTAs; preview-only surfaces | Unlock shop / category / signup fees / checkout |
| Soft beauty first impression; mobile-first hero | Expose Studio / AI Family internals / API / commercial mechanics |
| Record every push in Studio Push Ledger | Ship JA+简体 as the board language set without a locale pass |
| Footer credit: **Powered by our AI family** | Claim launch / take payment |

**Handback for Gor Gor Review**

- [ ] Preview URL (e.g. local `/` or preview deploy)  
- [ ] Change notes (DNA · copy · CTA · footer · languages)  
- [ ] Ledger entry (16 fields)  
- [ ] Confirm: no payment · no unlock · no Studio leak  

---

### 2 · shortkey.studio — P0

| Field | Value |
|-------|--------|
| **Audience** | Internal only |
| **Main purpose** | ShortKey internal command center |
| **Design direction** | Clean control center — not public-facing. Functional, calm, traceable |
| **Status** | Internal only · Must be protected · No public brand content |

**Required features (Simpee):**

1. Domain Connection Map  
2. Design DNA Registry  
3. Feature Manifest Registry  
4. Studio Push Ledger  
5. Review Queue  
6. Preview link tracker  
7. Approval status tracker  
8. Rollback reference tracker  
9. Protected / internal access only  

| DO | DON’T |
|----|--------|
| Keep `/internal/*` · `noindex` · not linked from public nav | Expose Studio UI, ledger, or review queue on public pages |
| Grow manifest / map / ledger as **internal** tools | Put public brand marketing content in Studio |
| Track previews · approvals · rollback refs | Auto-publish from Studio |
| Read-only reference to `shortkey.live` in manifest | Modify `shortkey.live` from Studio |

**Handback for Gor Gor Review**

- [ ] Preview URL (e.g. `/internal/platform-manifest`)  
- [ ] Change notes (what registries / trackers added)  
- [ ] Ledger entry (16 fields)  
- [ ] Confirm: still internal-only · no public brand content  

---

### 3 · shortkey.info — P1 (first wave with P0)

| Field | Value |
|-------|--------|
| **Audience** | Brand partners |
| **Main purpose** | Brand-facing information and founding brand invitation |
| **Design direction** | Premium Asian beauty invitation — brands feel **selected**, not sold to |
| **Status** | Brand-facing draft · Needs Gor Gor Review before showing externally |

**Required features (Simpee):**

1. Founding Brand invitation page  
2. Featured Brand Wall  
3. Brand Detail Page template  
4. Private Meeting registration CTA  
5. Brand benefits section  
6. FAQ for brand partners  
7. External-safe partnership language  
8. Language switcher: **EN / 繁中 / KO**  
9. No pricing unless approved  

| DO | DON’T |
|----|--------|
| Draft invitation · wall · detail template · meeting CTA | Show pricing / founding fees without approval |
| External-safe partnership language only | Expose internal rates · CTRL Twin · Studio logic |
| EN / 繁中 / KO when public-facing | Publish externally before Gor Gor Review |
| Preview only + ledger | Hard-sell / checkout |

**Handback for Gor Gor Review**

- [ ] Preview URL(s) for invitation / wall / detail / FAQ  
- [ ] Change notes (partnership language · no pricing)  
- [ ] Ledger entry (16 fields)  
- [ ] Confirm: safe for external eyes only after Gor Gor OK  

---

## Remaining domains (shorter tables)

總機 does **not** open these until Simpee allocates. Priority + DO/DON’T only.

### shortkey.social — P1

| | |
|--|--|
| **Purpose** | Creator / influencer entry |
| **Design** | Stylish, creator-first, energetic but still premium |
| **Status** | Draft preview only |
| **DO** | Creator Join · profile preview · collab explain · application · social proof placeholder · EN/繁中/KO · “Join the ShortKey creator circle” CTA |
| **DON’T** | Unapproved creator promises · payment · public Studio leak · publish without Review |

### shortkey.store — P2

| | |
|--|--|
| **Purpose** | Product discovery / future shopping |
| **Design** | Beauty product editorial — clean cards, not marketplace clutter |
| **Status** | Skeleton first |
| **DO** | Discovery grid · brand/category filter · PDP template · story card · try-on/skin placeholder · wishlist/waitlist |
| **DON’T** | Checkout · payment gateway · unlock `productSurface` without approval |

### shortkey.live — P2 · **FROZEN**

| | |
|--|--|
| **Purpose** | Live shopping layer (future) |
| **Design** | Do **not** redesign now. Protect existing work |
| **Status** | **Frozen reference. Do not touch. Do not modify.** |
| **DO** | Keep current live work as frozen reference · Studio **read-only** manifest ref only · future schedule / replay / host flow as placeholders only (docs/concepts) |
| **DON’T** | Modify `shortkey.live` code/surfaces · redesign · Studio write/edit of live · claim production live hub |

### shortkey.wtf — P2

| | |
|--|--|
| **Purpose** | “A Place I Wonder” / Worth The Fight doorway |
| **Design** | Emotional, curious, poetic, human — not corporate |
| **Status** | Kieran-led prototype · not launch-ready until Gor Gor Review |
| **DO** | Wonder landing · story intro · WTF form · cause/emotion · colour shade/name · shareable card concept · moderation queue · Kieran creative lead |
| **DON’T** | Public unmoderated posts · launch claim · corporate sales tone |

### shortkey.fashion — P3

| | |
|--|--|
| **Purpose** | Future UGC / fashion-adjacent discovery |
| **Design** | Minimal, stylish, B/W + lilac accent, still ShortKey |
| **Status** | Placeholder only · not priority |
| **DO** | Route skeleton · moodboard / UGC / crossover placeholders · waitlist · language structure ready |
| **DON’T** | Full build · payment · steal first-wave capacity |

### shortkey.community — P3

| | |
|--|--|
| **Purpose** | Editorial / blog / story / community |
| **Design** | Magazine-like, soft, readable, premium |
| **Status** | Placeholder only · not priority |
| **DO** | Editorial landing skeleton · ritual/brand story templates · community signup placeholder · future comments placeholder · language structure |
| **DON’T** | Full community product · unmoderated public comments as launch |

### shortkey.club — P3

| | |
|--|--|
| **Purpose** | Membership / loyalty layer |
| **Design** | Exclusive but soft — not aggressive sales |
| **Status** | Concept placeholder only |
| **DO** | Club landing skeleton · benefits placeholder · waitlist · tier concept placeholder |
| **DON’T** | Pricing · subscription · payment language |

### shortkey.events — P3

| | |
|--|--|
| **Purpose** | Campaigns / launches / events / registration |
| **Design** | Clear, event-focused, premium invitation |
| **Status** | Draft skeleton only |
| **DO** | Event landing skeleton · calendar placeholder · registration / RSVP concepts · brand event template · shared RegistrationForm · language structure |
| **DON’T** | Paid ticketing without approval · publish unfinished event hub |

### shortkey.world — P4

| | |
|--|--|
| **Purpose** | Global expansion layer |
| **Design** | Global, clean, aspirational — not too much detail yet |
| **Status** | Reserved for later phase |
| **DO** | Global landing placeholder · region map concept · expansion story · regional template · partner waitlist · language routing concept |
| **DON’T** | Build full multi-region commerce now · divert first wave |

---

## Studio Push Ledger

**Lives at:** [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md)  
**Rule:** Every design or feature push to any domain **appends** one entry with the **16 fields** above.  
**Studio UI:** When Studio gains a Push Ledger module, this markdown remains the durable SSOT until a protected internal UI replaces it (still internal-only).

---

## Family note

對表就夠。總機先波 **beauty · studio · info**。**live 凍結**。預覽、改動說明、Ledger → Gor Gor Review。唔好一次做晒全部。
