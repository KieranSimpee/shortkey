/**
 * Minion Relay — Base44 app client (server-only).
 *
 * App ID: 6a5f20ace942aedd542584a2 (K Minion / Minion Relay)
 * Env (prefer): K_MINION_API_KEY
 * Alias: KMINION
 * Optional last-resort fallback: BASE44_API_KEY (shared family key — prefer dedicated)
 *
 * Never import this into client components. Never log the key.
 */

import { createClient, type Base44Client } from "@base44/sdk";

export const MINION_APP_ID = "6a5f20ace942aedd542584a2";

/** Known K Minion recipient id from live Message records in this app. */
export const K_MINION_RECIPIENT_ID = "6a5f20afe942aedd542584a4";
export const K_MINION_RECIPIENT_NAME = "K Minion";

export function getMinionApiKey(): string | undefined {
  const key =
    process.env.K_MINION_API_KEY?.trim() ||
    process.env.KMINION?.trim() ||
    process.env.BASE44_API_KEY?.trim() ||
    "";
  return key.length > 0 ? key : undefined;
}

export function isMinionRelayConfigured(): boolean {
  return Boolean(getMinionApiKey());
}

let cached: Base44Client | null = null;

/**
 * Server-side Base44 client for the Minion Relay app.
 * Uses api_key header (same pattern as Base44 Superagent bridges in this repo).
 */
export function getMinionBase44(): Base44Client {
  const apiKey = getMinionApiKey();
  if (!apiKey) {
    throw new Error(
      "Minion Relay is not configured. Set K_MINION_API_KEY in .env.local (server only).",
    );
  }
  if (cached) return cached;
  cached = createClient({
    appId: MINION_APP_ID,
    headers: {
      api_key: apiKey,
    },
  });
  return cached;
}

/** Reset cached client (tests / key rotation). */
export function resetMinionBase44Cache(): void {
  cached = null;
}
