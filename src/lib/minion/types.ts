/**
 * Minion Relay event + Message entity types.
 *
 * Live Base44 entities used:
 * - Message (primary chat/relay record)
 * - Task (optional review status mirror)
 * - Agent / GroupChat / Project (read helpers; not required for hop writes)
 *
 * LOCK — Minions REPORT only (messengers). They MUST NOT rewrite, paraphrase,
 * summarize-as-content, or otherwise alter Kieran’s words. `kieran_message`
 * is immutable; `minion_hop.content` is the verbatim report (same string),
 * chained via parent_id. Family/Simpee may instruct/reply in later hops only.
 */

export const RELAY_EVENT_TYPES = [
  "kieran_message",
  "minion_hop",
  "simpee_instruction",
  "family_response",
  "review_status",
  "final_answer",
] as const;

export type RelayEventType = (typeof RELAY_EVENT_TYPES)[number];

export type RelayReviewStatus =
  | "PENDING"
  | "GOR_GOR_REVIEW"
  | "PASS"
  | "HOLD"
  | "APPROVED"
  | "REJECTED";

/** Payload written to Base44 Message.create */
export type MinionMessageCreate = {
  sender_name: string;
  recipient_name: string;
  recipient_id?: string | null;
  content: string;
  /** Distinguishes hop kind; also accepted as free-form by this app. */
  message_type: RelayEventType | "direct" | "company_target" | string;
  /** App schema expects a string (JSON-serialized steps OK). */
  workflow_steps?: string | null;
  parent_id?: string | null;
  target_department?: string | null;
};

export type MinionMessageRecord = MinionMessageCreate & {
  id: string;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
};

export type RelayHopInput = {
  event: RelayEventType;
  /**
   * Message body stored on Message.content.
   * For `kieran_message` / `minion_hop`: must be Kieran’s exact words (verbatim).
   */
  content: string;
  sender_name?: string;
  recipient_name?: string;
  recipient_id?: string | null;
  parent_id?: string | null;
  target_department?: string | null;
  /**
   * Extra workflow metadata merged into workflow_steps JSON string.
   * Routing notes belong here — never replace minion_hop content.
   * Prefer meta.reported_message === content for minion_hop audits.
   */
  meta?: Record<string, unknown>;
  review_status?: RelayReviewStatus;
};

export type RelayPersistResult = {
  ok: true;
  event: RelayEventType;
  message_id: string;
  parent_id: string | null;
  record: MinionMessageRecord;
};

export type RelayPersistError = {
  ok: false;
  event: RelayEventType;
  error: string;
  code?: string;
};
