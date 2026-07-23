import { NextResponse } from "next/server";
import {
  INTERNAL_STAGING_COOKIE,
  INTERNAL_STAGING_COOKIE_VALUE,
  getInternalStagingSecret,
  passwordMatchesStagingSecret,
} from "@/lib/internalStagingAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Soft staging unlock — sets httpOnly cookie when password matches env secret.
 * Soft gate only (shared password). Not login / roles / 正式版 auth.
 */
export async function POST(request: Request) {
  const secret = getInternalStagingSecret();
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Staging gate not configured. Set FAMILY_TABLE_STAGING_PASSWORD or INTERNAL_STAGING_SECRET in env.",
      },
      { status: 503 },
    );
  }

  let password = "";
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as { password?: string } | null;
    password = typeof body?.password === "string" ? body.password : "";
  } else {
    const form = await request.formData().catch(() => null);
    const raw = form?.get("password");
    password = typeof raw === "string" ? raw : "";
  }

  if (!passwordMatchesStagingSecret(password)) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(INTERNAL_STAGING_COOKIE, INTERNAL_STAGING_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(INTERNAL_STAGING_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
