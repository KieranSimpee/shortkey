/**

 * Minion Relay flow — Kieran → Minion hop → Simpee → Family → Review → Final.

 * Every hop persists to Base44 Message (see relayPersist.ts).

 *

 * Family agent calls reuse src/lib/familyAsk.ts (separate Superagent keys).

 *

 * LOCK: Minions are messengers only. They REPORT Kieran’s exact words

 * (verbatim on minion_hop.content + meta.reported_message). No LLM rewrite,

 * paraphrase, or “improve” of the user message before family sees it.

 * Simpee/family may instruct/respond in later hops; kieran_message stays immutable.

 */



import {

  askFamilyAgent,

  FamilyAskError,

  isFamilyAskAgentKey,

  isFamilyAskConfigured,

  type FamilyAskAgentKey,

} from "@/lib/familyAsk";

import { isMinionRelayConfigured } from "@/lib/minion/base44";

import {

  saveFamilyResponse,

  saveFinalAnswer,

  saveKieranMessage,

  saveMinionHop,

  saveReviewStatus,

  saveSimpeeInstruction,

} from "@/lib/minion/relayPersist";

import type {

  RelayPersistError,

  RelayPersistResult,

  RelayReviewStatus,

} from "@/lib/minion/types";



export type MinionRelayRequest = {

  message: string;

  /** Family seat to consult after Simpee instruction. Default: gorgor */

  agent?: FamilyAskAgentKey;

  /** Skip live Superagent calls (persist-only dry run). */

  persistOnly?: boolean;

  /** Override final answer text (otherwise uses family reply). */

  finalAnswer?: string;

  reviewStatus?: RelayReviewStatus;

};



export type MinionRelayHopLog = {

  event: string;

  ok: boolean;

  message_id?: string;

  error?: string;

};



export type MinionRelayResult = {

  ok: boolean;

  relay_root_id: string | null;

  /** Exact Kieran string accepted for this relay (immutable root body). */

  kieran_message: string | null;

  /** Same string reported on the minion hop (must equal kieran_message). */

  reported_message: string | null;

  hops: MinionRelayHopLog[];

  simpee_instruction?: string;

  family_reply?: string;

  final_answer?: string;

  review_status: RelayReviewStatus;

  agent?: FamilyAskAgentKey;

  warnings: string[];

};



function asLog(

  result: RelayPersistResult | RelayPersistError,

): MinionRelayHopLog {

  if (result.ok) {

    return { event: result.event, ok: true, message_id: result.message_id };

  }

  return { event: result.event, ok: false, error: result.error };

}



export function isMinionRelayReady(): {

  minion: boolean;

  familyAsk: boolean;

} {

  return {

    minion: isMinionRelayConfigured(),

    familyAsk: isFamilyAskConfigured(),

  };

}



/**

 * Run one Minion Relay cycle and persist all required hops.

 */

export async function runMinionRelay(

  input: MinionRelayRequest,

): Promise<MinionRelayResult> {

  const warnings: string[] = [];

  const hops: MinionRelayHopLog[] = [];

  // Bound whitespace only for empty rejection; body after that is frozen.

  const message = String(input.message ?? "").trim();

  const agent: FamilyAskAgentKey = isFamilyAskAgentKey(input.agent)

    ? input.agent

    : "gorgor";

  const reviewStatus: RelayReviewStatus =

    input.reviewStatus || "GOR_GOR_REVIEW";



  const emptyResult = (extraWarnings: string[] = []): MinionRelayResult => ({

    ok: false,

    relay_root_id: null,

    kieran_message: null,

    reported_message: null,

    hops,

    review_status: reviewStatus,

    warnings: [...warnings, ...extraWarnings],

  });



  if (!message) {

    return emptyResult(["Message is empty after trim."]);

  }



  if (!isMinionRelayConfigured()) {

    return emptyResult([

      "K_MINION_API_KEY missing — cannot persist to Minion Base44 app.",

    ]);

  }



  // 1) Kieran message (immutable root — exact accepted string)

  const kieran = await saveKieranMessage(message);

  hops.push(asLog(kieran));

  if (!kieran.ok) {

    return {

      ...emptyResult(),

      hops,

    };

  }

  const rootId = kieran.message_id;



  // 2) Minion hop — REPORT ONLY: same string as kieran_message (no rewrite).

  //    Routing lives in meta / workflow_steps, never replaces content.

  const minionHop = await saveMinionHop(message, {

    parent_id: rootId,

    meta: {

      role: "report",

      reported_message: message,

      kieran_message_id: rootId,

      route_to: "simpee",

      then_agent: agent,

    },

  });

  hops.push(asLog(minionHop));



  let simpeeText =

    `Simpee instruction: review Kieran message (relay ${rootId}), protect revenue/DNA, then ask ${agent}.`;

  let familyReply = "";



  if (!input.persistOnly) {

    if (!isFamilyAskConfigured()) {

      warnings.push(

        "Family ask not configured (KURA_API_KEY / BASE44_API_KEY). Persisted hops with local instruction stubs.",

      );

    } else {

      try {

        const simpeeAsk = await askFamilyAgent(

          "gorgor",

          [

            "You are Simpee (Gor Gor), gatekeeper for ShortKey Minion Relay.",

            "Minion reported Kieran’s message VERBATIM below — minions cannot edit.",

            "Do NOT rewrite or replace that message. Return a short instruction for the family seat only.",

            "Keep DNA locks: no fake creators/reviews; Banuba TINT ≠ DeepSeek.",

            "Status remains GOR_GOR_REVIEW until approved.",

            "",

            `Target seat: ${agent}`,

            "Reported Kieran message (verbatim):",

            "<<<",

            message,

            ">>>",

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



      try {

        const familyAsk = await askFamilyAgent(

          agent,

          [

            "Minion Relay — follow Simpee instruction, answer Kieran.",

            "The reported Kieran message below is VERBATIM (minions cannot edit it).",

            "",

            `Simpee instruction: ${simpeeText}`,

            "",

            "Reported Kieran message (verbatim):",

            "<<<",

            message,

            ">>>",

          ].join("\n"),

        );

        familyReply = familyAsk.reply;

      } catch (err) {

        const msg =

          err instanceof FamilyAskError

            ? err.message

            : "Family Superagent call failed";

        warnings.push(`Family live call failed: ${msg}`);

        familyReply =

          familyReply ||

          `(no live family reply — ${agent} call failed; see warnings)`;

      }

    }

  } else {

    familyReply =

      "(persistOnly) Family response placeholder — live Superagent skipped.";

  }



  if (!familyReply) {

    familyReply =

      "(stub) Family response pending — configure family ask keys or retry.";

  }



  // 3) Simpee instruction

  const simpeeSave = await saveSimpeeInstruction(simpeeText, {

    parent_id: rootId,

    recipient_name: agent,

    meta: { agent },

  });

  hops.push(asLog(simpeeSave));



  // 4) Family response

  const familySave = await saveFamilyResponse(familyReply, {

    parent_id: rootId,

    sender_name: agent,

    meta: { agent },

  });

  hops.push(asLog(familySave));



  // 5) Review status

  const reviewSave = await saveReviewStatus(

    `Review status: ${reviewStatus} for relay ${rootId}`,

    reviewStatus,

    {

      parent_id: rootId,

      meta: { agent },

    },

  );

  hops.push(asLog(reviewSave));



  // 6) Final answer

  const finalText = (input.finalAnswer?.trim() || familyReply).trim();

  const finalSave = await saveFinalAnswer(finalText, {

    parent_id: rootId,

    meta: { agent, review_status: reviewStatus },

  });

  hops.push(asLog(finalSave));



  const allOk = hops.every((h) => h.ok);

  return {

    ok: allOk,

    relay_root_id: rootId,

    kieran_message: message,

    reported_message: message,

    hops,

    simpee_instruction: simpeeText,

    family_reply: familyReply,

    final_answer: finalText,

    review_status: reviewStatus,

    agent,

    warnings,

  };

}


