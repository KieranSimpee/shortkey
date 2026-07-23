"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Family Chat v0.1 — LOCAL PROTOTYPE ONLY.
 * Storage: separate localStorage key `shortkey-family-chat-v01` (migrate-safe;
 * does not nest under / mutate `shortkey-family-table-v07`).
 */

export const FAMILY_CHAT_STORAGE_KEY = "shortkey-family-chat-v01";

const CHAT_WARNING =
  "Internal staging only · localStorage only · not shared database · no private data yet.";

const ROOMS = [
  "Family Table",
  "Kieran Vision",
  "Gor Gor Review",
  "Sky Video Room",
  "Senti Poster Room",
  "Kura Structure Room",
  "Agent R Evidence Room",
] as const;

type ChatRoom = (typeof ROOMS)[number];

const ROLES = [
  "Kieran",
  "Simpee/Gor Gor",
  "Sky",
  "Kura",
  "Agent R",
  "Senti",
  "Key",
] as const;

type ChatRole = (typeof ROLES)[number];

const STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "WAITING FOR GOR GOR",
  "GOR GOR REVIEWING",
  "KIERAN REVIEW READY",
  "APPROVED",
  "BLOCKED",
] as const;

type ChatStatus = (typeof STATUSES)[number];

export type FamilyChatMessage = {
  id: string;
  sender_name: string;
  sender_role: ChatRole;
  room: ChatRoom;
  message: string;
  status: ChatStatus;
  timestamp: string;
  evidence_url?: string;
};

type FamilyChatState = {
  messages: FamilyChatMessage[];
};

const EMPTY: FamilyChatState = { messages: [] };

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";
const btnPrimary =
  "rounded-full bg-brand px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40";
const btnGhost =
  "rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/30 hover:text-ink";

const STATUS_TONE: Record<ChatStatus, string> = {
  DRAFT: "border-ink/15 bg-ink/5 text-ink-muted",
  SUBMITTED: "border-brand/30 bg-brand/5 text-brand-dark",
  "WAITING FOR GOR GOR": "border-amber-400/40 bg-amber-400/10 text-amber-800",
  "GOR GOR REVIEWING": "border-brand/40 bg-brand/10 text-brand",
  "KIERAN REVIEW READY": "border-violet-400/40 bg-violet-400/10 text-violet-900",
  APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  BLOCKED: "border-rose-400/40 bg-rose-400/10 text-rose-800",
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadChat(): FamilyChatState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(FAMILY_CHAT_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<FamilyChatState>;
    return {
      messages: Array.isArray(parsed.messages) ? (parsed.messages as FamilyChatMessage[]) : [],
    };
  } catch {
    return EMPTY;
  }
}

function saveChat(data: FamilyChatState) {
  localStorage.setItem(FAMILY_CHAT_STORAGE_KEY, JSON.stringify(data));
}

/** Clears Family Chat v0.1 only — does not touch Family Table v0.7 key. */
export function clearFamilyChatStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FAMILY_CHAT_STORAGE_KEY);
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

export function FamilyChatPanel({ onSaved }: { onSaved?: () => void }) {
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<FamilyChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom>("Family Table");

  const [senderName, setSenderName] = useState("");
  const [senderRole, setSenderRole] = useState<ChatRole>("Key");
  const [status, setStatus] = useState<ChatStatus>("DRAFT");
  const [body, setBody] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  useEffect(() => {
    setMessages(loadChat().messages);
    setReady(true);
  }, []);

  const persist = useCallback(
    (next: FamilyChatMessage[]) => {
      setMessages(next);
      saveChat({ messages: next });
      onSaved?.();
    },
    [onSaved],
  );

  const roomMessages = useMemo(
    () => messages.filter((m) => m.room === room),
    [messages, room],
  );

  if (!ready) {
    return <p className="px-4 py-8 text-center text-sm text-ink-muted">Loading Family Chat…</p>;
  }

  return (
    <div className="grid gap-0 lg:grid-cols-[minmax(0,300px)_1fr]">
      <div className="border-b border-ink/10 bg-silk/60 p-4 sm:p-5 lg:border-b-0 lg:border-r">
        <div
          role="status"
          className="mb-4 rounded-xl border border-amber-700/25 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-950"
        >
          {CHAT_WARNING}
        </div>

        <p className={labelClass}>Room</p>
        <div className="mb-4 flex flex-col gap-1.5">
          {ROOMS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoom(r)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left text-xs font-medium transition",
                room === r
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-ink/10 bg-white text-ink-muted hover:border-brand/25 hover:text-ink",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <form
          className="space-y-3 border-t border-ink/10 pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!senderName.trim() || !body.trim()) return;
            const next: FamilyChatMessage = {
              id: uid(),
              sender_name: senderName.trim(),
              sender_role: senderRole,
              room,
              message: body.trim(),
              status,
              timestamp: new Date().toISOString(),
              ...(evidenceUrl.trim() ? { evidence_url: evidenceUrl.trim() } : {}),
            };
            persist([next, ...messages]);
            setBody("");
            setEvidenceUrl("");
            setStatus("DRAFT");
          }}
        >
          <div>
            <label className={labelClass}>Sender name</label>
            <input
              className={inputClass}
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your display name"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Role (family seat)</label>
            <select
              className={inputClass}
              value={senderRole}
              onChange={(e) => setSenderRole(e.target.value as ChatRole)}
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as ChatStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea
              className={cn(inputClass, "min-h-[88px] resize-y")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Family note — this browser only"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Evidence URL (optional)</label>
            <input
              className={inputClass}
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <p className="text-[10px] text-ink-subtle">
            Posting to <span className="font-semibold text-ink-muted">{room}</span> · key{" "}
            <code className="font-mono">{FAMILY_CHAT_STORAGE_KEY}</code>
          </p>
          <button type="submit" className={btnPrimary}>
            Post to room
          </button>
        </form>
      </div>

      <div className="min-h-[320px]">
        <div className="border-b border-ink/5 bg-brand/[0.03] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-sm font-semibold text-ink">{room}</p>
              <p className="text-[10px] text-ink-subtle">
                {roomMessages.length} message{roomMessages.length === 1 ? "" : "s"} in this room
              </p>
            </div>
            {messages.length > 0 ? (
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  if (!window.confirm("Clear all Family Chat v0.1 messages on this browser?")) return;
                  persist([]);
                }}
              >
                Clear chat
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-900/90">{CHAT_WARNING}</p>
        </div>

        {roomMessages.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-subtle">
            No messages in {room} yet — post the first note.
          </p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {roomMessages.map((m) => (
              <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{m.sender_name}</p>
                    <Badge tone="border-brand/30 bg-brand/10 text-brand">{m.sender_role}</Badge>
                    <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-muted">{m.message}</p>
                  {m.evidence_url ? (
                    <a
                      href={m.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-block break-all text-xs text-brand underline decoration-brand/30 underline-offset-2 hover:text-brand-dark"
                    >
                      Evidence → {m.evidence_url}
                    </a>
                  ) : null}
                  <p className="mt-1.5 text-[10px] text-ink-subtle">{m.timestamp}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="rounded-full border border-ink/10 bg-white px-2 py-1 text-[10px] text-ink-muted outline-none focus:border-brand/40"
                    value={m.status}
                    aria-label="Update status"
                    onChange={(e) => {
                      const nextStatus = e.target.value as ChatStatus;
                      persist(
                        messages.map((x) =>
                          x.id === m.id ? { ...x, status: nextStatus } : x,
                        ),
                      );
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => persist(messages.filter((x) => x.id !== m.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
