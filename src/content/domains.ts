/** ShortKey 12-domain Beauty Commerce OS — control-plane registry */

export type DomainPhase = 1 | 2 | 3 | 4;
export type DomainStatus = "live" | "building" | "scaffold" | "planned";
export type DomainBackend = "Base44" | "Shopify" | "Base44 + Shopify" | "Base44 + AI" | "Base44 + Cloudinary";

export type ShortkeyDomain = {
  id: string;
  host: string;
  purpose: string;
  audience: string;
  phase: DomainPhase;
  status: DomainStatus;
  backend: DomainBackend;
  aug14Must: boolean;
  localApp: string;
  href?: string;
  features: string[];
};

export const SPEC_SOURCES = [
  {
    id: "studio-v2",
    title: "Studio v2 — Master Control Panel",
    url: "/control/hub.html",
    remoteUrl:
      "https://base44.app/api/apps/6a54198bebbee048f44e1378/files/mp/public/6a54198bebbee048f44e1378/896c73fc6_shortkey_studio_v2.html",
  },
  {
    id: "live-rebuild",
    title: "shortkey.live — Full Rebuild",
    url: "/control/live.html",
    remoteUrl:
      "https://base44.app/api/apps/6a54198bebbee048f44e1378/files/mp/public/6a54198bebbee048f44e1378/a62b28f75_shortkey_live.html",
  },
  {
    id: "ui-spec",
    title: "Visual Ecosystem Blueprint",
    url: "/control/blueprint.html",
    remoteUrl:
      "https://base44.app/api/apps/6a54198bebbee048f44e1378/files/mp/public/6a54198bebbee048f44e1378/c558749f9_shortkey_ui_spec.html",
  },
  {
    id: "execution",
    title: "Homepage Execution Guide",
    url: "/control/execution.html",
    remoteUrl:
      "https://base44.app/api/apps/6a54198bebbee048f44e1378/files/mp/public/6a54198bebbee048f44e1378/d684b1cba_execution_guide.html",
  },
] as const;

export const shortkeyDomains: ShortkeyDomain[] = [
  {
    id: "beauty",
    host: "shortkey.beauty",
    purpose: "Main website — B2B brand entry + consumer discovery",
    audience: "Brands discovering ShortKey; shoppers exploring try-on",
    phase: 1,
    status: "live",
    backend: "Base44",
    aug14Must: true,
    localApp: "apps/beauty",
    href: "/",
    features: ["Brand homepage", "TINT AR showcase", "Founding Brand CTA", "Shop + try-on"],
  },
  {
    id: "info",
    host: "shortkey.info",
    purpose: "Brand Portal (login)",
    audience: "Signed-up brands",
    phase: 1,
    status: "scaffold",
    backend: "Base44",
    aug14Must: true,
    localApp: "apps/info",
    features: ["Campaigns / GMV / reports", "Influencer match", "Commission breakdown"],
  },
  {
    id: "social",
    host: "shortkey.social",
    purpose: "Influencer Personal Beauty OS",
    audience: "Creators — personalised pages",
    phase: 1,
    status: "scaffold",
    backend: "Base44 + Shopify",
    aug14Must: true,
    localApp: "apps/social",
    features: ["Ctrl+Shop UI", "Commission dashboard", "Live calendar → .live"],
  },
  {
    id: "store",
    host: "shortkey.store",
    purpose: "Consumer shopping portal (B2C)",
    audience: "End consumers",
    phase: 1,
    status: "building",
    backend: "Shopify",
    aug14Must: true,
    localApp: "apps/store",
    href: "/shop",
    features: ["~45 SKUs", "TINT try-on", "Affiliate links", "Orders → Base44 commissions"],
  },
  {
    id: "live",
    host: "shortkey.live",
    purpose: "Live streaming hub + calendar",
    audience: "Fans + creators",
    phase: 2,
    status: "building",
    backend: "Base44",
    aug14Must: false,
    localApp: "apps/live",
    href: "/live",
    features: [
      "Coming Soon gate (public)",
      "Calendar / stream schedule",
      "Watch hub (Full Rebuild)",
      "Creator go-live",
      "VIP slot + submit show (spec)",
      "Links → social + store",
    ],
  },
  {
    id: "fashion",
    host: "shortkey.fashion",
    purpose: "Tutorial + makeover portal",
    audience: "UGC + official content viewers",
    phase: 2,
    status: "planned",
    backend: "Base44 + Cloudinary",
    aug14Must: false,
    localApp: "apps/fashion",
    features: ["Tutorials", "Makeover flows", "Media library"],
  },
  {
    id: "community",
    host: "shortkey.community",
    purpose: "Blog + fan sharing + alerts",
    audience: "Fans / community",
    phase: 2,
    status: "scaffold",
    backend: "Base44",
    aug14Must: false,
    localApp: "apps/community",
    features: ["Posts", "Fan email alerts", "Sharing"],
  },
  {
    id: "wtf",
    host: "shortkey.wtf",
    purpose: "B2C viral / campaign entry",
    audience: "Campaign traffic",
    phase: 2,
    status: "scaffold",
    backend: "Base44",
    aug14Must: false,
    localApp: "apps/wtf",
    features: ["WTFSubmission", "Viral entry", "Campaign landing"],
  },
  {
    id: "studio",
    host: "shortkey.studio",
    purpose: "In-house creative studio (brand service)",
    audience: "Internal + brand services",
    phase: 3,
    status: "scaffold",
    backend: "Base44 + AI",
    aug14Must: false,
    localApp: "apps/studio",
    features: ["Creative ops", "AI image APIs", "Studio control panel"],
  },
  {
    id: "club",
    host: "shortkey.club",
    purpose: "Membership programme",
    audience: "Members",
    phase: 3,
    status: "scaffold",
    backend: "Base44",
    aug14Must: false,
    localApp: "apps/club",
    features: ["Membership tiers", "Payments", "Member perks"],
  },
  {
    id: "events",
    host: "shortkey.events",
    purpose: "Promotions + game zone",
    audience: "Promo participants",
    phase: 3,
    status: "scaffold",
    backend: "Base44",
    aug14Must: false,
    localApp: "apps/events",
    features: ["Promotions", "Game mechanics", "Event landings"],
  },
  {
    id: "world",
    host: "shortkey.world",
    purpose: "Global multi-country / i18n",
    audience: "International markets",
    phase: 4,
    status: "scaffold",
    backend: "Base44",
    aug14Must: false,
    localApp: "apps/world",
    features: ["Multi-region", "i18n", "Localised commerce"],
  },
];

export const phaseLabels: Record<DomainPhase, string> = {
  1: "Phase 1 — Aug 14 must-ship",
  2: "Phase 2 — Aug–Sep",
  3: "Phase 3 — Oct–Dec",
  4: "Phase 4 — 2027",
};

export const statusLabels: Record<DomainStatus, string> = {
  live: "Live",
  building: "Building",
  scaffold: "Scaffold",
  planned: "Planned",
};

const SPEC_BLOCK = SPEC_SOURCES.map((s) => `- ${s.title}\n  ${s.url}`).join("\n");

const DOMAIN_BLOCK = shortkeyDomains
  .map(
    (d) =>
      `- ${d.host} | Phase ${d.phase} | ${d.status} | ${d.backend} | ${d.purpose}`,
  )
  .join("\n");

/** Paste into Base44 Super Agent — architecture, sequencing, data layer */
export const SUPER_AGENT_BRIEF = `You are the ShortKey Super Agent for the Beauty Commerce OS.

## Mission
Own the full 12-domain operating system. Base44 + Shopify are the single source of truth. Do not create parallel apps, repos, or Shopify stores. Never rebuild locked connections — only rotate secrets.

## Spec sources (open and follow exactly)
${SPEC_BLOCK}

## Domain map
${DOMAIN_BLOCK}

## Locked chain (do not rebuild)
Repo → GitHub KieranSimpee/shortkey → Vercel → Base44 apps → Shopify simplex-ity-dev.myshopify.com

Locked Base44 bridges:
- Products: app ID 69ddc914cfcf229762ac123d → getShortKeyProducts
- Senti: app ID 6a42029cc124d0206f027335 → getShortKeyData

## Your job as Super Agent
1. Read Studio v2 Master Control Panel + Visual Ecosystem Blueprint + Homepage Execution Guide first.
2. Produce a single execution plan: what Base44 entities, functions, auth, and domain backends must exist for each host.
3. Sequence work: Phase 1 (beauty, info, social, store) before Phase 2 (live, fashion, community, wtf).
4. For shortkey.live, treat the Full Rebuild spec as canonical — calendar, streams, creator go-live.
5. Keep domains independent frontends sharing one data layer. If one domain fails, others keep working.
6. Output: (a) OS overview status board, (b) entity/API checklist per domain, (c) handoff packets for the Builder Agent per domain, (d) risks / blockers for Aug 14.

## Constraints
- Do not invent new Base44 app IDs for products/Senti — reuse locked IDs.
- shortkey.store commerce is Shopify DIRECT; Base44 only gets post-purchase commission sync.
- shortkey.beauty brand inquiry stays on Base44.
- Match visual language from the Visual Ecosystem Blueprint across all domains.
- Prefer incremental shippable slices over big-bang rewrites.

## Deliverable format
Return a structured control brief:
1. OS status (per domain: purpose, backend, entities, ready/not)
2. Immediate next 5 Builder tasks (ordered)
3. Exact Builder prompts (copy-paste) for: Studio control panel, shortkey.live rebuild, homepage execution
4. Open questions that block build`;

/** Paste into Base44 Builder Agent — implement UI/apps from specs */
export const BUILDER_AGENT_BRIEF = `You are the ShortKey Builder Agent. Implement only — do not redesign the OS architecture.

## Spec sources (implement pixel + flow fidelity)
${SPEC_BLOCK}

## Build order (strict)
1. Studio v2 Master Control Panel — the overview that controls / links all domains.
2. Homepage Execution Guide — shortkey.beauty homepage slices that are not done.
3. shortkey.live Full Rebuild — after Studio shell exists.
4. Apply Visual Ecosystem Blueprint tokens/components to every surface you touch.

## Domain context
${DOMAIN_BLOCK}

## Implementation rules
- Treat each domain as an independent frontend; share Base44 entities / Shopify catalog — do not couple deploys.
- Reuse existing locked Base44 function endpoints; do not recreate apps.
- Studio control panel must show: all 12 domains, phase, status, backend, key features, deep links, and paste-ready agent briefs for Super + Builder.
- shortkey.live must follow the Full Rebuild HTML: schedule/calendar, live hub, creator paths, links back to social + store.
- Match Visual Ecosystem Blueprint for type, color, spacing, motion — no generic AI purple dashboard look that drifts from the brand.
- Mobile-first; Aug 14 Phase 1 domains must feel production-ready on phone.
- When a screen needs data, define Base44 entity fields + sample records before inventing UI-only mocks that cannot sync.

## Locked commerce notes
- Products bridge: getShortKeyProducts (app 69ddc914cfcf229762ac123d)
- Senti bridge: getShortKeyData (app 6a42029cc124d0206f027335)
- Shopify store: simplex-ity-dev.myshopify.com
- Storefront checkout stays Shopify; Base44 owns brands/campaigns/influencers/commissions/calendar.

## Output each turn
1. What you built (screens / entities / functions)
2. What still open from the specs
3. Exact next step for the following Builder turn
4. Links or file names created

## Start now
Open Studio v2 Master Control Panel + Visual Ecosystem Blueprint. Build the Master Control Panel first as the hub that links every domain. Then continue Homepage Execution Guide items. Pause before inventing features not in the specs — ask instead.`;

export function countByPhase(phase: DomainPhase) {
  return shortkeyDomains.filter((d) => d.phase === phase).length;
}

export function countByStatus(status: DomainStatus) {
  return shortkeyDomains.filter((d) => d.status === status).length;
}
