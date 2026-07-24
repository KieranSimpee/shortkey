/**
 * Creator Circle — Early Access form types (shortkey.social staging).
 * No payment system · no marketplace · no selection guarantees.
 */

export const SOCIAL_EARLY_ACCESS_VERSION = "0.2" as const;
export const SOCIAL_LOCAL_STORAGE_KEY = "shortkey-social-early-access-v02";

export const SOCIAL_SUBMISSION_STATUSES = [
  "Submitted",
  "Under Review",
  "Invited",
] as const;

export const SOCIAL_DEFAULT_STATUS = "Submitted" as const;

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

export type SocialSubmissionStatus = (typeof SOCIAL_SUBMISSION_STATUSES)[number];
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type SocialCategory = (typeof SOCIAL_CATEGORIES)[number];
export type SocialFollowerRange = (typeof SOCIAL_FOLLOWER_RANGES)[number];
export type SocialCollabType = (typeof SOCIAL_COLLAB_TYPES)[number];
export type SocialPayoutBand = (typeof SOCIAL_PAYOUT_BANDS)[number];

export interface SocialEarlyAccessEntry {
  id: string;
  createdAt: string;
  /** Pipeline status — new submissions default to Submitted */
  status: SocialSubmissionStatus;
  name: string;
  email: string;
  country: string;
  platform: SocialPlatform;
  handle: string;
  followerRange: SocialFollowerRange;
  beautyCategory: SocialCategory;
  preferredCollabType: SocialCollabType;
  preferredPayoutBand: SocialPayoutBand;
  /** Optional portfolio / media kit URL */
  portfolioLink: string;
  notes: string;
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
