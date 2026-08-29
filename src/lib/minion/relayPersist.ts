/**
 * Minion Relay persistence — every hop → Base44 Message entity.
 *
 * Mapping (event → Message.message_type):
 *   kieran_message     → message_type "kieran_message"
 *   minion_hop         → message_type "minion_hop"  (VERBATIM report of Kieran)
 *   simpee_instruction → message_type "simpee_instruction"
 *   family_response    → message_type "family_response"
 *   review_status      → message_type "review_status" (+ optional Task mirror)
 *   final_answer       → message_type "final_answer"
 *
 * workflow_steps is a JSON string (app schema requires string, not array).
 * parent_id chains hops under the original Kieran message id.
 *
 * LOCK: Persist stores content as given — no rewrite/paraphrase. Minion hops
 * report Kieran’s exact string; route notes go in workflow_steps meta only.
 */

import { getMinionBase44, K_MINION_RECIPIENT_ID, K_MINION_RECIPIENT_NAME } from "@/lib/minion/base44";
import type {
  MinionMessageCreate,
  MinionMessageRecord,
  RelayEventType,
  RelayHopInput,
  RelayPersistError,
  RelayPersistResult,
  RelayReviewStatus,
} from "@/lib/minion/types";

const DEFAULT_SENDERS: Record<RelayEventType, string> = {
  kieran_message: "Kieran",
  minion_hop: "K Minion",
  simpee_instruction: "Simpee",
  family_response: "Family",
  review_status: "Simpee",
  final_answer: "K Minion",
};

const DEFAULT_RECIPIENTS: Record<
  RelayEventType,
  { name: string; id: string | null }
> = {
  kieran_message: { name: K_MINION_RECIPIENT_NAME, id: K_MINION_RECIPIENT_ID },
  minion_hop: { name: "Simpee", id: null },
  simpee_instruction: { name: "Family", id: null },
  family_response: { name: K_MINION_RECIPIENT_NAME, id: K_MINION_RECIPIENT_ID },
  review_status: { name: "Kieran", id: null },
  final_answer: { name: "Kieran", id: null },
};

function buildWorkflowSteps(
  event: RelayEventType,
  meta?: Record<string, unknown>,
  reviewStatus?: RelayReviewStatus,
): string {
  return JSON.stringify({
    event,
    at: new Date().toISOString(),
    review_status: reviewStatus ?? null,
    ...(meta || {}),
  });
}

export async function createMinionMessage(
  data: MinionMessageCreate,
): Promise<MinionMessageRecord> {
  const base44 = getMinionBase44();
  const created = (await base44.entities.Message.create(data)) as MinionMessageRecord;
  return created;
}

/**
 * Persist one relay hop as a Message row.
 * Content is stored as provided (no trim/rewrite) once non-empty.
 */
export async function saveRelayHop(
  input: RelayHopInput,
): Promise<RelayPersistResult | RelayPersistError> {
  const event = input.event;
  // Empty check only — do not mutate body (minion report must stay verbatim).
  if (!input.content || !String(input.content).trim()) {
    return { ok: false, event, error: "content is required", code: "empty_content" };
  }
  const content = String(input.content);

  const defaults = DEFAULT_RECIPIENTS[event];
  const payload: MinionMessageCreate = {
    sender_name: input.sender_name?.trim() || DEFAULT_SENDERS[event],
    recipient_name: input.recipient_name?.trim() || defaults.name,
    recipient_id:
      input.recipient_id === undefined ? defaults.id : input.recipient_id,
    content,
    message_type: event,
    workflow_steps: buildWorkflowSteps(event, input.meta, input.review_status),
    parent_id: input.parent_id ?? null,
    target_department: input.target_department ?? null,
  };

  try {
    const record = await createMinionMessage(payload);

    // Mirror review status onto a Task when useful for Desk dashboards.
    if (event === "review_status" && input.review_status) {
      try {
        await mirrorReviewTask({
          status: input.review_status,
          content,
          parentMessageId: record.id,
          relayRootId: input.parent_id ?? record.id,
        });
      } catch {
        // Task mirror is best-effort; Message row is source of truth.
      }
    }

    return {
      ok: true,
      event,
      message_id: record.id,
      parent_id: input.parent_id ?? null,
      record,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save relay hop";
    return { ok: false, event, error: message, code: "persist_failed" };
  }
}

async function mirrorReviewTask(args: {
  status: RelayReviewStatus;
  content: string;
  parentMessageId: string;
  relayRootId: string;
}): Promise<void> {
  const base44 = getMinionBase44();
  const taskStatus =
    args.status === "APPROVED" || args.status === "PASS"
      ? "done"
      : args.status === "REJECTED" || args.status === "HOLD"
        ? "blocked"
        : "assigned";

  await base44.entities.Task.create({
    title: `Minion Relay review · ${args.status}`,
    description: `${args.content}\n\nrelay_root=${args.relayRootId}\nmessage_id=${args.parentMessageId}`,
    status: taskStatus,
    task_type: "other",
    category: "admin",
    assigned_to_name: "Simpee",
    priority: "high",
    comment: JSON.stringify({
      kind: "minion_relay_review",
      review_status: args.status,
      relay_root_id: args.relayRootId,
      message_id: args.parentMessageId,
    }),
  });
}

/** Convenience wrappers for the six required hop kinds. */
export async function saveKieranMessage(
  content: string,
  opts?: Partial<RelayHopInput>,
) {
  return saveRelayHop({ event: "kieran_message", content, ...opts });
}

/** Minion hop = verbatim report of Kieran’s message (messengers cannot edit). */
export async function saveMinionHop(
  content: string,
  opts?: Partial<RelayHopInput>,
) {
  return saveRelayHop({ event: "minion_hop", content, ...opts });
}

export async function saveSimpeeInstruction(
  content: string,
  opts?: Partial<RelayHopInput>,
) {
  return saveRelayHop({ event: "simpee_instruction", content, ...opts });
}

export async function saveFamilyResponse(
  content: string,
  opts?: Partial<RelayHopInput>,
) {
  return saveRelayHop({ event: "family_response", content, ...opts });
}

export async function saveReviewStatus(
  content: string,
  reviewStatus: RelayReviewStatus,
  opts?: Partial<RelayHopInput>,
) {
  return saveRelayHop({
    event: "review_status",
    content,
    review_status: reviewStatus,
    ...opts,
  });
}

export async function saveFinalAnswer(
  content: string,
  opts?: Partial<RelayHopInput>,
) {
  return saveRelayHop({ event: "final_answer", content, ...opts });
}

export async function listRecentRelayMessages(limit = 20) {
  const base44 = getMinionBase44();
  return (await base44.entities.Message.list(
    "-created_date",
    limit,
  )) as MinionMessageRecord[];
}

/**
 * Load one Minion Chat / Relay thread: root message + all hops with parent_id = rootId.
 * Prefers Message.filter; falls back to recent list scan.
 */
export async function listThreadMessages(
  rootId: string,
  limit = 80,
): Promise<MinionMessageRecord[]> {
  const id = String(rootId || "").trim();
  if (!id) return [];

  const base44 = getMinionBase44();
  let children: MinionMessageRecord[] = [];
  let root: MinionMessageRecord | null = null;

  try {
    const filtered = (await base44.entities.Message.filter(
      { parent_id: id },
      "created_date",
      limit,
    )) as MinionMessageRecord[];
    children = Array.isArray(filtered) ? filtered : [];
  } catch {
    children = [];
  }

  try {
    root = (await base44.entities.Message.get(id)) as MinionMessageRecord;
  } catch {
    root = null;
  }

  if (!root || children.length === 0) {
    const recent = await listRecentRelayMessages(Math.max(limit, 40));
    if (!root) {
      root = recent.find((m) => m.id === id) || null;
    }
    if (children.length === 0) {
      children = recent.filter((m) => m.parent_id === id);
    }
  }

  const byId = new Map<string, MinionMessageRecord>();
  if (root) byId.set(root.id, root);
  for (const row of children) {
    if (row?.id) byId.set(row.id, row);
  }

  return [...byId.values()].sort((a, b) => {
    const ta = a.created_date || "";
    const tb = b.created_date || "";
    if (ta < tb) return -1;
    if (ta > tb) return 1;
    return 0;
  });
}

