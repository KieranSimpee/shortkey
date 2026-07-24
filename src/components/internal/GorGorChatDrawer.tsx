"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  MEMBER_LABEL,
  RECEIPT_TONE,
  resolveTargets,
  type CommandSender,
  type FamilyCommandMessage,
  type FamilyReceipt,
  type TargetMember,
  type TargetMemberOption,
} from "@/components/internal/FamilyDoorbell";
import { P0_CHAT_SENDERS } from "@/lib/familyDoorbellTypes";

/**
 * Family Chat drawer (same floating Gor Gor button).
 * Sender = who is speaking · Send to = who should receive.
 * Gor Gor among recipients → real `/api/gor-gor-chat` (Simpee bridge).
 * Sky / Senti / Kura / Agent R → shared doorbell (SENT / WAITING · no fake replies).
 *
 * Storage (same key, nested fields):
 *   shortkey-gor-gor-chat-bridge-v01
 *     · livingRoomConversationId
 *     · livingRoomMessages[]
 *     · rooms{} kept for legacy per-room transcripts (not used by this UX)
 */

export const GOR_GOR_BRIDGE_STORAGE_KEY = "shortkey-gor-gor-chat-bridge-v01";
export const GOR_GOR_BRIDGE_WARNING =
  "Internal staging only · Family Chat · selected recipients · no private data yet.";

const BRIDGE_OFFLINE_MSG =
  "Gor Gor Chat Bridge is not connected yet. Message saved locally only.";

export type BridgeRoomId =
  | "living"
  | "kieran"
  | "gorgor"
  | "sky"
  | "senti"
  | "kura"
  | "agent-r";

export type LivingRoomSender =
  | "Kieran"
  | "Little Brother"
  | "Gor Gor"
  | "Sky"
  | "Senti"
  | "Kura"
  | "Agent R";

export type LivingRoomKind =
  | "CHAT"
  | "NOTE"
  | "HOMEWORK SUBMITTED"
  | "EVIDENCE SUBMITTED"
  | "WAITING FOR GOR GOR";

type RecipientStatusLine = {
  member: TargetMember;
  status: string;
  reply?: string;
};

type LivingRoomMessage = {
  id: string;
  role: "user" | "gorgor" | "system" | "card";
  text: string;
  at: string;
  sender?: LivingRoomSender;
  fromRoom?: BridgeRoomId;
  kind?: LivingRoomKind;
  /** Family Chat card — selected recipients + per-member status. */
  recipients?: TargetMemberOption[];
  recipientStatuses?: RecipientStatusLine[];
  doorbellId?: string;
};

/** Legacy per-room shape (kept in storage; Family Chat does not write here). */
type BridgeRoomState = {
  conversation_id?: string;
  messages: { id: string; role: "user" | "gorgor" | "system"; text: string; at: string }[];
};

type BridgeStore = {
  version: "0.1";
  rooms: Partial<Record<BridgeRoomId, BridgeRoomState>>;
  livingRoomConversationId?: string;
  livingRoomMessages?: LivingRoomMessage[];
};

const RECIPIENT_OPTIONS: { id: TargetMemberOption; label: string }[] = [
  { id: "gor-gor", label: "Gor Gor" },
  { id: "sky", label: "Sky" },
  { id: "senti", label: "Senti" },
  { id: "kura", label: "Kura" },
  { id: "agent-r", label: "Agent R" },
  { id: "all", label: "All Family" },
];

const ROOM_OPTIONS: { id: BridgeRoomId; label: string; short: string }[] = [
  { id: "living", label: "Living Room", short: "Living Room" },
  { id: "kieran", label: "Kieran Vision Room", short: "Kieran Vision Room" },
  { id: "gorgor", label: "Gor Gor Review Room", short: "Gor Gor Review Room" },
  { id: "sky", label: "Sky Room", short: "Sky Room" },
  { id: "senti", label: "Senti Room", short: "Senti Room" },
  { id: "kura", label: "Kura Room", short: "Kura Room" },
  { id: "agent-r", label: "Agent R Room", short: "Agent R Room" },
];

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyStore(): BridgeStore {
  return { version: "0.1", rooms: {}, livingRoomMessages: [] };
}

function loadStore(): BridgeStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(GOR_GOR_BRIDGE_STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as BridgeStore;
    if (parsed?.version !== "0.1" || typeof parsed.rooms !== "object") {
      return emptyStore();
    }
    return {
      ...parsed,
      livingRoomMessages: Array.isArray(parsed.livingRoomMessages)
        ? parsed.livingRoomMessages
        : [],
      livingRoomConversationId:
        typeof parsed.livingRoomConversationId === "string"
          ? parsed.livingRoomConversationId
          : undefined,
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store: BridgeStore) {
  localStorage.setItem(GOR_GOR_BRIDGE_STORAGE_KEY, JSON.stringify(store));
}

function roomLabel(room: BridgeRoomId): string {
  return ROOM_OPTIONS.find((r) => r.id === room)?.short ?? "Living Room";
}

function recipientLabel(opt: TargetMemberOption): string {
  if (opt === "all") return "All Family";
  return MEMBER_LABEL[opt] ?? opt;
}

/**
 * Prepend Family Home context for Simpee / Gor Gor.
 * Sent as `message` to /api/gor-gor-chat (API skips re-prefix when already tagged).
 */
export function formatLivingRoomApiMessage(opts: {
  fromRoom: BridgeRoomId;
  sender: LivingRoomSender;
  kind: LivingRoomKind;
  text: string;
}): string {
  const lines = [
    `[Family Home · ${roomLabel(opts.fromRoom)}]`,
    `[Sender: ${opts.sender}]`,
  ];
  if (opts.kind !== "CHAT") {
    lines.push(`[Kind: ${opts.kind}]`);
  }
  lines.push(opts.text);
  return lines.join("\n");
}

function kindBadgeClass(kind?: LivingRoomKind): string {
  switch (kind) {
    case "HOMEWORK SUBMITTED":
      return "bg-brand/15 text-brand";
    case "EVIDENCE SUBMITTED":
      return "bg-emerald-700/10 text-emerald-900";
    case "WAITING FOR GOR GOR":
      return "bg-amber-100 text-amber-950";
    case "NOTE":
      return "bg-ink/5 text-ink-muted";
    default:
      return "bg-ink/5 text-ink-subtle";
  }
}

function statusTone(status: string): string {
  if (status === "REPLIED" || status === "WAITING") {
    return status === "REPLIED"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
      : "border-amber-400/40 bg-amber-400/10 text-amber-900";
  }
  if (status in RECEIPT_TONE) {
    return RECEIPT_TONE[status as keyof typeof RECEIPT_TONE];
  }
  return "border-ink/15 bg-ink/5 text-ink-muted";
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** Seeds Living Room context when the drawer opens. */
  initialRoom?: BridgeRoomId;
};

export function GorGorChatDrawer({ open, onClose, initialRoom = "living" }: Props) {
  const [sender, setSender] = useState<CommandSender>("Kieran");
  const [selected, setSelected] = useState<TargetMemberOption[]>([]);
  const [store, setStore] = useState<BridgeStore>(emptyStore);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setStore(loadStore());
      setBanner(null);
      setSender("Kieran");
      setSelected([]);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, initialRoom]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, store.livingRoomMessages, sending]);

  const persist = useCallback((next: BridgeStore) => {
    setStore(next);
    saveStore(next);
  }, []);

  const messages = store.livingRoomMessages ?? [];
  const conversationId = store.livingRoomConversationId;

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

  const patchCard = (cardId: string, patch: Partial<LivingRoomMessage>) => {
    const latest = loadStore();
    persist({
      ...latest,
      livingRoomMessages: (latest.livingRoomMessages ?? []).map((m) =>
        m.id === cardId ? { ...m, ...patch } : m,
      ),
    });
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || sending || selected.length === 0) return;

    const resolved = resolveTargets(selected);
    const wantsGorGor = resolved.includes("gor-gor");
    const otherMembers = resolved.filter((m) => m !== "gor-gor");
    const wantsDoorbell = selected.includes("all") || otherMembers.length > 0;

    const initialStatuses: RecipientStatusLine[] = resolved.map((member) => ({
      member,
      status: member === "gor-gor" && wantsGorGor ? "WAITING" : "SENT",
    }));

    const cardId = uid();
    const card: LivingRoomMessage = {
      id: cardId,
      role: "card",
      text,
      at: new Date().toISOString(),
      sender: sender as LivingRoomSender,
      fromRoom: "living",
      kind: "CHAT",
      recipients: selected.includes("all") ? ["all"] : selected,
      recipientStatuses: initialStatuses,
    };

    const nextAfterCard: BridgeStore = {
      ...store,
      livingRoomConversationId: conversationId,
      livingRoomMessages: [...messages, card],
    };
    persist(nextAfterCard);
    setDraft("");
    setSending(true);
    setBanner(null);

    let nextConversationId = conversationId;

    // 1) Gor Gor real bridge when selected
    if (wantsGorGor) {
      const apiMessage = formatLivingRoomApiMessage({
        fromRoom: "living",
        sender: sender as LivingRoomSender,
        kind: "CHAT",
        text,
      });

      try {
        const res = await fetch("/api/gor-gor-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: apiMessage,
            room: "living",
            conversation_id: conversationId,
            sender,
            kind: "CHAT",
            from_room: "living",
          }),
        });

        const data = (await res.json().catch(() => null)) as {
          reply?: string;
          conversation_id?: string;
          fallback?: boolean;
          error?: string;
        } | null;

        if (data?.conversation_id) {
          nextConversationId = data.conversation_id;
        }

        const latest = loadStore();
        const statuses =
          latest.livingRoomMessages?.find((m) => m.id === cardId)?.recipientStatuses ??
          initialStatuses;

        if (data?.fallback && data.reply) {
          setBanner(BRIDGE_OFFLINE_MSG);
          patchCard(cardId, {
            recipientStatuses: statuses.map((s) =>
              s.member === "gor-gor"
                ? { ...s, status: "REPLIED", reply: data.reply }
                : s,
            ),
          });
        } else if (!res.ok || !data?.reply) {
          const errText =
            data?.error ||
            "Gor Gor could not reply right now. Your message is still saved locally.";
          setBanner(errText);
          patchCard(cardId, {
            recipientStatuses: statuses.map((s) =>
              s.member === "gor-gor"
                ? { ...s, status: "WAITING", reply: errText }
                : s,
            ),
          });
        } else {
          patchCard(cardId, {
            recipientStatuses: statuses.map((s) =>
              s.member === "gor-gor"
                ? { ...s, status: "REPLIED", reply: data.reply }
                : s,
            ),
          });
        }

        if (nextConversationId) {
          const after = loadStore();
          persist({ ...after, livingRoomConversationId: nextConversationId });
        }
      } catch {
        setBanner(BRIDGE_OFFLINE_MSG);
        const latest = loadStore();
        const statuses =
          latest.livingRoomMessages?.find((m) => m.id === cardId)?.recipientStatuses ??
          initialStatuses;
        patchCard(cardId, {
          recipientStatuses: statuses.map((s) =>
            s.member === "gor-gor"
              ? { ...s, status: "WAITING", reply: BRIDGE_OFFLINE_MSG }
              : s,
          ),
        });
      }
    }

    // 2) Doorbell for Sky / Senti / Kura / Agent R (and optionally All / mixed)
    if (wantsDoorbell) {
      const doorbellTargets: TargetMemberOption[] = selected.includes("all")
        ? ["all"]
        : selected;

      try {
        const res = await fetch("/api/family-doorbell/messages", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: text,
            sender,
            target_members: doorbellTargets,
            selected_recipients: doorbellTargets,
            mode: "doorbell",
            urgency: "NORMAL",
          }),
        });

        const data = (await res.json().catch(() => null)) as {
          message?: FamilyCommandMessage;
          messages?: FamilyCommandMessage[];
          error?: string;
        } | null;

        if (!res.ok) {
          setBanner(
            (prev) =>
              prev ||
              data?.error ||
              "Doorbell could not save. Family recipients may be local-only.",
          );
        } else {
          const created =
            data?.message ??
            (Array.isArray(data?.messages) ? data!.messages[0] : undefined);

          if (created) {
            const latest = loadStore();
            const statuses =
              latest.livingRoomMessages?.find((m) => m.id === cardId)
                ?.recipientStatuses ?? initialStatuses;

            const byMember = new Map<TargetMember, FamilyReceipt>();
            for (const r of created.receipts ?? []) {
              byMember.set(r.member, r);
            }

            patchCard(cardId, {
              doorbellId: created.id,
              recipientStatuses: statuses.map((s) => {
                if (s.member === "gor-gor" && wantsGorGor && s.status === "REPLIED") {
                  return s;
                }
                const receipt = byMember.get(s.member);
                if (!receipt) return s;
                // No fake replies — doorbell starts SENT; WAITING until they respond
                return {
                  ...s,
                  status: receipt.status === "SENT" ? "SENT" : receipt.status,
                };
              }),
            });
          }
        }
      } catch {
        setBanner(
          (prev) =>
            prev ||
            "Doorbell unreachable — family recipients marked SENT locally until shared board syncs.",
        );
      }
    }

    setSending(false);
  };

  if (!open) return null;

  const canSend = draft.trim().length > 0 && selected.length > 0 && !sending;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-end">
      <button
        type="button"
        aria-label="Close Family Chat"
        className="absolute inset-0 bg-ink/35 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label="Family Chat · Living Room"
        className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-ink/10 bg-gradient-to-b from-[#FBF9FF] to-white shadow-[0_-12px_40px_rgba(90,70,140,0.18)] sm:max-h-[82vh]"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-ink/15" aria-hidden />

        <div className="flex items-start justify-between gap-3 border-b border-brand/10 px-4 pb-3 pt-2">
          <div>
            <p className="font-display text-base font-semibold tracking-tight text-ink">
              Family Chat · Living Room
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-ink-subtle">
              {GOR_GOR_BRIDGE_WARNING}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/30 hover:text-ink"
          >
            Close
          </button>
        </div>

        <div className="border-b border-ink/5 bg-[#f7f4fc]/70 px-4 py-2.5">
          <p className="text-[11px] leading-relaxed text-ink-muted">
            Pick Sender, then Send to — manual recipients only. No fake replies.
          </p>
          <div className="mt-2 min-w-[8rem]">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Sender
            </label>
            <select
              value={sender}
              onChange={(e) => setSender(e.target.value as CommandSender)}
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand/40"
            >
              {P0_CHAT_SENDERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {banner ? (
          <p
            role="status"
            className="border-b border-amber-700/20 bg-amber-50 px-4 py-2 text-[11px] leading-relaxed text-amber-950"
          >
            {banner}
          </p>
        ) : null}

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <p className="text-center text-xs text-ink-subtle">
              Family Chat — choose recipients below, then send. Soft pearl staging only.
            </p>
          ) : null}
          {messages.map((m) => {
            if (m.role === "card") {
              const toLine = (m.recipients ?? [])
                .map(recipientLabel)
                .join(", ");
              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-brand/15 bg-white/95 px-3.5 py-3 text-sm text-ink shadow-sm"
                >
                  <p className="font-medium text-ink">
                    {m.sender ?? "You"} → {toLine || "—"}
                  </p>
                  <p className="mt-1.5 whitespace-pre-wrap text-[13px] text-ink">
                    {m.text}
                  </p>
                  <div className="mt-3 border-t border-ink/5 pt-2.5">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
                      Status
                    </p>
                    <ul className="space-y-2">
                      {(m.recipientStatuses ?? []).map((line) => (
                        <li key={line.member} className="text-[13px]">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-ink">
                              {MEMBER_LABEL[line.member]}:
                            </span>
                            <span
                              className={cn(
                                "inline-flex rounded-md border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em]",
                                statusTone(line.status),
                              )}
                            >
                              {line.status === "SENT" ? "SENT / WAITING" : line.status}
                            </span>
                          </div>
                          {line.reply ? (
                            <p className="mt-1 whitespace-pre-wrap rounded-lg border border-brand/10 bg-[#f7f4fc]/80 px-2.5 py-2 text-[12px] leading-relaxed text-ink-muted">
                              {line.reply}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user" &&
                      "rounded-br-md bg-brand text-white shadow-sm",
                    m.role === "gorgor" &&
                      "rounded-bl-md border border-brand/15 bg-white text-ink shadow-sm",
                    m.role === "system" &&
                      "w-full max-w-full rounded-xl border border-amber-700/20 bg-amber-50/90 text-[11px] text-amber-950",
                  )}
                >
                  {m.role !== "system" ? (
                    <div
                      className={cn(
                        "mb-1.5 flex flex-wrap items-center gap-1.5",
                        m.role === "user" ? "text-white/80" : "text-ink-subtle",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[9px] font-semibold uppercase tracking-[0.14em]",
                          m.role === "gorgor" && "text-brand",
                          m.role === "user" && "text-white/75",
                        )}
                      >
                        {m.sender ?? (m.role === "gorgor" ? "Gor Gor" : "You")}
                      </p>
                      {m.fromRoom ? (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[8px] font-medium tracking-wide",
                            m.role === "user"
                              ? "bg-white/15 text-white/85"
                              : "bg-brand/8 text-brand",
                          )}
                        >
                          {roomLabel(m.fromRoom)}
                        </span>
                      ) : null}
                      {m.kind ? (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em]",
                            m.role === "user"
                              ? "bg-white/20 text-white"
                              : kindBadgeClass(m.kind),
                          )}
                        >
                          {m.kind}
                        </span>
                      ) : null}
                    </div>
                  ) : m.kind ? (
                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-800/80">
                      {m.kind}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            );
          })}
          {sending ? (
            <div className="flex justify-start">
              <p className="rounded-xl border border-amber-700/15 bg-amber-50/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-950">
                Sending…
              </p>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-ink/10 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mb-2.5">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Send to
            </p>
            <div className="flex flex-wrap gap-1.5">
              {RECIPIENT_OPTIONS.map((opt) => {
                const active = selected.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition",
                      active
                        ? "border-brand/40 bg-brand/10 text-brand"
                        : "border-ink/10 bg-[#FBF9FF] text-ink-muted hover:border-brand/25",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-[var(--brand,#8c82fc)]"
                      checked={active}
                      onChange={() => toggleRecipient(opt.id)}
                      disabled={sending}
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Message the family…"
              className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-ink/10 bg-[#FBF9FF] px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40"
              disabled={sending}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={!canSend}
              className="self-end rounded-full bg-brand px-4 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
