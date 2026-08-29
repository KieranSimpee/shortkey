/**
 * Makeup try-on demo catalog — Issue 01 Nihon Sakura / brand SIMULATOR.
 * Prefer real shop SKUs; shade colors drive local overlays only.
 * Status: GOR_GOR_REVIEW · NOT live Banuba/TINT CRM.
 */

export type MakeupTryOnSlot = "lip" | "blush" | "eye" | "base";

export type MakeupTryOnItem = {
  id: string;
  sku: string;
  slot: MakeupTryOnSlot;
  name: string;
  brand: string;
  type: string;
  shadeName: string;
  /** Primary swatch hex */
  color: string;
  /** Face-sim layer colors (rgba or hex) */
  overlay: {
    lip?: string;
    cheek?: string;
    eye?: string;
    base?: string;
  };
  /** Honest label when SKU is editorial / not Shopify-approved */
  editorial?: boolean;
  priceUsd: number;
};

export const MAKEUP_TRYON_SLOTS: { id: MakeupTryOnSlot; label: string }[] = [
  { id: "lip", label: "Lip" },
  { id: "blush", label: "Blush" },
  { id: "eye", label: "Eye" },
  { id: "base", label: "Base" },
];

/** Curated makeup available for try-on demos (simulator + catalog links). */
export const makeupTryOnDemo: MakeupTryOnItem[] = [
  {
    id: "sakura-lip-oil",
    sku: "SK-M003",
    slot: "lip",
    name: "Rose Oil Lip Tint",
    brand: "Shortkey Edit",
    type: "Tinted Lip Oil",
    shadeName: "Sakura Rose",
    color: "#C45A62",
    overlay: { lip: "rgba(196, 90, 98, 0.62)" },
    priceUsd: 22,
  },
  {
    id: "glass-gloss",
    sku: "SK-M001",
    slot: "lip",
    name: "Glass Lip Gloss",
    brand: "Shortkey Edit",
    type: "High-Shine Gloss",
    shadeName: "Clear Bloom",
    color: "#E8A0A8",
    overlay: { lip: "rgba(232, 160, 168, 0.55)" },
    priceUsd: 18,
  },
  {
    id: "berry-tint",
    sku: "SK-M014",
    slot: "lip",
    name: "Berry Water Tint",
    brand: "Shortkey Edit",
    type: "Sheer Lip Tint",
    shadeName: "Night Berry",
    color: "#8B3A4A",
    overlay: { lip: "rgba(139, 58, 74, 0.58)" },
    priceUsd: 19,
  },
  {
    id: "peach-blush",
    sku: "SK-M015",
    slot: "blush",
    name: "Peach Flush Stick",
    brand: "Shortkey Edit",
    type: "Cream Blush Tint",
    shadeName: "Peach Sakura",
    color: "#E87868",
    overlay: { cheek: "rgba(232, 120, 104, 0.42)" },
    priceUsd: 23,
  },
  {
    id: "cherry-cheek",
    sku: "SK-M013",
    slot: "blush",
    name: "Cherry Lip Cheek Tint",
    brand: "Shortkey Edit",
    type: "Multi-Use Tint",
    shadeName: "Cherry Petal",
    color: "#C45A6A",
    overlay: {
      cheek: "rgba(196, 90, 106, 0.4)",
      lip: "rgba(196, 90, 106, 0.35)",
    },
    priceUsd: 21,
  },
  {
    id: "sakura-eye",
    sku: "SK-M019",
    slot: "eye",
    name: "Soft Sakura Eye Duo",
    brand: "Shortkey Edit",
    type: "Eyeshadow Duo",
    shadeName: "Petal Taupe",
    color: "#A67C6D",
    overlay: { eye: "rgba(166, 124, 109, 0.45)" },
    editorial: true,
    priceUsd: 28,
  },
  {
    id: "felt-liner",
    sku: "SK-M004",
    slot: "eye",
    name: "Precision Felt Liner",
    brand: "Shortkey Edit",
    type: "Liquid Eyeliner",
    shadeName: "Soft Black",
    color: "#2A2422",
    overlay: { eye: "rgba(42, 36, 34, 0.55)" },
    priceUsd: 16,
  },
  {
    id: "skin-cushion",
    sku: "SK-M010",
    slot: "base",
    name: "Skin Fit Cushion",
    brand: "Shortkey Edit",
    type: "Foundation Cushion",
    shadeName: "Dew 21",
    color: "#E8C4B0",
    overlay: { base: "rgba(232, 196, 176, 0.28)" },
    priceUsd: 38,
  },
  {
    id: "runway-skin-tint",
    sku: "SK-M101",
    slot: "base",
    name: "Translucent Skin Tint",
    brand: "ShortKey Runway",
    type: "Skin Tint",
    shadeName: "Glass Veil",
    color: "#EFE4DC",
    overlay: { base: "rgba(239, 228, 220, 0.32)" },
    editorial: true,
    priceUsd: 38,
  },
  {
    id: "tirtir-cushion",
    sku: "SK-M104",
    slot: "base",
    name: "Mask Fit Red Cushion",
    brand: "TIRTIR Seoul",
    type: "Cushion Foundation",
    shadeName: "Red Cushion 21N",
    color: "#E5C2B0",
    overlay: { base: "rgba(229, 194, 176, 0.3)" },
    editorial: true,
    priceUsd: 32,
  },
];

export const MAKEUP_TRYON_DEFAULT_ID = "sakura-lip-oil";

export function getMakeupTryOnById(id: string): MakeupTryOnItem | undefined {
  return makeupTryOnDemo.find((p) => p.id === id);
}

export function getMakeupTryOnBySku(sku: string): MakeupTryOnItem | undefined {
  const key = sku.toUpperCase();
  return makeupTryOnDemo.find((p) => p.sku.toUpperCase() === key);
}

export function makeupTryOnBySlot(slot: MakeupTryOnSlot): MakeupTryOnItem[] {
  return makeupTryOnDemo.filter((p) => p.slot === slot);
}
