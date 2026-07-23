/**
 * Soft staging gate for `/internal/*` (shortkey.studio + Family Table).
 * Shared secret via env — not production auth / roles.
 */

export const INTERNAL_STAGING_COOKIE = "sk_internal_staging";

/** Cookie value after unlock (password never stored in the cookie). */
export const INTERNAL_STAGING_COOKIE_VALUE = "unlocked";

export function getInternalStagingSecret(): string | undefined {
  const raw =
    process.env.FAMILY_TABLE_STAGING_PASSWORD?.trim() ||
    process.env.INTERNAL_STAGING_SECRET?.trim() ||
    "";
  return raw.length > 0 ? raw : undefined;
}

/** Soft gate: when unset, middleware does not require a cookie (local / unset Vercel). */
export function isInternalStagingGateConfigured(): boolean {
  return Boolean(getInternalStagingSecret());
}

export function passwordMatchesStagingSecret(password: string): boolean {
  const secret = getInternalStagingSecret();
  if (!secret) return false;
  return password === secret;
}
