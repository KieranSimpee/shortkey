/**
 * Family Home v0.9.3 — Shared Doorbell / Family Meeting store
 *
 * Backends (first match wins):
 * 1. Upstash Redis REST — UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * 2. Vercel KV REST — KV_REST_API_URL + KV_REST_API_TOKEN
 * 3. Local JSON file — NODE_ENV=development or FAMILY_DOORBELL_FILE_STORE=1
 *    → data/family-doorbell.json
 * 4. In-memory ephemeral — shared:false · mode:"ephemeral" (do not pretend durable)
 *
 * Redis key stays v092 so existing shared messages (incl. first meeting) are preserved.
 * Interface: listMessages · createMessage · updateReceipt
 */

import { promises as fs } from "fs";
import path from "path";
import {
  emptyDocument,
  inferMessageMode,
  isCompleteSelfCheck,
  isMessageMode,
  isReceiptStatus,
  isSupportStatus,
  isTargetMember,
  resolveTargets,
  type CommandSender,
  type FamilyCommandMessage,
  type FamilyDoorbellDocument,
  type FamilyDoorbellStoreMeta,
  type FamilyDoorbellStoreMode,
  type FamilyReceipt,
  type FamilySelfCheck,
  type MessageMode,
  type ReceiptStatus,
  type SupportStatus,
  type TargetMember,
  type TargetMemberOption,
} from "@/lib/familyDoorbellTypes";

/** Keep v092 key — do not migrate Redis namespace (preserves fd_mryrchhg_gdlx7zrl). */
const REDIS_KEY = "shortkey:family-doorbell:v092";
const FILE_REL = path.join("data", "family-doorbell.json");
const API_VERSION = "0.9.3" as const;

/** Process-local fallback — lost on cold start / multi-instance. */
let memoryDoc: FamilyDoorbellDocument = emptyDocument();

function newId(): string {
  return `fd_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function redisCreds():
  | { url: string; token: string; mode: "upstash" | "vercel-kv" }
  | null {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl.replace(/\/$/, ""), token: upstashToken, mode: "upstash" };
  }
  const kvUrl = process.env.KV_REST_API_URL?.trim();
  const kvToken = process.env.KV_REST_API_TOKEN?.trim();
  if (kvUrl && kvToken) {
    return { url: kvUrl.replace(/\/$/, ""), token: kvToken, mode: "vercel-kv" };
  }
  return null;
}

function useFileStore(): boolean {
  if (process.env.FAMILY_DOORBELL_FILE_STORE === "1") return true;
  return process.env.NODE_ENV === "development";
}

function filePath(): string {
  return path.join(process.cwd(), FILE_REL);
}

function metaFor(mode: FamilyDoorbellStoreMode): FamilyDoorbellStoreMeta {
  return {
    shared: mode !== "ephemeral",
    mode,
    version: API_VERSION,
  };
}

function normalizeStoredMessage(raw: unknown): FamilyCommandMessage | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as FamilyCommandMessage & { messageType?: unknown };
  if (typeof m.body !== "string" || !Array.isArray(m.receipts)) return null;
  const mode = inferMessageMode(m);
  return {
    ...m,
    mode,
  };
}

function parseDocument(raw: unknown): FamilyDoorbellDocument {
  if (!raw || typeof raw !== "object") return emptyDocument();
  const o = raw as { version?: unknown; messages?: unknown };
  if (!Array.isArray(o.messages)) return emptyDocument();
  const messages = o.messages
    .map((m) => normalizeStoredMessage(m))
    .filter(Boolean) as FamilyCommandMessage[];
  return { version: API_VERSION, messages };
}

async function redisCommand(
  url: string,
  token: string,
  args: (string | number)[],
): Promise<unknown> {
  // Upstash / Vercel KV REST: POST JSON command array (safe for large JSON values).
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Redis REST ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

async function readRedis(
  url: string,
  token: string,
): Promise<FamilyDoorbellDocument> {
  const result = await redisCommand(url, token, ["GET", REDIS_KEY]);
  if (result == null || result === "") return emptyDocument();
  if (typeof result === "string") {
    try {
      return parseDocument(JSON.parse(result));
    } catch {
      return emptyDocument();
    }
  }
  return parseDocument(result);
}

async function writeRedis(
  url: string,
  token: string,
  doc: FamilyDoorbellDocument,
): Promise<void> {
  await redisCommand(url, token, ["SET", REDIS_KEY, JSON.stringify(doc)]);
}

async function readFileDoc(): Promise<FamilyDoorbellDocument> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return parseDocument(JSON.parse(raw));
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") return emptyDocument();
    throw err;
  }
}

async function writeFileDoc(doc: FamilyDoorbellDocument): Promise<void> {
  const fp = filePath();
  await fs.mkdir(path.dirname(fp), { recursive: true });
  await fs.writeFile(fp, JSON.stringify(doc, null, 2), "utf8");
}

type Backend = {
  mode: FamilyDoorbellStoreMode;
  read: () => Promise<FamilyDoorbellDocument>;
  write: (doc: FamilyDoorbellDocument) => Promise<void>;
};

function resolveBackend(): Backend {
  const redis = redisCreds();
  if (redis) {
    return {
      mode: redis.mode,
      read: () => readRedis(redis.url, redis.token),
      write: (doc) => writeRedis(redis.url, redis.token, doc),
    };
  }
  if (useFileStore()) {
    return {
      mode: "file",
      read: readFileDoc,
      write: writeFileDoc,
    };
  }
  return {
    mode: "ephemeral",
    read: async () => memoryDoc,
    write: async (doc) => {
      memoryDoc = doc;
    },
  };
}

export type ListMessagesResult = FamilyDoorbellStoreMeta & {
  messages: FamilyCommandMessage[];
};

export type CreateMessageInput = {
  body: string;
  sender: CommandSender;
  target_members: TargetMemberOption[];
  mode?: MessageMode;
};

export type UpdateReceiptInput = {
  member: TargetMember;
  status?: ReceiptStatus;
  note?: string;
  supportStatus?: SupportStatus;
  selfCheck?: FamilySelfCheck | null;
  evidenceUrl?: string | null;
  blocker?: string | null;
};

export async function listMessages(): Promise<ListMessagesResult> {
  const backend = resolveBackend();
  const doc = await backend.read();
  return {
    ...metaFor(backend.mode),
    messages: doc.messages,
  };
}

export async function createMessage(
  input: CreateMessageInput,
): Promise<ListMessagesResult & { message: FamilyCommandMessage }> {
  const body = input.body.trim();
  const resolved = resolveTargets(input.target_members);
  if (!body) throw new StoreValidationError("Command body is required.");
  if (resolved.length === 0) {
    throw new StoreValidationError("At least one target_member is required.");
  }

  const now = new Date().toISOString();
  const mode: MessageMode = isMessageMode(input.mode)
    ? input.mode
    : "family-meeting";
  const message: FamilyCommandMessage = {
    id: newId(),
    body,
    sender: input.sender,
    target_members: input.target_members.includes("all")
      ? ["all"]
      : resolved,
    resolved_targets: resolved,
    createdAt: now,
    mode,
    receipts: resolved.map(
      (member): FamilyReceipt => ({
        id: newId(),
        member,
        status: "SENT",
        updatedAt: now,
        note: "",
        supportStatus: "GREEN",
        selfCheck: null,
        evidenceUrl: null,
        blocker: null,
      }),
    ),
  };

  const backend = resolveBackend();
  const doc = await backend.read();
  const next: FamilyDoorbellDocument = {
    version: API_VERSION,
    messages: [message, ...doc.messages],
  };
  await backend.write(next);

  return {
    ...metaFor(backend.mode),
    messages: next.messages,
    message,
  };
}

export async function updateReceipt(
  messageId: string,
  input: UpdateReceiptInput,
): Promise<ListMessagesResult & { message: FamilyCommandMessage; receipt: FamilyReceipt }> {
  if (!isTargetMember(input.member)) {
    throw new StoreValidationError("Invalid member.");
  }

  if (input.status !== undefined && !isReceiptStatus(input.status)) {
    throw new StoreValidationError("Invalid receipt status.");
  }
  if (input.supportStatus !== undefined && !isSupportStatus(input.supportStatus)) {
    throw new StoreValidationError("Invalid supportStatus.");
  }

  if (input.status === "SUBMITTED") {
    if (!isCompleteSelfCheck(input.selfCheck)) {
      throw new StoreValidationError(
        "SUBMITTED requires a complete self-check (what I did, evidence, purpose fulfilled, what could be better, blockers, support needed).",
      );
    }
  }

  const backend = resolveBackend();
  const doc = await backend.read();
  const idx = doc.messages.findIndex((m) => m.id === messageId);
  if (idx < 0) throw new StoreNotFoundError("Message not found.");

  const message = doc.messages[idx];
  const rIdx = message.receipts.findIndex((r) => r.member === input.member);
  if (rIdx < 0) {
    throw new StoreNotFoundError("Receipt for this member not found on message.");
  }

  const prev = message.receipts[rIdx];
  const now = new Date().toISOString();
  const nextStatus = input.status ?? prev.status;

  let selfCheck = prev.selfCheck ?? null;
  if (input.selfCheck !== undefined) {
    selfCheck = input.selfCheck;
  }
  if (nextStatus === "SUBMITTED" && !isCompleteSelfCheck(selfCheck)) {
    throw new StoreValidationError(
      "SUBMITTED requires a complete self-check (what I did, evidence, purpose fulfilled, what could be better, blockers, support needed).",
    );
  }

  const receipt: FamilyReceipt = {
    ...prev,
    status: nextStatus,
    updatedAt: now,
    note: input.note !== undefined ? input.note : prev.note,
    supportStatus: input.supportStatus ?? prev.supportStatus,
    selfCheck,
    evidenceUrl:
      input.evidenceUrl !== undefined ? input.evidenceUrl : (prev.evidenceUrl ?? null),
    blocker: input.blocker !== undefined ? input.blocker : (prev.blocker ?? null),
  };

  const nextMessage: FamilyCommandMessage = {
    ...message,
    mode: message.mode ?? inferMessageMode(message),
    receipts: message.receipts.map((r, i) => (i === rIdx ? receipt : r)),
  };
  const nextMessages = doc.messages.map((m, i) => (i === idx ? nextMessage : m));
  const nextDoc: FamilyDoorbellDocument = {
    version: API_VERSION,
    messages: nextMessages,
  };
  await backend.write(nextDoc);

  return {
    ...metaFor(backend.mode),
    messages: nextMessages,
    message: nextMessage,
    receipt,
  };
}

export class StoreValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreValidationError";
  }
}

export class StoreNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreNotFoundError";
  }
}
