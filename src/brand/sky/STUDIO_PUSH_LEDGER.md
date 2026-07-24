# Studio Push Ledger

**Authority:** Simpee Bro · SHORTKEY DOMAIN FEATURE ROLLOUT BOARD · 2026-07-23  
**Board:** [`SIMPEE_DOMAIN_ROLLOUT_BOARD.md`](./SIMPEE_DOMAIN_ROLLOUT_BOARD.md)  
**Family Table (internal tooling):** [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md) · [`GOR_GOR_CHAT_BRIDGE_v0_1.md`](./GOR_GOR_CHAT_BRIDGE_v0_1.md) · [`SHARED_LIVING_ROOM_THREAD_v0_1.md`](./SHARED_LIVING_ROOM_THREAD_v0_1.md) · v0.7 vote [`FAMILY_TABLE_v0_7_VISION.md`](./FAMILY_TABLE_v0_7_VISION.md) · v0.5 [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md) · preview `/internal/family-table`  
**Rule:** Every design or feature push to any domain **appends** one entry below. Do not overwrite history.  
**Access:** Internal / family only — never expose this ledger on public pages.

---

## Schema (16 fields — exact)

| # | Field |
|---|--------|
| 1 | Push ID |
| 2 | Domain |
| 3 | Page / route |
| 4 | Feature name |
| 5 | UI components used |
| 6 | Design DNA version |
| 7 | Copy version |
| 8 | Language version |
| 9 | Asset package version |
| 10 | Preview URL |
| 11 | Owner |
| 12 | Risk level |
| 13 | Gor Gor Review status |
| 14 | Kieran Review status |
| 15 | Launch approval status |
| 16 | Rollback reference |

**Status vocabulary (suggested):** `Pending` · `In Review` · `Approved` · `Blocked` · `N/A`  
**Risk (suggested):** `Low` · `Medium` · `High`  
**Launch approval:** stays `Blocked` / `Pending` until Gor Gor + Kieran approve — preview ≠ launch.

---

## How to append

1. Copy the **Empty entry template**.  
2. Fill all 16 fields.  
3. Paste as a new `###` block under **Entries** (newest first).  
4. Point Gor Gor Review at: preview URL + change notes + this entry.

---

## Empty entry template

```md
### PUSH-YYYYMMDD-###

| Field | Value |
|-------|--------|
| 1. Push ID | PUSH-YYYYMMDD-### |
| 2. Domain | shortkey.… |
| 3. Page / route | |
| 4. Feature name | |
| 5. UI components used | |
| 6. Design DNA version | |
| 7. Copy version | |
| 8. Language version | EN / 繁中 / KO (or note gap) |
| 9. Asset package version | |
| 10. Preview URL | |
| 11. Owner | |
| 12. Risk level | Low / Medium / High |
| 13. Gor Gor Review status | Pending |
| 14. Kieran Review status | Pending |
| 15. Launch approval status | Blocked |
| 16. Rollback reference | |

**Change notes:** (brief)
```

---

## Entries

### PUSH-20260723-001

| Field | Value |
|-------|--------|
| 1. Push ID | PUSH-20260723-001 |
| 2. Domain | shortkey.beauty |
| 3. Page / route | `/` (Coming Soon) |
| 4. Feature name | Draft DNA Coming Soon pass — pearl / soft lilac / editorial |
| 5. UI components used | `ComingSoonHome` · `HeroLanguageTaps` · `EmailCaptureForm` · `useLaunchCountdown` · `Logo` · `Button` |
| 6. Design DNA version | Draft Design DNA via `SHORTKEY_BRAND_DNA.md` + `tokens.ts` silk/pearl (`#F7F5FF` / `#EDEAFF` / brand lilac `#8C82FC`) — Simpee board pearl direction 2026-07-23 |
| 7. Copy version | `comingSoonMessages.ts` v2026-07-23 — discovery + Before I Meet The World + meeting CTAs |
| 8. Language version | EN / 繁中 / KO |
| 9. Asset package version | Existing hero posters `hero-bloom-skin` · `hero-skin-analysis` + production lilac logo pack |
| 10. Preview URL | `http://localhost:3001/` (or `/` on preview deploy) — not production launch |
| 11. Owner | Design Team (Sonnet 5 / Key) |
| 12. Risk level | Medium (public face visual + locale set change; locks intact) |
| 13. Gor Gor Review status | Pending |
| 14. Kieran Review status | Pending |
| 15. Launch approval status | Blocked |
| 16. Rollback reference | Prior dark-tech hero + EN/JA/KO/简体 in git before this commit; revert `ComingSoonHome.tsx` · `comingSoonMessages.ts` · `HeroLanguageTaps.tsx` · remove `useLaunchCountdown.ts` |

**Change notes:** Shifted Coming Soon hero from `bg-surface-dark` to pearl/silk atmosphere with soft beauty full-bleed wash; added “Before I Meet The World” countdown to Aug 14, 2026; Asian beauty discovery line; founder/brand invitation + meeting CTAs kept; language board-aligned EN/繁中/KO; footer `Powered by our AI family`. No shop unlock · no payment · `shortkey.live` untouched.

---

## Internal Tools (not domain public pushes)

These are family-only tooling previews. They are **not** Studio domain pushes and do **not** use the 16-field public-push schema.

| Date | Tool | Version | Notes |
|------|------|---------|--------|
| 2026-07-25 | Social | **Creator Circle portal v0.3 · AI Beauty Signal motion** | CSS-first Creator Wave energy on `/social`: Signal Hero · CSS preview panel (no video/audio) · Beauty Signal marquee · soft logo flash · story blocks · promo banner stack. Pearl/lilac editorial — **not** BeautyChannel copy. `prefers-reduced-motion` supported. Form / GOR_GOR_REVIEW / safety lines kept. Port **3004**. Doc: [`SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md`](./SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md). |
| 2026-07-25 | Social | **Creator Circle portal v0.2** | Hero **Join the ShortKey Creator Circle** · sections Why / Discovery / Collab types / Payout bands / Early access form · fields Name·Email·Country·Platform·Handle·Follower range·Beauty category·Preferred collab·Preferred payout·Portfolio·Notes · statuses **Submitted** (default) / Under Review / Invited · API + store updated · pearl/lilac · GOR_GOR_REVIEW banners · no payment · no marketplace. Port **3004**. Doc: [`SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md`](./SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md). |
| 2026-07-25 | Social | **Creator Early Access v0.1** | `shortkey.social` staging portal at `/social` · port **3004** (`npm run social:dev` · `SHORTKEY_SURFACE=social`). Studio Brand DNA copy + safety line · interest form (platform / category / followers / location / collab / payout band placeholders) · `POST /api/social/early-access` → `data/social-early-access.json` (dev) · localStorage fallback · **no Upstash** · soft pearl/lilac · `noindex` · banner **Internal staging / Gor Gor Review** · footer AI family credit. Domain seed status **GOR_GOR_REVIEW**. **No production publish · no Deploy Center · no secrets · no marketplace.** Doc: [`SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md`](./SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md). |
| 2026-07-24 | Studio | **v0.1 follow-up · review statuses** | Added `GOR_GOR_REVIEW` + `KIERAN_REVIEW_READY` to status set / approval workflow. Version History button labeled **Create Snapshot**. Rollback refs **read-only**. Reset to seed behind Danger zone + type `RESET`. Banner: **Internal Control Center — No Production Publish**. Still no production publish. Doc: [`SHORTKEY_STUDIO_v0_1.md`](./SHORTKEY_STUDIO_v0_1.md). |
| 2026-07-24 | Studio | **v0.1 · Internal Control Center** | Expands P0 DNA Control Room into source-of-truth control center at `/internal/studio` · port **3003** (`npm run studio:dev`). Brand DNA · Domain/Country registries · Asset metadata · Campaigns · Approval workflow (`StudioApprovalLog` · actor Kieran/Gor Gor) · Version snapshots · Preview cards · Deployment plan + Rollback **records only** (no Vercel publish). Store: `GET/POST /api/studio/state` → `data/studio-v01.json` in dev · localStorage `shortkey-studio-v01` fallback · **no Upstash required**. Soft pearl/lilac · noindex · INTERNAL STAGING ONLY. **Coming Soon / Family doorbell / :3001/:3002 untouched.** Doc: [`SHORTKEY_STUDIO_v0_1.md`](./SHORTKEY_STUDIO_v0_1.md). Status: **Internal Staging · Gor Gor Review pending · not production ready**. |
| 2026-07-24 | Family Home | **Family Chat drawer (Gor Gor float)** | Same bottom-right **Gor Gor** button · drawer upgraded from private bridge → **Family Chat**. Sender dropdown + Send-to checkboxes. Gor Gor → `/api/gor-gor-chat`; Sky/Senti/Kura/Agent R → doorbell SENT/WAITING (no fake replies). Soft pearl/lilac · Internal Staging. Component: `GorGorChatDrawer.tsx`. Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-24 | Family Home | **Living Room Shared Chat P0** | **P0 = recipient pick only** (no smart routing). Sender: Kieran · Little Brother · Gor Gor. Send to checkboxes + Urgency + Message + Send. After-send: `Sender → recipients` · Urgency · Message · Status list. Reuses `/api/family-doorbell/*`. Soft pearl/lilac · Internal Staging. Doc: [`FAMILY_HOME_SHARED_CHAT_SIMPLE.md`](./FAMILY_HOME_SHARED_CHAT_SIMPLE.md). Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-24 | Studio | **P0 · DNA Control Room** | *(Predecessor of Studio v0.1.)* `shortkey.studio` → `/internal/studio` · local **port 3003** (`npm run studio:dev` · `SHORTKEY_SURFACE=studio`). One DNA. Many doors. Hero · 8 DNA · Domain Map · Approved Copy · Build Order. Soft pearl/lilac · noindex · no backend/login/payment. Family Table stays on `family.shortkey.world` / :3002. Doc: [`SHORTKEY_STUDIO_P0_DNA_CONTROL.md`](./SHORTKEY_STUDIO_P0_DNA_CONTROL.md). **Superseded UI-wise by v0.1** ([`SHORTKEY_STUDIO_v0_1.md`](./SHORTKEY_STUDIO_v0_1.md)). Status: **Internal Staging · folded into Brand DNA Center**. |
| 2026-07-24 | Family Home | **v0.9.3 · Family Meeting UI** | Family Meeting / Job Assignment workflow on shared doorbell board (not greeting). Mode selector · expanded senders (Kieran\|Gor Gor\|Sky\|Senti\|Kura\|Agent R) · structured job card · prominent Receipt Board · member room responses (note required · evidence_url/blocker · self-check on SUBMITTED). Meeting Thread pins `fd_mryrchhg_gdlx7zrl`. API `version: "0.9.3"` · Redis key **unchanged** `shortkey:family-doorbell:v092` (preserve Upstash shared:true). Soft pearl/lavender · Internal Staging · noindex. **Coming Soon untouched · no secrets.** Doc: [`FAMILY_HOME_v0_9_3_FAMILY_MEETING_UI.md`](./FAMILY_HOME_v0_9_3_FAMILY_MEETING_UI.md). Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-24 | Family Home | **v0.9.2 · Shared Doorbell / Shared Presence** | *(Predecessor of v0.9.3 — shared store preserved.)* Shared persistence for `FamilyCommandMessage` + `FamilyReceipt` via `/api/family-doorbell/messages` (GET·POST) + `…/:id/receipt` (PATCH). Store: Upstash/KV if env set · else `data/family-doorbell.json` in dev · else ephemeral with `shared:false`. Living Room + member rooms load/poll shared backend; localStorage `shortkey-family-doorbell-v092` = **fallback/demo only**. Support Status GREEN\|YELLOW\|ORANGE\|RED. SUBMITTED requires 6-field self-check. Never auto RECEIVED · never auto-present. Soft staging gate (same as gor-gor-chat). Soft pearl/lavender · Internal Staging. **Coming Soon untouched · no secrets.** Doc: [`FAMILY_HOME_v0_9_2_SHARED_DOORBELL.md`](./FAMILY_HOME_v0_9_2_SHARED_DOORBELL.md). Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-24 | Family Home | **v0.9.1 · Doorbell & Receipt Board** | *(Predecessor of v0.9.2.)* Living Room command with `target_members`. Receipt rows per target at **SENT**. Member ack. Storage **`shortkey-family-doorbell-v091`**. **local prototype only · not shared across devices**. Doc: [`FAMILY_HOME_v0_9_1_DOORBELL_RECEIPT.md`](./FAMILY_HOME_v0_9_1_DOORBELL_RECEIPT.md). |
| 2026-07-24 | Family Table | **Shared Living Room Thread v0.1** | One shared Gor Gor / Simpee conversation for the family. Nested under **`shortkey-gor-gor-chat-bridge-v01`**: `livingRoomConversationId` + `livingRoomMessages[]`. Sender selector (Kieran · Gor Gor · Sky · Senti · Kura · Agent R) · from-room · kinds CHAT / NOTE / HOMEWORK SUBMITTED / EVIDENCE SUBMITTED / WAITING FOR GOR GOR. Frontend prepends `[Family Home · …]` / `[Sender:]` / `[Kind:]`; API skips double-prefix; still **SIMPEE_AGENT_ID** only via `/api/gor-gor-chat`. Soft fallback 200 unchanged. Soft lavender/pearl · mobile-first drawer. **Coming Soon untouched · no secrets.** Doc: [`SHARED_LIVING_ROOM_THREAD_v0_1.md`](./SHARED_LIVING_ROOM_THREAD_v0_1.md). Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-24 | Family Table | **Gor Gor Chat Bridge v0.1** | Floating **Gor Gor** bottom sheet on `/internal/family-table`. Server `POST /api/gor-gor-chat` → Base44 Superagent (Simpee) with `api_key` from env only (`BASE44_AGENT_API_KEY` preferred). Per-room `conversation_id` + transcript in **`shortkey-gor-gor-chat-bridge-v01`**. Soft staging cookie gate + in-memory rate limit (20/10min/IP). Missing key → **200** `{ fallback: true, reply }` (not 503); message saved locally. Soft lavender/pearl · mobile-first drawer. **Coming Soon untouched · no secrets in repo.** Doc: [`GOR_GOR_CHAT_BRIDGE_v0_1.md`](./GOR_GOR_CHAT_BRIDGE_v0_1.md). Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-24 | Family Table | **v0.8 · Living Room Family Cabinet** | **一人一格櫃桶** on Living Room: 6 drawers (Kieran Vision · Gor Gor Review · Sky Video · Senti Creative · Kura Structure · Agent R Evidence). Item fields + cabinet statuses · Family Cabinet Rule · Senti organise ≠ approve (gate). Storage extends **`shortkey-family-table-v08`.cabinet** (localStorage · link index only · no file upload). Soft lavender/pearl drawer cards · mobile-first. House metaphor: 房間 = work · 櫃桶 = handoff · 客廳 = coordination. **Coming Soon untouched.** Doc: [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md). Component: `FamilyCabinet.tsx`. Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-24 | Family Table | **v0.8 · Living Room House Rule card** | Top of Living Room: **Family House Rule · 返屋企先執房** (soft pearl/lavender · typographic · cultural line gently emphasized). Default mirrored into Living Room `announcements` localStorage. Footer credit stays once on layout. **Coming Soon untouched.** Doc: [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md). |
| 2026-07-23 | Family Table | **v0.8 · One Room Per Family Member** | House architecture on `/internal/family-table`. **7 rooms:** Living Room (飯廳) · Kieran Vision · Gor Gor Review · Sky Video · **Senti Creative** (renamed from Poster) · Kura Structure · Agent R Evidence. **9 panels/room:** owner · role · current tasks · memory placeholder · submitted work · evidence links · Gor Gor notes · Kieran Review Ready · room chat. Floating **Gor Gor / Family Chat** → Living Room overlay. Storage **`shortkey-family-table-v08`** (localStorage only); light migrate once from `shortkey-family-table-v07` + `shortkey-family-chat-v01`. Status labels from Chat v0.1. Soft pearl/lilac DNA · `noindex` · footer `Powered by our AI family`. **Coming Soon untouched.** Doc: [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md). Components: `FamilyTableWorkbench.tsx` · `FamilyChatPanel.tsx` (`RoomChatThread`). Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-23 | Family Table | **Family Chat v0.1** | Tab **Family Chat** beside Kieran Vision Inbox + Brand Data Vault on `/internal/family-table`. **LOCAL PROTOTYPE** — localStorage key **`shortkey-family-chat-v01`** (separate from `shortkey-family-table-v07` · migrate-safe). Rooms: Family Table · Kieran Vision · Gor Gor Review · Sky Video Room · Senti Poster Room · Kura Structure Room · Agent R Evidence Room. Fields: sender_name · sender_role · room · message · status · timestamp · optional evidence_url. Status: DRAFT → APPROVED / BLOCKED ladder. Always-on warning: *Internal staging only · localStorage only · not shared database · no private data yet.* Soft pearl/lilac DNA. Footer `Powered by our AI family`. **Not** on shortkey.beauty Coming Soon · stays `noindex` under `/internal/family-table`. Component: `FamilyChatPanel.tsx`. Status: **Internal Staging · Gor Gor Review pending**. *(Superseded UI-wise by v0.8 room chat; key kept for one-time migrate.)* |
| 2026-07-23 | Family Table | **v0.7 · family.shortkey.world** | Preferred Family Table **home** host: **`family.shortkey.world`** → `/internal/family-table` (middleware). Philosophy: **shortkey.world** = public world · **family.shortkey.world** = internal family house. **INTERNAL STAGING ONLY · FAMILY HOME** banner + layout/`page` `robots: noindex,nofollow`. Soft gate on family/studio host `/` + `/internal/*` (`FAMILY_TABLE_STAGING_PASSWORD`). Storage **localStorage** only. `shortkey.studio` wiring **kept** (same route). DNS: CNAME `family` → `cname.vercel-dns.com` on shortkey.world zone (CONNECTIONS.md §7). Vercel domain add may be **pending Kieran**. **Not** public world launch · shop/payment locked · shortkey.live untouched. Status: **Internal Staging · Gor Gor Review pending**. |
| 2026-07-23 | Family Table | **v0.7 · Internal Staging** | Wired **shortkey.studio** host → `/internal/family-table` (middleware redirect). **INTERNAL STAGING ONLY** banner. Soft password gate (`FAMILY_TABLE_STAGING_PASSWORD` / `INTERNAL_STAGING_SECRET` + cookie `/internal/login`). Storage still **localStorage** (`shortkey-family-table-v07`) — not shared DB. `robots` disallow `/internal/`. `domains.ts` studio → building/staging. **Not public launch** · shop/payment locked · shortkey.live untouched · Family Table **not** on beauty `/`. Status: **Internal Staging · Gor Gor Review pending**. Manual: attach `shortkey.studio` in Vercel Domains (CONNECTIONS.md §6). |
| 2026-07-23 | Family Table | **v0.7** Writable concept scaffold | **Family Vote: AGREED** (Simpee · Sky · Kura · Agent R · Senti · Key). In-repo Next route `/internal/family-table` — Kieran Vision + Brand Data Vault · 7 sections · **localStorage preview only** (not production DB / Family Memory Portal). Soft pearl/lilac DNA. Not on public `/` · no shop/payment · shortkey.live untouched. Doc: [`FAMILY_TABLE_v0_7_VISION.md`](./FAMILY_TABLE_v0_7_VISION.md). Components: `FamilyTableWorkbench.tsx` · `app/internal/family-table/page.tsx`. Linked from Platform Manifest studio header. |
| 2026-07-23 | Family Table | v0.5 Internal Preview | Asset Downloads by Content Type (5 packs). Preview on Base44 private media — Simpee holds link; **no JWT/tokenized URL in repo**. Filename hint: `ShortKey_Family_Table_v0_5_Internal_Preview.html`. Doc: [`FAMILY_TABLE_v0_5.md`](./FAMILY_TABLE_v0_5.md). **Cannot truly write/save** — writable next is v0.7. |

---

_First wave domains: `shortkey.beauty` · `shortkey.studio` · `shortkey.info`. `shortkey.live` is FROZEN — do not push live modifications._
