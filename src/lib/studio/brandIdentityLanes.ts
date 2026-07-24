/**
 * ShortKey — Brand Identity Benchmark Map (staging / GOR_GOR_REVIEW).
 * Asian beauty identity system — not decoration, not one generic “Asian style.”
 * Preview archetypes only · no trademarked logos · no fake partnerships.
 */

import type { StudioStatus } from "@/lib/studio/types";

export const IDENTITY_LANES = [
  "J-Beauty",
  "K-Beauty",
  "C-Beauty",
  "Pan-Asian",
  "Western-Asian Hybrid",
] as const;

export type IdentityLane = (typeof IDENTITY_LANES)[number];

export const VISUAL_VIBES = [
  "soft",
  "clean",
  "fantasy",
  "bold",
  "editorial",
  "clinical",
  "playful",
] as const;

export type VisualVibe = (typeof VISUAL_VIBES)[number];

export const PRODUCT_STORY_ANGLES = [
  "routine",
  "shade",
  "texture",
  "packaging",
  "ingredient",
  "creator shop",
] as const;

export type ProductStoryAngle = (typeof PRODUCT_STORY_ANGLES)[number];

export const CREATOR_FIT_ROLES = [
  "reviewer",
  "swatcher",
  "routine educator",
  "fashion creator",
  "shop host",
] as const;

export type CreatorFitRole = (typeof CREATOR_FIT_ROLES)[number];

export const LANE_FOCUS: Record<
  IdentityLane,
  { focus: string; rhythm: string }
> = {
  "J-Beauty": {
    focus: "mood / fashion / personal creator identity",
    rhythm: "Atmosphere · personal style · soft editorial presence",
  },
  "K-Beauty": {
    focus: "content sharing / routine / product education / Hallyu rhythm",
    rhythm: "Beauty Signal · routine story · creator demos · ingredient/finish · trend notes",
  },
  "C-Beauty": {
    focus: "packaging / color / brand personality / viral marketplace energy",
    rhythm: "Shade · pack story · color test · viral makeup notes · discovery energy",
  },
  "Pan-Asian": {
    focus: "bridge across J / K / C signals without forcing one look",
    rhythm: "Shared product story + local market fit",
  },
  "Western-Asian Hybrid": {
    focus: "cross-market storytelling for diaspora and hybrid audiences",
    rhythm: "Localized commerce · bilingual creator trust",
  },
};

/** Preview-only demo brand profile — never a real trademark partnership claim. */
export interface BrandIdentityLaneProfile {
  id: string;
  /** Always prefix with Preview in seed data. */
  label: string;
  previewOnly: true;
  lane: IdentityLane;
  visualVibe: VisualVibe;
  productStory: ProductStoryAngle[];
  creatorFit: CreatorFitRole[];
  note: string;
  status: StudioStatus;
}

export type BeautySignalKind =
  | "beauty-signal"
  | "routine-story"
  | "creator-demo"
  | "ingredient-finish"
  | "trend-note"
  | "campaign-formula"
  | "shade-swatch"
  | "packaging-story"
  | "creator-color-test"
  | "viral-makeup-note"
  | "discovery-energy";

export interface BeautySignalContentCardData {
  id: string;
  kind: BeautySignalKind;
  lane: IdentityLane | "Shared";
  title: string;
  body: string;
  previewOnly: true;
}

export interface CreatorDiscoveryPreviewSlot {
  id: string;
  /** Generic role slot — not a fake named creator. */
  roleLabel: string;
  laneFit: IdentityLane[];
  fitRoles: CreatorFitRole[];
  note: string;
  previewOnly: true;
}

export interface LaneBenchmarkSection {
  lane: IdentityLane;
  headline: string;
  education: string;
  signalCardIds: string[];
}

export interface BrandIdentityBenchmarkMap {
  id: string;
  label: string;
  status: StudioStatus;
  updatedAt: string;
  /** Honest framing for Gor Gor. */
  framing: string;
  guardrails: string[];
  laneProfiles: BrandIdentityLaneProfile[];
  beautySignalCards: BeautySignalContentCardData[];
  creatorDiscovery: CreatorDiscoveryPreviewSlot[];
  laneBenchmarks: LaneBenchmarkSection[];
}

export function createSeedIdentityBenchmark(): BrandIdentityBenchmarkMap {
  const updatedAt = "2026-07-25T02:00:00.000Z";

  const laneProfiles: BrandIdentityLaneProfile[] = [
    {
      id: "preview_brand_a",
      label: "Preview Brand A · soft mood lane",
      previewOnly: true,
      lane: "J-Beauty",
      visualVibe: "soft",
      productStory: ["texture", "routine"],
      creatorFit: ["fashion creator", "routine educator"],
      note: "Preview archetype — mood / fashion / personal identity. Not a real brand partnership.",
      status: "GOR_GOR_REVIEW",
    },
    {
      id: "preview_brand_b",
      label: "Preview Brand B · routine education lane",
      previewOnly: true,
      lane: "K-Beauty",
      visualVibe: "clean",
      productStory: ["routine", "ingredient", "texture"],
      creatorFit: ["routine educator", "reviewer"],
      note: "Preview archetype — content sharing / routine / product education rhythm. Not a real brand.",
      status: "GOR_GOR_REVIEW",
    },
    {
      id: "preview_brand_c",
      label: "Preview Brand C · color & pack personality",
      previewOnly: true,
      lane: "C-Beauty",
      visualVibe: "playful",
      productStory: ["packaging", "shade", "creator shop"],
      creatorFit: ["swatcher", "shop host"],
      note: "Preview archetype — packaging / color / viral discovery energy. Not a real brand or marketplace listing.",
      status: "GOR_GOR_REVIEW",
    },
    {
      id: "preview_brand_d",
      label: "Preview Brand D · pan-Asian bridge",
      previewOnly: true,
      lane: "Pan-Asian",
      visualVibe: "editorial",
      productStory: ["routine", "shade", "packaging"],
      creatorFit: ["reviewer", "swatcher", "routine educator"],
      note: "Preview archetype — flexible bridge across lanes. No single forced aesthetic.",
      status: "GOR_GOR_REVIEW",
    },
    {
      id: "preview_brand_e",
      label: "Preview Brand E · hybrid market story",
      previewOnly: true,
      lane: "Western-Asian Hybrid",
      visualVibe: "editorial",
      productStory: ["creator shop", "routine"],
      creatorFit: ["shop host", "fashion creator"],
      note: "Preview archetype — diaspora / hybrid storytelling. Not a live storefront.",
      status: "GOR_GOR_REVIEW",
    },
  ];

  const beautySignalCards: BeautySignalContentCardData[] = [
    {
      id: "sig_k_beauty_signal",
      kind: "beauty-signal",
      lane: "K-Beauty",
      title: "Beauty Signal card",
      body: "Clear product signal for sharing — glow, finish, or step — without idol packaging drops.",
      previewOnly: true,
    },
    {
      id: "sig_k_routine",
      kind: "routine-story",
      lane: "K-Beauty",
      title: "Routine story",
      body: "Morning / night / layering as education — creators teach the product story.",
      previewOnly: true,
    },
    {
      id: "sig_k_demo",
      kind: "creator-demo",
      lane: "K-Beauty",
      title: "Creator demo",
      body: "Texture, application, and finish demos — trust through showing, not celebrity claim.",
      previewOnly: true,
    },
    {
      id: "sig_k_ingredient",
      kind: "ingredient-finish",
      lane: "K-Beauty",
      title: "Ingredient / finish",
      body: "Honest finish language (sheer, blur, glow) — no exaggerated clinical results.",
      previewOnly: true,
    },
    {
      id: "sig_k_trend",
      kind: "trend-note",
      lane: "K-Beauty",
      title: "Trend note",
      body: "Seasonal rhythm notes for content planning — educational, not scraped from ads.",
      previewOnly: true,
    },
    {
      id: "sig_k_formula",
      kind: "campaign-formula",
      lane: "K-Beauty",
      title: "Campaign formula card",
      body: "ShortKey formula: visual product story + signal + creator trust + AI matching + localized commerce.",
      previewOnly: true,
    },
    {
      id: "sig_c_shade",
      kind: "shade-swatch",
      lane: "C-Beauty",
      title: "Shade swatch",
      body: "Color story as a matching signal — concept card only, no fake reviews.",
      previewOnly: true,
    },
    {
      id: "sig_c_pack",
      kind: "packaging-story",
      lane: "C-Beauty",
      title: "Packaging story",
      body: "C-beauty often leans playful packaging personality — learn the lane, do not copy logos or SKUs.",
      previewOnly: true,
    },
    {
      id: "sig_c_color_test",
      kind: "creator-color-test",
      lane: "C-Beauty",
      title: "Creator color test",
      body: "Swatch / wear test as creator fit — Preview concept, not a YesStyle-style listing.",
      previewOnly: true,
    },
    {
      id: "sig_c_viral",
      kind: "viral-makeup-note",
      lane: "C-Beauty",
      title: "Viral makeup trend note",
      body: "Discovery energy as a content angle — no scraped reviews, no brand asset lifts.",
      previewOnly: true,
    },
    {
      id: "sig_c_discovery",
      kind: "discovery-energy",
      lane: "C-Beauty",
      title: "Discovery energy",
      body: "Marketplace curiosity as a signal type — ShortKey stays link + story first, not a clone shop.",
      previewOnly: true,
    },
    {
      id: "sig_j_mood",
      kind: "beauty-signal",
      lane: "J-Beauty",
      title: "Mood / fashion signal",
      body: "Personal creator identity and soft editorial mood — not a forced cute-pack template.",
      previewOnly: true,
    },
  ];

  const creatorDiscovery: CreatorDiscoveryPreviewSlot[] = [
    {
      id: "disc_routine_educator",
      roleLabel: "Preview · Routine educator slot",
      laneFit: ["K-Beauty", "Pan-Asian"],
      fitRoles: ["routine educator", "reviewer"],
      note: "Role slot for matching education — not a fake named creator.",
      previewOnly: true,
    },
    {
      id: "disc_swatcher",
      roleLabel: "Preview · Swatcher / color host",
      laneFit: ["C-Beauty", "Pan-Asian"],
      fitRoles: ["swatcher", "shop host"],
      note: "Color and shade storytelling fit — Preview only.",
      previewOnly: true,
    },
    {
      id: "disc_fashion",
      roleLabel: "Preview · Fashion / mood creator",
      laneFit: ["J-Beauty", "Western-Asian Hybrid"],
      fitRoles: ["fashion creator"],
      note: "Mood and personal identity fit — Preview only.",
      previewOnly: true,
    },
  ];

  const laneBenchmarks: LaneBenchmarkSection[] = [
    {
      lane: "J-Beauty",
      headline: "J-Beauty benchmark",
      education:
        "Often mood, fashion, and personal creator identity — soft or editorial vibes without forcing one look.",
      signalCardIds: ["sig_j_mood"],
    },
    {
      lane: "K-Beauty",
      headline: "K-Beauty benchmark",
      education:
        "Content-sharing rhythm: Beauty Signal, routine story, creator demos, ingredient/finish, trend notes — not only cute packaging + idol.",
      signalCardIds: [
        "sig_k_beauty_signal",
        "sig_k_routine",
        "sig_k_demo",
        "sig_k_ingredient",
        "sig_k_trend",
        "sig_k_formula",
      ],
    },
    {
      lane: "C-Beauty",
      headline: "C-Beauty benchmark",
      education:
        "Packaging, color, brand personality, and discovery energy — concept cards only. No fake reviews, no marketplace clone, no logos without rights.",
      signalCardIds: [
        "sig_c_shade",
        "sig_c_pack",
        "sig_c_color_test",
        "sig_c_viral",
        "sig_c_discovery",
      ],
    },
    {
      lane: "Pan-Asian",
      headline: "Pan-Asian option",
      education:
        "Bridge across J / K / C without imposing one generic Asian style. Match by product story + creator trust + local market.",
      signalCardIds: [],
    },
    {
      lane: "Western-Asian Hybrid",
      headline: "Western-Asian Hybrid option",
      education:
        "For hybrid and diaspora audiences — localized commerce language with Asian beauty product signals.",
      signalCardIds: [],
    },
  ];

  return {
    id: "identity_benchmark_v01",
    label: "Brand Identity Benchmark Map",
    status: "GOR_GOR_REVIEW",
    updatedAt,
    framing:
      "ShortKey was missing an Asian beauty identity system — not decoration. This map is flexible lane education for matching. All demo brands are Preview-only archetypes.",
    guardrails: [
      "Do not copy any reference website, app, logo, product image, celebrity, review, or brand asset.",
      "References = internal benchmark learning only until relationships are real.",
      "Sample data must stay clearly marked Preview.",
      "No fake creators · no fake reviews · no fake partnerships.",
      "No production-ready claim · GOR_GOR_REVIEW first.",
      "No celebrity names/images without rights.",
    ],
    laneProfiles,
    beautySignalCards,
    creatorDiscovery,
    laneBenchmarks,
  };
}
