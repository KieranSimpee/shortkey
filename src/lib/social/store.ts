/**
 * Creator Circle Early Access — local/dev store.
 *
 * Backends (first match wins):
 * 1. Local JSON file — NODE_ENV=development or SOCIAL_FILE_STORE=1
 *    → data/social-early-access.json
 * 2. In-memory ephemeral — shared:false
 *
 * No Upstash required. Browser may also use localStorage fallback.
 * Not production · no payment · no marketplace.
 */

import { promises as fs } from "fs";
import path from "path";
import type {
  SocialEarlyAccessEntry,
  SocialEarlyAccessState,
  SocialStoreMeta,
  SocialStoreMode,
  SocialSubmissionStatus,
} from "@/lib/social/types";
import {
  SOCIAL_DEFAULT_STATUS,
  SOCIAL_EARLY_ACCESS_VERSION,
  SOCIAL_SUBMISSION_STATUSES,
} from "@/lib/social/types";

const FILE_REL = path.join("data", "social-early-access.json");

const HONESTY_FILE =
  "Local/dev shared file store (data/social-early-access.json) · staging interest list · not production · no Upstash required.";
const HONESTY_EPHEMERAL =
  "Ephemeral in-memory only · lost on restart · not shared across devices.";

let memoryState: SocialEarlyAccessState = {
  version: SOCIAL_EARLY_ACCESS_VERSION,
  entries: [],
};

function useFileStore(): boolean {
  if (process.env.SOCIAL_FILE_STORE === "1") return true;
  return process.env.NODE_ENV === "development";
}

function filePath(): string {
  return path.join(process.cwd(), FILE_REL);
}

function metaFor(mode: SocialStoreMode, count: number): SocialStoreMeta {
  return {
    shared: mode === "file",
    mode,
    version: SOCIAL_EARLY_ACCESS_VERSION,
    honesty: mode === "file" ? HONESTY_FILE : HONESTY_EPHEMERAL,
    count,
  };
}

function emptyState(): SocialEarlyAccessState {
  return { version: SOCIAL_EARLY_ACCESS_VERSION, entries: [] };
}

function isStatus(v: unknown): v is SocialSubmissionStatus {
  return (
    typeof v === "string" &&
    (SOCIAL_SUBMISSION_STATUSES as readonly string[]).includes(v)
  );
}

function normalizeEntry(raw: unknown): SocialEarlyAccessEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.createdAt !== "string") return null;
  if (typeof o.name !== "string") return null;

  // Support legacy v0.1 shape (handleOrEmail / location / category / collabType / payoutBand)
  const email =
    typeof o.email === "string"
      ? o.email
      : typeof o.handleOrEmail === "string" && String(o.handleOrEmail).includes("@")
        ? String(o.handleOrEmail)
        : "";
  const handle =
    typeof o.handle === "string"
      ? o.handle
      : typeof o.handleOrEmail === "string" && !String(o.handleOrEmail).includes("@")
        ? String(o.handleOrEmail)
        : typeof o.handleOrEmail === "string"
          ? String(o.handleOrEmail)
          : "";
  const country =
    typeof o.country === "string"
      ? o.country
      : typeof o.location === "string"
        ? o.location
        : "";
  const beautyCategory =
    typeof o.beautyCategory === "string"
      ? o.beautyCategory
      : typeof o.category === "string"
        ? o.category
        : "Other";
  const preferredCollabType =
    typeof o.preferredCollabType === "string"
      ? o.preferredCollabType
      : typeof o.collabType === "string"
        ? o.collabType
        : "Gifted";
  const preferredPayoutBand =
    typeof o.preferredPayoutBand === "string"
      ? o.preferredPayoutBand
      : typeof o.payoutBand === "string"
        ? o.payoutBand
        : "Not sure yet";

  return {
    id: o.id,
    createdAt: o.createdAt,
    status: isStatus(o.status) ? o.status : SOCIAL_DEFAULT_STATUS,
    name: o.name,
    email,
    country,
    platform: (typeof o.platform === "string" ? o.platform : "Other") as SocialEarlyAccessEntry["platform"],
    handle,
    followerRange: (typeof o.followerRange === "string"
      ? o.followerRange
      : "<1k") as SocialEarlyAccessEntry["followerRange"],
    beautyCategory: beautyCategory as SocialEarlyAccessEntry["beautyCategory"],
    preferredCollabType:
      preferredCollabType as SocialEarlyAccessEntry["preferredCollabType"],
    preferredPayoutBand:
      preferredPayoutBand as SocialEarlyAccessEntry["preferredPayoutBand"],
    portfolioLink: typeof o.portfolioLink === "string" ? o.portfolioLink : "",
    notes: typeof o.notes === "string" ? o.notes : "",
  };
}

function normalizeState(raw: unknown): SocialEarlyAccessState {
  if (!raw || typeof raw !== "object") return emptyState();
  const o = raw as Partial<SocialEarlyAccessState>;
  const entries = Array.isArray(o.entries)
    ? o.entries
        .map(normalizeEntry)
        .filter((e): e is SocialEarlyAccessEntry => e !== null)
    : [];
  return {
    version: SOCIAL_EARLY_ACCESS_VERSION,
    entries,
  };
}

async function readFileState(): Promise<SocialEarlyAccessState | null> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return normalizeState(JSON.parse(raw));
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") return null;
    throw err;
  }
}

async function writeFileState(state: SocialEarlyAccessState): Promise<void> {
  const dir = path.dirname(filePath());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify(state, null, 2), "utf8");
}

export function newSocialEntryId(): string {
  return `sea_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadSocialEarlyAccess(): Promise<{
  state: SocialEarlyAccessState;
  meta: SocialStoreMeta;
}> {
  if (useFileStore()) {
    const existing = await readFileState();
    if (existing) {
      memoryState = existing;
      return { state: existing, meta: metaFor("file", existing.entries.length) };
    }
    const seed = emptyState();
    await writeFileState(seed);
    memoryState = seed;
    return { state: seed, meta: metaFor("file", 0) };
  }
  return { state: memoryState, meta: metaFor("ephemeral", memoryState.entries.length) };
}

export async function appendSocialEarlyAccess(
  entry: Omit<SocialEarlyAccessEntry, "id" | "createdAt" | "status"> & {
    id?: string;
    createdAt?: string;
    status?: SocialSubmissionStatus;
  },
): Promise<{
  entry: SocialEarlyAccessEntry;
  state: SocialEarlyAccessState;
  meta: SocialStoreMeta;
}> {
  const full: SocialEarlyAccessEntry = {
    id: entry.id || newSocialEntryId(),
    createdAt: entry.createdAt || new Date().toISOString(),
    status: entry.status || SOCIAL_DEFAULT_STATUS,
    name: entry.name,
    email: entry.email,
    country: entry.country,
    platform: entry.platform,
    handle: entry.handle,
    followerRange: entry.followerRange,
    beautyCategory: entry.beautyCategory,
    preferredCollabType: entry.preferredCollabType,
    preferredPayoutBand: entry.preferredPayoutBand,
    portfolioLink: entry.portfolioLink || "",
    notes: entry.notes || "",
  };

  const { state } = await loadSocialEarlyAccess();
  const next: SocialEarlyAccessState = {
    version: SOCIAL_EARLY_ACCESS_VERSION,
    entries: [full, ...state.entries].slice(0, 5000),
  };
  memoryState = next;

  if (useFileStore()) {
    await writeFileState(next);
    return { entry: full, state: next, meta: metaFor("file", next.entries.length) };
  }
  return { entry: full, state: next, meta: metaFor("ephemeral", next.entries.length) };
}
