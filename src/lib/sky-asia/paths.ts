import path from "path";

/** Repo-root SKY_ASIA_OS folder (JSON + markdown ops data). */
export const SKY_ASIA_OS_ROOT = path.join(process.cwd(), "SKY_ASIA_OS");

export const DB_DIR = path.join(SKY_ASIA_OS_ROOT, "05_Database");
export const TASKS_PATH = path.join(
  SKY_ASIA_OS_ROOT,
  "00_Headquarters",
  "tasks",
  "tasks.json",
);
export const SEASON_01_PATH = path.join(
  SKY_ASIA_OS_ROOT,
  "04_Season01",
  "season-01.json",
);
export const KNOWLEDGE_DIR = path.join(
  SKY_ASIA_OS_ROOT,
  "00_Headquarters",
  "knowledge",
);
export const KNOWLEDGE_INDEX = path.join(
  SKY_ASIA_OS_ROOT,
  "KNOWLEDGE_HUB",
  "INDEX.md",
);

export type DbName =
  | "artists"
  | "creators"
  | "brands"
  | "festivals"
  | "culture";

export function dbPath(name: DbName): string {
  return path.join(DB_DIR, `${name}.json`);
}
