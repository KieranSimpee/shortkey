/**
 * Family Chat helpers — migration + room chat message types for Family Table.
 * Live multi-agent family chat = Minion Chat Box on Founder Desk (`/desk/#family`).
 * LocalStorage RoomChatThread / standalone FamilyChatPanel UI removed (weaker duplicate).
 */

export const FAMILY_CHAT_STORAGE_KEY = "shortkey-family-chat-v01";

export const CHAT_WARNING =
  "Family AI chat lives on Founder Desk Minion Chat Box (INTERNAL: https://shortkey.beauty/desk/#family · local :3005/desk/#family). This house keeps doorbell + room notes only.";

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
