/**
 * ShortKey — Brand Identity Benchmark Map (staging / GOR_GOR_REVIEW).
 * Asian beauty identity system — not decoration, not one generic “Asian style.”
 * Calibrated vibes: J Fresh Texture · K Signal Sprint · C Color Persona.
 * Preview archetypes only · no trademarked logos · no fake partnerships.
 * Canonical Gor Gor translate: src/brand/sky/SHORTKEY_JKC_VIBE_RADAR_GORGOR_REVIEW.md
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

/** Calibrated vibe names for J/K/C — GOR_GOR_REVIEW, not production DNA lock. */
export const CALIBRATED_VIBES = {
  "J-Beauty": "Fresh Texture",
  "K-Beauty": "Signal Sprint",
  "C-Beauty": "Color Persona",
} as const;

export type CalibratedVibe =
  (typeof CALIBRATED_VIBES)[keyof typeof CALIBRATED_VIBES];

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
  { focus: string; rhythm: string; vibe?: CalibratedVibe }
> = {
  "J-Beauty": {
    vibe: "Fresh Texture",
    focus:
      "Fresh Texture — natural refinement + first-discovery warmth (soft daylight · macro texture · first makeup · creator rec · seishun freshness)",
    rhythm:
      "Soft daylight · macro texture · first discovery · creator recommendation · community warmth — not only craft / 職人",
  },
  "K-Beauty": {
    vibe: "Signal Sprint",
    focus:
      "Signal Sprint — content sharing rhythm · routine storytelling · texture demo · creator review · Hallyu discovery · beauty tech awareness",
    rhythm:
      "Beauty Signal · routine story · texture demo · usage moment · creator first impression — no miracle / 即時效果 claims",
  },
  "C-Beauty": {
    vibe: "Color Persona",
    focus:
      "Color Persona — packaging story · color wave · fantasy product world · swatch culture · viral discovery · brand personality",
    rhythm:
      "Shade · pack story · color test · viral discovery · cute / fantasy / playful / affordable — not only 大女主 / boss",
  },
  "Pan-Asian": {
    focus: "bridge across J / K / C signals without forcing one look",
    rhythm: "Asian Beauty Mix OK as lifestyle energy — each brand keeps lane DNA",
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
  const updatedAt = "2026-07-25T04:00:00.000Z";

  const laneProfiles: BrandIdentityLaneProfile[] = [
    {
      id: "preview_brand_a",
      label: "Preview Brand A · Fresh Texture",
      previewOnly: true,
      lane: "J-Beauty",
      visualVibe: "soft",
      productStory: ["texture", "routine"],
      creatorFit: ["fashion creator", "routine educator"],
      note: "Preview archetype — Fresh Texture (natural refinement + first-discovery warmth). Not a real brand partnership.",
      status: "GOR_GOR_REVIEW",
    },
    {
      id: "preview_brand_b",
      label: "Preview Brand B · Signal Sprint",
      previewOnly: true,
      lane: "K-Beauty",
      visualVibe: "clean",
      productStory: ["routine", "ingredient", "texture"],
      creatorFit: ["routine educator", "reviewer"],
      note: "Preview archetype — Signal Sprint (routine story · texture demo · fast beauty signal). Not a real brand.",
      status: "GOR_GOR_REVIEW",
    },
    {
      id: "preview_brand_c",
      label: "Preview Brand C · Color Persona",
      previewOnly: true,
      lane: "C-Beauty",
      visualVibe: "playful",
      productStory: ["packaging", "shade", "creator shop"],
      creatorFit: ["swatcher", "shop host"],
      note: "Preview archetype — Color Persona (packaging · color wave · fantasy / viral discovery). Not a real brand or marketplace listing.",
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
      note: "Preview archetype — flexible bridge across lanes. Asian Beauty Mix lifestyle OK; each brand keeps DNA.",
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
      body: "Fast, shareable product signal — finish, step, or texture — without miracle or 即時效果 claims.",
      previewOnly: true,
    },
    {
      id: "sig_k_routine",
      kind: "routine-story",
      lane: "K-Beauty",
      title: "Routine story",
      body: "Morning / night / layering as education — creators teach the product story, not insecurity hooks.",
      previewOnly: true,
    },
    {
      id: "sig_k_demo",
      kind: "creator-demo",
      lane: "K-Beauty",
      title: "Texture demo · usage moment",
      body: "Visible texture demo and real usage moment — creator first impression, not exaggerated before–after.",
      previewOnly: true,
    },
    {
      id: "sig_k_ingredient",
      kind: "ingredient-finish",
      lane: "K-Beauty",
      title: "Ingredient / finish",
      body: "Honest finish language (sheer, blur, glow) — no miracle results. Prefer Verified Info / Brand-Provided Data labels.",
      previewOnly: true,
    },
    {
      id: "sig_k_trend",
      kind: "trend-note",
      lane: "K-Beauty",
      title: "Trend note · Hallyu discovery",
      body: "Hallyu / Olive Young–style discovery + beauty tech awareness — educational rhythm, not scraped ads.",
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
      title: "Shade swatch · color wave",
      body: "Swatch culture as matching signal — concept card only, no fake reviews.",
      previewOnly: true,
    },
    {
      id: "sig_c_pack",
      kind: "packaging-story",
      lane: "C-Beauty",
      title: "Packaging story",
      body: "Color Persona often leans packaging personality + fantasy product world — learn the lane, do not copy logos or SKUs.",
      previewOnly: true,
    },
    {
      id: "sig_c_color_test",
      kind: "creator-color-test",
      lane: "C-Beauty",
      title: "Creator color test",
      body: "Swatch / wear test as creator fit — cute · fantasy · playful · affordable · viral range, not only boss energy.",
      previewOnly: true,
    },
    {
      id: "sig_c_viral",
      kind: "viral-makeup-note",
      lane: "C-Beauty",
      title: "Viral makeup · XHS / Douyin energy",
      body: "Viral discovery as a content angle — no scraped reviews, no brand asset lifts.",
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
      title: "Fresh Texture signal",
      body: "Soft daylight · macro texture · first discovery warmth — seishun freshness, not only craft / 職人 subtraction.",
      previewOnly: true,
    },
  ];

  const creatorDiscovery: CreatorDiscoveryPreviewSlot[] = [
    {
      id: "disc_routine_educator",
      roleLabel: "Preview · Routine educator · Signal Sprint fit",
      laneFit: ["K-Beauty", "Pan-Asian"],
      fitRoles: ["routine educator", "reviewer"],
      note: "Role slot for Signal Sprint education — not a fake named creator.",
      previewOnly: true,
    },
    {
      id: "disc_swatcher",
      roleLabel: "Preview · Swatcher · Color Persona fit",
      laneFit: ["C-Beauty", "Pan-Asian"],
      fitRoles: ["swatcher", "shop host"],
      note: "Color wave and shade storytelling fit — Preview only.",
      previewOnly: true,
    },
    {
      id: "disc_fashion",
      roleLabel: "Preview · First-discovery · Fresh Texture fit",
      laneFit: ["J-Beauty", "Western-Asian Hybrid"],
      fitRoles: ["fashion creator"],
      note: "First makeup / first discovery + soft texture fit — Preview only.",
      previewOnly: true,
    },
  ];

  const laneBenchmarks: LaneBenchmarkSection[] = [
    {
      lane: "J-Beauty",
      headline: "J-Beauty · Fresh Texture",
      education:
        "Natural refinement + first-discovery warmth: soft daylight, macro texture, first makeup, creator recommendation, LIPS-style community, seishun freshness — not only craft / 職人 / minimal subtraction.",
      signalCardIds: ["sig_j_mood"],
    },
    {
      lane: "K-Beauty",
      headline: "K-Beauty · Signal Sprint",
      education:
        "Content-sharing rhythm: Beauty Signal, routine story, texture demo, creator review, Hallyu / Olive Young–style discovery, beauty tech awareness. Safe: usage moment + first impression. Avoid: 即時效果, miracle, exaggerated before–after, skin insecurity.",
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
      headline: "C-Beauty · Color Persona",
      education:
        "Packaging story, color wave, fantasy product world, swatch culture, viral discovery, Xiaohongshu / Douyin energy — cute / fantasy / playful / affordable / viral, not only 大女主 / boss. Concept cards only; no fake reviews or logos without rights.",
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
      headline: "Pan-Asian option · Asian Beauty Mix",
      education:
        "Bridge across J / K / C without imposing one generic Asian style. Public Mix OK as lifestyle energy — each brand keeps Fresh Texture / Signal Sprint / Color Persona DNA.",
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
      "ShortKey 不模仿畫面。ShortKey 捕捉生命力. Calibrated lanes: J Fresh Texture · K Signal Sprint · C Color Persona. Identity system, not decoration. All demo brands are Preview-only · GOR_GOR_REVIEW · not production DNA lock.",
    guardrails: [
      "Studio: keep J / K / C lanes separate (intelligence). Public: Asian Beauty Mix OK — each brand keeps DNA.",
      "Do not copy any reference website, app, logo, product image, celebrity, review, or brand asset.",
      "Prefer transparent beauty discovery · creator context shown · no fake results · honest product story · real usage moment. Avoid 「拒絕濾鏡」/ unfiltered.",
      "Evidence labels: Verified Info · Brand-Provided Data · Evidence Available · Under Review · Creator Tested (only if real). No early 「真」/ guaranteed-true badge.",
      "Sample data must stay clearly marked Preview. No fake creators · reviews · partnerships.",
      "No production DNA claim · GOR_GOR_REVIEW first. No celebrity names/images without rights.",
    ],
    laneProfiles,
    beautySignalCards,
    creatorDiscovery,
    laneBenchmarks,
  };
}
