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
import { P0_CHAT_SENDERS, URGENCY_LEVELS } from "@/lib/familyDoorbellTypes";

/**
 * Living Room Shared Chat — P0: recipient pick UI only.
 * Manual checkboxes · no smart routing · no auto replies.
 * Uses shared doorbell API when available; localStorage fallback otherwise.
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

const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  NORMAL: "Normal",
  TODAY: "Today",
  URGENT: "Urgent",
  RED: "Red",
};

const URGENCY_TONE: Record<UrgencyLevel, string> = {
  NORMAL: "border-ink/15 bg-ink/[0.04] text-ink-muted",
  TODAY: "border-brand/30 bg-brand/5 text-brand-dark",
  URGENT: "border-amber-500/35 bg-amber-50 text-amber-950",
  RED: "border-rose-500/40 bg-rose-50 text-rose-900",
};

const SIMPLE_ACK: { label: string; status: ReceiptStatus }[] = [
  { label: "SENT", status: "SENT" },
  { label: "RECEIVED", status: "RECEIVED" },
  { label: "READING", status: "READING" },
  { label: "IN_PROGRESS", status: "IN_PROGRESS" },
  { label: "NEEDS_GOR_GOR", status: "NEEDS_GOR_GOR" },
  { label: "BLOCKED", status: "BLOCKED" },
  { label: "PLACED_IN_CABINET", status: "PLACED_IN_CABINET" },
];

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";

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

function statusMembers(cmd: FamilyCommandMessage): TargetMember[] {
  const recipients = selectedList(cmd);
  const resolved =
    cmd.resolved_targets?.length > 0
      ? cmd.resolved_targets
      : resolveTargets(recipients);
  const order = RECIPIENT_OPTIONS.map((o) => o.id).filter(
    (id): id is TargetMember => id !== "all",
  );
  return order.filter((m) => resolved.includes(m));
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
  const [selected, setSelected] = useState<TargetMemberOption[]>([]);
  const [urgency, setUrgency] = useState<UrgencyLevel>("NORMAL");

  const sharedOk = connection.backendAvailable && connection.shared;

  const sorted = useMemo(() => {
    return [...state.commands].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [state.commands]);

  const toggleRecipient = (opt: TargetMemberOption) => {
    if (opt === "all") {
      setSelected((prev) => (prev.includes("all") ? [] : ["all"]));
      return;
    }
    setSelected((prev) => {
      const withoutAll = prev.filter((x) => x !== "all");
      if (withoutAll.includes(opt)) {
        return withoutAll.filter((x) => x !== opt);
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
          P0 · recipient pick only · no smart routing ·{" "}
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

        {/* Composer — wireframe: Sender / Send to / Urgency / Message / Send */}
        <form
          className="space-y-4 rounded-xl border border-dashed border-brand/20 bg-white/80 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSend) return;
            onPost(body, sender, selected, "doorbell", urgency);
            setBody("");
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-xs font-semibold text-brand">Compose</p>
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
            <p className={labelClass}>Sender</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Sender">
              {P0_CHAT_SENDERS.map((s) => {
                const active = sender === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSender(s)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-[12px] font-medium transition",
                      active
                        ? "border-brand/40 bg-brand/10 text-brand"
                        : "border-ink/10 bg-white text-ink-muted hover:border-brand/25",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className={labelClass}>Send to</p>
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
                      "rounded-xl border px-3 py-1.5 text-[12px] font-medium transition",
                      active
                        ? URGENCY_TONE[level]
                        : "border-ink/10 bg-white text-ink-muted hover:border-brand/25",
                    )}
                  >
                    {URGENCY_LABEL[level]}
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
              placeholder=""
              required
            />
          </div>

          <button
            type="submit"
            disabled={!canSend}
            className="rounded-full bg-brand px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40"
          >
            Send
          </button>
        </form>

        {/* After-send cards */}
        <div>
          <p className="mb-2 font-display text-xs font-semibold text-brand">Messages</p>
          {sorted.length === 0 ? (
            <p className="rounded-xl border border-ink/8 bg-white/70 py-8 text-center text-sm text-ink-subtle">
              No messages yet — pick recipients and Send.
            </p>
          ) : (
            <ul className="space-y-3">
              {sorted.map((cmd) => {
                const recipients = selectedList(cmd);
                const urgencyLevel = cmd.urgency ?? "NORMAL";
                const members = statusMembers(cmd);
                const toLine = recipients.map(recipientLabel).join(", ");
                return (
                  <li
                    key={cmd.id}
                    className="rounded-xl border border-brand/15 bg-white/90 px-3 py-3 font-sans text-sm text-ink sm:px-4"
                  >
                    <p className="font-medium text-ink">
                      {cmd.sender} → {toLine}
                    </p>
                    <p className="mt-1.5 text-[13px] text-ink-muted">
                      Urgency: {URGENCY_LABEL[urgencyLevel]}
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap text-[13px] text-ink">
                      Message: {cmd.body}
                    </p>
                    <div className="mt-3 border-t border-ink/5 pt-2.5">
                      <p className="mb-1.5 text-[13px] font-medium text-ink">Status:</p>
                      <ul className="space-y-1">
                        {members.map((member) => {
                          const receipt = cmd.receipts.find((r) => r.member === member);
                          const status = receipt?.status ?? "SENT";
                          return (
                            <li
                              key={member}
                              className="flex flex-wrap items-center gap-2 text-[13px]"
                            >
                              <span className="text-ink">
                                {MEMBER_LABEL[member]}:{" "}
                                <span
                                  className={cn(
                                    "inline-flex rounded-md border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em]",
                                    RECEIPT_TONE[status],
                                  )}
                                >
                                  {status}
                                </span>
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {SIMPLE_ACK.filter((a) => a.status !== status).map((a) => (
                                  <button
                                    key={a.status}
                                    type="button"
                                    disabled={busy}
                                    className="rounded-md border border-ink/10 bg-white px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-ink-subtle transition hover:border-brand/30 hover:text-brand disabled:opacity-30"
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
