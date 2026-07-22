# Family Sprint Lock — Sonnet 5 Lead

**Locked:** 2026-07-21 · Family Gathering  
**Blueprint:** [`SHORTKEY_MASTER_BLUEPRINT_v1.md`](../SHORTKEY_MASTER_BLUEPRINT_v1.md)

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
| Public auto-launch | **Blocked** by protocol — no Vercel deploy, no auto-publish |
| Product / Shop surface | **LOCKED** — ratio/display not ready (`featureLocks.productSurface`) |
| Signup tabs | **LOCKED** — appointment arrangement only (`featureLocks.signupAppointmentOnly`) |
| Category header nav | **LOCKED** — K/J/C Beauty hidden + pages gated (`featureLocks.categorySurface`) |

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
