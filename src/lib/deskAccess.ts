/**
 * Soft access gate for Founder Desk + Family ask APIs.
 * Secrets stay in server env — never expose to HTML.
 *
 * Env (either works):
 * - SITE_ACCESS_PASSWORD
 * - DESK_ACCESS_PASSWORD
 *
 * If neither is set → allow local use (caller should warn for production).
 */

export function getDeskAccessPassword(): string | undefined {
  const a = process.env.DESK_ACCESS_PASSWORD?.trim();
  const b = process.env.SITE_ACCESS_PASSWORD?.trim();
  const v = a || b || "";
  return v.length > 0 ? v : undefined;
}

export function isDeskPasswordConfigured(): boolean {
  return Boolean(getDeskAccessPassword());
}

export function verifyDeskPassword(password: unknown): {
  ok: true;
  passwordRequired: boolean;
} | {
  ok: false;
  status: number;
  error: string;
  passwordRequired: boolean;
} {
  const expected = getDeskAccessPassword();
  if (!expected) {
    return { ok: true, passwordRequired: false };
  }

  const provided = typeof password === "string" ? password.trim() : "";
  if (!provided || provided !== expected) {
    return {
      ok: false,
      status: 401,
      error: "Incorrect access password.",
      passwordRequired: true,
    };
  }

  return { ok: true, passwordRequired: true };
}
