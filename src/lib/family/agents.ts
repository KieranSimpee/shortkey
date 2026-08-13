/**
 * ShortKey Family Agent registry — ALWAYS TO TRUE.
 * Live = real upstream reply only. Never invent answers.
 */

export type FamilyAgentSeat =
  | "kura"
  | "gor-gor"
  | "senti"
  | "agent-r"
  | "maya"
  | "sky"
  | "key"
  | "minion";

export type FamilyAgentChannel =
  | "base44_superagent"
  | "asi_one"
  | "email_only"
  | "cursor_session"
  | "base44_minion";

export type LiveStatus =
  | "LIVE"
  | "NOT_CONNECTED"
  | "EMAIL_ONLY"
  | "SESSION_ONLY"
  | "UPSTREAM_ERROR"
  | "SKIPPED";

export type FamilyAgentDefinition = {
  seat: FamilyAgentSeat;
  label: string;
  channel: FamilyAgentChannel;
  /** Can produce a live model reply when keys + upstream work */
  liveCapable: boolean;
  agentIdEnv?: string;
  defaultAgentId?: string;
  conversationIdEnv?: string;
  defaultConversationId?: string;
  keyEnvNames: string[];
  notes: string;
};

/** Locked Base44 Superagent IDs — do not recreate apps. */
export const FAMILY_AGENTS: Record<FamilyAgentSeat, FamilyAgentDefinition> = {
  kura: {
    seat: "kura",
    label: "Kura",
    channel: "base44_superagent",
    liveCapable: true,
    agentIdEnv: "KURA_AGENT_ID",
    defaultAgentId: "6a54198bebbee048f44e1378",
    keyEnvNames: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
    notes: "Brand Design Manager · Base44 Superagent",
  },
  "gor-gor": {
    seat: "gor-gor",
    label: "Gor Gor (Simpee)",
    channel: "base44_superagent",
    liveCapable: true,
    agentIdEnv: "SIMPEE_AGENT_ID",
    defaultAgentId: "69ddc914cfcf229762ac123d",
    conversationIdEnv: "GOR_GOR_CONVERSATION_ID",
    defaultConversationId: "69ddc9166e1e12f6313fc523",
    keyEnvNames: ["BASE44_AGENT_API_KEY", "BASE44_API_KEY", "KURA_API_KEY"],
    notes: "Chief of Staff · Family gatekeeper · Base44 Superagent",
  },
  senti: {
    seat: "senti",
    label: "Senti",
    channel: "base44_superagent",
    liveCapable: true,
    agentIdEnv: "SENTI_AGENT_ID",
    defaultAgentId: "6a42029cc124d0206f027335",
    conversationIdEnv: "SENTI_CONVERSATION_ID",
    defaultConversationId: "6a42029ee7bbd796cda145e3",
    keyEnvNames: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
    notes: "Creative Director · Base44 Superagent (same family key)",
  },
  "agent-r": {
    seat: "agent-r",
    label: "Agent R",
    channel: "base44_superagent",
    liveCapable: true,
    agentIdEnv: "AGENT_R_AGENT_ID",
    defaultAgentId: "6a449e8691d185359beef333",
    conversationIdEnv: "AGENT_R_CONVERSATION_ID",
    defaultConversationId: "6a449e88110fe595b96cbb05",
    keyEnvNames: ["KURA_API_KEY", "BASE44_API_KEY", "BASE44_AGENT_API_KEY"],
    notes: "Secretary · evidence · Base44 Superagent (same family key)",
  },
  maya: {
    seat: "maya",
    label: "Maya",
    channel: "asi_one",
    liveCapable: true,
    keyEnvNames: ["ASI_ONE_API_KEY", "ASI1_API_KEY"],
    notes: "Editorial Heart · ASI:One only (Base44 Maya portal deleted)",
  },
  sky: {
    seat: "sky",
    label: "Sky",
    channel: "email_only",
    liveCapable: false,
    keyEnvNames: [],
    notes: "Social Room email seat only — not a live API agent (ALWAYS TO TRUE)",
  },
  key: {
    seat: "key",
    label: "Key (Cursor)",
    channel: "cursor_session",
    liveCapable: false,
    keyEnvNames: [],
    notes: "Cursor house · this session · not a separate remote API",
  },
  minion: {
    seat: "minion",
    label: "Minion Relay",
    channel: "base44_minion",
    liveCapable: true,
    defaultAgentId: "6a5f20ace942aedd542584a2",
    keyEnvNames: ["K_MINION_API_KEY", "KMINION"],
    notes: "Founder Desk relay · Base44 Minion app backend",
  },
};

export const LIVE_FAMILY_SEATS: FamilyAgentSeat[] = [
  "kura",
  "gor-gor",
  "senti",
  "agent-r",
  "maya",
];

export function resolveEnv(names: string[]): string | undefined {
  for (const name of names) {
    const v = process.env[name]?.trim();
    if (v) return v;
  }
  return undefined;
}

export function getAgentId(def: FamilyAgentDefinition): string | undefined {
  if (def.agentIdEnv) {
    const fromEnv = process.env[def.agentIdEnv]?.trim();
    if (fromEnv) return fromEnv;
  }
  return def.defaultAgentId;
}

export function hasKeyConfigured(def: FamilyAgentDefinition): boolean {
  if (def.channel === "email_only" || def.channel === "cursor_session") {
    return false;
  }
  return Boolean(resolveEnv(def.keyEnvNames));
}

export function skyEmail(): string {
  return process.env.SKY_EMAIL?.trim() || "sky@shortkey.beauty";
}

export type FamilyAgentStatusRow = {
  seat: FamilyAgentSeat;
  label: string;
  channel: FamilyAgentChannel;
  liveCapable: boolean;
  keyConfigured: boolean;
  agentIdSuffix: string | null;
  status: LiveStatus;
  live: boolean;
  detail: string;
  checkedAt: string;
  /** Present only after a real live ping succeeded */
  sampleReplyPreview?: string;
};

export function configOnlyStatus(seat: FamilyAgentSeat): FamilyAgentStatusRow {
  const def = FAMILY_AGENTS[seat];
  const checkedAt = new Date().toISOString();
  const keyConfigured = hasKeyConfigured(def);
  const agentId = getAgentId(def);
  const agentIdSuffix = agentId ? agentId.slice(-4) : null;

  if (def.channel === "email_only") {
    return {
      seat,
      label: def.label,
      channel: def.channel,
      liveCapable: false,
      keyConfigured: false,
      agentIdSuffix: null,
      status: "EMAIL_ONLY",
      live: false,
      detail: `Email seat only (${skyEmail()}). No live API — do not invent Sky replies.`,
      checkedAt,
    };
  }

  if (def.channel === "cursor_session") {
    return {
      seat,
      label: def.label,
      channel: def.channel,
      liveCapable: false,
      keyConfigured: false,
      agentIdSuffix: null,
      status: "SESSION_ONLY",
      live: false,
      detail: "Present in this Cursor session only — not a remote Superagent.",
      checkedAt,
    };
  }

  if (!keyConfigured) {
    return {
      seat,
      label: def.label,
      channel: def.channel,
      liveCapable: def.liveCapable,
      keyConfigured: false,
      agentIdSuffix,
      status: "NOT_CONNECTED",
      live: false,
      detail: `Missing key (${def.keyEnvNames.join(" | ")}). No live answer until key is set.`,
      checkedAt,
    };
  }

  return {
    seat,
    label: def.label,
    channel: def.channel,
    liveCapable: def.liveCapable,
    keyConfigured: true,
    agentIdSuffix,
    status: "SKIPPED",
    live: false,
    detail: "Key present · live ping not run (config-only check).",
    checkedAt,
  };
}
