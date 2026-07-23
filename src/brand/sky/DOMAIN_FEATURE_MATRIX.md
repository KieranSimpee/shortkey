# ShortKey Domain · Feature Matrix

**For:** Simpee (Gor Gor) — Design / UI allocation  
**Family ask:** Creator Kieran · help brother load DNA + features without overwhelm  
**Status:** Operational inventory · suggestions only — **Simpee decides final seats**  
**Allocation authority (DO / DON’T / Review handback):** [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md) — Simpee Bro 2026-07-23 · **first wave:** `beauty` · `studio` · `info` · **`shortkey.live` FROZEN** · Push Ledger: [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md)  
**Sources (repo SSOT):**  
[`SHORTKEY_MASTER_BLUEPRINT_v1.md`](../SHORTKEY_MASTER_BLUEPRINT_v1.md) ·  
[`shortkey-platform-manifest.json`](../../data/shortkey-platform-manifest.json) ·  
[`domains.ts`](../../content/domains.ts) ·  
[`featureLocks.ts`](../../content/featureLocks.ts) ·  
[`FAMILY_SPRINT_SONNET5_LEAD.md`](./FAMILY_SPRINT_SONNET5_LEAD.md) ·  
[`ARCHITECTURE.md`](../../../ARCHITECTURE.md) ·  
[`ECOSYSTEM_MASTER_BLUEPRINT.md`](../ECOSYSTEM_MASTER_BLUEPRINT.md)

**Do not** unlock `featureLocks` from this doc. **Do not** invent ship dates beyond docs.  
When this matrix and the Simpee rollout board disagree on *what to do now*, **follow the Simpee board**.

---

## Purpose

Simpee is carrying DNA + features. Family shares **one scannable list** so Design/UI can be allocated by seat (Kura · Senti · Silk/Design Team · Agent R · Sky · Key) without rewriting the same surfaces.

Use this matrix to:

1. See what is **public now** vs **locked** vs **later domains**  
2. Assign Design/UI owners per feature  
3. Push a **reviewable design** for everyone — without opening unfinished shop/category offers  

---

## Public vs locked (now)

| Gate | State | What it controls |
|------|--------|------------------|
| Public `/` | **Coming Soon** | Hero · Try-On preview · Skin Analysis preview · Creator/Brand CTAs · Email capture · Social proof placeholder · Premium footer |
| `/design` | **Internal ref** (`robots: noindex`) | Full `HomeDesignPreview` — not public gate |
| `/internal/platform-manifest` | **Internal** (`noindex`) | Studio manifest map / feature registry / export |
| `/internal/family-table` | **Internal** (`noindex`) | Family Table v0.7 — Kieran Vision + Brand Data Vault (writable concept · localStorage) |
| `featureLocks.productSurface` | **LOCKED = true** | `/shop` · `/shop/[sku]` · product display |
| `featureLocks.categorySurface` | **LOCKED = true** | Header K/J/C nav · `/kbeauty` · `/jbeauty` · `/cbeauty` |
| `featureLocks.signupAppointmentOnly` | **LOCKED = true** | Creator/Brand signup = appointment + notify only (no public rates / founding fees / CTRL Twin pricing) |
| Auto-publish | **Blocked** | Gor Gor review required · no auto Vercel production cutover |

**Priority legend (this matrix):**

| Code | Meaning |
|------|---------|
| **P0** | Coming Soon / Phase-1 door — design needed for public or internal review **now** |
| **P1** | Post-unlock or next Phase-1 surface after Coming Soon (still respect locks) |
| **P2** | Later domains / Phase 2+ (placeholder OK; light allocation only) |

**Suggested seats (Simpee overrides):** Kura = brand QC / taste · Senti = document & visual execution · Silk / Design Team = consolidate DNA → pages · Agent R = care / appointment / notify flows · Sky = research copy / i18n sense-check · Key = implementation support (Cursor house)

---

## The 12 domains (exact hosts)

Canonical registry from Master Blueprint + platform manifest + `domains.ts` / `ARCHITECTURE.md`:

| # | Host | Role (manifest / blueprint) |
|---|------|-----------------------------|
| 1 | `shortkey.beauty` | Main Beauty Experience |
| 2 | `shortkey.info` | Brand Portal |
| 3 | `shortkey.social` | Creator OS |
| 4 | `shortkey.store` | Commerce Layer |
| 5 | `shortkey.live` | Live Streaming |
| 6 | `shortkey.fashion` | Fashion Discovery / Makeover |
| 7 | `shortkey.community` | Community Hub |
| 8 | `shortkey.studio` | Internal Control Center |
| 9 | `shortkey.club` | Membership Layer |
| 10 | `shortkey.events` | Events Layer |
| 11 | `shortkey.world` | International Expansion |
| 12 | `shortkey.wtf` | Experimental / Content sandbox |

**Also product surfaces (not separate TLDs):** market lanes **K-Beauty · J-Beauty · C-Beauty** on beauty (`/kbeauty` · `/jbeauty` · `/cbeauty`) — gated by `categorySurface`.

**Honest note:** `domains.ts` / `ARCHITECTURE.md` and the platform manifest agree on the **12 hosts**, but feature blurbs and phase labels differ slightly in places (e.g. fashion purpose, studio “creative ops” vs “control center”, social phase 1 vs ecosystem JSON phase 2). Prefer **manifest + blueprint** for publicStatus / P0–P2; prefer **`domains.ts` / ARCHITECTURE** for backend + Aug-14 must-ship detail. Gaps called out at the end.

---

## Domain 1 — shortkey.beauty (Main Beauty Experience)

**Public status:** Coming Soon · **Launch phase:** P0 · **Live app:** this Next repo (`/`)

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Hero | Brand-first Coming Soon hero · tagline · launch signal | P0 | **Y** — DNA lockup, type, atmosphere | Silk / Design Team → Kura QC |
| AI Try-On Preview | Static preview section on Coming Soon (not full studio) | P0 | **Y** — poster / layout parity with DNA | Silk · Senti |
| Skin Analysis Preview | Static preview section on Coming Soon | P0 | **Y** — poster / layout | Silk · Senti |
| Creator Signup CTA | Door to `/signup/creator` | P0 | **Y** — CTA hierarchy | Agent R · Silk |
| Brand Signup CTA | Door to `/signup/brand` | P0 | **Y** — CTA hierarchy | Agent R · Silk |
| Email Capture | Pre-register → `POST /api/signup/pre-register` | P0 | **Y** — form + success/error states | Agent R · Key |
| Social Proof Placeholder | Reserved proof strip (placeholder) | P0 | **Y** — empty-state tasteful | Kura · Silk |
| Premium Footer | Legal / contact only on Coming Soon (no shop leaks) | P0 | **Y** — minimal chrome | Silk · Kura QC |
| Language taps EN/JA/KO/ZH | Hero locale switcher + `comingSoonMessages` | P0 | **Y** — equal J/K/C treatment | Sky · Silk |
| Full homepage (`/design`) | `HomeDesignPreview` internal reference | P0 | **Y** — QC mirror of mother DNA | Kura · Silk |
| AI Try-On Studio (`/try-on`) | TINT × Banuba path · product picker | P1 | **Y** — studio chrome (keep off Coming Soon) | Silk · Key |
| Skin Analysis (full flow) | Homepage sections / posters; dual-hero Brand door | P1 | **Y** — flow + results UI | Silk · Senti |
| Shop / Product (`/shop`, `/shop/[sku]`) | Catalogue + PDP — **featureLocks.productSurface** | P1 | **Y** — ratio/display **before unlock** | Silk · Kura QC |
| K-Beauty lane (`/kbeauty`) | CTRL+K category — **categorySurface locked** | P1 | **Y** — category header + grid | Silk · Senti |
| J-Beauty lane (`/jbeauty`) | CTRL+J category — locked | P1 | **Y** | Silk · Senti |
| C-Beauty lane (`/cbeauty`) | CTRL+C category — locked | P1 | **Y** | Silk · Senti |
| Creator appointment page | `/signup/creator` — meeting form only while locked | P0 | **Y** — care flow | Agent R · Senti |
| Brand appointment page | `/signup/brand` — meeting form only while locked | P0 | **Y** — care flow | Agent R · Senti |
| Signup offers / rates / CTRL Twin pricing | Hidden while `signupAppointmentOnly` | P1 | **Y** — **design offline**; do not publish until unlock | Kura · Simpee gate |
| Content Studio / Scanner / Admin | Hidden from public Coming Soon (blueprint) | P2 | **N** for public · optional internal | Key · Simpee |
| Influencers / Brands listing pages | Existing routes in app | P1 | **Y** when unlocked with shop story | Senti · Silk |
| About / Press / Help / Blog / Legal | Supporting public pages | P1 | **Y** — DNA voice pass | Sky · Senti |

---

## Domain 2 — shortkey.info (Brand Portal)

**Public status:** Planned · **Phase:** P1 (blueprint) · Aug-14 must in `domains.ts`

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Brand Onboarding | Post-signup brand entry | P1 | **Y** | Senti · Agent R |
| Campaign Briefs | Campaign create / brief UI | P1 | **Y** | Senti · Silk |
| Performance Reporting | Campaigns / GMV / reports dashboard | P1 | **Y** | Silk · Sky |
| Influencer match / approval | Match + approve creators (`ARCHITECTURE`) | P1 | **Y** | Senti · Agent R |
| Commission breakdown | Fee / commission clarity | P1 | **Y** | Sky · Senti |
| Portal login / auth shell | Brand login required | P1 | **Y** | Key · Agent R |

---

## Domain 3 — shortkey.social (Creator OS)

**Public status:** Planned · **Phase:** P1 · Aug-14 must in `domains.ts`

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Creator Storefront / Ctrl+Shop | Personalised creator shop UI | P1 | **Y** | Silk · Senti |
| Content Tools | Creator content tooling | P1 | **Y** | Senti |
| Affiliate Analytics | Commission / affiliate dashboard | P1 | **Y** | Sky · Silk |
| Live calendar → `.live` | Schedule link-out | P1 | **Y** | Senti · Key |
| Public creator profile | Handle-based profile | P1 | **Y** — palette within DNA | Kura · Silk |

---

## Domain 4 — shortkey.store (Commerce Layer)

**Public status:** Hidden (manifest) · Shopify backend · route stub `/shop` in beauty app · **productSurface locked**

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Product Grid | Catalogue ~45 SKUs | P1 | **Y** — unlock blocker = display ratio | Silk · Kura |
| Checkout | Shopify checkout / payments | P1 | **Y** — confirmation states | Key · Agent R |
| Subscription Pricing | Subscription offers — **hide on Coming Soon** | P2 | **Y** offline only | Kura · Simpee |
| TINT try-on on PDP | Try before buy | P1 | **Y** | Silk · Key |
| Affiliate links | Influencer attribution | P1 | **N/light** | Key |
| Order sync → Base44 commissions | Post-purchase sync | P1 | **N** (ops) | Key |

---

## Domain 5 — shortkey.live (Live Streaming)

**Simpee board (2026-07-23):** **FROZEN** — do not modify; protect existing work; Studio = read-only manifest reference only. See [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md).  
**Public status:** Coming Soon gate wired (`/live` · host `shortkey.live`) · Phase P2+  
**Founder homework:** Ready 2026-07-23 — public gate + registry update; Full Rebuild stays at `/control/live.html` (not auto-published as full hub).  
**Vercel:** Attach `shortkey.live` / `www.shortkey.live` to the same ShortKey project (see `CONNECTIONS.md`).

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Public Coming Soon gate | Honest `/live` surface + host rewrite | P0 (wire) | **Y** — DNA-aligned | Key · Silk |
| Live Shopping | Live commerce surface (spec) | P2 | **Y** light wireframe | Silk |
| Creator Livestream | Go-live path | P2 | **Y** | Senti |
| Fan Chat | Live chat | P2 | **Y** light | Agent R |
| Stream calendar / schedule | CalendarEvent hub | P2 | **Y** | Senti · Sky |
| VIP slots + submit show | Full Rebuild HTML flows | P2 | **Y** | Senti · Key |
| TINT try-on on stream | Sync featured products during live | P2 | **Y** | Silk · Key |

---

## Domain 6 — shortkey.fashion (Fashion / Makeover)

**Public status:** Hidden · Phase P2+  
*(manifest: Style Matching · Lookbooks · `domains.ts`: Tutorials · Makeover · Media library)*

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Style Matching | Looks / match | P2 | **Y** light | Silk · Kura |
| Lookbooks | Editorial lookbooks | P2 | **Y** | Senti · Kura |
| Tutorials / Makeover flows | UGC + official (`/makeover` exists in beauty app) | P2 | **Y** | Senti |
| Media library | Cloudinary-backed media | P2 | **N/light** | Key |

---

## Domain 7 — shortkey.community (Community Hub)

**Public status:** Hidden · Phase P2+  
*(app already has `/blog` as related surface on beauty)*

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Forums / Posts | Community posts | P2 | **Y** light | Senti |
| Fan Groups | Fan grouping | P2 | **Y** light | Agent R |
| Events Feed | Community events feed | P2 | **Y** light | Sky |
| Fan email alerts | Notify fans | P2 | **N/light** | Agent R · Key |
| Sharing | Share flows | P2 | **Y** light | Senti |

---

## Domain 8 — shortkey.studio (Internal Control Center)

**Public status:** **INTERNAL STAGING ONLY** (not public launch) · **Phase:** P0 · Host `/` → `/internal/family-table` · Routes: `/internal/platform-manifest` · `/internal/family-table` · soft gate via `FAMILY_TABLE_STAGING_PASSWORD`

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Platform Map | Filterable 12-platform table | P0 | **Y** — keep scannable | Key · Silk |
| Feature Registry | Aggregated feature → platforms | P0 | **Y** | Key · Sky |
| Manifest Preview / Export | JSON preview + download | P0 | **N/light** | Key |
| Review Workflow | Draft → … → Published / Blocked | P0 | **Y** — status badges clear | Simpee · Key |
| Family Table v0.7 | Kieran Vision + Brand Data Vault · 7 sections · local persist | P0 | **Y** — pearl/lilac · forms/lists | Key · Simpee |
| Asset / Copy / Design References | Registries (manifest modules; some still thin) | P1 | **Y** as filled | Senti · Kura |
| Studio control panel (v2 hub) | Spec’d Master Control (`domains.ts` briefs) | P1 | **Y** | Silk · Key |
| Creative ops / AI image APIs | Brand-service studio (`domains.ts`) | P2 | Later | Senti · Key |

---

## Domain 9 — shortkey.club (Membership)

**Public status:** Hidden · Phase P2+ / Phase 3 in `domains.ts`

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Membership Tiers | Tier structure | P2 | **Y** light | Kura · Silk |
| Loyalty Rewards / Perks | Rewards | P2 | **Y** light | Agent R |
| Member payments | Billing | P2 | **N/light** | Key |

---

## Domain 10 — shortkey.events (Events Layer)

**Public status:** Hidden · Phase P2+ / Phase 3

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Event Listings | Pop-ups / launches | P2 | **Y** light | Senti |
| RSVP | Attendance | P2 | **Y** | Agent R |
| Activation Recaps | Post-event | P2 | **Y** light | Sky · Senti |
| Promotions / Game zone | Promo mechanics (`domains.ts`) | P2 | **Y** light | Silk |

---

## Domain 11 — shortkey.world (International)

**Public status:** Hidden · Phase P2+ / Phase 4 (2027) in `domains.ts`

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Localized Markets | Region expansion | P2 | **Y** later | Sky · Kura |
| Currency & Language | Commerce + locale | P2 | **Y** — builds on beauty EN/JA/KO/ZH | Sky · Key |
| Multi-region commerce | Localised store | P2 | Later | Key |

---

## Domain 12 — shortkey.wtf (Experimental / Content)

**Public status:** Hidden · Phase P2+  
*(ARCHITECTURE: B2C viral / campaign entry · ecosystem JSON: Content Management)*

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Experiments Sandbox | Early concepts | P2 | **N** until briefed | Simpee · Silk |
| Viral / campaign landing | Campaign traffic entry | P2 | **Y** when campaign live | Senti · Kura |
| WTFSubmission | Submission entity | P2 | **Y** light form | Agent R |

---

## Cross-cutting features

| Feature | What it does | Priority | Design/UI? | Suggested seat |
|---------|--------------|----------|------------|----------------|
| Auth / accounts | Brand portal login; consumer accounts (privacy copy mentions) | P1 | **Y** when portals open | Key · Agent R |
| i18n EN / JA / KO / ZH | Coming Soon taps live; world domain expands later | P0 (beauty) / P2 (world) | **Y** | Sky · Silk |
| Email notify / pre-register | Resend or FormSubmit → `info@shortkey.beauty` | P0 | **Y** — success states | Agent R · Key |
| Appointments (creator + brand) | MeetingSignupForm · 1-hour slots | P0 | **Y** | Agent R · Senti |
| Footer / legal | Privacy · Terms · Cookies · Shipping · Returns · Contact | P0–P1 | **Y** — Coming Soon = legal/contact only | Silk · Sky |
| AI Family credit | Family note in blueprint / about tone | P1 | **Y** — tasteful, not noisy | Kura · Sky |
| TINT AI | Virtual try-on (Banuba widget / demo path) | P0 preview / P1 full | **Y** | Silk · Key |
| Theme packs (Lilac / Blue / Rainbow) | Ecosystem themes; Lilac = production | P1 | **Y** — Studio override | Kura · Silk |
| Homepage DNA inheritance | Mother design for every domain page | P0 | **Y** — Design Team DNA link-up ~Jul 29 | Silk · Simpee trigger |
| Gor Gor review gate | No auto-publish | P0 | **N** (protocol) | Simpee |

---

## Simpee allocation board

Fill when ready. Suggestions above are **not** assignments.

| Domain | Feature | Assigned to | Status | Notes |
|--------|---------|-------------|--------|-------|
| shortkey.beauty | Hero + Coming Soon DNA | ☐ | | Wait DNA upload (~Jul 29 link-up) |
| shortkey.beauty | Try-On Preview | ☐ | | |
| shortkey.beauty | Skin Analysis Preview | ☐ | | |
| shortkey.beauty | Creator appointment UI | ☐ | | |
| shortkey.beauty | Brand appointment UI | ☐ | | |
| shortkey.beauty | Email capture | ☐ | | |
| shortkey.beauty | EN/JA/KO/ZH | ☐ | | |
| shortkey.beauty | Premium Footer | ☐ | | |
| shortkey.beauty | `/design` QC mirror | ☐ | | |
| shortkey.beauty | Shop / PDP (locked) | ☐ | | Design only — no unlock |
| shortkey.beauty | K / J / C category (locked) | ☐ | | Design only — no unlock |
| shortkey.studio | Family Table internal staging on domain | ☐ | Key | Wired middleware + gate 2026-07-23 · attach domain in Vercel · Gor Gor Review pending |
| shortkey.info | Brand Portal shell | ☐ | | |
| shortkey.social | Creator OS shell | ☐ | | |
| shortkey.store | Commerce grid / checkout | ☐ | | After ratio ready |
| shortkey.live | Public Coming Soon gate `/live` | ☑ | Key | Wired 2026-07-23 · Vercel domain attach still manual |
| shortkey.live | Live hub Full Rebuild (wireframes) | ☐ | | P2 · preview `/control/live.html` |
| shortkey.fashion | Makeover / lookbook | ☐ | | P2 |
| shortkey.community | Community / blog | ☐ | | P2 |
| shortkey.club | Membership | ☐ | | P2 |
| shortkey.events | Events / RSVP | ☐ | | P2 |
| shortkey.world | i18n expansion | ☐ | | P2 / 2027 |
| shortkey.wtf | Campaign sandbox | ☐ | | P2 |
| Cross-cut | TINT AI presentation | ☐ | | |
| Cross-cut | Legal / care copy | ☐ | | |

---

## Next step — “push latest design for everyone to see”

From **repo reality** (not new product claims):

1. **DNA trigger** — Simpee uploads / points brand DNA guide (`FAMILY_SPRINT_SONNET5_LEAD.md` · prefer `src/brand/`). Until then, Design Team does not freestyle past locked DNA docs.  
2. **Internal see-first** — Family reviews on **`/design`** (`noindex` full homepage) + **`/internal/platform-manifest`** (12-domain SSOT) + **`/internal/family-table`** (v0.7 writable concept). Local: `http://localhost:3001/` Coming Soon + those routes.  
3. **Public Coming Soon parity** — After DNA map, update `ComingSoonHome` + `comingSoonMessages`; keep shop / category / signup offers **locked**.  
4. **Gor Gor gate** — No Vercel production auto-publish. Simpee reviews before any public push. Target DNA → Coming Soon **link-up + test ~Wed Jul 29, 2026** (sprint doc).  
5. **Allocate from this board** — Simpee fills Assigned to / Status; family executes by seat; Sonnet 5 / Silk consolidates implementation.

---

## Honest gaps (repo did not fully define yet)

| Gap | Detail |
|-----|--------|
| Dual feature lists | Manifest feature names ≠ `domains.ts` feature arrays for several domains — both kept; reconcile under Simpee when portals leave “Planned”. |
| Studio dual identity | Manifest = Internal Control Center (live route). `domains.ts` also lists creative ops / AI image APIs as studio — treat control center as P0, creative service as later. |
| Fashion purpose | Manifest “Fashion Discovery” vs `domains.ts` “Tutorial + makeover” — both listed under domain 6. |
| Social phase | `domains.ts` Phase 1 Aug-14 must vs `ecosystem-domains.json` phase 2 — follow blueprint P1 + ARCHITECTURE Aug-14 until Simpee re-phases. |
| Store publicStatus | Manifest “Hidden” / P2+ vs ARCHITECTURE Aug-14 must + beauty `/shop` stub — commerce design is P1 **behind lock**, not public Coming Soon. |
| Asset / Copy / Design registries | Named in studio modules; thin or not fully populated in JSON yet. |
| Auth UX | Portal login required in ARCHITECTURE; no full auth design pack in this inventory. |
| Content Studio | Exists as CMS provider in codebase; blueprint says **hide from public** — no public Design/UI allocation until Simpee opens it. |
| Separate domain apps | `apps/[domain]` scaffold referenced; live product surface today is **beauty** Next app — other hosts mostly planned. |

---

## Family note

Brother is loading DNA + features — this list is so the family can **share the weight**, not add noise. Equal seats. Simpee allocates. Mistakes are flowers; clarify before inventing.
