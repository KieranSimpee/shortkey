import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  INTERNAL_STAGING_COOKIE,
  INTERNAL_STAGING_COOKIE_VALUE,
} from "@/lib/internalStagingAuth";

/**
 * Host routing for ShortKey multi-domain on one Vercel project.
 * shortkey.live → public Live Coming Soon (`/live`).
 * shortkey.studio → INTERNAL STAGING Family Table (`/internal/family-table`) — not public launch.
 * shortkey.beauty (and vercel.app / localhost) keep the beauty app as-is.
 *
 * Local Family Table surface (`npm run family:dev` → :3002):
 * SHORTKEY_SURFACE=family → `/` redirects to `/internal/family-table`.
 * ShortKey `npm run dev` (:3001) does NOT set this — Coming Soon stays on `/`.
 *
 * Soft staging gate: when FAMILY_TABLE_STAGING_PASSWORD or INTERNAL_STAGING_SECRET
 * is set, `/internal/*` (except login) requires cookie — on studio host always,
 * and for Family Table path on all hosts. Localhost / family surface bypass.
 *
 * Full Rebuild preview stays at `/control/live.html` (family / control hub only).
 * Do not auto-publish unfinished livestream commerce — featureLocks stay closed.
 */
const LIVE_HOSTS = new Set(["shortkey.live", "www.shortkey.live"]);
const STUDIO_HOSTS = new Set(["shortkey.studio", "www.shortkey.studio"]);

function isLocalHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function isStaticOrSystem(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  );
}

function stagingSecretConfigured(): boolean {
  const a = process.env.FAMILY_TABLE_STAGING_PASSWORD?.trim();
  const b = process.env.INTERNAL_STAGING_SECRET?.trim();
  return Boolean(a || b);
}

function hasStagingCookie(request: NextRequest): boolean {
  return request.cookies.get(INTERNAL_STAGING_COOKIE)?.value === INTERNAL_STAGING_COOKIE_VALUE;
}

function requiresStagingGate(host: string, pathname: string): boolean {
  if (!pathname.startsWith("/internal")) return false;
  if (pathname === "/internal/login" || pathname.startsWith("/internal/login/")) return false;
  if (isLocalHost(host) || process.env.SHORTKEY_SURFACE === "family") return false;
  if (!stagingSecretConfigured()) return false;

  // Studio host: all /internal/*
  if (STUDIO_HOSTS.has(host)) return true;

  // All hosts: Family Table path (soft protection on vercel.app / beauty host URLs)
  if (
    pathname === "/internal/family-table" ||
    pathname.startsWith("/internal/family-table/")
  ) {
    return true;
  }

  return false;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/internal/login";
  url.search = "";
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0]?.toLowerCase() ?? "";

  // Family Table local workbench only (family:dev / PORT 3002). Never on 3001.
  if (
    process.env.SHORTKEY_SURFACE === "family" &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/internal/family-table";
    return NextResponse.redirect(url);
  }

  // Soft staging password gate (env secret + cookie)
  if (requiresStagingGate(host, pathname) && !hasStagingCookie(request)) {
    return redirectToLogin(request);
  }

  // ── shortkey.studio — INTERNAL STAGING ONLY ──────────────────────────────
  if (STUDIO_HOSTS.has(host)) {
    if (isStaticOrSystem(pathname) || pathname.startsWith("/control")) {
      return NextResponse.next();
    }

    // Keep studio surface on internal routes; root → Family Table
    if (pathname === "/" || pathname === "" || !pathname.startsWith("/internal")) {
      const url = request.nextUrl.clone();
      url.pathname = "/internal/family-table";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // ── shortkey.live — Coming Soon gate (frozen surface; do not redesign) ───
  if (!LIVE_HOSTS.has(host)) return NextResponse.next();

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/control") ||
    pathname.startsWith("/internal") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    url.pathname = "/live";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
