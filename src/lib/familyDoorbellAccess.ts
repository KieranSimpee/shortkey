/**
 * Soft staging gate for /api/family-doorbell/* — same pattern as gor-gor-chat.
 */

import { assertGorGorChatAccess } from "@/lib/gorGorChatAccess";

export function assertFamilyDoorbellAccess(request: Request): {
  ok: true;
} | {
  ok: false;
  status: number;
  error: string;
} {
  return assertGorGorChatAccess(request);
}
