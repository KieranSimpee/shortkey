"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Family Chat — room thread UI for Family Table v0.8.
 * Messages live under `shortkey-family-table-v08` rooms[*].chat (migrated once from v0.1).
 * Legacy key `shortkey-family-chat-v01` is read-only for migration.
 */

export const FAMILY_CHAT_STORAGE_KEY = "shortkey-family-chat-v01";

export const CHAT_WARNING =
  "Internal staging only · localStorage only · not shared database · no private data yet.";

export const CHAT_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "WAITING FOR GOR GOR",
  "GOR GOR REVIEWING",
  "KIERAN REVIEW READY",
  "APPROVED",
  "BLOCKED",
] as const;

export type ChatStatus = (typeof CHAT_STATUSES)[number];

export const CHAT_ROLES = [
  "Kieran",
  "Simpee/Gor Gor",
  "Sky",
  "Kura",
  "Agent R",
  "Senti",
  "Key",
] as const;

export type ChatRole = (typeof CHAT_ROLES)[number];

/** Chat v0.1 display names → v0.8 room ids */
export const LEGACY_CHAT_ROOM_TO_ID: Record<string, string> = {
  "Family Table": "living",
  "Kieran Vision": "kieran",
  "Gor Gor Review": "gorgor",
  "Sky Video Room": "sky",
  "Senti Poster Room": "senti",
  "Senti Creative Room": "senti",
  "Kura Structure Room": "kura",
  "Agent R Evidence Room": "agent-r",
};

export type FamilyChatMessage = {
  id: string;
  sender_name: string;
  sender_role: ChatRole;
  room: string;
  message: string;
  status: ChatStatus;
  timestamp: string;
  evidence_url?: string;
};

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";
const btnPrimary =
  "rounded-full bg-brand px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40";
const btnGhost =
  "rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/30 hover:text-ink";

export const CHAT_STATUS_TONE: Record<ChatStatus, string> = {
  DRAFT: "border-ink/15 bg-ink/5 text-ink-muted",
  SUBMITTED: "border-brand/30 bg-brand/5 text-brand-dark",
  "WAITING FOR GOR GOR": "border-amber-400/40 bg-amber-400/10 text-amber-800",
  "GOR GOR REVIEWING": "border-brand/40 bg-brand/10 text-brand",
  "KIERAN REVIEW READY": "border-violet-400/40 bg-violet-400/10 text-violet-900",
  APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  BLOCKED: "border-rose-400/40 bg-rose-400/10 text-rose-800",
};

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Load legacy Family Chat v0.1 messages (migration only). */
export function loadLegacyFamilyChat(): FamilyChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAMILY_CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { messages?: FamilyChatMessage[] };
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
}

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

export function RoomChatThread({
  roomLabel,
  messages,
  onChange,
  compact,
  onPosted,
}: {
  roomLabel: string;
  messages: FamilyChatMessage[];
  onChange: (next: FamilyChatMessage[]) => void;
  compact?: boolean;
  /** Fired after a successful post — e.g. doorbell RECEIVED via reply. */
  onPosted?: () => void;
}) {
  const [senderName, setSenderName] = useState("");
  const [senderRole, setSenderRole] = useState<ChatRole>("Key");
  const [status, setStatus] = useState<ChatStatus>("DRAFT");
  const [body, setBody] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const sorted = useMemo(
    () => [...messages].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    [messages],
  );

  return (
    <div className={cn("grid gap-0", compact ? "" : "lg:grid-cols-[minmax(0,280px)_1fr]")}>
      <div
        className={cn(
          "border-ink/10 bg-silk/60 p-4 sm:p-5",
          compact ? "border-b" : "border-b lg:border-b-0 lg:border-r",
        )}
      >
        <div
          role="status"
          className="mb-3 rounded-xl border border-amber-700/25 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-950"
        >
          {CHAT_WARNING}
        </div>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!senderName.trim() || !body.trim()) return;
            const next: FamilyChatMessage = {
              id: uid(),
              sender_name: senderName.trim(),
              sender_role: senderRole,
              room: roomLabel,
              message: body.trim(),
              status,
              timestamp: new Date().toISOString(),
              ...(evidenceUrl.trim() ? { evidence_url: evidenceUrl.trim() } : {}),
            };
            onChange([next, ...messages]);
            setBody("");
            setEvidenceUrl("");
            setStatus("DRAFT");
            onPosted?.();
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
            <label className={labelClass}>Role</label>
            <select
              className={inputClass}
              value={senderRole}
              onChange={(e) => setSenderRole(e.target.value as ChatRole)}
            >
              {CHAT_ROLES.map((r) => (
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
              {CHAT_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea
              className={cn(inputClass, "min-h-[72px] resize-y")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Room note — this browser only"
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
          <button type="submit" className={btnPrimary}>
            Post to room
          </button>
        </form>
      </div>

      <div className={cn("min-h-[200px]", compact ? "max-h-[280px] overflow-y-auto" : "")}>
        <div className="border-b border-ink/5 bg-brand/[0.03] px-4 py-2.5">
          <p className="font-display text-sm font-semibold text-ink">{roomLabel}</p>
          <p className="text-[10px] text-ink-subtle">
            {sorted.length} message{sorted.length === 1 ? "" : "s"}
          </p>
        </div>
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-subtle">No messages yet — post the first note.</p>
        ) : (
          <ul className="divide-y divide-ink/5">
            {sorted.map((m) => (
              <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{m.sender_name}</p>
                    <Badge tone="border-brand/30 bg-brand/10 text-brand">{m.sender_role}</Badge>
                    <Badge tone={CHAT_STATUS_TONE[m.status]}>{m.status}</Badge>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-muted">{m.message}</p>
                  {m.evidence_url ? (
                    <a
                      href={m.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-block break-all text-xs text-brand underline decoration-brand/30 underline-offset-2"
                    >
                      Evidence → {m.evidence_url}
                    </a>
                  ) : null}
                  <p className="mt-1 text-[10px] text-ink-subtle">{m.timestamp}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="rounded-full border border-ink/10 bg-white px-2 py-1 text-[10px] text-ink-muted outline-none"
                    value={m.status}
                    aria-label="Update status"
                    onChange={(e) => {
                      const nextStatus = e.target.value as ChatStatus;
                      onChange(messages.map((x) => (x.id === m.id ? { ...x, status: nextStatus } : x)));
                    }}
                  >
                    {CHAT_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => onChange(messages.filter((x) => x.id !== m.id))}
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

/** @deprecated Standalone tab removed in v0.8 — use RoomChatThread inside rooms. */
export function FamilyChatPanel({ onSaved }: { onSaved?: () => void }) {
  void onSaved;
  return (
    <p className="px-4 py-8 text-center text-sm text-ink-muted">
      Family Chat now lives inside each Family Room (v0.8). Use the floating Gor Gor / Family Chat
      button for the Living Room thread.
    </p>
  );
}
