/**
 * Family Home v0.9.3 — Family Meeting UI + Shared Doorbell types
 * Canonical: src/brand/sky/FAMILY_HOME_v0_9_3_FAMILY_MEETING_UI.md
 * Predecessor: FAMILY_HOME_v0_9_2_SHARED_DOORBELL.md (shared store preserved)
 */

export const TARGET_MEMBER_OPTIONS = [
  "sky",
  "senti",
  "kura",
  "agent-r",
  "gor-gor",
  "all",
] as const;

export type TargetMemberOption = (typeof TARGET_MEMBER_OPTIONS)[number];
export type TargetMember = Exclude<TargetMemberOption, "all">;

export const ALL_MEMBERS: TargetMember[] = [
  "sky",
  "senti",
  "kura",
  "agent-r",
  "gor-gor",
];

export const RECEIPT_STATUSES = [
  "SENT",
  "RECEIVED",
  "READING",
  "IN_PROGRESS",
  "NEEDS_GOR_GOR",
  "BLOCKED",
  "SUBMITTED",
  "NO_RESPONSE",
] as const;

export type ReceiptStatus = (typeof RECEIPT_STATUSES)[number];

export const SUPPORT_STATUSES = ["GREEN", "YELLOW", "ORANGE", "RED"] as const;
export type SupportStatus = (typeof SUPPORT_STATUSES)[number];

/** Living Room / Meeting composers may post as any of these. */
export const COMMAND_SENDERS = [
  "Kieran",
  "Gor Gor",
  "Sky",
  "Senti",
  "Kura",
  "Agent R",
] as const;
export type CommandSender = (typeof COMMAND_SENDERS)[number];

/**
 * Post mode / message type.
 * Stored on message as `mode` (also accepts POST alias `messageType`).
 */
export const MESSAGE_MODES = [
  "doorbell",
  "family-meeting",
  "job-assignment",
  "review-request",
] as const;
export type MessageMode = (typeof MESSAGE_MODES)[number];

export const MESSAGE_MODE_LABELS: Record<MessageMode, string> = {
  doorbell: "Doorbell / Announcement",
  "family-meeting": "Family Meeting",
  "job-assignment": "Job Assignment",
  "review-request": "Review Request",
};

/** Default composer mode for the current sprint. */
export const DEFAULT_COMPOSER_MODE: MessageMode = "family-meeting";

/** First real Family Meeting — pin / highlight when present. */
export const FIRST_FAMILY_MEETING_ID = "fd_mryrchhg_gdlx7zrl";

export const GOR_GOR_REVIEW_REMINDER =
  "Outputs are candidates only until Gor Gor Review. Kieran only reviews KIERAN REVIEW READY work.";

/** Required before status can become SUBMITTED. */
export type FamilySelfCheck = {
  whatIDid: string;
  evidence: string;
  purposeFulfilled: string;
  whatCouldBeBetter: string;
  blockers: string;
  supportNeeded: string;
};

export type FamilyReceipt = {
  id: string;
  member: TargetMember;
  status: ReceiptStatus;
  updatedAt: string;
  note: string;
  /** Member-set support signal — never auto-inferred from presence. */
  supportStatus: SupportStatus;
  selfCheck?: FamilySelfCheck | null;
  /** Optional evidence link (member response). */
  evidenceUrl?: string | null;
  /** Optional blocker note (member response). */
  blocker?: string | null;
};

/** Shared command message (Living Room doorbell / Family Meeting). */
export type FamilyCommandMessage = {
  id: string;
  body: string;
  sender: CommandSender;
  target_members: TargetMemberOption[];
  resolved_targets: TargetMember[];
  createdAt: string;
  receipts: FamilyReceipt[];
  /**
   * Post mode. Absent on v0.9.2 messages — inferred by `inferMessageMode`.
   */
  mode?: MessageMode;
};

export type FamilyDoorbellStoreMode =
  | "upstash"
  | "vercel-kv"
  | "file"
  | "ephemeral";

export type FamilyDoorbellStoreMeta = {
  shared: boolean;
  mode: FamilyDoorbellStoreMode;
  /** API/schema version — clients should tolerate 0.9.2 and 0.9.3. */
  version: "0.9.2" | "0.9.3";
};

export type FamilyDoorbellDocument = {
  version: "0.9.2" | "0.9.3";
  messages: FamilyCommandMessage[];
};

export function resolveTargets(selected: TargetMemberOption[]): TargetMember[] {
  if (selected.includes("all")) return [...ALL_MEMBERS];
  const set = new Set<TargetMember>();
  for (const t of selected) {
    if (t !== "all") set.add(t);
  }
  return ALL_MEMBERS.filter((m) => set.has(m));
}

export function isTargetMember(v: unknown): v is TargetMember {
  return typeof v === "string" && (ALL_MEMBERS as string[]).includes(v);
}

export function isReceiptStatus(v: unknown): v is ReceiptStatus {
  return typeof v === "string" && (RECEIPT_STATUSES as readonly string[]).includes(v);
}

export function isSupportStatus(v: unknown): v is SupportStatus {
  return typeof v === "string" && (SUPPORT_STATUSES as readonly string[]).includes(v);
}

export function isCommandSender(v: unknown): v is CommandSender {
  return typeof v === "string" && (COMMAND_SENDERS as readonly string[]).includes(v);
}

export function isMessageMode(v: unknown): v is MessageMode {
  return typeof v === "string" && (MESSAGE_MODES as readonly string[]).includes(v);
}

/**
 * Infer mode for legacy messages (no `mode` field).
 * Existing Gor Gor → all posts are treated as Family Meeting.
 */
export function inferMessageMode(msg: {
  mode?: unknown;
  messageType?: unknown;
  sender?: unknown;
  target_members?: unknown;
}): MessageMode {
  if (isMessageMode(msg.mode)) return msg.mode;
  if (isMessageMode(msg.messageType)) return msg.messageType;
  const targets = Array.isArray(msg.target_members) ? msg.target_members : [];
  const isAll =
    targets.includes("all") ||
    (ALL_MEMBERS.every((m) => targets.includes(m)) && targets.length >= ALL_MEMBERS.length);
  if (msg.sender === "Gor Gor" && isAll) return "family-meeting";
  return "doorbell";
}

export function isMeetingLikeMode(mode: MessageMode): boolean {
  return mode === "family-meeting" || mode === "job-assignment";
}

export function isCompleteSelfCheck(v: unknown): v is FamilySelfCheck {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  const keys: (keyof FamilySelfCheck)[] = [
    "whatIDid",
    "evidence",
    "purposeFulfilled",
    "whatCouldBeBetter",
    "blockers",
    "supportNeeded",
  ];
  return keys.every((k) => typeof o[k] === "string" && (o[k] as string).trim().length > 0);
}

export function emptyDocument(): FamilyDoorbellDocument {
  return { version: "0.9.3", messages: [] };
}
