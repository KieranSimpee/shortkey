/**
 * Ask any live-capable family seat — fail-closed, no ghost answers.
 */

import {
  FAMILY_AGENTS,
  getAgentId,
  hasKeyConfigured,
  skyEmail,
  type FamilyAgentSeat,
} from "@/lib/family/agents";
import { askBase44AgentLive } from "@/lib/family/base44Agent";
import { askAsiOneLive, AsiOneError } from "@/lib/ai/asi1";
import { GorGorBridgeError } from "@/lib/gorGorChatBridge";

export type FamilyAskSuccess = {
  live: true;
  seat: FamilyAgentSeat;
  label: string;
  reply: string;
  conversation_id?: string;
  provider: string;
};

export type FamilyAskFailure = {
  live: false;
  seat: FamilyAgentSeat;
  label: string;
  code: string;
  error: string;
  status: number;
};

export type FamilyAskResult = FamilyAskSuccess | FamilyAskFailure;

export async function askFamilyAgent(opts: {
  seat: FamilyAgentSeat;
  message: string;
  conversationId?: string;
}): Promise<FamilyAskResult> {
  const def = FAMILY_AGENTS[opts.seat];
  if (!def) {
    return {
      live: false,
      seat: opts.seat,
      label: opts.seat,
      code: "unknown_seat",
      error: "Unknown family seat.",
      status: 400,
    };
  }

  const message = opts.message.trim();
  if (!message || message.length > 8000) {
    return {
      live: false,
      seat: opts.seat,
      label: def.label,
      code: "invalid_message",
      error: "Message is required (max 8000 characters).",
      status: 400,
    };
  }

  if (def.channel === "email_only") {
    return {
      live: false,
      seat: opts.seat,
      label: def.label,
      code: "email_only",
      error: `Sky is email-only (${skyEmail()}). No live API — do not invent Sky replies.`,
      status: 501,
    };
  }

  if (def.channel === "cursor_session") {
    return {
      live: false,
      seat: opts.seat,
      label: def.label,
      code: "session_only",
      error: "Key/Cursor is this session — use Cursor chat directly, not a remote agent API.",
      status: 501,
    };
  }

  if (def.channel === "base44_minion") {
    if (!hasKeyConfigured(def)) {
      return {
        live: false,
        seat: opts.seat,
        label: def.label,
        code: "not_connected",
        error: "K_MINION_API_KEY missing. Minion is not live.",
        status: 503,
      };
    }
    // Minion relay is entity/chat backend — not a Superagent chat completion.
    // Honesty: key present ≠ live conversational agent until relay verify exists.
    return {
      live: false,
      seat: opts.seat,
      label: def.label,
      code: "relay_only",
      error:
        "Minion key present, but conversational Superagent ask is not claimed. Use Desk /api/minion/relay — do not ghost Minion chat replies here.",
      status: 501,
    };
  }

  if (def.channel === "asi_one") {
    try {
      const result = await askAsiOneLive({ userMessage: message });
      return {
        live: true,
        seat: opts.seat,
        label: def.label,
        reply: result.reply,
        provider: "asi1",
      };
    } catch (err) {
      if (err instanceof AsiOneError) {
        return {
          live: false,
          seat: opts.seat,
          label: def.label,
          code: err.code,
          error: err.message,
          status: err.status,
        };
      }
      return {
        live: false,
        seat: opts.seat,
        label: def.label,
        code: "bridge_error",
        error: "Maya / ASI:One ask failed.",
        status: 502,
      };
    }
  }

  // base44_superagent
  if (!hasKeyConfigured(def)) {
    return {
      live: false,
      seat: opts.seat,
      label: def.label,
      code: "not_connected",
      error: `${def.label} Superagent key missing (${def.keyEnvNames.join(" | ")}).`,
      status: 503,
    };
  }

  const agentId = getAgentId(def);
  if (!agentId) {
    return {
      live: false,
      seat: opts.seat,
      label: def.label,
      code: "missing_agent_id",
      error: `${def.label} agent id not configured.`,
      status: 503,
    };
  }

  try {
    const result = await askBase44AgentLive({
      agentId,
      message,
      conversationId: opts.conversationId,
    });
    return {
      live: true,
      seat: opts.seat,
      label: def.label,
      reply: result.reply,
      conversation_id: result.conversation_id,
      provider: "base44_superagent",
    };
  } catch (err) {
    if (err instanceof GorGorBridgeError) {
      return {
        live: false,
        seat: opts.seat,
        label: def.label,
        code: err.code,
        error: err.message,
        status: err.status >= 400 && err.status < 600 ? err.status : 502,
      };
    }
    return {
      live: false,
      seat: opts.seat,
      label: def.label,
      code: "bridge_error",
      error: `${def.label} live ask failed.`,
      status: 502,
    };
  }
}
