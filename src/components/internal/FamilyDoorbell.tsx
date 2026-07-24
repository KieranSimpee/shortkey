"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { uid } from "@/components/internal/FamilyChatPanel";

/**
 * Family Home v0.9.1 — Doorbell & Receipt Board
 * Storage: browser localStorage key `shortkey-family-doorbell-v091` only.
 * Migrates once from legacy `shortkey-doorbell-receipts-v01` if present.
 * Local prototype — no cross-device sync · not production · Gor Gor Review pending.
 * Doc: src/brand/sky/FAMILY_HOME_v0_9_1_DOORBELL_RECEIPT.md
 */

export const DOORBELL_STORAGE_KEY = "shortkey-family-doorbell-v091";
const LEGACY_DOORBELL_KEY = "shortkey-doorbell-receipts-v01";

export const DOORBELL_WARNING =
  "Family Home v0.9.1 · Internal Staging · local prototype only · this browser’s localStorage · not shared across devices · not shared DB · Gor Gor Review pending.";

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

/** Ack buttons shown in member rooms (status they set). */
export const ACK_ACTIONS: { label: string; status: ReceiptStatus }[] = [
  { label: "收到", status: "RECEIVED" },
  { label: "睇緊", status: "READING" },
  { label: "處理中", status: "IN_PROGRESS" },
  { label: "需要Gor Gor", status: "NEEDS_GOR_GOR" },
  { label: "Blocked", status: "BLOCKED" },
  { label: "已提交", status: "SUBMITTED" },
];

export const COMMAND_SENDERS = ["Kieran", "Gor Gor"] as const;
export type CommandSender = (typeof COMMAND_SENDERS)[number];

export type DoorbellReceipt = {
  id: string;
  member: TargetMember;
  status: ReceiptStatus;
  updatedAt: string;
  note: string;
};

export type DoorbellCommand = {
  id: string;
  body: string;
  sender: CommandSender;
  /** Options selected at post time (may include `all`). */
  target_members: TargetMemberOption[];
  /** Expanded members who received a receipt row. */
  resolved_targets: TargetMember[];
  createdAt: string;
  receipts: DoorbellReceipt[];
};

export type DoorbellState = {
  version: "0.9.1";
  commands: DoorbellCommand[];
  migratedFrom?: string[];
};

const ALL_MEMBERS: TargetMember[] = ["sky", "senti", "kura", "agent-r", "gor-gor"];

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
  SUBMITTED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  NO_RESPONSE: "border-ink/20 bg-ink/[0.03] text-ink-subtle",
};

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";
const btnPrimary =
  "rounded-full bg-brand px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40";
const btnAck =
  "rounded-full border border-brand/25 bg-white px-3 py-1.5 text-[11px] font-medium text-ink transition hover:border-brand/50 hover:bg-brand/5";

function emptyState(): DoorbellState {
  return { version: "0.9.1", commands: [] };
}

export function resolveTargets(selected: TargetMemberOption[]): TargetMember[] {
  if (selected.includes("all")) return [...ALL_MEMBERS];
  const set = new Set<TargetMember>();
  for (const t of selected) {
    if (t !== "all") set.add(t);
  }
  return ALL_MEMBERS.filter((m) => set.has(m));
}

function normalizeState(
  parsed: Partial<DoorbellState> & { version?: string },
  migratedFrom?: string[],
): DoorbellState {
  if (!Array.isArray(parsed.commands)) {
    return migratedFrom?.length
      ? { version: "0.9.1", commands: [], migratedFrom }
      : emptyState();
  }
  return {
    version: "0.9.1",
    commands: parsed.commands,
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
      const parsed = JSON.parse(raw) as Partial<DoorbellState>;
      return normalizeState(parsed);
    }
    // One-time migrate from prior v0.1 key
    const legacy = localStorage.getItem(LEGACY_DOORBELL_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as Partial<DoorbellState>;
      const migrated = normalizeState(parsed, [LEGACY_DOORBELL_KEY]);
      localStorage.setItem(DOORBELL_STORAGE_KEY, JSON.stringify(migrated));
      localStorage.removeItem(LEGACY_DOORBELL_KEY);
      return migrated;
    }
    return emptyState();
  } catch {
    return emptyState();
  }
}

export function saveDoorbellState(data: DoorbellState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DOORBELL_STORAGE_KEY, JSON.stringify({ ...data, version: "0.9.1" }));
}

export function clearDoorbellStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DOORBELL_STORAGE_KEY);
  localStorage.removeItem(LEGACY_DOORBELL_KEY);
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

function StagingBanner() {
  return (
    <div
      role="status"
      className="rounded-xl border border-amber-700/25 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-950"
    >
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-amber-900">
        Family Home v0.9.1 · Internal Staging · local prototype only
      </span>
      <span className="mt-0.5 block text-amber-900/90">{DOORBELL_WARNING}</span>
    </div>
  );
}

/** Hook: doorbell state + persist helpers for Family Table host. */
export function useDoorbell() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<DoorbellState>(emptyState);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setState(loadDoorbellState());
    setReady(true);
  }, []);

  const persist = useCallback((next: DoorbellState) => {
    setState(next);
    saveDoorbellState(next);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }, []);

  const postCommand = useCallback(
    (body: string, sender: CommandSender, targets: TargetMemberOption[]) => {
      const resolved = resolveTargets(targets);
      if (!body.trim() || resolved.length === 0) return;
      const now = new Date().toISOString();
      const command: DoorbellCommand = {
        id: uid(),
        body: body.trim(),
        sender,
        target_members: targets.includes("all") ? ["all"] : resolved,
        resolved_targets: resolved,
        createdAt: now,
        receipts: resolved.map((member) => ({
          id: uid(),
          member,
          status: "SENT" as ReceiptStatus,
          updatedAt: now,
          note: "",
        })),
      };
      persist({ ...state, commands: [command, ...state.commands] });
    },
    [persist, state],
  );

  const updateReceipt = useCallback(
    (
      commandId: string,
      member: TargetMember,
      patch: Partial<Pick<DoorbellReceipt, "status" | "note">>,
    ) => {
      const now = new Date().toISOString();
      persist({
        ...state,
        commands: state.commands.map((cmd) => {
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
                  }
                : r,
            ),
          };
        }),
      });
    },
    [persist, state],
  );

  /**
   * Room chat reply path: if member still SENT / NO_RESPONSE, bump to RECEIVED.
   * Does not auto-mark on load — only when they send a reply.
   */
  const markReceivedOnReply = useCallback(
    (member: TargetMember) => {
      const now = new Date().toISOString();
      let changed = false;
      const commands = state.commands.map((cmd) => {
        const receipts = cmd.receipts.map((r) => {
          if (r.member !== member) return r;
          if (r.status !== "SENT" && r.status !== "NO_RESPONSE") return r;
          changed = true;
          return {
            ...r,
            status: "RECEIVED" as ReceiptStatus,
            updatedAt: now,
            note: r.note || "Ack via room chat reply",
          };
        });
        return { ...cmd, receipts };
      });
      if (changed) persist({ ...state, commands });
    },
    [persist, state],
  );

  const clearAll = useCallback(() => {
    clearDoorbellStorage();
    persist(emptyState());
  }, [persist]);

  return {
    ready,
    state,
    savedFlash,
    postCommand,
    updateReceipt,
    markReceivedOnReply,
    clearAll,
  };
}

/** Living Room — post doorbell command + Receipt Board. */
export function LivingRoomDoorbell({
  state,
  savedFlash,
  onPost,
  onUpdateReceipt,
}: {
  state: DoorbellState;
  savedFlash?: boolean;
  onPost: (body: string, sender: CommandSender, targets: TargetMemberOption[]) => void;
  onUpdateReceipt: (
    commandId: string,
    member: TargetMember,
    patch: Partial<Pick<DoorbellReceipt, "status" | "note">>,
  ) => void;
}) {
  const [sender, setSender] = useState<CommandSender>("Kieran");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<TargetMemberOption[]>(["all"]);

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

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/25 bg-white shadow-[0_0_0_1px_rgba(140,130,252,0.06)]">
      <header className="border-b border-ink/5 bg-gradient-to-r from-brand/[0.06] via-[#f7f4fc] to-white px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">
          Family Home v0.9.1 · Doorbell &amp; Receipt Board
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-subtle">
          Kieran / Gor Gor ring from Living Room · members ack from their rooms · not shared across
          devices
        </p>
      </header>

      <div className="space-y-5 p-4 sm:p-5">
        <StagingBanner />
        {savedFlash ? (
          <p className="text-[11px] font-semibold text-brand">Saved locally ✓</p>
        ) : null}

        <form
          className="space-y-3 rounded-xl border border-dashed border-brand/25 bg-gradient-to-br from-white via-[#faf8fc] to-[#f3eef9] p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!body.trim() || selected.length === 0) return;
            onPost(body, sender, selected);
            setBody("");
          }}
        >
          <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Ring doorbell · Living Room command
          </p>
          <div>
            <label className={labelClass}>Sender</label>
            <select
              className={inputClass}
              value={sender}
              onChange={(e) => setSender(e.target.value as CommandSender)}
            >
              {COMMAND_SENDERS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
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
              Multi-select members, or <code className="font-mono">all</code>. Receipts start as
              SENT — not auto RECEIVED.
            </p>
          </div>
          <div>
            <label className={labelClass}>Command</label>
            <textarea
              className={cn(inputClass, "min-h-[72px] resize-y")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What should the family do? (this browser only)"
              required
            />
          </div>
          <button type="submit" className={btnPrimary} disabled={!body.trim()}>
            Send doorbell
          </button>
        </form>

        <div>
          <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Receipt Board
          </p>
          <p className="mb-3 text-[11px] text-ink-subtle">
            Each target member · current status · timestamp · last note. Until ack, status stays
            SENT (no response yet). Key:{" "}
            <code className="font-mono text-[10px]">{DOORBELL_STORAGE_KEY}</code>
          </p>

          {state.commands.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-subtle">
              No doorbells yet — send the first Living Room command.
            </p>
          ) : (
            <ul className="space-y-4">
              {state.commands.map((cmd) => (
                <li
                  key={cmd.id}
                  className="overflow-hidden rounded-xl border border-ink/10 bg-silk/40"
                >
                  <div className="border-b border-ink/5 bg-white/80 px-3 py-2.5 sm:px-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="border-brand/30 bg-brand/10 text-brand">{cmd.sender}</Badge>
                      <span className="text-[10px] text-ink-subtle">
                        → {cmd.target_members.join(", ")}
                      </span>
                      <span className="text-[10px] text-ink-subtle">{formatTime(cmd.createdAt)}</span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink">{cmd.body}</p>
                  </div>
                  <ul className="divide-y divide-ink/5">
                    {cmd.receipts.map((r) => (
                      <li
                        key={r.id}
                        className="flex flex-wrap items-start justify-between gap-2 px-3 py-2.5 sm:px-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-ink">{MEMBER_LABEL[r.member]}</p>
                            <Badge tone={RECEIPT_TONE[r.status]}>{r.status}</Badge>
                            {(r.status === "SENT" || r.status === "NO_RESPONSE") && (
                              <span className="text-[10px] text-ink-subtle">no response yet</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[10px] text-ink-subtle">
                            {formatTime(r.updatedAt)}
                          </p>
                          {r.note ? (
                            <p className="mt-1 text-xs text-ink-muted">Note: {r.note}</p>
                          ) : (
                            <p className="mt-1 text-[10px] text-ink-subtle">No note yet</p>
                          )}
                        </div>
                        <select
                          className="rounded-full border border-ink/10 bg-white px-2 py-1 text-[10px] text-ink-muted outline-none"
                          value={r.status}
                          aria-label={`Update ${MEMBER_LABEL[r.member]} status`}
                          onChange={(e) =>
                            onUpdateReceipt(cmd.id, r.member, {
                              status: e.target.value as ReceiptStatus,
                            })
                          }
                        >
                          {RECEIPT_STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/** Member room — pending doorbells addressed to this seat + ack buttons. */
export function MemberDoorbellPanel({
  member,
  state,
  onUpdateReceipt,
}: {
  member: TargetMember;
  state: DoorbellState;
  onUpdateReceipt: (
    commandId: string,
    member: TargetMember,
    patch: Partial<Pick<DoorbellReceipt, "status" | "note">>,
  ) => void;
}) {
  const pending = useMemo(() => {
    return state.commands
      .map((cmd) => {
        const receipt = cmd.receipts.find((r) => r.member === member);
        if (!receipt) return null;
        return { cmd, receipt };
      })
      .filter(Boolean) as { cmd: DoorbellCommand; receipt: DoorbellReceipt }[];
  }, [state.commands, member]);

  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/25 bg-white shadow-[0_0_0_1px_rgba(140,130,252,0.06)]">
      <header className="border-b border-ink/5 bg-gradient-to-r from-[#f7f4fc] via-white to-brand/[0.04] px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">
          Doorbell · {MEMBER_LABEL[member]} room · v0.9.1
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-subtle">
          Ack Living Room commands here · or reply in room chat to mark RECEIVED
        </p>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <StagingBanner />

        {pending.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-subtle">
            No doorbells for {MEMBER_LABEL[member]} yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {pending.map(({ cmd, receipt }) => {
              const noteDraft = notes[cmd.id] ?? receipt.note;
              return (
                <li
                  key={cmd.id}
                  className="rounded-xl border border-ink/10 bg-gradient-to-br from-white via-[#faf8fc] to-[#f3eef9] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="border-brand/30 bg-brand/10 text-brand">{cmd.sender}</Badge>
                    <Badge tone={RECEIPT_TONE[receipt.status]}>{receipt.status}</Badge>
                    <span className="text-[10px] text-ink-subtle">
                      {formatTime(cmd.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{cmd.body}</p>
                  <p className="mt-1 text-[10px] text-ink-subtle">
                    Last update · {formatTime(receipt.updatedAt)}
                    {receipt.note ? ` · ${receipt.note}` : ""}
                  </p>

                  <div className="mt-3">
                    <label className={labelClass}>Ack (optional note)</label>
                    <input
                      className={inputClass}
                      value={noteDraft}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [cmd.id]: e.target.value }))
                      }
                      placeholder="Short note for Living Room board"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ACK_ACTIONS.map((a) => (
                      <button
                        key={a.status}
                        type="button"
                        className={btnAck}
                        onClick={() =>
                          onUpdateReceipt(cmd.id, member, {
                            status: a.status,
                            note: (notes[cmd.id] ?? receipt.note).trim(),
                          })
                        }
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
