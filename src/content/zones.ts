export type ZoneStatus = "none" | "needs-change" | "in-progress" | "review" | "approved";

export type CmsZoneDefinition = {
  id: string;
  label: string;
  description: string;
  contentPath: string;
  fields: string[];
};

export const cmsZones: CmsZoneDefinition[] = [
  {
    id: "header",
    label: "Header & Navigation",
    description: "Sticky welcome bar at the very top.",
    contentPath: "src/content/homepage.ts → header",
    fields: ["welcome"],
  },
  {
    id: "header-brand",
    label: "Brand Nav Section",
    description:
      "Section between sticky header and hero — Beauty label, category nav, search, cart, AI Lab CTA.",
    contentPath: "src/content/homepage.ts → header",
    fields: [
      "categoryLabel",
      "searchPlaceholder",
      "nav[].label",
      "nav[].href",
      "cta.label",
      "cartCount",
    ],
  },
  {
    id: "hero",
    label: "Hero Banner",
    description: "Template hero without bottle — copy, model, skin analysis + routine, Beauty OS.",
    contentPath: "src/content/homepage.ts → hero",
    fields: [
      "posters[]",
      "defaultPoster",
      "rotateMs",
      "modelHeadImage",
      "atmosphereImage",
      "statsCard",
      "skincareRoutine",
      "tryOnModelImage",
      "tryOnStudio",
      "launchImage",
      "partnersImage",
      "sealLabel",
    ],
  },
  {
    id: "beauty-os",
    label: "Beauty OS Bar",
    description: "Shortcut categories overlaid on the hero bottom.",
    contentPath: "src/content/homepage.ts → beautyOs",
    fields: [
      "label",
      "categories[].label",
      "categories[].shortcuts[].shortcut",
      "categories[].shortcuts[].label",
    ],
  },
  {
    id: "commands",
    label: "Choose Your Command",
    description: "Six command cards grid.",
    contentPath: "src/content/homepage.ts → commands",
    fields: ["titleLeft", "cards[].title", "cards[].shortcut", "cards[].image"],
  },
  {
    id: "ai-lab",
    label: "Influencer Introduction",
    description:
      "Creator hosts for live streaming, fan try-on sessions, and screenshot looks.",
    contentPath: "src/content/homepage.ts → aiLab",
    fields: [
      "badge",
      "title",
      "subtitle",
      "hostTabs[].label",
      "hosts[].name",
      "hosts[].handle",
      "hosts[].bio",
      "hosts[].shopHref",
      "hosts[].image",
      "hosts[].status",
      "hosts[].activity",
      "hosts[].brands[]",
      "hosts[].shopProducts[]",
      "hosts[].liveClips[]",
      "hosts[].blogPosts[]",
      "cta.label",
    ],
  },
  {
    id: "brands",
    label: "For Beauty Brands",
    description: "Partner pitch, features list, and stats.",
    contentPath: "src/content/homepage.ts → brands",
    fields: ["title", "description", "features[]", "stats[]", "cta.label"],
  },
  {
    id: "footer",
    label: "Footer",
    description: "Newsletter, link groups, social, and copyright.",
    contentPath: "src/content/homepage.ts → footer",
    fields: ["newsletter.*", "linkGroups[]", "social[]", "copyright"],
  },
];

export const zoneStatusLabels: Record<ZoneStatus, string> = {
  none: "No flag",
  "needs-change": "Needs change",
  "in-progress": "In progress",
  review: "Ready for review",
  approved: "Approved",
};

export const zoneStatusColors: Record<ZoneStatus, string> = {
  none: "transparent",
  "needs-change": "#E8766A",
  "in-progress": "#6B9FD4",
  review: "#9B7FD4",
  approved: "#6BBF8A",
};

export function getZoneById(id: string) {
  return cmsZones.find((z) => z.id === id);
}

export function getZoneOrScannedLabel(
  id: string,
  scanned?: { id: string; label: string; description: string; className?: string; tag?: string },
) {
  return getZoneById(id)?.label ?? scanned?.label ?? id;
}
