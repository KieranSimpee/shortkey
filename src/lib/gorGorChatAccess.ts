/**
 * Soft staging gate for /api/gor-gor-chat — mirrors middleware behavior:
 * - If FAMILY_TABLE_STAGING_PASSWORD / INTERNAL_STAGING_SECRET unset → allow
 * - Localhost / SHORTKEY_SURFACE=family → soft allow
 * - Otherwise require INTERNAL_STAGING_COOKIE
 */

import {
  INTERNAL_STAGING_COOKIE,
  INTERNAL_STAGING_COOKIE_VALUE,
  isInternalStagingGateConfigured,
} from "@/lib/internalStagingAuth";

function isLocalHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

export function assertGorGorChatAccess(request: Request): {
  ok: true;
} | {
  ok: false;
  status: number;
  error: string;
} {
  if (!isInternalStagingGateConfigured()) {
    return { ok: true };
  }

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  if (isLocalHost(host) || process.env.SHORTKEY_SURFACE === "family") {
    return { ok: true };
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${INTERNAL_STAGING_COOKIE}=`));
  const value = match?.slice(INTERNAL_STAGING_COOKIE.length + 1);

  if (value === INTERNAL_STAGING_COOKIE_VALUE) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 401,
    error: "Internal staging unlock required. Open /internal/login first.",
  };
}
