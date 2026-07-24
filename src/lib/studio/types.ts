/**
 * ShortKey Studio v0.1 — internal control center types.
 * Source of truth for DNA / domains / campaigns / plans.
 * Not production-ready · no real publish / deploy.
 */

import type { BrandIdentityBenchmarkMap } from "@/lib/studio/brandIdentityLanes";
import type { CampaignHallyuFormula } from "@/lib/studio/hallyuFormula";

export const STUDIO_VERSION = "0.1" as const;
export const STUDIO_LOCAL_STORAGE_KEY = "shortkey-studio-v01";

export const STUDIO_STATUSES = [
  "DRAFT",
  "IN_REVIEW",
  "GOR_GOR_REVIEW",
  "KIERAN_REVIEW_READY",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
  "ROLLBACK_READY",
  "DO_NOT_USE",
] as const;

export type StudioStatus = (typeof STUDIO_STATUSES)[number];

export const STUDIO_ACTORS = ["Kieran", "Gor Gor"] as const;
export type StudioActor = (typeof STUDIO_ACTORS)[number];

export type StudioEntityType =
  | "brandDna"
  | "asset"
  | "campaign"
  | "domain"
  | "country"
  | "deploymentPlan"
  | "rollbackRef"
  | "versionSnapshot"
  | "identityBenchmark";

export type StudioPageId =
  | "dashboard"
  | "brand-dna"
  | "identity"
  | "assets"
  | "campaigns"
  | "domains"
  | "deployments"
  | "versions"
  | "preview";

export const STUDIO_PAGES: { id: StudioPageId; label: string }[] = [
  { id: "dashboard", label: "Studio Dashboard" },
  { id: "brand-dna", label: "Brand DNA Center" },
  { id: "identity", label: "Identity Benchmark Map" },
  { id: "assets", label: "Asset Library" },
  { id: "campaigns", label: "Campaign Manager" },
  { id: "domains", label: "Domain Manager" },
  { id: "deployments", label: "Deployment Plans" },
  { id: "versions", label: "Version History" },
  { id: "preview", label: "Preview Mode" },
];

export interface BrandDNA {
  id: string;
  label: string;
  tagline: string;
  points: string[];
  copyBlocks: { label: string; text: string }[];
  buildOrder: string[];
  status: StudioStatus;
  updatedAt: string;
}

export interface StudioAsset {
  id: string;
  name: string;
  kind: "image" | "copy" | "video" | "doc" | "other";
  domainIds: string[];
  status: StudioStatus;
  notes: string;
  updatedAt: string;
}

export interface StudioCampaign {
  id: string;
  name: string;
  domainIds: string[];
  countryIds: string[];
  assetIds: string[];
  status: StudioStatus;
  notes: string;
  updatedAt: string;
  /**
   * Optional Hallyu → Creator formula + Product Story Readiness.
   * Absent on older persisted state — migrate gracefully.
   */
  hallyuFormula?: CampaignHallyuFormula;
}

export interface StudioDomain {
  id: string;
  hostname: string;
  purpose: string;
  status: StudioStatus;
  notes: string;
  updatedAt: string;
}

export interface StudioCountry {
  id: string;
  code: string;
  label: string;
  localeHint: string;
  status: StudioStatus;
  notes: string;
  updatedAt: string;
}

/** Records only — no real Vercel / production deploy. */
export interface StudioDeploymentPlan {
  id: string;
  title: string;
  domainIds: string[];
  campaignIds: string[];
  scheduledFor: string | null;
  status: StudioStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** Rollback reference records only — no automated rollback. */
export interface StudioRollbackRef {
  id: string;
  title: string;
  snapshotId: string | null;
  domainIds: string[];
  status: StudioStatus;
  notes: string;
  createdAt: string;
}

export interface StudioVersionSnapshot {
  id: string;
  label: string;
  createdAt: string;
  createdBy: StudioActor;
  note: string;
  /** Full Studio state at snapshot time (nested snapshots stripped). */
  state: StudioStatePayload;
}

export interface StudioApprovalLog {
  id: string;
  entityType: StudioEntityType;
  entityId: string;
  entityLabel: string;
  who: StudioActor;
  when: string;
  fromStatus: StudioStatus;
  toStatus: StudioStatus;
  note: string;
}

/** Persistable payload (excludes nested snapshot blobs for size control). */
export interface StudioStatePayload {
  version: typeof STUDIO_VERSION;
  brandDna: BrandDNA;
  assets: StudioAsset[];
  campaigns: StudioCampaign[];
  domains: StudioDomain[];
  countries: StudioCountry[];
  deploymentPlans: StudioDeploymentPlan[];
  rollbackRefs: StudioRollbackRef[];
  approvalLogs: StudioApprovalLog[];
  /**
   * Brand Identity Benchmark Map (J/K/C lanes).
   * Optional on older persisted state — migrate fills from seed.
   */
  identityBenchmark?: BrandIdentityBenchmarkMap;
}

export interface StudioState extends StudioStatePayload {
  versionSnapshots: StudioVersionSnapshot[];
}

export type StudioStoreMode = "file" | "ephemeral";

export interface StudioStoreMeta {
  shared: boolean;
  mode: StudioStoreMode;
  version: typeof STUDIO_VERSION;
  honesty: string;
}

export function isStudioStatus(v: unknown): v is StudioStatus {
  return typeof v === "string" && (STUDIO_STATUSES as readonly string[]).includes(v);
}

export function isStudioActor(v: unknown): v is StudioActor {
  return typeof v === "string" && (STUDIO_ACTORS as readonly string[]).includes(v);
}

export function isStudioPageId(v: unknown): v is StudioPageId {
  return (
    typeof v === "string" &&
    STUDIO_PAGES.some((p) => p.id === v)
  );
}
