/**
 * Sky Collective Intelligence OS — lightweight orchestrator helpers.
 * Classifies domain → returns family weights from families.json.
 * Cursor uses this for routing decisions; full multi-model collection is Hub/Studio.
 */

import families from "./families.json";
import registry from "./capability-registry.json";

export type RouteKey = keyof typeof families.routing;
export type FamilyKey = keyof typeof families.families;

export type SkyClassification = {
  route: RouteKey | FamilyKey;
  weights: Record<string, number>;
  purpose: string[];
  formula: string;
};

const KEYWORDS: { route: RouteKey; keys: string[] }[] = [
  { route: "UX_DESIGN", keys: ["ux", "ui", "journey", "whitespace", "design system", "homepage", "minimal"] },
  { route: "SITE_DEVELOPMENT", keys: ["implement", "code", "component", "next.js", "refactor", "build", "fix"] },
  { route: "FULL_PLATFORM_ARCHITECTURE", keys: ["architecture", "infrastructure", "scale", "platform design"] },
  { route: "DEEP_RESEARCH", keys: ["deep research", "investigate", "root cause"] },
  { route: "RESEARCH", keys: ["research", "analyze", "synthesis"] },
  { route: "COMPETITOR_RESEARCH", keys: ["competitor", "competitive"] },
  { route: "BRAND_POSITIONING", keys: ["brand", "positioning", "messaging", "naming"] },
  { route: "PRODUCT_STRATEGY", keys: ["product strategy", "roadmap", "vision"] },
  { route: "STARTUP_VALIDATION", keys: ["pmf", "validation", "startup"] },
  { route: "ROADMAP_PLANNING", keys: ["roadmap"] },
];

/** Classify a natural-language task into a Sky routing key. */
export function classifyTask(input: string): RouteKey {
  const q = input.toLowerCase();
  for (const row of KEYWORDS) {
    if (row.keys.some((k) => q.includes(k))) return row.route;
  }
  return "SITE_DEVELOPMENT";
}

/** Resolve weights for a route or family name. */
export function getWeights(routeOrFamily: string): Record<string, number> {
  const routing = families.routing as Record<string, Record<string, number>>;
  if (routing[routeOrFamily]) return { ...routing[routeOrFamily] };
  const fam = families.families as Record<string, { weights: Record<string, number> }>;
  if (fam[routeOrFamily]) return { ...fam[routeOrFamily].weights };
  return { ...routing.SITE_DEVELOPMENT };
}

export function classify(input: string): SkyClassification {
  const route = classifyTask(input);
  const weights = getWeights(route);
  const familyHint =
    route.includes("UX")
      ? "UX"
      : route.includes("ARCH")
        ? "ARCHITECTURE"
        : route.includes("RESEARCH") || route.includes("COMPETITOR")
          ? "RESEARCH"
          : route.includes("STRATEGY") || route.includes("PRODUCT") || route.includes("ROADMAP") || route.includes("BRAND") || route.includes("STARTUP")
            ? "STRATEGY"
            : "DEVELOPMENT";
  const fam = (families.families as Record<string, { purpose: string[] }>)[familyHint];
  return {
    route,
    weights,
    purpose: fam?.purpose ?? ["Software Development"],
    formula: families.consensusFormula,
  };
}

/** Consensus score helper (0–1 normalized weights assumed). */
export function consensusScore(parts: {
  model: string;
  weight: number;
  historicalAccuracy: number;
  confidence: number;
  taskRelevance: number;
}): number {
  const reg = (registry.models as Record<string, { confidence: number }>)[parts.model];
  const modelConf = (reg?.confidence ?? 80) / 100;
  return (
    parts.weight *
    parts.historicalAccuracy *
    parts.confidence *
    parts.taskRelevance *
    modelConf
  );
}

export function listModels() {
  return Object.keys(registry.models);
}
