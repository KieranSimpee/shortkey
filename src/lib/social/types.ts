/**
 * Creator Early Access — interest form types (shortkey.social staging).
 * No payment system · no marketplace · no selection guarantees.
 */

export const SOCIAL_EARLY_ACCESS_VERSION = "0.1" as const;
export const SOCIAL_LOCAL_STORAGE_KEY = "shortkey-social-early-access-v01";

export const SOCIAL_PLATFORMS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Other",
] as const;

export const SOCIAL_CATEGORIES = [
  "Beauty",
  "Skincare",
  "Makeup",
  "Lifestyle",
  "Other",
] as const;

export const SOCIAL_FOLLOWER_RANGES = [
  "<1k",
  "1–10k",
  "10–50k",
  "50–100k",
  "100k+",
] as const;

export const SOCIAL_COLLAB_TYPES = [
  "Gifted",
  "Paid",
  "Affiliate",
  "Hybrid",
] as const;

/** Placeholder bands only — no payment system in staging. */
export const SOCIAL_PAYOUT_BANDS = [
  "Not sure yet",
  "Gifted / product only",
  "Under $100",
  "$100–$500",
  "$500–$1,500",
  "$1,500+",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type SocialCategory = (typeof SOCIAL_CATEGORIES)[number];
export type SocialFollowerRange = (typeof SOCIAL_FOLLOWER_RANGES)[number];
export type SocialCollabType = (typeof SOCIAL_COLLAB_TYPES)[number];
export type SocialPayoutBand = (typeof SOCIAL_PAYOUT_BANDS)[number];

export interface SocialEarlyAccessEntry {
  id: string;
  createdAt: string;
  name: string;
  /** Handle or email — required contact identity */
  handleOrEmail: string;
  platform: SocialPlatform;
  category: SocialCategory;
  followerRange: SocialFollowerRange;
  location: string;
  collabType: SocialCollabType;
  payoutBand: SocialPayoutBand;
}

export type SocialStoreMode = "file" | "ephemeral";

export interface SocialStoreMeta {
  shared: boolean;
  mode: SocialStoreMode;
  version: typeof SOCIAL_EARLY_ACCESS_VERSION;
  honesty: string;
  count: number;
}

export interface SocialEarlyAccessState {
  version: typeof SOCIAL_EARLY_ACCESS_VERSION;
  entries: SocialEarlyAccessEntry[];
}
