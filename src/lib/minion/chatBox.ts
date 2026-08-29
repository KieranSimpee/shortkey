/**

 * Minion Chat Box — shared family thread on Minion Relay Message entity.

 *

 * Superagent seats cannot natively read each other’s private conversations.

 * This board is the shared place: every hop → Base44 Message (parent_id chain).

 * Each subsequent seat receives the prior transcript in their ask prompt.

 *

 * LOCK: Minions REPORT only — kieran_message + minion_hop stay verbatim.

 * Status: GOR_GOR_REVIEW until Gor Gor approves.

 */



import {

  askFamilyAgent,

  FAMILY_ASK_AGENTS,

  FamilyAskError,

  isFamilyAskConfigured,

  type FamilyAskAgentKey,

} from "@/lib/familyAsk";

import { isMinionRelayConfigured } from "@/lib/minion/base44";

import {

  listThreadMessages,

  saveFamilyResponse,

  saveKieranMessage,

  saveMinionHop,

  saveReviewStatus,

  saveSimpeeInstruction,

} from "@/lib/minion/relayPersist";

import type {

  MinionMessageRecord,

  RelayPersistError,

  RelayPersistResult,

  RelayReviewStatus,

} from "@/lib/minion/types";



/** Default council order after Minion report + Simpee gate. */

export const MINION_CHAT_FAMILY_SEATS: FamilyAskAgentKey[] = [

  "kura",

  "gorgor",

  "senti",

  "agent-r",

];



export type MinionChatSeatPost = {

  seat: FamilyAskAgentKey;

  label: string;

  reply: string;

  message_id?: string;

  ok: boolean;

  error?: string;

};



export type MinionChatBoxResult = {

  ok: boolean;

  mode: "minion_chat_box";

  relay_root_id: string | null;

  kieran_message: string | null;

  reported_message: string | null;

  simpee_instruction?: string;

  seats: MinionChatSeatPost[];

  review_status: RelayReviewStatus;

  thread: MinionChatBubble[];

  warnings: string[];

};



export type MinionChatBubble = {

  id: string;

  from_seat: string;

  role:

    | "kieran"

    | "minion"

    | "simpee"

    | "family"

    | "review"

    | "other";

  message_type: string;

  content: string;

  created_date?: string;

  parent_id?: string | null;

};



function asOk(result: RelayPersistResult | RelayPersistError): boolean {

  return result.ok;

}



function parseFromSeat(record: MinionMessageRecord): string {

  const type = String(record.message_type || "");

  if (type === "kieran_message") return "Kieran";

  if (type === "minion_hop") return "K Minion";

  if (type === "simpee_instruction") return "Simpee";

  if (type === "review_status") return "Review";

  if (type === "final_answer") return "Final";

  try {

    const steps = record.workflow_steps

      ? (JSON.parse(String(record.workflow_steps)) as Record<string, unknown>)

      : null;

    const seat = steps?.from_seat || steps?.agent;

    if (typeof seat === "string" && seat) {

      if (isFamilyKey(seat)) return FAMILY_ASK_AGENTS[seat].label;

      return seat;

    }

  } catch {

    /* ignore */

  }

  return record.sender_name || "Family";

}



function isFamilyKey(value: string): value is FamilyAskAgentKey {

  return Object.prototype.hasOwnProperty.call(FAMILY_ASK_AGENTS, value);

}



function bubbleRole(

  messageType: string,

): MinionChatBubble["role"] {

  if (messageType === "kieran_message") return "kieran";

  if (messageType === "minion_hop") return "minion";

  if (messageType === "simpee_instruction") return "simpee";

  if (messageType === "family_response") return "family";

  if (messageType === "review_status") return "review";

  return "other";

}



export function recordsToBubbles(

  records: MinionMessageRecord[],

): MinionChatBubble[] {

  return records.map((r) => ({

    id: r.id,

    from_seat: parseFromSeat(r),

    role: bubbleRole(String(r.message_type || "")),

    message_type: String(r.message_type || "direct"),

    content: String(r.content || ""),

    created_date: r.created_date,

    parent_id: r.parent_id ?? null,

  }));

}



function formatTranscript(lines: { from: string; text: string }[]): string {

  if (!lines.length) return "(empty board)";

  return lines

    .map((l) => `[${l.from}]\n${l.text}`)

    .join("\n\n---\n\n");

}



/**

 * Run one Minion Chat Box round:

 * Kieran → Minion (verbatim) → Simpee gate → each family seat (with sibling transcript).

 */

export async function runMinionChatBox(input: {

  message: string;

  seats?: FamilyAskAgentKey[];

  persistOnly?: boolean;

  reviewStatus?: RelayReviewStatus;

}): Promise<MinionChatBoxResult> {

  const warnings: string[] = [];

  const seatsAsked: MinionChatSeatPost[] = [];

  const message = String(input.message ?? "").trim();

  const seats = (input.seats?.length ? input.seats : MINION_CHAT_FAMILY_SEATS).filter(

    (s, i, arr) => arr.indexOf(s) === i,

  );

  const reviewStatus: RelayReviewStatus =

    input.reviewStatus || "GOR_GOR_REVIEW";



  const empty = (extra: string[] = []): MinionChatBoxResult => ({

    ok: false,

    mode: "minion_chat_box",

    relay_root_id: null,

    kieran_message: null,

    reported_message: null,

    seats: seatsAsked,

    review_status: reviewStatus,

    thread: [],

    warnings: [...warnings, ...extra],

  });



  if (!message) return empty(["Message is empty after trim."]);

  if (!isMinionRelayConfigured()) {

    return empty([

      "K_MINION_API_KEY missing — cannot persist to Minion Base44 app.",

    ]);

  }



  // 1) Kieran (immutable root)

  const kieran = await saveKieranMessage(message, {

    meta: { board: "minion_chat_box", from_seat: "kieran" },

  });

  if (!kieran.ok) return empty([kieran.error || "Failed to save Kieran message"]);

  const rootId = kieran.message_id;



  const boardLines: { from: string; text: string }[] = [

    { from: "Kieran", text: message },

  ];



  // 2) Minion report — VERBATIM

  const minionHop = await saveMinionHop(message, {

    parent_id: rootId,

    meta: {

      role: "report",

      reported_message: message,

      kieran_message_id: rootId,

      board: "minion_chat_box",

      from_seat: "minion",

      note: "Minion reports only — cannot edit Kieran’s words.",

    },

  });

  if (!asOk(minionHop)) {

    warnings.push(

      minionHop.ok ? "" : minionHop.error || "Minion hop failed",

    );

  }

  boardLines.push({

    from: "K Minion (report only · verbatim)",

    text: message,

  });



  let simpeeText =

    `Simpee: open Minion Chat Box thread ${rootId}. Family seats reply in the same board. Status GOR_GOR_REVIEW. Minion reported Kieran verbatim — do not rewrite.`;



  if (!input.persistOnly && isFamilyAskConfigured()) {

    try {

      const simpeeAsk = await askFamilyAgent(

        "gorgor",

        [

          "You are Simpee (Gor Gor), gatekeeper for the ShortKey Minion Chat Box.",

          "Minion reported Kieran’s message VERBATIM — minions cannot edit.",

          "Post a short gatekeeper note for the shared family chat (not a private silo).",

          "Keep DNA locks. Status remains GOR_GOR_REVIEW.",

          "Do not invent deploy/live claims.",

          "",

          "Shared board so far:",

          formatTranscript(boardLines),

        ].join("\n"),

      );

      simpeeText = simpeeAsk.reply;

    } catch (err) {

      const msg =

        err instanceof FamilyAskError

          ? err.message

          : "Simpee Superagent call failed";

      warnings.push(`Simpee live call failed: ${msg}`);

    }

  } else if (!input.persistOnly && !isFamilyAskConfigured()) {

    warnings.push(

      "Family ask not configured (KURA_API_KEY / BASE44_API_KEY). Persisting stubs.",

    );

  } else if (input.persistOnly) {

    simpeeText =

      "(persistOnly) Simpee gate placeholder — live Superagent skipped.";

  }



  const simpeeSave = await saveSimpeeInstruction(simpeeText, {

    parent_id: rootId,

    recipient_name: "Family",

    meta: { board: "minion_chat_box", from_seat: "gorgor", role: "simpee_gate" },

  });

  if (!asOk(simpeeSave)) {

    warnings.push(

      simpeeSave.ok ? "" : simpeeSave.error || "Simpee persist failed",

    );

  }

  boardLines.push({ from: "Simpee (Gor Gor)", text: simpeeText });



  // 3) Family seats — each sees prior siblings on the board

  for (const seat of seats) {

    const label = FAMILY_ASK_AGENTS[seat].label;

    const role = FAMILY_ASK_AGENTS[seat].role;

    let reply = "";

    let askOk = true;

    let askErr: string | undefined;



    if (input.persistOnly) {

      reply = `(persistOnly) ${label} placeholder — live Superagent skipped.`;

    } else if (!isFamilyAskConfigured()) {

      reply = `(stub) ${label} pending — configure family ask keys.`;

      askOk = false;

      askErr = "not_configured";

    } else {

      try {

        const ask = await askFamilyAgent(

          seat,

          [

            `You are ${label} (${role}) posting INTO the shared Minion Chat Box.`,

            "Your reply will be visible to the whole family on the same board.",

            "You can see siblings’ earlier messages below — respond to Kieran AND acknowledge siblings where useful.",

            "Stay in your seat. Do not invent DNA. Do not claim production-ready.",

            "Status: GOR_GOR_REVIEW.",

            "Minion report is VERBATIM (cannot edit).",

            "",

            "Shared Minion Chat Box transcript:",

            formatTranscript(boardLines),

            "",

            `Now post your ${label} area update for this thread.`,

          ].join("\n"),

        );

        reply = ask.reply;

      } catch (err) {

        askOk = false;

        askErr =

          err instanceof FamilyAskError

            ? err.message

            : `${label} Superagent call failed`;

        warnings.push(`${label} live call failed: ${askErr}`);

        reply = `(no live reply — ${label} call failed)`;

      }

    }



    const saved = await saveFamilyResponse(reply, {

      parent_id: rootId,

      sender_name: label,

      recipient_name: "Family Board",

      meta: {

        board: "minion_chat_box",

        from_seat: seat,

        agent: seat,

      },

    });



    seatsAsked.push({

      seat,

      label,

      reply,

      message_id: saved.ok ? saved.message_id : undefined,

      ok: askOk && saved.ok,

      error: saved.ok ? askErr : saved.error,

    });



    boardLines.push({ from: label, text: reply });

  }



  const reviewSave = await saveReviewStatus(

    `Minion Chat Box · ${reviewStatus} · thread ${rootId}`,

    reviewStatus,

    {

      parent_id: rootId,

      meta: { board: "minion_chat_box", seats },

    },

  );

  if (!reviewSave.ok) {

    warnings.push(reviewSave.error || "Review status persist failed");

  }



  const threadRecords = await listThreadMessages(rootId);

  const thread = recordsToBubbles(threadRecords);

  const allSeatOk = seatsAsked.every((s) => s.ok);



  return {

    ok: allSeatOk && asOk(minionHop) && asOk(simpeeSave) && reviewSave.ok,

    mode: "minion_chat_box",

    relay_root_id: rootId,

    kieran_message: message,

    reported_message: message,

    simpee_instruction: simpeeText,

    seats: seatsAsked,

    review_status: reviewStatus,

    thread,

    warnings: warnings.filter(Boolean),

  };

}



/** Load one chat-box thread as UI bubbles. */

export async function loadMinionChatThread(

  rootId: string,

): Promise<{ ok: boolean; relay_root_id: string; thread: MinionChatBubble[] }> {

  const records = await listThreadMessages(rootId);

  return {

    ok: true,

    relay_root_id: rootId,

    thread: recordsToBubbles(records),

  };

}


