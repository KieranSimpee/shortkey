/**
 * Live family agent status — pings upstream when keys exist.
 * NEVER marks LIVE without a real reply.
 */

import {
  FAMILY_AGENTS,
  configOnlyStatus,
  getAgentId,
  hasKeyConfigured,
  type FamilyAgentSeat,
  type FamilyAgentStatusRow,
  type LiveStatus,
} from "@/lib/family/agents";
import { pingBase44AgentLive } from "@/lib/family/base44Agent";
import { pingAsiOneLive } from "@/lib/ai/asi1";

export type FamilyAgentsStatusReport = {
  ok: boolean;
  liveCount: number;
  connectedCapableCount: number;
  totalSeats: number;
  honesty:
    | "ALL_LIVE_CAPABLE_CONNECTED"
    | "PARTIAL"
    | "NONE_LIVE"
    | "CONFIG_ONLY";
  checkedAt: string;
  agents: FamilyAgentStatusRow[];
  blockers: string[];
};

const ALL_SEATS = Object.keys(FAMILY_AGENTS) as FamilyAgentSeat[];

export async function getFamilyAgentsStatus(opts?: {
  ping?: boolean;
}): Promise<FamilyAgentsStatusReport> {
  const ping = opts?.ping !== false;
  const checkedAt = new Date().toISOString();
  const agents: FamilyAgentStatusRow[] = [];
  const blockers: string[] = [];

  for (const seat of ALL_SEATS) {
    const def = FAMILY_AGENTS[seat];
    const base = configOnlyStatus(seat);

    if (!ping || !def.liveCapable) {
      agents.push(base);
      if (def.liveCapable && !base.keyConfigured) {
        blockers.push(`${def.label}: missing key`);
      }
      if (def.channel === "email_only") {
        // not a blocker — honest non-live seat
      }
      continue;
    }

    if (!hasKeyConfigured(def)) {
      agents.push(base);
      blockers.push(`${def.label}: missing key`);
      continue;
    }

    if (def.channel === "asi_one") {
      const result = await pingAsiOneLive();
      const status: LiveStatus = result.live ? "LIVE" : "UPSTREAM_ERROR";
      if (!result.live) blockers.push(`${def.label}: ${result.detail}`);
      agents.push({
        ...base,
        keyConfigured: true,
        status,
        live: result.live,
        detail: result.detail,
        checkedAt,
        sampleReplyPreview: result.sampleReplyPreview,
      });
      continue;
    }

    if (def.channel === "base44_minion") {
      agents.push({
        ...base,
        keyConfigured: true,
        status: "NOT_CONNECTED",
        live: false,
        detail:
          "Minion key set · conversational live ping not claimed (relay-only). Not marked LIVE.",
        checkedAt,
      });
      blockers.push(`${def.label}: relay-only (no Superagent ping claimed)`);
      continue;
    }

    const agentId = getAgentId(def);
    if (!agentId) {
      agents.push({
        ...base,
        status: "NOT_CONNECTED",
        live: false,
        detail: "Agent id missing.",
        checkedAt,
      });
      blockers.push(`${def.label}: missing agent id`);
      continue;
    }

    const result = await pingBase44AgentLive(agentId);
    const status: LiveStatus = result.live ? "LIVE" : "UPSTREAM_ERROR";
    if (!result.live) blockers.push(`${def.label}: ${result.detail}`);
    agents.push({
      ...base,
      keyConfigured: true,
      agentIdSuffix: agentId.slice(-4),
      status,
      live: result.live,
      detail: result.detail,
      checkedAt,
      sampleReplyPreview: result.sampleReplyPreview,
    });
  }

  const liveCapable = agents.filter((a) => FAMILY_AGENTS[a.seat].liveCapable);
  const liveCount = agents.filter((a) => a.live).length;
  const connectedCapableCount = liveCapable.filter((a) => a.live).length;
  // Core conversational family seats (Minion is relay-only — not required for ok)
  const core = agents.filter((a) =>
    ["kura", "gor-gor", "senti", "agent-r", "maya"].includes(a.seat),
  );
  const coreAllLive = core.every((a) => a.live);

  let honesty: FamilyAgentsStatusReport["honesty"] = "NONE_LIVE";
  if (!ping) honesty = "CONFIG_ONLY";
  else if (coreAllLive) honesty = "ALL_LIVE_CAPABLE_CONNECTED";
  else if (liveCount > 0) honesty = "PARTIAL";
  else honesty = "NONE_LIVE";

  return {
    ok: coreAllLive,
    liveCount,
    connectedCapableCount,
    totalSeats: agents.length,
    honesty,
    checkedAt,
    agents,
    blockers,
  };
}
