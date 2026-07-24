/**
 * ShortKey — Hallyu → Creator formula + Product Story Readiness (staging).
 * Educational / matching-signal concepts only.
 * Do NOT copy brands, celebs, ads, or article text.
 */

import type { StudioStatus } from "@/lib/studio/types";

/** Historical pattern (learn only — never recreate as ads or celeb drops). */
export const HISTORICAL_KBEAUTY_FORMULA =
  "Cute packaging + Effective product + Hallyu stars" as const;

/** ShortKey modern formula (owned language). */
export const SHORTKEY_CREATOR_FORMULA =
  "Visual product story + clear product signal + creator trust + AI matching + localized commerce" as const;

export const FLOW_SHIFT = {
  historical: "Brand → Celebrity → Consumer",
  shortkey: "Brand → Creator Circle → Community → Consumer",
} as const;

export const PACKAGING_VISUAL_SIGNALS = [
  "soft-focus pack shot",
  "texture close-up",
  "shade story still",
  "routine shelf frame",
  "gift-ready unbox",
] as const;

export const PRODUCT_SIGNAL_OPTIONS = [
  "glow",
  "soft blur",
  "cushion",
  "lip tint",
  "routine step",
  "hydration veil",
  "sheer coverage",
] as const;

export const CREATOR_FIT_OPTIONS = [
  "skincare routine",
  "makeup swatch",
  "GRWM",
  "J-beauty mood",
  "K-beauty review",
  "creator shop",
] as const;

export const CONTENT_ANGLE_OPTIONS = [
  "texture test",
  "shade swatch",
  "before/after",
  "routine demo",
  "comparison",
] as const;

export const LOCAL_MARKET_OPTIONS = [
  "HK",
  "Japan",
  "Korea",
  "US",
  "Philippines",
  "SEA",
] as const;

export type PackagingVisualSignal = (typeof PACKAGING_VISUAL_SIGNALS)[number];
export type ProductSignal = (typeof PRODUCT_SIGNAL_OPTIONS)[number];
export type CreatorFitOption = (typeof CREATOR_FIT_OPTIONS)[number];
export type ContentAngleOption = (typeof CONTENT_ANGLE_OPTIONS)[number];
export type LocalMarketOption = (typeof LOCAL_MARKET_OPTIONS)[number];

export type ReadinessLevel = "ready" | "partial" | "missing";

export interface ReadinessCheckItem {
  id: string;
  label: string;
  level: ReadinessLevel;
  note?: string;
}

export interface CreatorFitSignalData {
  fits: CreatorFitOption[];
  strength: ReadinessLevel;
  note?: string;
}

export interface LocalMarketSignalData {
  markets: LocalMarketOption[];
  strength: ReadinessLevel;
  note?: string;
}

export interface ProductStoryReadiness {
  packagingVisual: {
    level: ReadinessLevel;
    signals: PackagingVisualSignal[];
    note?: string;
  };
  productSignal: {
    level: ReadinessLevel;
    signals: ProductSignal[];
    note?: string;
  };
  creatorFit: CreatorFitSignalData;
  contentAngle: {
    level: ReadinessLevel;
    angles: ContentAngleOption[];
    note?: string;
  };
  localMarket: LocalMarketSignalData;
  /** 0–100 educational score from checklist levels (not a live ranking engine). */
  score: number;
  checklist: ReadinessCheckItem[];
}

/** Optional campaign extension — migrate-safe when absent on older state. */
export interface CampaignHallyuFormula {
  enabled: true;
  status: StudioStatus;
  historicalFormula: typeof HISTORICAL_KBEAUTY_FORMULA;
  shortkeyFormula: typeof SHORTKEY_CREATOR_FORMULA;
  flowShift: typeof FLOW_SHIFT;
  readiness: ProductStoryReadiness;
  /** Honest guardrails for Gor Gor review. */
  guardrails: string[];
}

export function scoreFromLevels(levels: ReadinessLevel[]): number {
  if (levels.length === 0) return 0;
  const points = levels.reduce((sum, level) => {
    if (level === "ready") return sum + 2;
    if (level === "partial") return sum + 1;
    return sum;
  }, 0);
  return Math.round((points / (levels.length * 2)) * 100);
}

export function buildReadinessChecklist(
  readiness: Omit<ProductStoryReadiness, "checklist" | "score">,
): { checklist: ReadinessCheckItem[]; score: number } {
  const checklist: ReadinessCheckItem[] = [
    {
      id: "packaging",
      label: "Packaging visual strength",
      level: readiness.packagingVisual.level,
      note: readiness.packagingVisual.note,
    },
    {
      id: "product",
      label: "Product signal (usage story)",
      level: readiness.productSignal.level,
      note: readiness.productSignal.note,
    },
    {
      id: "creator",
      label: "Creator fit",
      level: readiness.creatorFit.strength,
      note: readiness.creatorFit.note,
    },
    {
      id: "angle",
      label: "Content angle",
      level: readiness.contentAngle.level,
      note: readiness.contentAngle.note,
    },
    {
      id: "market",
      label: "Local market fit",
      level: readiness.localMarket.strength,
      note: readiness.localMarket.note,
    },
  ];
  return {
    checklist,
    score: scoreFromLevels(checklist.map((c) => c.level)),
  };
}

/** Seed example for Studio Campaign Manager / Preview — GOR_GOR_REVIEW. */
export function createSeedHallyuFormula(): CampaignHallyuFormula {
  const core = {
    packagingVisual: {
      level: "ready" as const,
      signals: ["texture close-up", "soft-focus pack shot"] as PackagingVisualSignal[],
      note: "Clear pack + texture story — ShortKey-owned stills only when assets exist.",
    },
    productSignal: {
      level: "ready" as const,
      signals: ["glow", "lip tint", "routine step"] as ProductSignal[],
      note: "Usage story signals for matching — not clinical claims.",
    },
    creatorFit: {
      fits: ["skincare routine", "makeup swatch", "K-beauty review"] as CreatorFitOption[],
      strength: "partial" as const,
      note: "Fit tags for Creator Circle matching — not celebrity endorsement.",
    },
    contentAngle: {
      level: "ready" as const,
      angles: ["texture test", "shade swatch", "routine demo"] as ContentAngleOption[],
      note: "Angles creators can film — no before/after exaggeration.",
    },
    localMarket: {
      markets: ["HK", "Japan", "Korea", "Philippines"] as LocalMarketOption[],
      strength: "partial" as const,
      note: "Localized commerce intent — markets listed for fit, not live storefronts.",
    },
  };
  const { checklist, score } = buildReadinessChecklist(core);
  return {
    enabled: true,
    status: "GOR_GOR_REVIEW",
    historicalFormula: HISTORICAL_KBEAUTY_FORMULA,
    shortkeyFormula: SHORTKEY_CREATOR_FORMULA,
    flowShift: { ...FLOW_SHIFT },
    readiness: { ...core, checklist, score },
    guardrails: [
      "Do not copy Etude House, Holika Holika, celebrity photos, ad images, or article text.",
      "No celebrity names or images without rights.",
      "No fake endorsements or exaggerated product results.",
      "Educational staging only — not a marketplace or production deploy.",
    ],
  };
}

export const HALLYU_SEED_CAMPAIGN_ID = "cmp_hallyu_creator_formula" as const;
