"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Gor Gor Chat Bridge · Shared Living Room Thread v0.1
 * One shared upstream conversation for the Family Home Living Room.
 * Talks to /api/gor-gor-chat (server-side Base44 · SIMPEE only).
 *
 * Storage (same key, nested fields):
 *   shortkey-gor-gor-chat-bridge-v01
 *     · livingRoomConversationId
 *     · livingRoomMessages[]
 *     · rooms{} kept for legacy per-room transcripts (not used by this UX)
 */

export const GOR_GOR_BRIDGE_STORAGE_KEY = "shortkey-gor-gor-chat-bridge-v01";
export const GOR_GOR_BRIDGE_WARNING =
  "Internal staging only · API bridge required for real Gor Gor reply · no private data yet.";

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

type LivingRoomMessage = {
  id: string;
  role: "user" | "gorgor" | "system";
  text: string;
  at: string;
  sender?: LivingRoomSender;
  fromRoom?: BridgeRoomId;
  kind?: LivingRoomKind;
};

/** Legacy per-room shape (kept in storage; Living Room Thread does not write here). */
type BridgeRoomState = {
  conversation_id?: string;
  messages: { id: string; role: "user" | "gorgor" | "system"; text: string; at: string }[];
};

type BridgeStore = {
  version: "0.1";
  rooms: Partial<Record<BridgeRoomId, BridgeRoomState>>;
  /** Shared Living Room Thread v0.1 — one Gor Gor conversation for the family. */
  livingRoomConversationId?: string;
  livingRoomMessages?: LivingRoomMessage[];
};

const ROOM_OPTIONS: { id: BridgeRoomId; label: string; short: string }[] = [
  { id: "living", label: "Living Room", short: "Living Room" },
  { id: "kieran", label: "Kieran Vision Room", short: "Kieran Vision Room" },
  { id: "gorgor", label: "Gor Gor Review Room", short: "Gor Gor Review Room" },
  { id: "sky", label: "Sky Room", short: "Sky Room" },
  { id: "senti", label: "Senti Room", short: "Senti Room" },
  { id: "kura", label: "Kura Room", short: "Kura Room" },
  { id: "agent-r", label: "Agent R Room", short: "Agent R Room" },
];

const SENDER_OPTIONS: LivingRoomSender[] = [
  "Kieran",
  "Gor Gor",
  "Sky",
  "Senti",
  "Kura",
  "Agent R",
];

const KIND_OPTIONS: LivingRoomKind[] = [
  "CHAT",
  "NOTE",
  "HOMEWORK SUBMITTED",
  "EVIDENCE SUBMITTED",
  "WAITING FOR GOR GOR",
];

const ROOM_DEFAULT_SENDER: Record<BridgeRoomId, LivingRoomSender> = {
  living: "Kieran",
  kieran: "Kieran",
  gorgor: "Gor Gor",
  sky: "Sky",
  senti: "Senti",
  kura: "Kura",
  "agent-r": "Agent R",
};

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

type Props = {
  open: boolean;
  onClose: () => void;
  /** Seeds the “from room” selector when the drawer opens. */
  initialRoom?: BridgeRoomId;
};

export function GorGorChatDrawer({ open, onClose, initialRoom = "living" }: Props) {
  const [fromRoom, setFromRoom] = useState<BridgeRoomId>(initialRoom);
  const [sender, setSender] = useState<LivingRoomSender>(
    ROOM_DEFAULT_SENDER[initialRoom],
  );
  const [kind, setKind] = useState<LivingRoomKind>("CHAT");
  const [store, setStore] = useState<BridgeStore>(emptyStore);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setStore(loadStore());
      setFromRoom(initialRoom);
      setSender(ROOM_DEFAULT_SENDER[initialRoom]);
      setKind("CHAT");
      setBanner(null);
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

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const userMsg: LivingRoomMessage = {
      id: uid(),
      role: "user",
      text,
      at: new Date().toISOString(),
      sender,
      fromRoom,
      kind,
    };

    const nextAfterUser: BridgeStore = {
      ...store,
      livingRoomConversationId: conversationId,
      livingRoomMessages: [...messages, userMsg],
    };
    persist(nextAfterUser);
    setDraft("");
    setSending(true);
    setBanner(null);

    const apiMessage = formatLivingRoomApiMessage({
      fromRoom,
      sender,
      kind,
      text,
    });

    try {
      const res = await fetch("/api/gor-gor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: apiMessage,
          room: fromRoom,
          conversation_id: conversationId,
          sender,
          kind,
          from_room: fromRoom,
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        reply?: string;
        conversation_id?: string;
        fallback?: boolean;
        error?: string;
        code?: string;
      } | null;

      const appendToLivingRoom = (
        extra: LivingRoomMessage[],
        nextConversationId?: string,
      ) => {
        const latest = loadStore();
        persist({
          ...latest,
          livingRoomConversationId:
            nextConversationId || latest.livingRoomConversationId,
          livingRoomMessages: [
            ...(latest.livingRoomMessages ?? []),
            ...extra,
          ],
        });
      };

      // Soft path: missing API key → 200 + { fallback: true, reply }
      if (data?.fallback && data.reply) {
        setBanner(BRIDGE_OFFLINE_MSG);
        appendToLivingRoom([
          {
            id: uid(),
            role: "gorgor",
            text: data.reply,
            at: new Date().toISOString(),
            sender: "Gor Gor",
            fromRoom: "living",
            kind: "CHAT",
          },
        ]);
        return;
      }

      if (!res.ok || !data?.reply) {
        const errText =
          data?.error ||
          "Gor Gor could not reply right now. Your message is still saved locally.";
        setBanner(errText);
        appendToLivingRoom([
          {
            id: uid(),
            role: "system",
            text: errText,
            at: new Date().toISOString(),
            kind: "WAITING FOR GOR GOR",
          },
        ]);
        return;
      }

      appendToLivingRoom(
        [
          {
            id: uid(),
            role: "gorgor",
            text: data.reply,
            at: new Date().toISOString(),
            sender: "Gor Gor",
            fromRoom: "living",
            kind: "CHAT",
          },
        ],
        data.conversation_id,
      );
    } catch {
      setBanner(BRIDGE_OFFLINE_MSG);
      const latest = loadStore();
      persist({
        ...latest,
        livingRoomMessages: [
          ...(latest.livingRoomMessages ?? []),
          {
            id: uid(),
            role: "system",
            text: BRIDGE_OFFLINE_MSG,
            at: new Date().toISOString(),
            kind: "WAITING FOR GOR GOR",
          },
        ],
      });
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-end">
      <button
        type="button"
        aria-label="Close Gor Gor Chat"
        className="absolute inset-0 bg-ink/35 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label="Living Room · Gor Gor Chat"
        className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-ink/10 bg-gradient-to-b from-[#FBF9FF] to-white shadow-[0_-12px_40px_rgba(90,70,140,0.18)] sm:max-h-[82vh]"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-ink/15" aria-hidden />

        <div className="flex items-start justify-between gap-3 border-b border-brand/10 px-4 pb-3 pt-2">
          <div>
            <p className="font-display text-base font-semibold tracking-tight text-ink">
              Living Room · Gor Gor
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-ink-subtle">
              Shared family thread · one Simpee conversation · {GOR_GOR_BRIDGE_WARNING}
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

        <div className="grid grid-cols-1 gap-2.5 border-b border-ink/5 px-4 py-2.5 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              From room
            </label>
            <select
              value={fromRoom}
              onChange={(e) => {
                const next = e.target.value as BridgeRoomId;
                setFromRoom(next);
                setSender(ROOM_DEFAULT_SENDER[next]);
              }}
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand/40"
            >
              {ROOM_OPTIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Sender
            </label>
            <select
              value={sender}
              onChange={(e) => setSender(e.target.value as LivingRoomSender)}
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand/40"
            >
              {SENDER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Kind
            </label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as LivingRoomKind)}
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand/40"
            >
              {KIND_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
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
              One Living Room thread for the whole family. Pick who is speaking and
              which room you are entering from — Gor Gor replies here.
            </p>
          ) : null}
          {messages.map((m) => (
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
          ))}
          {sending ? (
            <div className="flex justify-start">
              <p className="rounded-xl border border-amber-700/15 bg-amber-50/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-950">
                Waiting for Gor Gor…
              </p>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-ink/10 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
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
              placeholder="Talk to Gor Gor from the Living Room…"
              className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-ink/10 bg-[#FBF9FF] px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40"
              disabled={sending}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={sending || !draft.trim()}
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
