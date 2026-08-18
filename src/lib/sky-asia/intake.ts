import { promises as fs } from "fs";
import path from "path";
import {
  base44Headers,
  createBase44Conversation,
  getBase44AgentApiKey,
  joinUrl,
  sendBase44Message,
} from "@/lib/gorGorChatBridge";
import { appendTask, type JsonRecord } from "@/lib/sky-asia/data";
import { INTAKE_PATH } from "@/lib/sky-asia/paths";

export const INTAKE_CATEGORIES = [
  "Research: Artist",
  "Research: Creator",
  "Research: Brand",
  "Research: Festival",
  "Research: Culture Topic",
  "Outreach: Interview",
  "Outreach: Partnership",
  "Asset: Image",
  "Asset: Media Kit",
] as const;

export type IntakeCategory = (typeof INTAKE_CATEGORIES)[number];

export type IntakeKind = "research" | "outreach" | "asset";

export type IntakeOwner = "Kura" | "Simpee" | "Senti";

export type IntakeRecord = {
  id: string;
  subject: string;
  category: string;
  description: string;
  link: string;
  notes: string;
  status: string;
  assignedTo: string | null;
  submittedBy: string;
  submittedAt: string;
  tableRecordId: string;
  routedAt: string | null;
  agentNotify: string;
};

const KURA_AGENT_ID = "6a54198bebbee048f44e1378";
const SENTI_AGENT_ID = "6a42029cc124d0206f027335";
const SIMPEE_AGENT_ID = "69ddc914cfcf229762ac123d";
const AGENT_API_ROOT = "https://app.base44.com/api/agents";

export function isIntakeCategory(value: string): value is IntakeCategory {
  return (INTAKE_CATEGORIES as readonly string[]).includes(value);
}

export function intakeKindFromCategory(category: string): IntakeKind | null {
  if (category.startsWith("Research:")) return "research";
  if (category.startsWith("Outreach:")) return "outreach";
  if (category.startsWith("Asset:")) return "asset";
  return null;
}

export function ownerForKind(kind: IntakeKind): IntakeOwner {
  switch (kind) {
    case "research":
      return "Kura";
    case "outreach":
      return "Simpee";
    case "asset":
      return "Senti";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function routedStatusForOwner(owner: IntakeOwner): string {
  switch (owner) {
    case "Kura":
      return "routed_to_kura";
    case "Simpee":
      return "routed_to_simpee";
    case "Senti":
      return "routed_to_senti";
    default: {
      const _exhaustive: never = owner;
      return _exhaustive;
    }
  }
}

function agentIdForOwner(owner: IntakeOwner): string {
  switch (owner) {
    case "Kura":
      return process.env.KURA_AGENT_ID?.trim() || KURA_AGENT_ID;
    case "Simpee":
      return process.env.SIMPEE_AGENT_ID?.trim() || SIMPEE_AGENT_ID;
    case "Senti":
      return process.env.SENTI_AGENT_ID?.trim() || SENTI_AGENT_ID;
    default: {
      const _exhaustive: never = owner;
      return _exhaustive;
    }
  }
}

export async function readIntake(): Promise<IntakeRecord[]> {
  try {
    const raw = await fs.readFile(INTAKE_PATH, "utf8");
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data as IntakeRecord[];
  } catch {
    return [];
  }
}

async function writeIntake(rows: IntakeRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(INTAKE_PATH), { recursive: true });
  await fs.writeFile(INTAKE_PATH, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export async function upsertIntake(row: IntakeRecord): Promise<IntakeRecord[]> {
  const rows = await readIntake();
  const idx = rows.findIndex(
    (r) => r.id === row.id || (row.tableRecordId && r.tableRecordId === row.tableRecordId),
  );
  if (idx >= 0) {
    rows[idx] = { ...rows[idx], ...row };
  } else {
    rows.unshift(row);
  }
  await writeIntake(rows);
  return rows;
}

export function verifyIntakeSecret(headerValue: string | null): {
  ok: boolean;
  status: number;
  error?: string;
} {
  const expected = process.env.SKY_ASIA_INTAKE_SECRET?.trim() || "";
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        status: 503,
        error: "SKY_ASIA_INTAKE_SECRET is not set",
      };
    }
    return { ok: true, status: 200 };
  }
  if (!headerValue || headerValue !== expected) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  return { ok: true, status: 200 };
}

export async function notifyOwnerAgent(input: {
  owner: IntakeOwner;
  subject: string;
  category: string;
  description: string;
  link: string;
  notes: string;
  recordId: string;
}): Promise<string> {
  const apiKey = getBase44AgentApiKey();
  if (!apiKey) {
    return "skipped_no_key";
  }

  const agentId = agentIdForOwner(input.owner);
  const agentBase = joinUrl(AGENT_API_ROOT, agentId);
  const headers = base44Headers(apiKey);
  const conversationId = await createBase44Conversation(agentBase, headers);
  const content = [
    `SKY ASIA intake assigned by Kieran.`,
    `Owner: ${input.owner}`,
    `Subject: ${input.subject}`,
    `Category: ${input.category}`,
    `Description: ${input.description}`,
    input.link ? `Link: ${input.link}` : null,
    input.notes ? `Notes: ${input.notes}` : null,
    `Record: ${input.recordId}`,
    `Do not auto-publish. Research/outreach/assets only. Report back to Cursor HQ.`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendBase44Message(agentBase, headers, conversationId, content);
  return `notified:${input.owner}:${conversationId}`;
}

export async function createAssignedTask(input: {
  owner: IntakeOwner;
  subject: string;
  category: string;
  description: string;
  recordId: string;
}): Promise<JsonRecord> {
  const id = `INTAKE-${input.recordId.slice(0, 12)}`;
  const rows = await appendTask({
    id,
    owner: input.owner,
    title: `${input.category} — ${input.subject}`,
    detail: input.description,
    status: "todo",
    phase: 4,
    blockedBy: null,
    refs: [`SKY_ASIA_OS/00_Headquarters/intake/intake.json#${input.recordId}`],
  });
  return rows[rows.length - 1] ?? { id };
}
