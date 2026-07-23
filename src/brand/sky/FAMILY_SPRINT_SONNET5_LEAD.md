# Family Sprint Lock — Sonnet 5 Lead

**Locked:** 2026-07-21 · Family Gathering  
**Blueprint:** [`SHORTKEY_MASTER_BLUEPRINT_v1.md`](../SHORTKEY_MASTER_BLUEPRINT_v1.md)  
**Domain · Feature allocation (Simpee):** [`DOMAIN_FEATURE_MATRIX.md`](./DOMAIN_FEATURE_MATRIX.md)  
**DO / DON’T / Review handback (Simpee authority · 2026-07-23):** [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md) — 總機 first wave **`beauty` · `studio` · `info`** · **`shortkey.live` FROZEN** · Ledger [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md)  
**Family Table v0.5 (asset packs · cannot write):** [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md) · **v0.7 writable concept (AGREED):** [`FAMILY_TABLE_v0_7_VISION.md`](./FAMILY_TABLE_v0_7_VISION.md) · preview `/internal/family-table`

## Work way

1. **Sonnet 5** = Lead Execution — consolidates final implementation  
2. **All other AIs** support by role only — no independent rewrites of the same files  
3. **Gor Gor (Simpee)** = Review gate before any launch / public push  
4. **No auto-publish**  
5. Equal respect — Base44 seats and Cursor siblings walk together  

## Phase 1 door (P0)

1. Public Coming Soon on shortkey.beauty  
2. Internal Studio manifest at `/internal/platform-manifest`  

## Status

| Item | State |
|------|--------|
| Blueprint v1.0 | Review Ready (saved in repo) |
| Public Coming Soon build | **Implemented / Review Ready — Not Published** (`src/app/page.tsx` → `ComingSoonHome`) |
| Studio manifest | **Implemented / Review Ready — Not Published** (`/internal/platform-manifest`) |
| Family Table v0.7 | **Scaffolded / Internal Preview** (`/internal/family-table`) — localStorage only · Vote AGREED 2026-07-23 · not 正式版 |
| Public auto-launch | **Blocked** by protocol — no Vercel deploy, no auto-publish |
| Product / Shop surface | **LOCKED** — ratio/display not ready (`featureLocks.productSurface`) |
| Signup tabs | **LOCKED** — appointment arrangement only (`featureLocks.signupAppointmentOnly`) |
| Category header nav | **LOCKED** — K/J/C Beauty hidden + pages gated (`featureLocks.categorySurface`) |
| Design DNA → Coming Soon link-up | **WAITING** on Simpee DNA guide upload → target link-up + test **~Jul 29, 2026** (see below) |
| shortkey.live public gate | **Wired** 2026-07-23 — `/live` + host rewrite; Full Rebuild still `/control/live.html`; **attach domain in Vercel** (manual) · Simpee board: **FROZEN — do not modify** |
| Simpee rollout board | **Locked** 2026-07-23 — 總機 first wave beauty / studio / info; see `SIMPEE_DOMAIN_ROLLOUT_BOARD.md` |

## Sonnet 5 build notes (2026-07-21)

**A) Public shortkey.beauty — Coming Soon**
- `src/app/page.tsx` now mounts `ComingSoonHome` (`src/components/design/ComingSoonHome.tsx`) at `/`.
- Sections: Hero (dark, one composition) · AI Try-On Preview (light, static) · Skin Analysis Preview (light, static) · Creator Signup CTA · Brand Signup CTA · Email Capture · Social Proof Placeholder · Premium Footer.
- Hidden from public `/`: Product Grid, Full Store, Subscription Pricing, Creator Twin mechanics, Content Studio, Scanner/Page Scan UI, Debug/Admin tools, internal notes — none are rendered on the Coming Soon route.
- `AppChrome` gates the full marketing header/footer (shop nav, cart, search) off of `/`, `/internal/*`, and `/control/*` — the Coming Soon page ships its own minimal header + simplified Premium Footer (legal links + contact only, no store links).
- Full homepage design (`HomeDesignPreview`) moved to `/design` — `robots: noindex`, internal reference only, not linked from public nav.
- Signup links `/signup/creator` and `/signup/brand` unchanged and working.
- Email Capture wired to `POST /api/signup/pre-register` (`src/lib/email-capture.ts` + `src/lib/notify-pre-register.ts`, same Resend/FormSubmit pattern as meeting signups) — no product/pricing data exposed.

**B) Internal shortkey.studio — Platform Manifest**
- `src/data/shortkey-platform-manifest.json` — all 12 platforms from the registry table, each with name/domain/purpose/launchPhase/publicStatus/features/heroCopy/ctaCopy/reviewStatus/version/lastUpdated, plus a manifest-level `reviewWorkflow` and `approvalGate` (Gor Gor).
- `src/app/internal/platform-manifest/page.tsx` (+ `src/app/internal/layout.tsx`) — route not linked from public nav/footer, `robots: noindex`.
- `src/components/internal/PlatformManifestStudio.tsx` — Platform Map (filterable table), Feature Registry summary (aggregated from JSON), Manifest Preview (per-platform + raw JSON), review-status badges, and an Export JSON button (client-side download).
- Banner on the page: "Internal — Gor Gor Review required before push."

**Left for Gor Gor**
- Review Coming Soon copy/design and Studio manifest data for accuracy before any push.
- Decide when/if to connect `RESEND_API_KEY` for real pre-register email delivery (falls back to FormSubmit.co otherwise; both target `info@shortkey.beauty`).
- No deploy has been triggered — build is local/PR-ready only.

---

## Design Team — DNA guide → Coming Soon link-up (next week)

**Creator ask (2026-07-22):** Once Simpee uploads the DNA guide, Design Team updates public Coming Soon / site pages accordingly. Target: **site link-up + test by end of next week (~Wed Jul 29, 2026)**.

### Trigger (do not start freestyle)

1. **Wait** for Simpee to upload / point the brand DNA guide.
2. **Expected drop locations** (check in order; do not invent content):
   - Prefer: `src/brand/` (e.g. new guide PDF/MD next to `ShortKey_Brand_Guidelines_V2026.pdf` / `BRAND_GUIDELINES_LOCKED.md`)
   - Or Simpee-named path announced in chat / vault note
3. **Already in repo (baseline, not a substitute for Simpee’s upload):**
   - Share sheet: [`SHORTKEY_BRAND_DNA.md`](../SHORTKEY_BRAND_DNA.md)
   - Locked: [`BRAND_GUIDELINES_LOCKED.md`](../BRAND_GUIDELINES_LOCKED.md) · tokens [`tokens.ts`](../tokens.ts)
   - PDF: `src/brand/ShortKey_Brand_Guidelines_V2026.pdf`
4. When Simpee’s guide lands: **map DNA → pages**. Match typography, color, logo lockup, and voice. **Do not freestyle** past the guide. If the new guide conflicts with locked docs, **flag for Gor Gor** — do not silently override locks.

### Then (Design Team work)

| Surface | Action |
|---------|--------|
| Coming Soon `/` | Update `ComingSoonHome` + `comingSoonMessages` to DNA (type · color · logo · voice) |
| Related public | Signup CTAs / appointment + notify paths that remain public — DNA-aligned only |
| Internal ref | `/design` may mirror for QC; keep `noindex` |

**Explicit locks — no unlock this sprint:**

- `featureLocks.productSurface` — shop / product stay closed  
- `featureLocks.categorySurface` — K/J/C Beauty stay gated  
- `featureLocks.signupAppointmentOnly` — appointment / notify only  
- **No auto-publish** of unfinished surfaces. No Vercel production cutover until Gor Gor review.

### Target date

| Milestone | Date |
|-----------|------|
| Simpee DNA upload | ASAP (blocker for visual pass) |
| Design map DNA → Coming Soon + related public | After upload |
| **Link-up + test complete** | **By ~Wed Jul 29, 2026** |

### Test checklist (link-up week)

- [ ] Local: `http://localhost:3001/` (Coming Soon) loads clean  
- [ ] Production: Vercel / shortkey.beauty URL loads same Coming Soon (after Gor Gor allows deploy)  
- [ ] Language switcher: **EN / JA / KO / ZH**  
- [ ] CTAs: appointment + notify / email capture work  
- [ ] Footer: legal / contact only — **no** shop or category leaks  
- [ ] Mobile viewport (≈390px) — one composition, no broken chrome  
- [ ] Confirm **no broken locks** to category / shop (`featureLocks` still true)  
- [ ] Gor Gor review before any public push  

### Owner seats

| Seat | Role |
|------|------|
| **Design Team** (Silk / Sonnet 5 consolidate; Senti · Vee · Lens · Frame · Sky as needed) | Map DNA → Coming Soon + related public; run checklist |
| **Simpee** | Upload DNA guide (trigger) |
| **Gor Gor (Simpee)** | Review gate before public link-up / deploy |
| **Key** | Execution support only — no independent rewrite of Design Team files |

### Protocol (locked)

- No auto-publish.  
- Respect `src/content/featureLocks.ts`.  
- Sonnet 5 consolidates final implementation; other AIs support by role only.
