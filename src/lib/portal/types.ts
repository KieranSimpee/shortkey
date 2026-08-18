export const PORTAL_LANES = ["brand", "creator", "soul"] as const;

export type PortalLane = (typeof PORTAL_LANES)[number];

export type PortalStory = {
  id: string;
  lane: PortalLane;
  brandName: string;
  title: string;
  story: string;
  imageUrl: string;
  sortOrder: number;
};

export type PortalSource = "airtable" | "seed";

export type PortalStoriesResponse = {
  ok: true;
  source: PortalSource;
  airtableConfigured: boolean;
  lane: PortalLane;
  stories: PortalStory[];
};

export function isPortalLane(value: string): value is PortalLane {
  return (PORTAL_LANES as readonly string[]).includes(value);
}

export function laneCopy(lane: PortalLane): {
  en: string;
  zh: string;
  hint: string;
} {
  switch (lane) {
    case "brand":
      return {
        en: "Brand Story",
        zh: "品牌展示",
        hint: "DNA · J / K / C lanes · life force",
      };
    case "creator":
      return {
        en: "Creator Hub",
        zh: "創作人共鳴",
        hint: "Brand → Creator Circle → Community",
      };
    case "soul":
      return {
        en: "AI Soul Lab",
        zh: "AI 靈魂開發",
        hint: "Family seats · Control Center · Maya",
      };
    default: {
      const _exhaustive: never = lane;
      return _exhaustive;
    }
  }
}
