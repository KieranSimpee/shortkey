"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  MEMBER_LABEL,
  RECEIPT_TONE,
  resolveTargets,
  type CommandSender,
  type DoorbellConnection,
  type DoorbellState,
  type FamilyCommandMessage,
  type FamilyReceipt,
  type MessageMode,
  type ReceiptStatus,
  type TargetMember,
  type TargetMemberOption,
  type UrgencyLevel,
} from "@/components/internal/FamilyDoorbell";
import {
  COMMAND_SENDERS,
  URGENCY_LEVELS,
  isCommandSender,
} from "@/lib/familyDoorbellTypes";

/**
 * Living Room Shared Chat — simple manual-recipient family chat.
 * Uses shared doorbell API when available; localStorage fallback otherwise.
 * No auto-routing · no fake replies · Internal Staging only.
 * Doc: src/brand/sky/FAMILY_HOME_SHARED_CHAT_SIMPLE.md
 */

const RECIPIENT_OPTIONS: { id: TargetMemberOption; label: string }[] = [
  { id: "gor-gor", label: "Gor Gor" },
  { id: "sky", label: "Sky" },
  { id: "senti", label: "Senti" },
  { id: "kura", label: "Kura" },
  { id: "agent-r", label: "Agent R" },
  { id: "all", label: "All Family" },
];

const SIMPLE_ACK: { label: string; status: ReceiptStatus }[] = [
  { label: "SENT", status: "SENT" },
  { label: "RECEIVED", status: "RECEIVED" },
  { label: "READING", status: "READING" },
  { label: "IN_PROGRESS", status: "IN_PROGRESS" },
  { label: "NEEDS_GOR_GOR", status: "NEEDS_GOR_GOR" },
  { label: "BLOCKED", status: "BLOCKED" },
  { label: "PLACED_IN_CABINET", status: "PLACED_IN_CABINET" },
];

const URGENCY_TONE: Record<UrgencyLevel, string> = {
  NORMAL: "border-ink/15 bg-ink/[0.04] text-ink-muted",
  TODAY: "border-brand/30 bg-brand/5 text-brand-dark",
  URGENT: "border-amber-500/35 bg-amber-50 text-amber-950",
  RED: "border-rose-500/40 bg-rose-50 text-rose-900",
};

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function recipientLabel(opt: TargetMemberOption): string {
  if (opt === "all") return "All Family";
  return MEMBER_LABEL[opt] ?? opt;
}

function selectedList(cmd: FamilyCommandMessage): TargetMemberOption[] {
  if (Array.isArray(cmd.selected_recipients) && cmd.selected_recipients.length > 0) {
    return cmd.selected_recipients;
  }
  return cmd.target_members;
}

type Props = {
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
    patch: Partial<Pick<FamilyReceipt, "status" | "note">>,
  ) => void;
  onRefresh?: () => void;
};

export function LivingRoomSharedChat({
  state,
  connection,
  savedFlash,
  errorFlash,
  busy,
  onPost,
  onUpdateReceipt,
  onRefresh,
}: Props) {
  const [sender, setSender] = useState<CommandSender>("Kieran");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<TargetMemberOption[]>(["all"]);
  const [urgency, setUrgency] = useState<UrgencyLevel>("NORMAL");

  const sharedOk = connection.backendAvailable && connection.shared;

  const sorted = useMemo(() => {
    return [...state.commands].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [state.commands]);

  const toggleRecipient = (opt: TargetMemberOption) => {
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

  const canSend = body.trim().length > 0 && selected.length > 0 && !busy;

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/25 bg-gradient-to-br from-[#fbf9ff] via-white to-[#f3eef9] shadow-[0_0_0_1px_rgba(140,130,252,0.06)]">
      <header className="border-b border-brand/10 bg-gradient-to-r from-[#f7f4fc] via-white to-[#fbf9ff] px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">
          Living Room · Shared Chat
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-subtle">
          Manual recipients · no auto-router ·{" "}
          {sharedOk
            ? `shared backend (${connection.mode})`
            : "local fallback until backend connects"}
          {" · "}Internal Staging only
        </p>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <div
          role="status"
          className={cn(
            "rounded-xl border px-3 py-2 text-[11px] leading-relaxed",
            sharedOk
              ? "border-brand/20 bg-brand/[0.05] text-ink-muted"
              : "border-amber-700/20 bg-amber-50/90 text-amber-950",
          )}
        >
          {sharedOk
            ? "Shared Upstash doorbell API connected — messages sync across devices when available."
            : "Backend unavailable — messages stay in this browser’s localStorage only. Not production-ready."}
        </div>

        {savedFlash ? (
          <p className="text-[11px] font-semibold text-brand">
            {sharedOk ? "Synced" : "Saved locally"}
          </p>
        ) : null}
        {errorFlash ? (
          <p className="rounded-lg border border-rose-300/40 bg-rose-50 px-3 py-2 text-[11px] text-rose-900">
            {errorFlash}
          </p>
        ) : null}

        {/* Composer */}
        <form
          className="space-y-3 rounded-xl border border-dashed border-brand/20 bg-white/80 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSend) return;
            onPost(body, sender, selected, "doorbell", urgency);
            setBody("");
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              Send to family
            </p>
            {onRefresh ? (
              <button
                type="button"
                className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand hover:underline disabled:opacity-40"
                onClick={() => onRefresh()}
                disabled={busy}
              >
                Refresh
              </button>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="lr-shared-sender">
              Sender
            </label>
            <select
              id="lr-shared-sender"
              className={inputClass}
              value={sender}
              onChange={(e) => {
                if (isCommandSender(e.target.value)) setSender(e.target.value);
              }}
            >
              {COMMAND_SENDERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className={labelClass}>Recipients</p>
            <div className="flex flex-wrap gap-2">
              {RECIPIENT_OPTIONS.map((opt) => {
                const active = selected.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-medium transition",
                      active
                        ? "border-brand/40 bg-brand/10 text-brand"
                        : "border-ink/10 bg-white text-ink-muted hover:border-brand/25",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-[var(--brand,#8c82fc)]"
                      checked={active}
                      onChange={() => toggleRecipient(opt.id)}
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-ink-subtle">
              Only selected members need to respond. All Family selects everyone.
            </p>
          </div>

          <div>
            <p className={labelClass}>Urgency</p>
            <div className="flex flex-wrap gap-2">
              {URGENCY_LEVELS.map((level) => {
                const active = urgency === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={cn(
                      "rounded-xl border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition",
                      active
                        ? URGENCY_TONE[level]
                        : "border-ink/10 bg-white text-ink-muted hover:border-brand/25",
                    )}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="lr-shared-body">
              Message
            </label>
            <textarea
              id="lr-shared-body"
              className={cn(inputClass, "min-h-[88px] resize-y")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write one message for the selected family…"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!canSend}
            className="rounded-full bg-brand px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40"
          >
            Send to selected family
          </button>
        </form>

        {/* Shared chat box */}
        <div>
          <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Shared chat
          </p>
          {sorted.length === 0 ? (
            <p className="rounded-xl border border-ink/8 bg-white/70 py-8 text-center text-sm text-ink-subtle">
              No messages yet — select recipients and send.
            </p>
          ) : (
            <ul className="space-y-3">
              {sorted.map((cmd) => {
                const recipients = selectedList(cmd);
                const urgencyLevel = cmd.urgency ?? "NORMAL";
                const resolved =
                  cmd.resolved_targets?.length > 0
                    ? cmd.resolved_targets
                    : resolveTargets(recipients);
                return (
                  <li
                    key={cmd.id}
                    className="rounded-xl border border-brand/15 bg-white/90 px-3 py-3 sm:px-4"
                  >
                    <p className="whitespace-pre-wrap text-sm text-ink">{cmd.body}</p>

                    <dl className="mt-3 grid gap-1.5 text-[11px] text-ink-muted sm:grid-cols-2">
                      <div>
                        <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                          Sender
                        </dt>
                        <dd className="text-ink">{cmd.sender}</dd>
                      </div>
                      <div>
                        <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                          Timestamp
                        </dt>
                        <dd className="text-ink">{formatTime(cmd.createdAt)}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                          Selected recipients
                        </dt>
                        <dd className="mt-0.5 flex flex-wrap gap-1.5">
                          {recipients.map((r) => (
                            <span
                              key={r}
                              className="rounded-md border border-brand/20 bg-brand/[0.06] px-2 py-0.5 text-[10px] font-medium text-brand"
                            >
                              {recipientLabel(r)}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                          Urgency
                        </dt>
                        <dd className="mt-0.5">
                          <span
                            className={cn(
                              "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                              URGENCY_TONE[urgencyLevel],
                            )}
                          >
                            {urgencyLevel}
                          </span>
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-3 border-t border-ink/5 pt-3">
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                        Receipt status per recipient
                      </p>
                      <ul className="space-y-2">
                        {resolved.map((member) => {
                          const receipt = cmd.receipts.find((r) => r.member === member);
                          const status = receipt?.status ?? "SENT";
                          return (
                            <li
                              key={member}
                              className="flex flex-wrap items-center gap-2 rounded-lg border border-ink/8 bg-[#fbf9ff]/80 px-2.5 py-2"
                            >
                              <span className="min-w-[4.5rem] text-[12px] font-medium text-ink">
                                {MEMBER_LABEL[member]}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em]",
                                  RECEIPT_TONE[status],
                                )}
                              >
                                {status}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {SIMPLE_ACK.filter((a) => a.status !== "SENT").map((a) => (
                                  <button
                                    key={a.status}
                                    type="button"
                                    disabled={busy || status === a.status}
                                    className="rounded-md border border-ink/10 bg-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-ink-muted transition hover:border-brand/30 hover:text-brand disabled:opacity-30"
                                    onClick={() =>
                                      onUpdateReceipt(cmd.id, member, {
                                        status: a.status,
                                        note: receipt?.note || `Status → ${a.status}`,
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
                    </div>
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
