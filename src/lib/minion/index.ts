/**
 * Re-exports for Minion Relay (server-only).
 */

export {
  getMinionApiKey,
  getMinionBase44,
  isMinionRelayConfigured,
  K_MINION_RECIPIENT_ID,
  K_MINION_RECIPIENT_NAME,
  MINION_APP_ID,
  resetMinionBase44Cache,
} from "@/lib/minion/base44";

export {
  createMinionMessage,
  listRecentRelayMessages,
  listThreadMessages,
  saveFamilyResponse,
  saveFinalAnswer,
  saveKieranMessage,
  saveMinionHop,
  saveRelayHop,
  saveReviewStatus,
  saveSimpeeInstruction,
} from "@/lib/minion/relayPersist";

export {
  isMinionRelayReady,
  runMinionRelay,
  type MinionRelayHopLog,
  type MinionRelayRequest,
  type MinionRelayResult,
} from "@/lib/minion/relay";

export {
  loadMinionChatThread,
  MINION_CHAT_FAMILY_SEATS,
  recordsToBubbles,
  runMinionChatBox,
  type MinionChatBoxResult,
  type MinionChatBubble,
  type MinionChatSeatPost,
} from "@/lib/minion/chatBox";
export type {
  MinionMessageCreate,
  MinionMessageRecord,
  RelayEventType,
  RelayHopInput,
  RelayPersistError,
  RelayPersistResult,
  RelayReviewStatus,
} from "@/lib/minion/types";

export { RELAY_EVENT_TYPES } from "@/lib/minion/types";
