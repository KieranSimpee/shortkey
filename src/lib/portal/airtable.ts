import {
  isPortalLane,
  type PortalLane,
  type PortalSource,
  type PortalStory,
} from "@/lib/portal/types";
import seedFile from "@/data/portal-seed.json";

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records?: AirtableRecord[];
  error?: { message?: string; type?: string };
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function firstAttachmentUrl(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) return "";
  const first = value[0];
  if (first && typeof first === "object" && "url" in first) {
    return asString((first as { url: unknown }).url);
  }
  return "";
}

export function airtableConfigured(): boolean {
  return Boolean(
    process.env.AIRTABLE_API_KEY?.trim() && process.env.AIRTABLE_BASE_ID?.trim(),
  );
}

function mapSeed(): PortalStory[] {
  return seedFile.stories.flatMap((row) => {
    if (!isPortalLane(row.lane)) return [];
    return [
      {
        id: row.id,
        lane: row.lane,
        brandName: row.brandName,
        title: row.title,
        story: row.story,
        imageUrl: row.imageUrl,
        sortOrder: row.sortOrder,
      },
    ];
  });
}

function mapAirtableRecord(record: AirtableRecord, index: number): PortalStory | null {
  const fields = record.fields;
  const laneRaw = asString(fields.Lane).toLowerCase();
  if (!isPortalLane(laneRaw)) return null;

  const status = asString(fields.Status).toUpperCase();
  if (status === "DO_NOT_USE") return null;

  const imageUrl =
    asString(fields.Image_URL) || firstAttachmentUrl(fields.Image) || "/logo/shortkey-primary.png";

  return {
    id: record.id,
    lane: laneRaw,
    brandName: asString(fields.Brand_Name) || "ShortKey",
    title: asString(fields.Title) || asString(fields.Brand_Name) || "ShortKey",
    story: asString(fields.Story),
    imageUrl,
    sortOrder: asNumber(fields.Sort_Order, index + 1),
  };
}

async function fetchAirtableLane(lane: PortalLane): Promise<PortalStory[]> {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();
  const tableName = process.env.AIRTABLE_TABLE_NAME?.trim() || "Stories";
  if (!apiKey || !baseId) return [];

  const formula = `{Lane}="${lane}"`;
  const params = new URLSearchParams({
    filterByFormula: formula,
    "sort[0][field]": "Sort_Order",
    "sort[0][direction]": "asc",
  });

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const body = (await res.json()) as AirtableListResponse;
  if (!res.ok) {
    throw new Error(body.error?.message || `Airtable HTTP ${res.status}`);
  }

  const mapped = (body.records ?? [])
    .map((record, index) => mapAirtableRecord(record, index))
    .filter((row): row is PortalStory => row !== null && row.story.length > 0);

  mapped.sort((a, b) => a.sortOrder - b.sortOrder);
  return mapped;
}

export async function loadPortalStories(lane: PortalLane): Promise<{
  source: PortalSource;
  stories: PortalStory[];
}> {
  if (airtableConfigured()) {
    try {
      const stories = await fetchAirtableLane(lane);
      return { source: "airtable", stories };
    } catch (error) {
      console.error("[portal] Airtable read failed; using DNA seed.", error);
    }
  }

  const stories = mapSeed()
    .filter((row) => row.lane === lane)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return { source: "seed", stories };
}
