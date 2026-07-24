/**
 * Creator Early Access — local/dev store.
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
} from "@/lib/social/types";
import { SOCIAL_EARLY_ACCESS_VERSION } from "@/lib/social/types";

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

function normalizeState(raw: unknown): SocialEarlyAccessState {
  if (!raw || typeof raw !== "object") return emptyState();
  const o = raw as Partial<SocialEarlyAccessState>;
  return {
    version: SOCIAL_EARLY_ACCESS_VERSION,
    entries: Array.isArray(o.entries) ? (o.entries as SocialEarlyAccessEntry[]) : [],
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
  entry: Omit<SocialEarlyAccessEntry, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  },
): Promise<{
  entry: SocialEarlyAccessEntry;
  state: SocialEarlyAccessState;
  meta: SocialStoreMeta;
}> {
  const full: SocialEarlyAccessEntry = {
    id: entry.id || newSocialEntryId(),
    createdAt: entry.createdAt || new Date().toISOString(),
    name: entry.name,
    handleOrEmail: entry.handleOrEmail,
    platform: entry.platform,
    category: entry.category,
    followerRange: entry.followerRange,
    location: entry.location,
    collabType: entry.collabType,
    payoutBand: entry.payoutBand,
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
