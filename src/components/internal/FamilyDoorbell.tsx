"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ALL_MEMBERS,
  COMMAND_SENDERS,
  RECEIPT_STATUSES,
  SUPPORT_STATUSES,
  TARGET_MEMBER_OPTIONS,
  type CommandSender,
  type FamilyCommandMessage,
  type FamilyDoorbellStoreMode,
  type FamilyReceipt,
  type FamilySelfCheck,
  type ReceiptStatus,
  type SupportStatus,
  type TargetMember,
  type TargetMemberOption,
} from "@/lib/familyDoorbellTypes";

/**
 * Family Home v0.9.2 — Shared Doorbell / Shared Presence
 * Prefers shared API (`/api/family-doorbell/*`); localStorage is fallback/demo only.
 * Never auto RECEIVED · never auto-present · SUBMITTED requires self-check.
 * Doc: src/brand/sky/FAMILY_HOME_v0_9_2_SHARED_DOORBELL.md
 */

export const DOORBELL_STORAGE_KEY = "shortkey-family-doorbell-v092";
const LEGACY_V091_KEY = "shortkey-family-doorbell-v091";
const LEGACY_V01_KEY = "shortkey-doorbell-receipts-v01";

export const POLL_MS = 6000;

export const DOORBELL_WARNING_SHARED =
  "Family Home v0.9.2 · Internal Staging · Shared backend connected · Gor Gor Review pending.";

export const DOORBELL_WARNING_FALLBACK =
  "Family Home v0.9.2 · Internal Staging · Local fallback / demo only · this browser’s localStorage · not shared across devices · Gor Gor Review pending.";

/** @deprecated use mode-aware banners; kept for clear-all UI copy */
export const DOORBELL_WARNING = DOORBELL_WARNING_FALLBACK;

export {
  TARGET_MEMBER_OPTIONS,
  RECEIPT_STATUSES,
  SUPPORT_STATUSES,
  COMMAND_SENDERS,
  ALL_MEMBERS,
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
};

/** Ack buttons shown in member rooms (status they set). */
export const ACK_ACTIONS: { label: string; status: ReceiptStatus }[] = [
  { label: "收到", status: "RECEIVED" },
  { label: "睇緊", status: "READING" },
  { label: "處理中", status: "IN_PROGRESS" },
  { label: "需要Gor Gor", status: "NEEDS_GOR_GOR" },
  { label: "Blocked", status: "BLOCKED" },
  { label: "已提交", status: "SUBMITTED" },
];

export type DoorbellReceipt = FamilyReceipt;
export type DoorbellCommand = FamilyCommandMessage;

export type DoorbellState = {
  version: "0.9.2";
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

function emptyState(): DoorbellState {
  return { version: "0.9.2", commands: [] };
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
  };
}

function normalizeCommand(c: Partial<FamilyCommandMessage>): FamilyCommandMessage | null {
  if (!c || typeof c.body !== "string" || !Array.isArray(c.receipts)) return null;
  const receipts = c.receipts
    .filter((r): r is FamilyReceipt => !!r && typeof r === "object" && !!r.member)
    .map((r) => normalizeReceipt(r));
  return {
    id: typeof c.id === "string" ? c.id : `legacy_${Date.now()}`,
    body: c.body,
    sender: c.sender === "Gor Gor" ? "Gor Gor" : "Kieran",
    target_members: Array.isArray(c.target_members)
      ? (c.target_members as TargetMemberOption[])
      : ["all"],
    resolved_targets: Array.isArray(c.resolved_targets)
      ? (c.resolved_targets as TargetMember[])
      : receipts.map((r) => r.member),
    createdAt: typeof c.createdAt === "string" ? c.createdAt : new Date().toISOString(),
    receipts,
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
    version: "0.9.2",
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
  localStorage.setItem(DOORBELL_STORAGE_KEY, JSON.stringify({ ...data, version: "0.9.2" }));
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
        Family Home v0.9.2 · Internal Staging
        {sharedOk ? " · Shared backend" : " · Local fallback"}
      </span>
      <span className={cn("mt-0.5 block", sharedOk ? "text-ink-muted" : "text-amber-900/90")}>
        {sharedOk
          ? `${DOORBELL_WARNING_SHARED} · mode: ${connection.mode}`
          : DOORBELL_WARNING_FALLBACK}
      </span>
    </div>
  );
}

type ApiListResponse = {
  messages?: FamilyCommandMessage[];
  shared?: boolean;
  mode?: FamilyDoorbellStoreMode;
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

async function apiCreate(body: string, sender: CommandSender, targets: TargetMemberOption[]) {
  const res = await fetch("/api/family-doorbell/messages", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, sender, target_members: targets }),
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
  },
) {
  const res = await fetch(`/api/family-doorbell/messages/${encodeURIComponent(messageId)}/receipt`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
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
      version: "0.9.2",
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

  const refreshFromApi = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      const data = await apiList();
      const applied = applyApiMessages(data);
      setState(applied.state);
      setConnection(applied.connection);
      // Mirror shared snapshot locally for offline demo continuity
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
  }, [flashSaved]);

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

  // Poll when shared backend is connected
  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      if (!connectionRef.current.backendAvailable) return;
      void refreshFromApi({ silent: true });
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [ready, refreshFromApi]);

  const postCommand = useCallback(
    async (body: string, sender: CommandSender, targets: TargetMemberOption[]) => {
      const resolved = resolveTargets(targets);
      if (!body.trim() || resolved.length === 0) return;
      setBusy(true);
      setErrorFlash(null);
      try {
        if (connectionRef.current.backendAvailable) {
          const data = await apiCreate(body.trim(), sender, targets);
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
            target_members: targets.includes("all") ? ["all"] : resolved,
            resolved_targets: resolved,
            createdAt: now,
            receipts: resolved.map((member) => ({
              id: `local_r_${member}_${Date.now().toString(36)}`,
              member,
              status: "SENT" as ReceiptStatus,
              updatedAt: now,
              note: "",
              supportStatus: "GREEN" as SupportStatus,
              selfCheck: null,
            })),
          };
          persistLocal({
            ...stateRef.current,
            commands: [command, ...stateRef.current.commands],
          });
        }
      } catch (err) {
        setErrorFlash(err instanceof Error ? err.message : "Failed to post doorbell.");
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
      patch: Partial<Pick<FamilyReceipt, "status" | "note" | "supportStatus" | "selfCheck">>,
    ) => {
      if (patch.status === "SUBMITTED" && !selfCheckComplete(patch.selfCheck ?? emptySelfCheck())) {
        setErrorFlash(
          "SUBMITTED requires a complete self-check (all six fields).",
        );
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

/** Living Room — post doorbell command + Receipt Board. */
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
  onPost: (body: string, sender: CommandSender, targets: TargetMemberOption[]) => void;
  onUpdateReceipt: (
    commandId: string,
    member: TargetMember,
    patch: Partial<Pick<FamilyReceipt, "status" | "note" | "supportStatus" | "selfCheck">>,
  ) => void;
  onRefresh?: () => void;
}) {
  const [sender, setSender] = useState<CommandSender>("Kieran");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<TargetMemberOption[]>(["all"]);
  const [boardHint, setBoardHint] = useState<string | null>(null);

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

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/25 bg-white shadow-[0_0_0_1px_rgba(140,130,252,0.06)]">
      <header className="border-b border-ink/5 bg-gradient-to-r from-brand/[0.06] via-[#f7f4fc] to-white px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">
          Family Home v0.9.2 · Shared Doorbell / Shared Presence
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-subtle">
          Kieran / Gor Gor ring from Living Room · members ack from their rooms ·{" "}
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

        <form
          className="space-y-3 rounded-xl border border-dashed border-brand/25 bg-gradient-to-br from-white via-[#faf8fc] to-[#f3eef9] p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!body.trim() || selected.length === 0 || busy) return;
            onPost(body, sender, selected);
            setBody("");
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              Ring doorbell · Living Room command
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
              SENT — not auto RECEIVED · members are not auto-marked present.
            </p>
          </div>
          <div>
            <label className={labelClass}>Command</label>
            <textarea
              className={cn(inputClass, "min-h-[72px] resize-y")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                sharedOk
                  ? "What should the family do? (shared across devices)"
                  : "What should the family do? (local fallback — this browser only)"
              }
              required
            />
          </div>
          <button type="submit" className={btnPrimary} disabled={!body.trim() || busy}>
            Send doorbell
          </button>
        </form>

        <div>
          <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Receipt Board
          </p>
          <p className="mb-3 text-[11px] text-ink-subtle">
            Each target member · status · support · timestamp · last note. Until ack, status stays
            SENT (no response yet). Poll ~{POLL_MS / 1000}s when shared.
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
                            <Badge tone={SUPPORT_TONE[r.supportStatus]}>
                              Support {r.supportStatus}
                            </Badge>
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
                          {r.selfCheck ? (
                            <details className="mt-2 text-[10px] text-ink-muted">
                              <summary className="cursor-pointer font-semibold text-brand">
                                Self-check
                              </summary>
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
                              setBoardHint(
                                "SUBMITTED only from the member room self-check — Living Room cannot fake it.",
                              );
                              return;
                            }
                            setBoardHint(null);
                            onUpdateReceipt(cmd.id, r.member, { status: next });
                          }}
                        >
                          {RECEIPT_STATUSES.map((s) => (
                            <option
                              key={s}
                              disabled={
                                s === "SUBMITTED" &&
                                (!r.selfCheck || !selfCheckComplete(r.selfCheck))
                              }
                            >
                              {s}
                            </option>
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

/** Member room — pending doorbells + ack + support status + SUBMITTED self-check. */
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
    patch: Partial<Pick<FamilyReceipt, "status" | "note" | "supportStatus" | "selfCheck">>,
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
  const [selfChecks, setSelfChecks] = useState<Record<string, FamilySelfCheck>>({});
  const [selfCheckOpen, setSelfCheckOpen] = useState<string | null>(null);

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/25 bg-white shadow-[0_0_0_1px_rgba(140,130,252,0.06)]">
      <header className="border-b border-ink/5 bg-gradient-to-r from-[#f7f4fc] via-white to-brand/[0.04] px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">
          Doorbell · {MEMBER_LABEL[member]} room · v0.9.2
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-subtle">
          Ack Living Room commands here · Support Status · SUBMITTED needs self-check · or reply in
          room chat to mark RECEIVED
        </p>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <StagingBanner connection={connection} />
        {errorFlash ? (
          <p className="rounded-lg border border-rose-300/40 bg-rose-50 px-3 py-2 text-[11px] text-rose-900">
            {errorFlash}
          </p>
        ) : null}

        {pending.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-subtle">
            No doorbells for {MEMBER_LABEL[member]} yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {pending.map(({ cmd, receipt }) => {
              const noteDraft = notes[cmd.id] ?? receipt.note;
              const sc = selfChecks[cmd.id] ?? emptySelfCheck();
              const open = selfCheckOpen === cmd.id;
              return (
                <li
                  key={cmd.id}
                  className="rounded-xl border border-ink/10 bg-gradient-to-br from-white via-[#faf8fc] to-[#f3eef9] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="border-brand/30 bg-brand/10 text-brand">{cmd.sender}</Badge>
                    <Badge tone={RECEIPT_TONE[receipt.status]}>{receipt.status}</Badge>
                    <Badge tone={SUPPORT_TONE[receipt.supportStatus]}>
                      Support {receipt.supportStatus}
                    </Badge>
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
                          onClick={() =>
                            onUpdateReceipt(cmd.id, member, { supportStatus: s })
                          }
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

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
                        disabled={busy}
                        onClick={() => {
                          if (a.status === "SUBMITTED") {
                            setSelfCheckOpen(cmd.id);
                            return;
                          }
                          onUpdateReceipt(cmd.id, member, {
                            status: a.status,
                            note: (notes[cmd.id] ?? receipt.note).trim(),
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
                            if (!selfCheckComplete(sc)) return;
                            onUpdateReceipt(cmd.id, member, {
                              status: "SUBMITTED",
                              note: (notes[cmd.id] ?? receipt.note).trim(),
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
