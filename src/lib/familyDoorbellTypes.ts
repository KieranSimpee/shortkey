/**
 * Family Home v0.9.2 — Shared Doorbell types
 * Canonical: src/brand/sky/FAMILY_HOME_v0_9_2_SHARED_DOORBELL.md
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

export const COMMAND_SENDERS = ["Kieran", "Gor Gor"] as const;
export type CommandSender = (typeof COMMAND_SENDERS)[number];

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
};

/** Shared command message (Living Room doorbell). */
export type FamilyCommandMessage = {
  id: string;
  body: string;
  sender: CommandSender;
  target_members: TargetMemberOption[];
  resolved_targets: TargetMember[];
  createdAt: string;
  receipts: FamilyReceipt[];
};

export type FamilyDoorbellStoreMode =
  | "upstash"
  | "vercel-kv"
  | "file"
  | "ephemeral";

export type FamilyDoorbellStoreMeta = {
  shared: boolean;
  mode: FamilyDoorbellStoreMode;
  version: "0.9.2";
};

export type FamilyDoorbellDocument = {
  version: "0.9.2";
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
  return { version: "0.9.2", messages: [] };
}
