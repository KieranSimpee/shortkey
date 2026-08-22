/**
 * Discovery curation + asset workflow board
 * Hide / add / season move / redesign / buy-real / interview / game stubs
 * ALWAYS TO TRUE — never invent interview copy or DNA
 * File: public/studio-review/discovery-demo/curation.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type CurationRemoved = {
  packId: string;
  file: string;
  note?: string;
  at?: string;
};

export type CurationAdded = {
  id: string;
  packId: string;
  file: string;
  url: string;
  reason: string;
  at?: string;
};

export type SeasonId =
  | "season-01"
  | "season-02"
  | "season-03"
  | "unassigned"
  | "other";

export const SEASON_OPTIONS: { id: SeasonId; label: string }[] = [
  { id: "season-01", label: "Season 1 · Hidden Gems" },
  { id: "season-02", label: "Season 2 (slot)" },
  { id: "season-03", label: "Season 3 (slot)" },
  { id: "unassigned", label: "Unassigned" },
  { id: "other", label: "Other / later" },
];

export type WorkflowKind =
  | "edit"
  | "redesign"
  | "move-season"
  | "buy-real-picture"
  | "interview-story"
  | "add-game";

export type WorkflowStatus = "TODO" | "DOING" | "REVIEW" | "DONE" | "AWAITING";

export type AssetWorkflow = {
  id: string;
  packId: string;
  file: string;
  kind: WorkflowKind;
  status: WorkflowStatus;
  season?: SeasonId;
  note?: string;
  /** Founder-pasted only — empty body = AWAITING (do not invent) */
  interviewStory?: {
    title?: string;
    body?: string;
    source?: string;
  };
  gameStub?: {
    name: string;
    brief?: string;
  };
  at: string;
  updatedAt?: string;
};

/** Per-asset meta (season assignment + flags) */
export type AssetMeta = {
  packId: string;
  file: string;
  season?: SeasonId;
  needsRealPhoto?: boolean;
  redesign?: boolean;
  editNote?: string;
  interviewStory?: {
    title?: string;
    body?: string;
    source?: string;
  };
};

export type DiscoveryCuration = {
  version: 2;
  updatedAt: string;
  honesty: string;
  removed: CurationRemoved[];
  added: CurationAdded[];
  meta: AssetMeta[];
  workflows: AssetWorkflow[];
  games: Array<{
    id: string;
    name: string;
    brief?: string;
    season?: SeasonId;
    status: WorkflowStatus;
    at: string;
  }>;
};

const ROOT = process.cwd();
const CURATION_PATH = path.join(
  ROOT,
  "public",
  "studio-review",
  "discovery-demo",
  "curation.json",
);
const UPLOAD_DIR = path.join(
  ROOT,
  "public",
  "studio-review",
  "discovery-uploads",
);

const ALLOWED_URL_PREFIXES = [
  "/shortkey-assets/",
  "/magazine-demo/",
  "/studio-review/",
  "/logo/",
] as const;

export function emptyCuration(): DiscoveryCuration {
  return {
    version: 2,
    updatedAt: new Date().toISOString(),
    honesty:
      "Hide = discovery only (disk untouched). Workflows = founder queue (edit / redesign / season / buy-real / interview / game). Interview & game briefs = founder paste only — AWAITING if empty. No invented DNA.",
    removed: [],
    added: [],
    meta: [],
    workflows: [],
    games: [],
  };
}

function normalize(raw: Partial<DiscoveryCuration>): DiscoveryCuration {
  const base = emptyCuration();
  return {
    version: 2,
    updatedAt: raw.updatedAt || new Date().toISOString(),
    honesty: raw.honesty || base.honesty,
    removed: Array.isArray(raw.removed) ? raw.removed : [],
    added: Array.isArray(raw.added) ? raw.added : [],
    meta: Array.isArray(raw.meta) ? raw.meta : [],
    workflows: Array.isArray(raw.workflows) ? raw.workflows : [],
    games: Array.isArray(raw.games) ? raw.games : [],
  };
}

export function loadCuration(): DiscoveryCuration {
  try {
    if (!existsSync(CURATION_PATH)) return emptyCuration();
    const raw = JSON.parse(readFileSync(CURATION_PATH, "utf8")) as Partial<DiscoveryCuration>;
    return normalize(raw);
  } catch {
    return emptyCuration();
  }
}

export function saveCuration(data: DiscoveryCuration): DiscoveryCuration {
  const next = normalize({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  mkdirSync(path.dirname(CURATION_PATH), { recursive: true });
  writeFileSync(CURATION_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return next;
}

export function assetKey(packId: string, file: string): string {
  return `${packId}::${file}`;
}

export function getMeta(
  curation: DiscoveryCuration,
  packId: string,
  file: string,
): AssetMeta | undefined {
  return curation.meta.find((m) => assetKey(m.packId, m.file) === assetKey(packId, file));
}

export function upsertMeta(
  curation: DiscoveryCuration,
  patch: AssetMeta,
): DiscoveryCuration {
  const key = assetKey(patch.packId, patch.file);
  const rest = curation.meta.filter((m) => assetKey(m.packId, m.file) !== key);
  const prev = curation.meta.find((m) => assetKey(m.packId, m.file) === key);
  rest.push({ ...prev, ...patch });
  curation.meta = rest;
  return curation;
}

export function pushWorkflow(
  curation: DiscoveryCuration,
  wf: Omit<AssetWorkflow, "id" | "at"> & { id?: string },
): DiscoveryCuration {
  const id = wf.id || `wf_${Date.now().toString(36)}`;
  curation.workflows.unshift({
    ...wf,
    id,
    at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return curation;
}

export function isAllowedPublicUrl(url: string): boolean {
  if (!url.startsWith("/") || url.includes("..") || url.includes("\\")) return false;
  return ALLOWED_URL_PREFIXES.some((p) => url.startsWith(p));
}

export function ensureUploadDir(): string {
  mkdirSync(UPLOAD_DIR, { recursive: true });
  return UPLOAD_DIR;
}

export function uploadPublicUrl(filename: string): string {
  return `/studio-review/discovery-uploads/${filename}`;
}

export function curationPath(): string {
  return CURATION_PATH;
}

export function canWriteCuration(request: Request): boolean {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0]?.toLowerCase() || "";
  if (
    hostname === "127.0.0.1" ||
    hostname === "localhost" ||
    hostname === "::1"
  ) {
    return true;
  }
  if (process.env.SHORTKEY_SURFACE === "studio") return true;
  return false;
}

/** Honest story payload for UI — never invent body */
export function resolveInterviewStory(
  curation: DiscoveryCuration,
  packId: string,
  file: string,
): { status: "HAS_STORY" | "AWAITING"; title?: string; body?: string; source?: string } {
  const meta = getMeta(curation, packId, file);
  const story = meta?.interviewStory;
  const body = (story?.body || "").trim();
  if (body) {
    return {
      status: "HAS_STORY",
      title: story?.title,
      body,
      source: story?.source,
    };
  }
  return {
    status: "AWAITING",
    title: story?.title,
    source: story?.source,
  };
}
