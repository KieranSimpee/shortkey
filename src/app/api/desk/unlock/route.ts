import { NextResponse } from "next/server";
import {
  isDeskPasswordConfigured,
  verifyDeskPassword,
} from "@/lib/deskAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/desk/unlock
 * Body: { password?: string }
 * Soft gate for Founder Desk — compares against SITE_ACCESS_PASSWORD or DESK_ACCESS_PASSWORD.
 * If no password configured → allow with production warning.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? (body as { password?: unknown }).password
      : undefined;

  const result = verifyDeskPassword(password);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, passwordRequired: true },
      { status: result.status },
    );
  }

  const configured = isDeskPasswordConfigured();
  return NextResponse.json({
    ok: true,
    passwordRequired: configured,
    warn: configured
      ? undefined
      : "No SITE_ACCESS_PASSWORD / DESK_ACCESS_PASSWORD set — local use only. Add a password on Vercel before relying on this desk remotely.",
  });
}

/** GET — status only (does not leak whether password matches anything). */
export async function GET() {
  const configured = isDeskPasswordConfigured();
  return NextResponse.json({
    passwordRequired: configured,
    warn: configured
      ? undefined
      : "No access password configured. Family ask and unlock will allow open use until you set SITE_ACCESS_PASSWORD or DESK_ACCESS_PASSWORD.",
  });
}
