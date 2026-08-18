import { promises as fs } from "fs";
import path from "path";
import {
  COVER_READY_PATH,
  COVER_STORY_PATH,
  dbPath,
  KNOWLEDGE_DIR,
  KNOWLEDGE_INDEX,
  SEASON_01_PATH,
  TASKS_PATH,
  type DbName,
} from "./paths";

export type JsonRecord = Record<string, unknown>;

export async function readJsonArray(filePath: string): Promise<JsonRecord[]> {
  const raw = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`Expected JSON array at ${filePath}`);
  }
  return data as JsonRecord[];
}

export async function writeJsonArray(
  filePath: string,
  rows: JsonRecord[],
): Promise<void> {
  await fs.writeFile(filePath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export async function readDb(name: DbName): Promise<JsonRecord[]> {
  return readJsonArray(dbPath(name));
}

export async function appendDb(
  name: DbName,
  row: JsonRecord,
): Promise<JsonRecord[]> {
  const rows = await readDb(name);
  rows.push(row);
  await writeJsonArray(dbPath(name), rows);
  return rows;
}

export async function readTasks(): Promise<JsonRecord[]> {
  return readJsonArray(TASKS_PATH);
}

export async function appendTask(row: JsonRecord): Promise<JsonRecord[]> {
  const rows = await readTasks();
  rows.push(row);
  await writeJsonArray(TASKS_PATH, rows);
  return rows;
}

export type Season01 = {
  id: string;
  title: string;
  theme: string;
  status: string;
  countries: string[];
  deadline: string;
  mode?: string;
  coverStory?: {
    title: string;
    path: string;
    checklist: string;
    status: string;
    gates: {
      gor_gor_review: string;
      kieran_approval: string;
    };
  };
  framework: Array<{
    slot: string;
    title: string;
    angle: string;
    status: string;
    path?: string;
  }>;
  slots: Array<{
    id: string;
    file: string;
    status: string;
    content?: string;
  }>;
};

export async function readSeason01(): Promise<Season01> {
  const raw = await fs.readFile(SEASON_01_PATH, "utf8");
  return JSON.parse(raw) as Season01;
}

export type CoverStoryDoc = {
  title: string;
  status: string;
  relativePath: string;
  body: string;
  gates: {
    gorGorReview: string;
    kieranApproval: string;
  };
};

/** Load Season 01 Cover Story markdown for HOME/CONTENT surfaces. */
export async function readCoverStory(): Promise<CoverStoryDoc | null> {
  try {
    const [season, raw] = await Promise.all([
      readSeason01(),
      fs.readFile(COVER_STORY_PATH, "utf8"),
    ]);
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const statusMatch = raw.match(/\*\*Status:\*\*\s*(.+)$/m);
    const parts = raw.split(/\n---\n/);
    const body = (parts.length > 1 ? parts.slice(1).join("\n---\n") : raw)
      .split(/\n### Editorial notes[\s\S]*$/)[0]
      .trim();

    let checklistHint = "";
    try {
      checklistHint = await fs.readFile(COVER_READY_PATH, "utf8");
    } catch {
      checklistHint = "";
    }
    const gor =
      season.coverStory?.gates.gor_gor_review ??
      (checklistHint.includes("GOR_GOR_REVIEW") &&
      checklistHint.includes("`PENDING`")
        ? "PENDING"
        : "UNKNOWN");
    const kieran =
      season.coverStory?.gates.kieran_approval ??
      (checklistHint.includes("Kieran approval") &&
      checklistHint.includes("`PENDING`")
        ? "PENDING"
        : "UNKNOWN");

    return {
      title:
        season.coverStory?.title ??
        titleMatch?.[1]?.trim() ??
        "Cover Story",
      status:
        season.coverStory?.status ??
        statusMatch?.[1]?.trim() ??
        "draft",
      relativePath: "SKY_ASIA_OS/04_Season01/content/COVER_STORY.md",
      body,
      gates: {
        gorGorReview: gor,
        kieranApproval: kieran,
      },
    };
  } catch {
    return null;
  }
}

export type KnowledgeNoteMeta = {
  filename: string;
  title: string;
  status: string;
};

export async function listKnowledgeNotes(): Promise<KnowledgeNoteMeta[]> {
  const entries = await fs.readdir(KNOWLEDGE_DIR);
  const notes: KnowledgeNoteMeta[] = [];
  for (const filename of entries) {
    if (!filename.endsWith(".md") || filename === "README.md" || filename === "INDEX.md") {
      continue;
    }
    const text = await fs.readFile(path.join(KNOWLEDGE_DIR, filename), "utf8");
    const titleMatch = text.match(/^#\s+(.+)$/m);
    const statusMatch = text.match(/\*\*Status:\*\*\s*(.+)$/m);
    notes.push({
      filename,
      title: titleMatch?.[1]?.trim() ?? filename,
      status: statusMatch?.[1]?.trim() ?? "unknown",
    });
  }
  notes.sort((a, b) => a.filename.localeCompare(b.filename));
  return notes;
}

export async function readKnowledgeIndex(): Promise<string> {
  try {
    return await fs.readFile(KNOWLEDGE_INDEX, "utf8");
  } catch {
    return "# Knowledge Hub\n\nIndex missing.\n";
  }
}

export async function getCounts(): Promise<Record<string, number>> {
  const [artists, creators, brands, festivals, culture, tasks, notes] =
    await Promise.all([
      readDb("artists"),
      readDb("creators"),
      readDb("brands"),
      readDb("festivals"),
      readDb("culture"),
      readTasks(),
      listKnowledgeNotes(),
    ]);
  return {
    artists: artists.length,
    creators: creators.length,
    brands: brands.length,
    festivals: festivals.length,
    culture: culture.length,
    tasks: tasks.length,
    knowledge: notes.length,
  };
}

export const DB_COLUMNS: Record<DbName, string[]> = {
  artists: [
    "Name",
    "Country",
    "Instagram",
    "Category",
    "Website",
    "Story Potential",
    "Status",
  ],
  creators: ["Name", "Country", "Platform", "Followers", "Niche", "Contact"],
  brands: [
    "Brand",
    "Country",
    "Beauty/Fashion/Lifestyle",
    "Website",
    "Potential Collaboration",
  ],
  festivals: ["Festival", "Country", "Date", "Story Angle", "Content Ready"],
  culture: ["Topic", "Country", "Category", "Reference"],
};
