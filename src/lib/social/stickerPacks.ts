/**
 * ShortKey StickerEmoji — built-in packs only (P0).
 * Cultural line: Fan Sticker Wall energy · ShortKey visual language (not emoji chaos).
 * Status: GOR_GOR_REVIEW · UNDER_REVIEW · no creator uploads · no third-party IP.
 */

export const STICKER_STORAGE_KEY = "shortkey-social-sticker-emoji-v01";
export const STICKER_REVIEW_STATUS = "UNDER_REVIEW" as const;
export const STICKER_DNA_STATUS = "GOR_GOR_REVIEW" as const;

export const STICKER_HARD_RULES = [
  "No Sanrio / Disney / anime / idol / celebrity",
  "No third-party brand logos",
  "No AI-generated text stickers",
  "No underage / school-uniform sexualized vibe",
  "No fake review / fake verified stickers",
  "P0: no creator-uploaded custom stickers",
  "Decorated previews remain UNDER_REVIEW / GOR_GOR_REVIEW",
] as const;

export const DECORATE_TARGETS = [
  {
    id: "creator-profile",
    label: "Creator profile card",
    kicker: "Profile",
    blurb: "How a creator signal might read to brands — preview only.",
  },
  {
    id: "campaign-submission",
    label: "Campaign submission preview",
    kicker: "Campaign",
    blurb: "Submission frame for a beauty story pitch — not a live campaign.",
  },
  {
    id: "product-story",
    label: "Product story card",
    kicker: "Story",
    blurb: "Visual product story chip — honest signal, not a review claim.",
  },
  {
    id: "media-kit",
    label: "Media kit preview",
    kicker: "Media kit",
    blurb: "Lightweight kit shell — links and vibe, not verified metrics.",
  },
  {
    id: "creator-shop",
    label: "Creator shop / Creator Edit",
    kicker: "Shop · Edit",
    blurb: "Creator Edit surface sketch — CTRL-style energy, staging only.",
  },
] as const;

export type DecorateTargetId = (typeof DECORATE_TARGETS)[number]["id"];

export type StickerPackId =
  | "shortkey-native"
  | "j-beauty-fresh"
  | "k-beauty-signal"
  | "c-beauty-color"
  | "creator-circle";

export type StickerGlyphKind =
  | "ctrl"
  | "alt"
  | "beauty-signal"
  | "creator-circle"
  | "product-story"
  | "saved-look"
  | "soft-sparkle"
  | "pearl-glow"
  | "first-discovery"
  | "soft-ribbon"
  | "morning-light"
  | "routine-step"
  | "swatch-signal"
  | "trend-pulse"
  | "creator-review"
  | "texture-tap"
  | "color-swatch-burst"
  | "packaging-sparkle"
  | "color-aura"
  | "fantasy-frame"
  | "bold-bloom"
  | "my-style"
  | "my-shelf"
  | "try-this"
  | "campaign-ready"
  | "profile-complete";

export interface StickerDef {
  id: string;
  packId: StickerPackId;
  label: string;
  glyph: StickerGlyphKind;
  /** Soft tint class key for chip atmosphere */
  tint: "lilac" | "pearl" | "mint" | "rose" | "amber" | "sky";
}

export interface StickerPack {
  id: StickerPackId;
  name: string;
  lane: string;
  stickers: StickerDef[];
}

export interface StickerPlacement {
  id: string;
  stickerId: string;
  targetId: DecorateTargetId;
  /** 0–100 relative position inside card */
  x: number;
  y: number;
  placedAt: string;
}

export interface StickerPlacementState {
  version: "0.1";
  status: typeof STICKER_REVIEW_STATUS;
  dna: typeof STICKER_DNA_STATUS;
  placements: StickerPlacement[];
}

export const STICKER_PACKS: StickerPack[] = [
  {
    id: "shortkey-native",
    name: "ShortKey Native",
    lane: "Platform DNA",
    stickers: [
      { id: "sk-ctrl", packId: "shortkey-native", label: "ctrl", glyph: "ctrl", tint: "lilac" },
      { id: "sk-alt", packId: "shortkey-native", label: "alt", glyph: "alt", tint: "lilac" },
      {
        id: "sk-beauty-signal",
        packId: "shortkey-native",
        label: "Beauty Signal",
        glyph: "beauty-signal",
        tint: "pearl",
      },
      {
        id: "sk-creator-circle",
        packId: "shortkey-native",
        label: "Creator Circle",
        glyph: "creator-circle",
        tint: "lilac",
      },
      {
        id: "sk-product-story",
        packId: "shortkey-native",
        label: "Product Story",
        glyph: "product-story",
        tint: "pearl",
      },
      {
        id: "sk-saved-look",
        packId: "shortkey-native",
        label: "Saved Look",
        glyph: "saved-look",
        tint: "rose",
      },
    ],
  },
  {
    id: "j-beauty-fresh",
    name: "J-Beauty Fresh",
    lane: "Fresh Texture",
    stickers: [
      {
        id: "j-soft-sparkle",
        packId: "j-beauty-fresh",
        label: "soft sparkle",
        glyph: "soft-sparkle",
        tint: "pearl",
      },
      {
        id: "j-pearl-glow",
        packId: "j-beauty-fresh",
        label: "pearl glow",
        glyph: "pearl-glow",
        tint: "pearl",
      },
      {
        id: "j-first-discovery",
        packId: "j-beauty-fresh",
        label: "first discovery",
        glyph: "first-discovery",
        tint: "mint",
      },
      {
        id: "j-soft-ribbon",
        packId: "j-beauty-fresh",
        label: "soft ribbon",
        glyph: "soft-ribbon",
        tint: "rose",
      },
      {
        id: "j-morning-light",
        packId: "j-beauty-fresh",
        label: "morning light",
        glyph: "morning-light",
        tint: "amber",
      },
    ],
  },
  {
    id: "k-beauty-signal",
    name: "K-Beauty Signal",
    lane: "Signal Sprint",
    stickers: [
      {
        id: "k-routine-step",
        packId: "k-beauty-signal",
        label: "routine step",
        glyph: "routine-step",
        tint: "lilac",
      },
      {
        id: "k-swatch-signal",
        packId: "k-beauty-signal",
        label: "swatch signal",
        glyph: "swatch-signal",
        tint: "rose",
      },
      {
        id: "k-trend-pulse",
        packId: "k-beauty-signal",
        label: "trend pulse",
        glyph: "trend-pulse",
        tint: "sky",
      },
      {
        id: "k-creator-review",
        packId: "k-beauty-signal",
        label: "creator review",
        glyph: "creator-review",
        tint: "lilac",
      },
      {
        id: "k-texture-tap",
        packId: "k-beauty-signal",
        label: "texture tap",
        glyph: "texture-tap",
        tint: "pearl",
      },
    ],
  },
  {
    id: "c-beauty-color",
    name: "C-Beauty Color",
    lane: "Color Persona",
    stickers: [
      {
        id: "c-swatch-burst",
        packId: "c-beauty-color",
        label: "color swatch burst",
        glyph: "color-swatch-burst",
        tint: "rose",
      },
      {
        id: "c-packaging-sparkle",
        packId: "c-beauty-color",
        label: "packaging sparkle",
        glyph: "packaging-sparkle",
        tint: "amber",
      },
      {
        id: "c-color-aura",
        packId: "c-beauty-color",
        label: "color aura",
        glyph: "color-aura",
        tint: "lilac",
      },
      {
        id: "c-fantasy-frame",
        packId: "c-beauty-color",
        label: "fantasy frame",
        glyph: "fantasy-frame",
        tint: "sky",
      },
      {
        id: "c-bold-bloom",
        packId: "c-beauty-color",
        label: "bold bloom",
        glyph: "bold-bloom",
        tint: "rose",
      },
    ],
  },
  {
    id: "creator-circle",
    name: "Creator Circle",
    lane: "Creator energy",
    stickers: [
      {
        id: "cc-my-style",
        packId: "creator-circle",
        label: "my style",
        glyph: "my-style",
        tint: "lilac",
      },
      {
        id: "cc-my-shelf",
        packId: "creator-circle",
        label: "my shelf",
        glyph: "my-shelf",
        tint: "pearl",
      },
      {
        id: "cc-try-this",
        packId: "creator-circle",
        label: "try this",
        glyph: "try-this",
        tint: "mint",
      },
      {
        id: "cc-campaign-ready",
        packId: "creator-circle",
        label: "campaign ready",
        glyph: "campaign-ready",
        tint: "sky",
      },
      {
        id: "cc-profile-complete",
        packId: "creator-circle",
        label: "profile complete",
        glyph: "profile-complete",
        tint: "lilac",
      },
    ],
  },
];

export function allStickers(): StickerDef[] {
  return STICKER_PACKS.flatMap((p) => p.stickers);
}

export function findSticker(id: string): StickerDef | undefined {
  return allStickers().find((s) => s.id === id);
}

export function emptyPlacementState(): StickerPlacementState {
  return {
    version: "0.1",
    status: STICKER_REVIEW_STATUS,
    dna: STICKER_DNA_STATUS,
    placements: [],
  };
}

export const MAX_STICKERS_PER_TARGET = 8;
