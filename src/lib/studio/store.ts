/**
 * ShortKey Studio v0.1 — local/dev store.
 *
 * Backends (first match wins):
 * 1. Local JSON file — NODE_ENV=development or STUDIO_FILE_STORE=1
 *    → data/studio-v01.json
 * 2. In-memory ephemeral — shared:false
 *
 * No Upstash required for v0.1. Browser may also use localStorage fallback.
 */

import { promises as fs } from "fs";
import path from "path";
import { createStudioSeed } from "@/lib/studio/seed";
import { createSeedIdentityBenchmark } from "@/lib/studio/brandIdentityLanes";
import {
  createSeedHallyuFormula,
  HALLYU_SEED_CAMPAIGN_ID,
} from "@/lib/studio/hallyuFormula";
import type {
  StudioCampaign,
  StudioState,
  StudioStatePayload,
  StudioStoreMeta,
  StudioStoreMode,
  StudioVersionSnapshot,
} from "@/lib/studio/types";
import { STUDIO_VERSION } from "@/lib/studio/types";

const FILE_REL = path.join("data", "studio-v01.json");

const HONESTY_FILE =
  "Local/dev shared file store (data/studio-v01.json) · internal staging · not production · no Upstash required.";
const HONESTY_EPHEMERAL =
  "Ephemeral in-memory only · lost on restart · not shared across devices.";

let memoryState: StudioState = createStudioSeed();

function useFileStore(): boolean {
  if (process.env.STUDIO_FILE_STORE === "1") return true;
  return process.env.NODE_ENV === "development";
}

function filePath(): string {
  return path.join(process.cwd(), FILE_REL);
}

function metaFor(mode: StudioStoreMode): StudioStoreMeta {
  return {
    shared: mode === "file",
    mode,
    version: STUDIO_VERSION,
    honesty: mode === "file" ? HONESTY_FILE : HONESTY_EPHEMERAL,
  };
}

function stripSnapshots(state: StudioState): StudioStatePayload {
  const { versionSnapshots: _vs, ...payload } = state;
  return payload;
}

/** Ensure Hallyu seed campaign exists; preserve user edits when present. */
function migrateCampaigns(campaigns: StudioCampaign[]): StudioCampaign[] {
  const seed = createStudioSeed();
  const hallyuSeed = seed.campaigns.find((c) => c.id === HALLYU_SEED_CAMPAIGN_ID);
  if (!hallyuSeed) return campaigns;

  const idx = campaigns.findIndex((c) => c.id === HALLYU_SEED_CAMPAIGN_ID);
  if (idx < 0) {
    return [...campaigns, hallyuSeed];
  }

  const existing = campaigns[idx];
  if (!existing.hallyuFormula) {
    const next = [...campaigns];
    next[idx] = {
      ...existing,
      hallyuFormula: existing.hallyuFormula ?? createSeedHallyuFormula(),
      status: existing.status === "DRAFT" ? "GOR_GOR_REVIEW" : existing.status,
    };
    return next;
  }
  return campaigns;
}

function normalizeState(raw: unknown): StudioState {
  if (!raw || typeof raw !== "object") return createStudioSeed();
  const o = raw as Partial<StudioState>;
  const seed = createStudioSeed();
  return {
    version: STUDIO_VERSION,
    brandDna: o.brandDna && typeof o.brandDna === "object" ? { ...seed.brandDna, ...o.brandDna } : seed.brandDna,
    assets: Array.isArray(o.assets) ? o.assets : seed.assets,
    campaigns: migrateCampaigns(Array.isArray(o.campaigns) ? o.campaigns : seed.campaigns),
    domains: Array.isArray(o.domains) ? o.domains : seed.domains,
    countries: Array.isArray(o.countries) ? o.countries : seed.countries,
    deploymentPlans: Array.isArray(o.deploymentPlans) ? o.deploymentPlans : seed.deploymentPlans,
    rollbackRefs: Array.isArray(o.rollbackRefs) ? o.rollbackRefs : seed.rollbackRefs,
    approvalLogs: Array.isArray(o.approvalLogs) ? o.approvalLogs : seed.approvalLogs,
    identityBenchmark:
      o.identityBenchmark && typeof o.identityBenchmark === "object"
        ? { ...createSeedIdentityBenchmark(), ...o.identityBenchmark }
        : seed.identityBenchmark ?? createSeedIdentityBenchmark(),
    versionSnapshots: Array.isArray(o.versionSnapshots) ? o.versionSnapshots : [],
  };
}

async function readFileState(): Promise<StudioState | null> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return normalizeState(JSON.parse(raw));
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") return null;
    throw err;
  }
}

async function writeFileState(state: StudioState): Promise<void> {
  const dir = path.dirname(filePath());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify(state, null, 2), "utf8");
}

export async function loadStudioState(): Promise<{
  state: StudioState;
  meta: StudioStoreMeta;
}> {
  if (useFileStore()) {
    const existing = await readFileState();
    if (existing) {
      memoryState = existing;
      return { state: existing, meta: metaFor("file") };
    }
    const seed = createStudioSeed();
    await writeFileState(seed);
    memoryState = seed;
    return { state: seed, meta: metaFor("file") };
  }
  return { state: memoryState, meta: metaFor("ephemeral") };
}

export async function saveStudioState(next: StudioState): Promise<{
  state: StudioState;
  meta: StudioStoreMeta;
}> {
  const state = normalizeState(next);
  memoryState = state;
  if (useFileStore()) {
    await writeFileState(state);
    return { state, meta: metaFor("file") };
  }
  return { state, meta: metaFor("ephemeral") };
}

export function snapshotPayload(state: StudioState): StudioStatePayload {
  return stripSnapshots(state);
}

export function newStudioId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function buildVersionSnapshot(
  state: StudioState,
  opts: { createdBy: StudioVersionSnapshot["createdBy"]; label?: string; note?: string },
): StudioVersionSnapshot {
  const createdAt = new Date().toISOString();
  return {
    id: newStudioId("snap"),
    label: opts.label?.trim() || `Snapshot ${createdAt}`,
    createdAt,
    createdBy: opts.createdBy,
    note: opts.note?.trim() || "",
    state: snapshotPayload(state),
  };
}
