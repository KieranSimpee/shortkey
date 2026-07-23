"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Gor Gor Chat Bridge v0.1 — bottom sheet drawer on Family Table.
 * Talks to /api/gor-gor-chat (server-side Base44). Transcript + conversation_id
 * per room in localStorage only.
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

type BridgeMessage = {
  id: string;
  role: "user" | "gorgor" | "system";
  text: string;
  at: string;
};

type BridgeRoomState = {
  conversation_id?: string;
  messages: BridgeMessage[];
};

type BridgeStore = {
  version: "0.1";
  rooms: Partial<Record<BridgeRoomId, BridgeRoomState>>;
};

const ROOM_OPTIONS: { id: BridgeRoomId; label: string }[] = [
  { id: "living", label: "Living Room" },
  { id: "kieran", label: "Kieran Vision Room" },
  { id: "gorgor", label: "Gor Gor Review Room" },
  { id: "sky", label: "Sky Room" },
  { id: "senti", label: "Senti Room" },
  { id: "kura", label: "Kura Room" },
  { id: "agent-r", label: "Agent R Room" },
];

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyStore(): BridgeStore {
  return { version: "0.1", rooms: {} };
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
    return parsed;
  } catch {
    return emptyStore();
  }
}

function saveStore(store: BridgeStore) {
  localStorage.setItem(GOR_GOR_BRIDGE_STORAGE_KEY, JSON.stringify(store));
}

function roomState(store: BridgeStore, room: BridgeRoomId): BridgeRoomState {
  return store.rooms[room] ?? { messages: [] };
}

type Props = {
  open: boolean;
  onClose: () => void;
  initialRoom?: BridgeRoomId;
};

export function GorGorChatDrawer({ open, onClose, initialRoom = "living" }: Props) {
  const [room, setRoom] = useState<BridgeRoomId>(initialRoom);
  const [store, setStore] = useState<BridgeStore>(emptyStore);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setStore(loadStore());
      setRoom(initialRoom);
      setBanner(null);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, initialRoom]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, store, room, sending]);

  const persist = useCallback((next: BridgeStore) => {
    setStore(next);
    saveStore(next);
  }, []);

  const current = roomState(store, room);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const userMsg: BridgeMessage = {
      id: uid(),
      role: "user",
      text,
      at: new Date().toISOString(),
    };

    const nextAfterUser: BridgeStore = {
      ...store,
      rooms: {
        ...store.rooms,
        [room]: {
          conversation_id: current.conversation_id,
          messages: [...current.messages, userMsg],
        },
      },
    };
    persist(nextAfterUser);
    setDraft("");
    setSending(true);
    setBanner(null);

    try {
      const res = await fetch("/api/gor-gor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          room,
          conversation_id: current.conversation_id,
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        reply?: string;
        conversation_id?: string;
        fallback?: boolean;
        error?: string;
        code?: string;
      } | null;

      // Soft path: missing API key → 200 + { fallback: true, reply }
      if (data?.fallback && data.reply) {
        setBanner(BRIDGE_OFFLINE_MSG);
        const replyMsg: BridgeMessage = {
          id: uid(),
          role: "gorgor",
          text: data.reply,
          at: new Date().toISOString(),
        };
        const latest = loadStore();
        const rs = roomState(latest, room);
        persist({
          ...latest,
          rooms: {
            ...latest.rooms,
            [room]: {
              conversation_id: rs.conversation_id,
              messages: [...rs.messages, replyMsg],
            },
          },
        });
        return;
      }

      if (!res.ok || !data?.reply) {
        const errText =
          data?.error ||
          "Gor Gor could not reply right now. Your message is still saved locally.";
        setBanner(errText);
        const sys: BridgeMessage = {
          id: uid(),
          role: "system",
          text: errText,
          at: new Date().toISOString(),
        };
        const latest = loadStore();
        const rs = roomState(latest, room);
        persist({
          ...latest,
          rooms: {
            ...latest.rooms,
            [room]: {
              conversation_id: rs.conversation_id,
              messages: [...rs.messages, sys],
            },
          },
        });
        return;
      }

      const replyMsg: BridgeMessage = {
        id: uid(),
        role: "gorgor",
        text: data.reply,
        at: new Date().toISOString(),
      };
      const latest = loadStore();
      const rs = roomState(latest, room);
      persist({
        ...latest,
        rooms: {
          ...latest.rooms,
          [room]: {
            conversation_id: data.conversation_id || rs.conversation_id,
            messages: [...rs.messages, replyMsg],
          },
        },
      });
    } catch {
      setBanner(BRIDGE_OFFLINE_MSG);
      const sys: BridgeMessage = {
        id: uid(),
        role: "system",
        text: BRIDGE_OFFLINE_MSG,
        at: new Date().toISOString(),
      };
      const latest = loadStore();
      const rs = roomState(latest, room);
      persist({
        ...latest,
        rooms: {
          ...latest.rooms,
          [room]: {
            conversation_id: rs.conversation_id,
            messages: [...rs.messages, sys],
          },
        },
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
        aria-label="Gor Gor Chat"
        className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-ink/10 bg-gradient-to-b from-[#FBF9FF] to-white shadow-[0_-12px_40px_rgba(90,70,140,0.18)] sm:max-h-[82vh]"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-ink/15" aria-hidden />

        <div className="flex items-start justify-between gap-3 border-b border-brand/10 px-4 pb-3 pt-2">
          <div>
            <p className="font-display text-base font-semibold tracking-tight text-ink">
              Gor Gor Chat
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

        <div className="border-b border-ink/5 px-4 py-2.5">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Room
          </label>
          <select
            value={room}
            onChange={(e) => setRoom(e.target.value as BridgeRoomId)}
            className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand/40"
          >
            {ROOM_OPTIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
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
          {current.messages.length === 0 ? (
            <p className="text-center text-xs text-ink-subtle">
              Talk to Gor Gor from this room. Transcript stays on this browser.
            </p>
          ) : null}
          {current.messages.map((m) => (
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
                {m.role === "gorgor" ? (
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand">
                    Gor Gor
                  </p>
                ) : null}
                {m.role === "user" ? (
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75">
                    You
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {sending ? (
            <p className="text-[11px] text-ink-subtle">Gor Gor is thinking…</p>
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
              placeholder="Talk to Gor Gor…"
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
