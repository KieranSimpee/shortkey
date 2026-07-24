"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ALL_MEMBERS,
  COMMAND_SENDERS,
  DEFAULT_COMPOSER_MODE,
  FIRST_FAMILY_MEETING_ID,
  GOR_GOR_REVIEW_REMINDER,
  inferMessageMode,
  isCommandSender,
  isMeetingLikeMode,
  MESSAGE_MODE_LABELS,
  MESSAGE_MODES,
  RECEIPT_STATUSES,
  SUPPORT_STATUSES,
  TARGET_MEMBER_OPTIONS,
  URGENCY_LEVELS,
  type CommandSender,
  type FamilyCommandMessage,
  type FamilyDoorbellStoreMode,
  type FamilyReceipt,
  type FamilySelfCheck,
  type MessageMode,
  type ReceiptStatus,
  type SupportStatus,
  type TargetMember,
  type TargetMemberOption,
  type UrgencyLevel,
} from "@/lib/familyDoorbellTypes";

/**
 * Family Home v0.9.3 — Family Meeting UI + Shared Doorbell
 * Prefers shared API (`/api/family-doorbell/*`); localStorage is fallback/demo only.
 * Never auto RECEIVED · never auto-present · SUBMITTED requires self-check.
 * Doc: src/brand/sky/FAMILY_HOME_v0_9_3_FAMILY_MEETING_UI.md
 */

export const DOORBELL_STORAGE_KEY = "shortkey-family-doorbell-v092";
const LEGACY_V091_KEY = "shortkey-family-doorbell-v091";
const LEGACY_V01_KEY = "shortkey-doorbell-receipts-v01";

export const POLL_MS = 6000;

export const DOORBELL_WARNING_SHARED =
  "Family Home v0.9.3 · Internal Staging · Shared backend connected · Gor Gor Review pending.";

export const DOORBELL_WARNING_FALLBACK =
  "Family Home v0.9.3 · Internal Staging · Local fallback / demo only · this browser’s localStorage · not shared across devices · Gor Gor Review pending.";

/** @deprecated use mode-aware banners; kept for clear-all UI copy */
export const DOORBELL_WARNING = DOORBELL_WARNING_FALLBACK;

export {
  TARGET_MEMBER_OPTIONS,
  RECEIPT_STATUSES,
  SUPPORT_STATUSES,
  COMMAND_SENDERS,
  ALL_MEMBERS,
  MESSAGE_MODES,
  MESSAGE_MODE_LABELS,
  DEFAULT_COMPOSER_MODE,
  FIRST_FAMILY_MEETING_ID,
  GOR_GOR_REVIEW_REMINDER,
  URGENCY_LEVELS,
};
export type {
  TargetMemberOption,
  TargetMember,
  ReceiptStatus,
  SupportStatus,
  CommandSender,
  FamilyCommandMessage,
  FamilyReceipt,
  FamilySelfCheck,
  MessageMode,
  UrgencyLevel,
};

/** Ack buttons shown in member rooms (status they set). */
export const ACK_ACTIONS: { label: string; status: ReceiptStatus }[] = [
  { label: "收到", status: "RECEIVED" },
  { label: "睇緊", status: "READING" },
  { label: "處理中", status: "IN_PROGRESS" },
  { label: "需要Gor Gor", status: "NEEDS_GOR_GOR" },
  { label: "Blocked", status: "BLOCKED" },
  { label: "Placed in cabinet", status: "PLACED_IN_CABINET" },
  { label: "已提交", status: "SUBMITTED" },
];

export type DoorbellReceipt = FamilyReceipt;
export type DoorbellCommand = FamilyCommandMessage;

export type DoorbellState = {
  version: "0.9.2" | "0.9.3";
  commands: FamilyCommandMessage[];
  migratedFrom?: string[];
};

export type DoorbellConnection = {
  shared: boolean;
  mode: FamilyDoorbellStoreMode | "local-fallback";
  backendAvailable: boolean;
};

export const MEMBER_LABEL: Record<TargetMember, string> = {
  sky: "Sky",
  senti: "Senti",
  kura: "Kura",
  "agent-r": "Agent R",
  "gor-gor": "Gor Gor",
};

/** Room id → doorbell member (only rooms that can receive doorbells). */
export const ROOM_TO_MEMBER: Record<string, TargetMember> = {
  sky: "sky",
  senti: "senti",
  kura: "kura",
  "agent-r": "agent-r",
  gorgor: "gor-gor",
};

export const RECEIPT_TONE: Record<ReceiptStatus, string> = {
  SENT: "border-ink/15 bg-ink/5 text-ink-muted",
  RECEIVED: "border-brand/30 bg-brand/5 text-brand-dark",
  READING: "border-violet-400/40 bg-violet-400/10 text-violet-900",
  IN_PROGRESS: "border-amber-400/40 bg-amber-400/10 text-amber-800",
  NEEDS_GOR_GOR: "border-brand/40 bg-brand/10 text-brand",
  BLOCKED: "border-rose-400/40 bg-rose-400/10 text-rose-800",
  PLACED_IN_CABINET: "border-violet-500/30 bg-[#f3eef9] text-violet-900",
  SUBMITTED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  NO_RESPONSE: "border-ink/20 bg-ink/[0.03] text-ink-subtle",
};

export const SUPPORT_TONE: Record<SupportStatus, string> = {
  GREEN: "border-emerald-500/35 bg-emerald-500/10 text-emerald-800",
  YELLOW: "border-amber-400/40 bg-amber-400/10 text-amber-900",
  ORANGE: "border-orange-400/40 bg-orange-400/10 text-orange-900",
  RED: "border-rose-500/40 bg-rose-500/10 text-rose-900",
};

const SELF_CHECK_FIELDS: {
  key: keyof FamilySelfCheck;
  label: string;
  placeholder: string;
}[] = [
  { key: "whatIDid", label: "What I did", placeholder: "What did you complete?" },
  { key: "evidence", label: "Evidence", placeholder: "Link, path, or proof" },
  { key: "purposeFulfilled", label: "Purpose fulfilled", placeholder: "How does this fulfill the ask?" },
  { key: "whatCouldBeBetter", label: "What could be better", placeholder: "Honest improvement note" },
  { key: "blockers", label: "Blockers", placeholder: "None / describe blockers" },
  { key: "supportNeeded", label: "Support needed", placeholder: "What help do you need?" },
];

const emptySelfCheck = (): FamilySelfCheck => ({
  whatIDid: "",
  evidence: "",
  purposeFulfilled: "",
  whatCouldBeBetter: "",
  blockers: "",
  supportNeeded: "",
});

function selfCheckComplete(sc: FamilySelfCheck): boolean {
  return SELF_CHECK_FIELDS.every((f) => sc[f.key].trim().length > 0);
}

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";
const btnPrimary =
  "rounded-full bg-brand px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40";
const btnAck =
  "rounded-full border border-brand/25 bg-white px-3 py-1.5 text-[11px] font-medium text-ink transition hover:border-brand/50 hover:bg-brand/5";
const btnGhost =
  "rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/40 hover:text-brand";

function emptyState(): DoorbellState {
  return { version: "0.9.3", commands: [] };
}

export function resolveTargets(selected: TargetMemberOption[]): TargetMember[] {
  if (selected.includes("all")) return [...ALL_MEMBERS];
  const set = new Set<TargetMember>();
  for (const t of selected) {
    if (t !== "all") set.add(t);
  }
  return ALL_MEMBERS.filter((m) => set.has(m));
}

function normalizeReceipt(r: Partial<FamilyReceipt> & { member: TargetMember }): FamilyReceipt {
  return {
    id: typeof r.id === "string" ? r.id : `legacy_${r.member}`,
    member: r.member,
    status: (RECEIPT_STATUSES as readonly string[]).includes(r.status as string)
      ? (r.status as ReceiptStatus)
      : "SENT",
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : new Date().toISOString(),
    note: typeof r.note === "string" ? r.note : "",
    supportStatus: (SUPPORT_STATUSES as readonly string[]).includes(r.supportStatus as string)
      ? (r.supportStatus as SupportStatus)
      : "GREEN",
    selfCheck: r.selfCheck ?? null,
    evidenceUrl: typeof r.evidenceUrl === "string" ? r.evidenceUrl : r.evidenceUrl ?? null,
    blocker: typeof r.blocker === "string" ? r.blocker : r.blocker ?? null,
  };
}

function normalizeCommand(c: Partial<FamilyCommandMessage>): FamilyCommandMessage | null {
  if (!c || typeof c.body !== "string" || !Array.isArray(c.receipts)) return null;
  const receipts = c.receipts
    .filter((r): r is FamilyReceipt => !!r && typeof r === "object" && !!r.member)
    .map((r) => normalizeReceipt(r));
  const sender: CommandSender = isCommandSender(c.sender) ? c.sender : "Kieran";
  const target_members = Array.isArray(c.target_members)
    ? (c.target_members as TargetMemberOption[])
    : (["all"] as TargetMemberOption[]);
  const mode = inferMessageMode({
    mode: c.mode,
    sender,
    target_members,
  });
  const urgency =
    typeof c.urgency === "string" &&
    (URGENCY_LEVELS as readonly string[]).includes(c.urgency)
      ? (c.urgency as UrgencyLevel)
      : undefined;
  return {
    id: typeof c.id === "string" ? c.id : `legacy_${Date.now()}`,
    body: c.body,
    sender,
    target_members,
    selected_recipients: Array.isArray(c.selected_recipients)
      ? (c.selected_recipients as TargetMemberOption[])
      : target_members,
    resolved_targets: Array.isArray(c.resolved_targets)
      ? (c.resolved_targets as TargetMember[])
      : receipts.map((r) => r.member),
    createdAt: typeof c.createdAt === "string" ? c.createdAt : new Date().toISOString(),
    receipts,
    mode,
    ...(urgency ? { urgency } : {}),
  };
}

function normalizeLocalState(
  parsed: Partial<DoorbellState> & { commands?: unknown[]; messages?: unknown[] },
  migratedFrom?: string[],
): DoorbellState {
  const rawList = Array.isArray(parsed.commands)
    ? parsed.commands
    : Array.isArray(parsed.messages)
      ? parsed.messages
      : [];
  const commands = rawList
    .map((c) => normalizeCommand(c as Partial<FamilyCommandMessage>))
    .filter(Boolean) as FamilyCommandMessage[];
  return {
    version: "0.9.3",
    commands,
    ...(migratedFrom?.length || parsed.migratedFrom?.length
      ? { migratedFrom: migratedFrom ?? parsed.migratedFrom }
      : {}),
  };
}

export function loadDoorbellState(): DoorbellState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(DOORBELL_STORAGE_KEY);
    if (raw) {
      return normalizeLocalState(JSON.parse(raw) as Partial<DoorbellState>);
    }
    for (const legacy of [LEGACY_V091_KEY, LEGACY_V01_KEY]) {
      const leg = localStorage.getItem(legacy);
      if (leg) {
        const migrated = normalizeLocalState(
          JSON.parse(leg) as Partial<DoorbellState>,
          [legacy],
        );
        localStorage.setItem(DOORBELL_STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(legacy);
        return migrated;
      }
    }
    return emptyState();
  } catch {
    return emptyState();
  }
}

export function saveDoorbellState(data: DoorbellState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DOORBELL_STORAGE_KEY, JSON.stringify({ ...data, version: "0.9.3" }));
}

export function clearDoorbellStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DOORBELL_STORAGE_KEY);
  localStorage.removeItem(LEGACY_V091_KEY);
  localStorage.removeItem(LEGACY_V01_KEY);
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        tone ?? "border-ink/10 bg-ink/5 text-ink-muted",
      )}
    >
      {children}
    </span>
  );
}

function StagingBanner({ connection }: { connection: DoorbellConnection }) {
  const sharedOk = connection.backendAvailable && connection.shared;
  return (
    <div
      role="status"
      className={cn(
        "rounded-xl border px-3 py-2 text-[11px] leading-relaxed",
        sharedOk
          ? "border-brand/25 bg-brand/[0.06] text-ink"
          : "border-amber-700/25 bg-amber-50 text-amber-950",
      )}
    >
      <span
        className={cn(
          "font-display text-[10px] font-bold uppercase tracking-[0.14em]",
          sharedOk ? "text-brand" : "text-amber-900",
        )}
      >
        Family Home v0.9.3 · Internal Staging
        {sharedOk ? " · Shared backend" : " · Local fallback"}
      </span>
      <span className={cn("mt-0.5 block", sharedOk ? "text-ink-muted" : "text-amber-900/90")}>
        {sharedOk
          ? `${DOORBELL_WARNING_SHARED} · mode: ${connection.mode}`
          : DOORBELL_WARNING_FALLBACK}
      </span>
      <span className="mt-1 block text-[10px] text-ink-subtle">
        INTERNAL STAGING ONLY · noindex · not public shortkey.world launch
      </span>
    </div>
  );
}

/** Structured sections parsed from freeform Family Meeting / Job Assignment bodies. */
export type MeetingCardSections = {
  title: string;
  purpose: string;
  assignments: string;
  deadline: string;
  requiredStatuses: string;
  supportKey: string;
  reviewReminder: string;
  leftover: string;
  structured: boolean;
};

type SectionKey = keyof Omit<MeetingCardSections, "structured" | "leftover">;

const SECTION_HEADINGS: { key: SectionKey; re: RegExp }[] = [
  { key: "title", re: /^(meeting\s+title|title|會議|標題)\s*[:：]?\s*(.*)$/i },
  { key: "purpose", re: /^(purpose|目標|目的)\s*[:：]?\s*(.*)$/i },
  {
    key: "assignments",
    re: /^(assignments?(?:\s+by\s+member)?|作業|分配|jobs?)\s*[:：]?\s*(.*)$/i,
  },
  { key: "deadline", re: /^(deadline(?:\s+guidance)?|截止|時限)\s*[:：]?\s*(.*)$/i },
  {
    key: "requiredStatuses",
    re: /^(required\s+response\s+statuses?|statuses?|回應狀態)\s*[:：]?\s*(.*)$/i,
  },
  {
    key: "supportKey",
    re: /^(support\s+status\s+key|support(?:\s+status)?|支援)\s*[:：]?\s*(.*)$/i,
  },
  {
    key: "reviewReminder",
    re: /^(gor\s*gor\s+review(?:\s+reminder)?|review\s+reminder|審查)\s*[:：]?\s*(.*)$/i,
  },
];

export function parseMeetingBody(body: string): MeetingCardSections {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const buckets: Record<SectionKey | "leftover", string[]> = {
    title: [],
    purpose: [],
    assignments: [],
    deadline: [],
    requiredStatuses: [],
    supportKey: [],
    reviewReminder: [],
    leftover: [],
  };

  let current: SectionKey | "leftover" | null = null;
  let structured = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      if (current) buckets[current].push("");
      continue;
    }

    let matchedHeading = false;
    for (const { key, re } of SECTION_HEADINGS) {
      const m = trimmed.match(re);
      if (!m) continue;
      current = key;
      structured = true;
      matchedHeading = true;
      const inline = (m[2] ?? "").trim();
      if (inline) buckets[key].push(inline);
      break;
    }
    if (matchedHeading) continue;

    if (!current) {
      // First freeform line → title candidate; rest → leftover
      if (buckets.title.length === 0 && buckets.leftover.length === 0) {
        buckets.title.push(trimmed);
        current = "leftover";
      } else {
        buckets.leftover.push(line);
        current = "leftover";
      }
    } else {
      buckets[current].push(line);
    }
  }

  const join = (arr: string[]) => arr.join("\n").trim();
  const result: MeetingCardSections = {
    title: join(buckets.title),
    purpose: join(buckets.purpose),
    assignments: join(buckets.assignments),
    deadline: join(buckets.deadline),
    requiredStatuses: join(buckets.requiredStatuses),
    supportKey: join(buckets.supportKey),
    reviewReminder: join(buckets.reviewReminder),
    leftover: join(buckets.leftover),
    structured:
      structured ||
      !!(
        buckets.purpose.length ||
        buckets.assignments.length ||
        buckets.deadline.length ||
        buckets.requiredStatuses.length ||
        buckets.supportKey.length ||
        buckets.reviewReminder.length
      ),
  };
  return result;
}

function MeetingJobCard({ cmd }: { cmd: FamilyCommandMessage }) {
  const [showRaw, setShowRaw] = useState(false);
  const sections = useMemo(() => parseMeetingBody(cmd.body), [cmd.body]);
  const mode = cmd.mode ?? inferMessageMode(cmd);
  const meetingLike = isMeetingLikeMode(mode);

  const rows: { label: string; value: string }[] = [
    { label: "Meeting title", value: sections.title },
    { label: "Purpose", value: sections.purpose },
    { label: "Assignments by member", value: sections.assignments },
    { label: "Deadline guidance", value: sections.deadline },
    { label: "Required response statuses", value: sections.requiredStatuses },
    { label: "Support status key", value: sections.supportKey },
    {
      label: "Gor Gor Review reminder",
      value: sections.reviewReminder || GOR_GOR_REVIEW_REMINDER,
    },
  ].filter((r) => r.value || r.label === "Gor Gor Review reminder");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="border-brand/30 bg-brand/10 text-brand">{cmd.sender}</Badge>
        <Badge tone="border-violet-400/35 bg-violet-400/10 text-violet-900">
          {MESSAGE_MODE_LABELS[mode]}
        </Badge>
        <span className="text-[10px] text-ink-subtle">→ {cmd.target_members.join(", ")}</span>
        <span className="text-[10px] text-ink-subtle">{formatTime(cmd.createdAt)}</span>
        {cmd.id === FIRST_FAMILY_MEETING_ID ? (
          <Badge tone="border-amber-500/40 bg-amber-50 text-amber-900">First meeting</Badge>
        ) : null}
      </div>

      {meetingLike ? (
        <div className="rounded-xl border border-brand/20 bg-gradient-to-br from-white via-[#faf8fc] to-[#f3eef9] p-3 sm:p-4">
          {sections.structured ? (
            <dl className="space-y-3">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 whitespace-pre-wrap text-sm text-ink">
                    {row.value || "—"}
                  </dd>
                </div>
              ))}
              {sections.leftover ? (
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                    Additional
                  </dt>
                  <dd className="mt-0.5 whitespace-pre-wrap text-sm text-ink-muted">
                    {sections.leftover}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <div>
              {sections.title ? (
                <p className="font-display text-base font-semibold text-ink">{sections.title}</p>
              ) : null}
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
                {sections.leftover || cmd.body}
              </p>
              <dl className="mt-3 space-y-2 border-t border-ink/5 pt-3">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                    Gor Gor Review reminder
                  </dt>
                  <dd className="mt-0.5 text-sm text-ink-muted">{GOR_GOR_REVIEW_REMINDER}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm text-ink">{cmd.body}</p>
      )}

      {meetingLike ? (
        <p className="rounded-lg border border-brand/15 bg-brand/[0.04] px-3 py-2 text-[11px] leading-relaxed text-ink-muted">
          {GOR_GOR_REVIEW_REMINDER}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btnGhost} onClick={() => setShowRaw((v) => !v)}>
          {showRaw ? "Hide raw body" : "Show raw body"}
        </button>
        <button
          type="button"
          className={btnGhost}
          onClick={() => {
            void navigator.clipboard?.writeText(cmd.body);
          }}
        >
          Copy raw
        </button>
        <span className="font-mono text-[10px] text-ink-subtle">{cmd.id}</span>
      </div>
      {showRaw ? (
        <pre className="overflow-x-auto rounded-lg border border-ink/10 bg-ink/[0.03] p-3 text-[11px] leading-relaxed text-ink-muted whitespace-pre-wrap">
          {cmd.body}
        </pre>
      ) : null}
    </div>
  );
}

function ReceiptBoardList({
  cmd,
  busy,
  onUpdateReceipt,
  setBoardHint,
}: {
  cmd: FamilyCommandMessage;
  busy?: boolean;
  onUpdateReceipt: (
    commandId: string,
    member: TargetMember,
    patch: Partial<
      Pick<FamilyReceipt, "status" | "note" | "supportStatus" | "selfCheck" | "evidenceUrl" | "blocker">
    >,
  ) => void;
  setBoardHint?: (hint: string | null) => void;
}) {
  // Stable member order for the board
  const ordered = ALL_MEMBERS.map(
    (m) => cmd.receipts.find((r) => r.member === m) ?? null,
  ).filter(Boolean) as FamilyReceipt[];
  const extras = cmd.receipts.filter((r) => !ALL_MEMBERS.includes(r.member));
  const rows = [...ordered, ...extras];

  return (
    <div className="border-t border-brand/15 bg-gradient-to-b from-[#f7f4fc]/80 to-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
          Receipt Board
        </p>
        <p className="text-[10px] text-ink-subtle">
          Default SENT · never auto RECEIVED · poll ~{POLL_MS / 1000}s when shared
        </p>
      </div>
      <ul className="divide-y divide-ink/5">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex flex-wrap items-start justify-between gap-2 px-3 py-3 sm:px-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{MEMBER_LABEL[r.member]}</p>
                <Badge tone={RECEIPT_TONE[r.status]}>{r.status}</Badge>
                <Badge tone={SUPPORT_TONE[r.supportStatus]}>Support {r.supportStatus}</Badge>
                {(r.status === "SENT" || r.status === "NO_RESPONSE") && (
                  <span className="text-[10px] text-ink-subtle">no response yet</span>
                )}
              </div>
              <p className="mt-0.5 text-[10px] text-ink-subtle">
                Last updated · {formatTime(r.updatedAt)}
              </p>
              {r.note ? (
                <p className="mt-1 text-xs text-ink-muted">Note: {r.note}</p>
              ) : (
                <p className="mt-1 text-[10px] text-ink-subtle">No note yet</p>
              )}
              {r.evidenceUrl ? (
                <p className="mt-0.5 text-[11px] text-ink-muted">
                  Evidence:{" "}
                  <a
                    href={r.evidenceUrl}
                    className="underline decoration-brand/40 underline-offset-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {r.evidenceUrl}
                  </a>
                </p>
              ) : null}
              {r.blocker ? (
                <p className="mt-0.5 text-[11px] text-rose-800">Blocker: {r.blocker}</p>
              ) : null}
              {r.selfCheck ? (
                <details className="mt-2 text-[10px] text-ink-muted">
                  <summary className="cursor-pointer font-semibold text-brand">Self-check</summary>
                  <ul className="mt-1 space-y-0.5 pl-3">
                    <li>What I did: {r.selfCheck.whatIDid}</li>
                    <li>Evidence: {r.selfCheck.evidence}</li>
                    <li>Purpose: {r.selfCheck.purposeFulfilled}</li>
                    <li>Better: {r.selfCheck.whatCouldBeBetter}</li>
                    <li>Blockers: {r.selfCheck.blockers}</li>
                    <li>Support: {r.selfCheck.supportNeeded}</li>
                  </ul>
                </details>
              ) : null}
            </div>
            <select
              className="rounded-full border border-ink/10 bg-white px-2 py-1 text-[10px] text-ink-muted outline-none"
              value={r.status}
              aria-label={`Update ${MEMBER_LABEL[r.member]} status`}
              disabled={busy}
              onChange={(e) => {
                const next = e.target.value as ReceiptStatus;
                if (
                  next === "SUBMITTED" &&
                  (!r.selfCheck || !selfCheckComplete(r.selfCheck))
                ) {
                  setBoardHint?.(
                    "SUBMITTED only from the member room self-check — Living Room cannot fake it.",
                  );
                  return;
                }
                setBoardHint?.(null);
                onUpdateReceipt(cmd.id, r.member, { status: next });
              }}
            >
              {RECEIPT_STATUSES.map((s) => (
                <option
                  key={s}
                  disabled={
                    s === "SUBMITTED" && (!r.selfCheck || !selfCheckComplete(r.selfCheck))
                  }
                >
                  {s}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ApiListResponse = {
  messages?: FamilyCommandMessage[];
  shared?: boolean;
  mode?: FamilyDoorbellStoreMode;
  version?: string;
  error?: string;
};

async function apiList(): Promise<ApiListResponse> {
  const res = await fetch("/api/family-doorbell/messages", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  });
  const data = (await res.json()) as ApiListResponse;
  if (!res.ok) throw new Error(data.error || `GET failed (${res.status})`);
  return data;
}

async function apiCreate(
  body: string,
  sender: CommandSender,
  targets: TargetMemberOption[],
  mode: MessageMode,
  urgency?: UrgencyLevel,
) {
  const res = await fetch("/api/family-doorbell/messages", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body,
      sender,
      target_members: targets,
      selected_recipients: targets,
      mode,
      ...(urgency ? { urgency } : {}),
    }),
  });
  const data = (await res.json()) as ApiListResponse & { error?: string };
  if (!res.ok) throw new Error(data.error || `POST failed (${res.status})`);
  return data;
}

async function apiPatchReceipt(
  messageId: string,
  patch: {
    member: TargetMember;
    status?: ReceiptStatus;
    note?: string;
    supportStatus?: SupportStatus;
    selfCheck?: FamilySelfCheck | null;
    evidence_url?: string | null;
    blocker?: string | null;
  },
) {
  const res = await fetch(
    `/api/family-doorbell/messages/${encodeURIComponent(messageId)}/receipt`,
    {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    },
  );
  const data = (await res.json()) as ApiListResponse & { error?: string };
  if (!res.ok) throw new Error(data.error || `PATCH failed (${res.status})`);
  return data;
}

function applyApiMessages(
  data: ApiListResponse,
): { state: DoorbellState; connection: DoorbellConnection } {
  const messages = Array.isArray(data.messages) ? data.messages : [];
  const mode = data.mode ?? "ephemeral";
  const shared = data.shared === true && mode !== "ephemeral";
  return {
    state: {
      version: "0.9.3",
      commands: messages.map((m) => normalizeCommand(m)).filter(Boolean) as FamilyCommandMessage[],
    },
    connection: {
      shared,
      mode,
      backendAvailable: true,
    },
  };
}

/** Hook: shared doorbell + local fallback for Family Table host. */
export function useDoorbell() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<DoorbellState>(emptyState);
  const [connection, setConnection] = useState<DoorbellConnection>({
    shared: false,
    mode: "local-fallback",
    backendAvailable: false,
  });
  const [savedFlash, setSavedFlash] = useState(false);
  const [errorFlash, setErrorFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const stateRef = useRef(state);
  const connectionRef = useRef(connection);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    connectionRef.current = connection;
  }, [connection]);

  const flashSaved = useCallback(() => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }, []);

  const persistLocal = useCallback(
    (next: DoorbellState) => {
      setState(next);
      saveDoorbellState(next);
      flashSaved();
    },
    [flashSaved],
  );

  const refreshFromApi = useCallback(
    async (opts?: { silent?: boolean }) => {
      try {
        const data = await apiList();
        const applied = applyApiMessages(data);
        setState(applied.state);
        setConnection(applied.connection);
        saveDoorbellState(applied.state);
        if (!opts?.silent) flashSaved();
        setErrorFlash(null);
        return true;
      } catch (err) {
        const local = loadDoorbellState();
        setState(local);
        setConnection({
          shared: false,
          mode: "local-fallback",
          backendAvailable: false,
        });
        if (!opts?.silent) {
          setErrorFlash(
            err instanceof Error
              ? `Backend unavailable — local fallback. ${err.message}`
              : "Backend unavailable — local fallback.",
          );
        }
        return false;
      }
    },
    [flashSaved],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshFromApi({ silent: true });
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshFromApi]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      if (!connectionRef.current.backendAvailable) return;
      void refreshFromApi({ silent: true });
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [ready, refreshFromApi]);

  const postCommand = useCallback(
    async (
      body: string,
      sender: CommandSender,
      targets: TargetMemberOption[],
      mode: MessageMode = DEFAULT_COMPOSER_MODE,
      urgency: UrgencyLevel = "NORMAL",
    ) => {
      const resolved = resolveTargets(targets);
      if (!body.trim() || resolved.length === 0) return;
      if (!isCommandSender(sender)) {
        setErrorFlash("Invalid sender — choose Kieran | Gor Gor | Sky | Senti | Kura | Agent R.");
        return;
      }
      setBusy(true);
      setErrorFlash(null);
      const selected = targets.includes("all")
        ? (["all"] as TargetMemberOption[])
        : resolved;
      try {
        if (connectionRef.current.backendAvailable) {
          const data = await apiCreate(body.trim(), sender, targets, mode, urgency);
          const applied = applyApiMessages(data);
          setState(applied.state);
          setConnection(applied.connection);
          saveDoorbellState(applied.state);
          flashSaved();
        } else {
          const now = new Date().toISOString();
          const command: FamilyCommandMessage = {
            id: `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
            body: body.trim(),
            sender,
            target_members: selected,
            selected_recipients: selected,
            resolved_targets: resolved,
            createdAt: now,
            mode,
            urgency,
            receipts: resolved.map((member) => ({
              id: `local_r_${member}_${Date.now().toString(36)}`,
              member,
              status: "SENT" as ReceiptStatus,
              updatedAt: now,
              note: "",
              supportStatus: "GREEN" as SupportStatus,
              selfCheck: null,
              evidenceUrl: null,
              blocker: null,
            })),
          };
          persistLocal({
            ...stateRef.current,
            commands: [command, ...stateRef.current.commands],
          });
        }
      } catch (err) {
        setErrorFlash(err instanceof Error ? err.message : "Failed to post.");
      } finally {
        setBusy(false);
      }
    },
    [flashSaved, persistLocal],
  );

  const updateReceipt = useCallback(
    async (
      commandId: string,
      member: TargetMember,
      patch: Partial<
        Pick<
          FamilyReceipt,
          "status" | "note" | "supportStatus" | "selfCheck" | "evidenceUrl" | "blocker"
        >
      >,
    ) => {
      if (patch.status === "SUBMITTED" && !selfCheckComplete(patch.selfCheck ?? emptySelfCheck())) {
        setErrorFlash("SUBMITTED requires a complete self-check (all six fields).");
        return;
      }
      setBusy(true);
      setErrorFlash(null);
      try {
        if (connectionRef.current.backendAvailable) {
          const data = await apiPatchReceipt(commandId, {
            member,
            status: patch.status,
            note: patch.note,
            supportStatus: patch.supportStatus,
            selfCheck: patch.selfCheck,
            evidence_url: patch.evidenceUrl,
            blocker: patch.blocker,
          });
          const applied = applyApiMessages(data);
          setState(applied.state);
          setConnection(applied.connection);
          saveDoorbellState(applied.state);
          flashSaved();
        } else {
          const now = new Date().toISOString();
          persistLocal({
            ...stateRef.current,
            commands: stateRef.current.commands.map((cmd) => {
              if (cmd.id !== commandId) return cmd;
              return {
                ...cmd,
                receipts: cmd.receipts.map((r) =>
                  r.member === member
                    ? {
                        ...r,
                        ...patch,
                        updatedAt: now,
                        note: patch.note !== undefined ? patch.note : r.note,
                        supportStatus:
                          patch.supportStatus !== undefined
                            ? patch.supportStatus
                            : r.supportStatus,
                        selfCheck:
                          patch.selfCheck !== undefined ? patch.selfCheck : r.selfCheck,
                        evidenceUrl:
                          patch.evidenceUrl !== undefined
                            ? patch.evidenceUrl
                            : r.evidenceUrl,
                        blocker: patch.blocker !== undefined ? patch.blocker : r.blocker,
                      }
                    : r,
                ),
              };
            }),
          });
        }
      } catch (err) {
        setErrorFlash(err instanceof Error ? err.message : "Failed to update receipt.");
      } finally {
        setBusy(false);
      }
    },
    [flashSaved, persistLocal],
  );

  /**
   * Room chat reply path: if member still SENT / NO_RESPONSE, bump to RECEIVED.
   * Does not auto-mark on load — only when they send a reply.
   */
  const markReceivedOnReply = useCallback(
    (member: TargetMember) => {
      const targets = stateRef.current.commands.filter((cmd) => {
        const r = cmd.receipts.find((x) => x.member === member);
        return r && (r.status === "SENT" || r.status === "NO_RESPONSE");
      });
      for (const cmd of targets) {
        void updateReceipt(cmd.id, member, {
          status: "RECEIVED",
          note: "Ack via room chat reply",
        });
      }
    },
    [updateReceipt],
  );

  const clearAll = useCallback(() => {
    clearDoorbellStorage();
    persistLocal(emptyState());
  }, [persistLocal]);

  return {
    ready,
    state,
    connection,
    savedFlash,
    errorFlash,
    busy,
    postCommand,
    updateReceipt,
    markReceivedOnReply,
    clearAll,
    refresh: () => refreshFromApi({ silent: false }),
  };
}

/** Living Room — Family Meeting / Job Assignment composer + Receipt Board. */
export function LivingRoomDoorbell({
  state,
  connection,
  savedFlash,
  errorFlash,
  busy,
  onPost,
  onUpdateReceipt,
  onRefresh,
}: {
  state: DoorbellState;
  connection: DoorbellConnection;
  savedFlash?: boolean;
  errorFlash?: string | null;
  busy?: boolean;
  onPost: (
    body: string,
    sender: CommandSender,
    targets: TargetMemberOption[],
    mode: MessageMode,
    urgency?: UrgencyLevel,
  ) => void;
  onUpdateReceipt: (
    commandId: string,
    member: TargetMember,
    patch: Partial<
      Pick<FamilyReceipt, "status" | "note" | "supportStatus" | "selfCheck" | "evidenceUrl" | "blocker">
    >,
  ) => void;
  onRefresh?: () => void;
}) {
  const [sender, setSender] = useState<CommandSender>("Gor Gor");
  const [postMode, setPostMode] = useState<MessageMode>(DEFAULT_COMPOSER_MODE);
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<TargetMemberOption[]>(["all"]);
  const [boardHint, setBoardHint] = useState<string | null>(null);
  const messageRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const toggleTarget = (opt: TargetMemberOption) => {
    if (opt === "all") {
      setSelected(["all"]);
      return;
    }
    setSelected((prev) => {
      const withoutAll = prev.filter((x) => x !== "all");
      if (withoutAll.includes(opt)) {
        const next = withoutAll.filter((x) => x !== opt);
        return next.length === 0 ? ["all"] : next;
      }
      return [...withoutAll, opt];
    });
  };

  const sharedOk = connection.backendAvailable && connection.shared;

  const meetingCommands = useMemo(() => {
    return state.commands.filter((c) => {
      const mode = c.mode ?? inferMessageMode(c);
      return isMeetingLikeMode(mode) || c.id === FIRST_FAMILY_MEETING_ID;
    });
  }, [state.commands]);

  const sortedCommands = useMemo(() => {
    const pinned = state.commands.find((c) => c.id === FIRST_FAMILY_MEETING_ID);
    const rest = state.commands.filter((c) => c.id !== FIRST_FAMILY_MEETING_ID);
    // Latest first; pinned first meeting stays highlighted at top when present
    const byTime = [...rest].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return pinned ? [pinned, ...byTime.filter((c) => c.id !== pinned.id)] : byTime;
  }, [state.commands]);

  const openMeetingThread = (id: string) => {
    const el = messageRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.focus();
    }
  };

  const focusId =
    meetingCommands.find((c) => c.id === FIRST_FAMILY_MEETING_ID)?.id ??
    meetingCommands[0]?.id ??
    null;

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/25 bg-white shadow-[0_0_0_1px_rgba(140,130,252,0.06)]">
      <header className="border-b border-ink/5 bg-gradient-to-r from-brand/[0.06] via-[#f7f4fc] to-white px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">
          Family Home v0.9.3 · Family Meeting / Shared Board
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-subtle">
          Family Meeting · Job Assignment · Review Request · Doorbell — not a greeting ·{" "}
          {sharedOk ? "shared across devices" : "local fallback until backend connects"}
        </p>
      </header>

      <div className="space-y-5 p-4 sm:p-5">
        <StagingBanner connection={connection} />
        {savedFlash ? (
          <p className="text-[11px] font-semibold text-brand">
            {sharedOk ? "Synced ✓" : "Saved locally ✓"}
          </p>
        ) : null}
        {errorFlash ? (
          <p className="rounded-lg border border-rose-300/40 bg-rose-50 px-3 py-2 text-[11px] text-rose-900">
            {errorFlash}
          </p>
        ) : null}
        {boardHint ? (
          <p className="rounded-lg border border-amber-300/50 bg-amber-50 px-3 py-2 text-[11px] text-amber-950">
            {boardHint}
          </p>
        ) : null}

        {/* Meeting Thread */}
        <div className="rounded-xl border border-brand/25 bg-gradient-to-br from-[#f7f4fc] via-white to-[#f3eef9] p-4">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            FIRST FAMILY MEETING · JOB ASSIGNMENT
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            Latest / first meeting at top · pin highlights{" "}
            <code className="font-mono text-[10px]">{FIRST_FAMILY_MEETING_ID}</code> when present.
          </p>
          {focusId ? (
            <button
              type="button"
              className={cn(btnPrimary, "mt-3")}
              onClick={() => openMeetingThread(focusId)}
            >
              Open Meeting Thread
            </button>
          ) : (
            <p className="mt-3 text-[11px] text-ink-subtle">
              No Family Meeting posts yet — compose one below.
            </p>
          )}
          {meetingCommands.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {meetingCommands.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="text-left text-[11px] text-ink-muted hover:text-brand"
                    onClick={() => openMeetingThread(c.id)}
                  >
                    <span className="font-semibold text-ink">{c.sender}</span>
                    {" · "}
                    {MESSAGE_MODE_LABELS[c.mode ?? inferMessageMode(c)]}
                    {" · "}
                    <span className="font-mono text-[10px]">{c.id}</span>
                    {c.id === FIRST_FAMILY_MEETING_ID ? " · pinned" : ""}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <form
          className="space-y-3 rounded-xl border border-dashed border-brand/25 bg-gradient-to-br from-white via-[#faf8fc] to-[#f3eef9] p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!body.trim() || selected.length === 0 || busy) return;
            onPost(body, sender, selected, postMode);
            setBody("");
            // Keep sender + mode — do not reset incorrectly
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              Compose · Living Room
            </p>
            {onRefresh ? (
              <button
                type="button"
                className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand hover:underline"
                onClick={() => onRefresh()}
                disabled={busy}
              >
                Refresh
              </button>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fh-post-mode">
              Mode
            </label>
            <select
              id="fh-post-mode"
              className={inputClass}
              value={postMode}
              onChange={(e) => setPostMode(e.target.value as MessageMode)}
            >
              {MESSAGE_MODES.map((m) => (
                <option key={m} value={m}>
                  {MESSAGE_MODE_LABELS[m]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-ink-subtle">
              Sprint default: Family Meeting / Job Assignment — never merely &quot;greeting&quot;.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="fh-sender">
              Sender
            </label>
            <select
              id="fh-sender"
              className={inputClass}
              value={sender}
              onChange={(e) => {
                const next = e.target.value;
                if (isCommandSender(next)) setSender(next);
              }}
            >
              {COMMAND_SENDERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-ink-subtle">
              Posts as exact API string (e.g.{" "}
              <code className="font-mono">&quot;Gor Gor&quot;</code>). Controlled select — does not
              reset on submit.
            </p>
          </div>

          <div>
            <label className={labelClass}>target_members</label>
            <div className="flex flex-wrap gap-2">
              {TARGET_MEMBER_OPTIONS.map((opt) => {
                const active = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleTarget(opt)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
                      active
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-ink/10 bg-white text-ink-muted hover:border-brand/30",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-ink-subtle">
              Multi-select members, or <code className="font-mono">all</code>. Receipts start as SENT
              — not auto RECEIVED · members are not auto-marked present.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="fh-body">
              {isMeetingLikeMode(postMode) ? "Meeting / assignment body" : "Announcement body"}
            </label>
            <textarea
              id="fh-body"
              className={cn(inputClass, "min-h-[120px] resize-y font-mono text-[12px]")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                isMeetingLikeMode(postMode)
                  ? "Meeting title: …\nPurpose: …\nAssignments by member:\n- Sky: …\nDeadline guidance: …\nRequired response statuses: …\nSupport status key: …\nGor Gor Review reminder: …"
                  : sharedOk
                    ? "What should the family hear? (shared across devices)"
                    : "What should the family hear? (local fallback — this browser only)"
              }
              required
            />
          </div>
          <button type="submit" className={btnPrimary} disabled={!body.trim() || busy}>
            {isMeetingLikeMode(postMode) ? "Post Family Meeting" : "Send announcement"}
          </button>
        </form>

        <div>
          <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Board · posts + receipts
          </p>
          <p className="mb-3 text-[11px] text-ink-subtle">
            Each Family Meeting shows a structured card and a prominent Receipt Board immediately
            below. Responses are never faked.
          </p>

          {sortedCommands.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-subtle">
              No posts yet — start the first Family Meeting above.
            </p>
          ) : (
            <ul className="space-y-4">
              {sortedCommands.map((cmd) => {
                const mode = cmd.mode ?? inferMessageMode(cmd);
                const pinned = cmd.id === FIRST_FAMILY_MEETING_ID;
                return (
                  <li
                    key={cmd.id}
                    id={`meeting-${cmd.id}`}
                    tabIndex={-1}
                    ref={(el) => {
                      messageRefs.current[cmd.id] = el;
                    }}
                    className={cn(
                      "overflow-hidden rounded-xl border bg-silk/40 outline-none focus:ring-2 focus:ring-brand/40",
                      pinned
                        ? "border-brand/40 shadow-[0_0_0_1px_rgba(140,130,252,0.2)]"
                        : "border-ink/10",
                    )}
                  >
                    <div className="border-b border-ink/5 bg-white/80 px-3 py-3 sm:px-4">
                      <MeetingJobCard cmd={{ ...cmd, mode }} />
                    </div>
                    <ReceiptBoardList
                      cmd={cmd}
                      busy={busy}
                      onUpdateReceipt={onUpdateReceipt}
                      setBoardHint={setBoardHint}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/** Member room — meeting response controls + ack + support + SUBMITTED self-check. */
export function MemberDoorbellPanel({
  member,
  state,
  connection,
  busy,
  errorFlash,
  onUpdateReceipt,
}: {
  member: TargetMember;
  state: DoorbellState;
  connection: DoorbellConnection;
  busy?: boolean;
  errorFlash?: string | null;
  onUpdateReceipt: (
    commandId: string,
    member: TargetMember,
    patch: Partial<
      Pick<FamilyReceipt, "status" | "note" | "supportStatus" | "selfCheck" | "evidenceUrl" | "blocker">
    >,
  ) => void;
}) {
  const pending = useMemo(() => {
    return state.commands
      .map((cmd) => {
        const receipt = cmd.receipts.find((r) => r.member === member);
        if (!receipt) return null;
        return { cmd, receipt };
      })
      .filter(Boolean) as { cmd: FamilyCommandMessage; receipt: FamilyReceipt }[];
  }, [state.commands, member]);

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [evidenceUrls, setEvidenceUrls] = useState<Record<string, string>>({});
  const [blockers, setBlockers] = useState<Record<string, string>>({});
  const [selfChecks, setSelfChecks] = useState<Record<string, FamilySelfCheck>>({});
  const [selfCheckOpen, setSelfCheckOpen] = useState<string | null>(null);
  const [localHint, setLocalHint] = useState<string | null>(null);

  const requireNote = (cmdId: string, receipt: FamilyReceipt): string | null => {
    const note = (notes[cmdId] ?? receipt.note).trim();
    if (!note) {
      setLocalHint("A note is required when you update your response status.");
      return null;
    }
    setLocalHint(null);
    return note;
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/25 bg-white shadow-[0_0_0_1px_rgba(140,130,252,0.06)]">
      <header className="border-b border-ink/5 bg-gradient-to-r from-[#f7f4fc] via-white to-brand/[0.04] px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">
          Family Meeting response · {MEMBER_LABEL[member]} room · v0.9.3
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-subtle">
          Update your receipt honestly · note required · Support Status · SUBMITTED needs self-check
          · never auto RECEIVED
        </p>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <StagingBanner connection={connection} />
        {errorFlash ? (
          <p className="rounded-lg border border-rose-300/40 bg-rose-50 px-3 py-2 text-[11px] text-rose-900">
            {errorFlash}
          </p>
        ) : null}
        {localHint ? (
          <p className="rounded-lg border border-amber-300/50 bg-amber-50 px-3 py-2 text-[11px] text-amber-950">
            {localHint}
          </p>
        ) : null}

        {pending.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-subtle">
            No meetings / doorbells for {MEMBER_LABEL[member]} yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {pending.map(({ cmd, receipt }) => {
              const noteDraft = notes[cmd.id] ?? receipt.note;
              const evidenceDraft = evidenceUrls[cmd.id] ?? receipt.evidenceUrl ?? "";
              const blockerDraft = blockers[cmd.id] ?? receipt.blocker ?? "";
              const sc = selfChecks[cmd.id] ?? emptySelfCheck();
              const open = selfCheckOpen === cmd.id;
              const mode = cmd.mode ?? inferMessageMode(cmd);
              return (
                <li
                  key={cmd.id}
                  className="rounded-xl border border-ink/10 bg-gradient-to-br from-white via-[#faf8fc] to-[#f3eef9] p-4"
                >
                  <MeetingJobCard cmd={{ ...cmd, mode }} />

                  <div className="mt-3 rounded-lg border border-brand/15 bg-white/80 p-3">
                    <p className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                      Your receipt
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={RECEIPT_TONE[receipt.status]}>{receipt.status}</Badge>
                      <Badge tone={SUPPORT_TONE[receipt.supportStatus]}>
                        Support {receipt.supportStatus}
                      </Badge>
                      <span className="text-[10px] text-ink-subtle">
                        Last update · {formatTime(receipt.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className={labelClass}>Support Status</label>
                    <div className="flex flex-wrap gap-2">
                      {SUPPORT_STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={busy}
                          className={cn(
                            "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition",
                            receipt.supportStatus === s
                              ? SUPPORT_TONE[s]
                              : "border-ink/10 bg-white text-ink-muted hover:border-brand/30",
                          )}
                          onClick={() => {
                            const note = requireNote(cmd.id, receipt);
                            if (!note) return;
                            onUpdateReceipt(cmd.id, member, {
                              supportStatus: s,
                              note,
                              evidenceUrl: evidenceDraft.trim() || null,
                              blocker: blockerDraft.trim() || null,
                            });
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className={labelClass}>Note (required on response)</label>
                    <input
                      className={inputClass}
                      value={noteDraft}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [cmd.id]: e.target.value }))
                      }
                      placeholder="Short honest note for the Receipt Board"
                      required
                    />
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Evidence URL (optional)</label>
                      <input
                        className={inputClass}
                        value={evidenceDraft}
                        onChange={(e) =>
                          setEvidenceUrls((prev) => ({ ...prev, [cmd.id]: e.target.value }))
                        }
                        placeholder="https://… or path"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Blocker (optional)</label>
                      <input
                        className={inputClass}
                        value={blockerDraft}
                        onChange={(e) =>
                          setBlockers((prev) => ({ ...prev, [cmd.id]: e.target.value }))
                        }
                        placeholder="What's blocking you?"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ACK_ACTIONS.map((a) => (
                      <button
                        key={a.status}
                        type="button"
                        className={btnAck}
                        disabled={busy}
                        onClick={() => {
                          const note = requireNote(cmd.id, receipt);
                          if (!note) return;
                          if (a.status === "SUBMITTED") {
                            setSelfCheckOpen(cmd.id);
                            return;
                          }
                          onUpdateReceipt(cmd.id, member, {
                            status: a.status,
                            note,
                            evidenceUrl: evidenceDraft.trim() || null,
                            blocker: blockerDraft.trim() || null,
                          });
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>

                  {open ? (
                    <div className="mt-4 space-y-3 rounded-xl border border-brand/20 bg-white/90 p-3">
                      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                        Self-check required before SUBMITTED
                      </p>
                      {SELF_CHECK_FIELDS.map((f) => (
                        <div key={f.key}>
                          <label className={labelClass}>{f.label}</label>
                          <textarea
                            className={cn(inputClass, "min-h-[56px] resize-y")}
                            value={sc[f.key]}
                            placeholder={f.placeholder}
                            onChange={(e) =>
                              setSelfChecks((prev) => ({
                                ...prev,
                                [cmd.id]: { ...sc, [f.key]: e.target.value },
                              }))
                            }
                          />
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={btnPrimary}
                          disabled={busy || !selfCheckComplete(sc)}
                          onClick={() => {
                            const note = requireNote(cmd.id, receipt);
                            if (!note || !selfCheckComplete(sc)) return;
                            onUpdateReceipt(cmd.id, member, {
                              status: "SUBMITTED",
                              note,
                              evidenceUrl: evidenceDraft.trim() || null,
                              blocker: blockerDraft.trim() || null,
                              selfCheck: {
                                whatIDid: sc.whatIDid.trim(),
                                evidence: sc.evidence.trim(),
                                purposeFulfilled: sc.purposeFulfilled.trim(),
                                whatCouldBeBetter: sc.whatCouldBeBetter.trim(),
                                blockers: sc.blockers.trim(),
                                supportNeeded: sc.supportNeeded.trim(),
                              },
                            });
                            setSelfCheckOpen(null);
                          }}
                        >
                          Submit with self-check
                        </button>
                        <button
                          type="button"
                          className={btnAck}
                          onClick={() => setSelfCheckOpen(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
