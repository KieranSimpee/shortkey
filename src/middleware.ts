import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  INTERNAL_STAGING_COOKIE,
  INTERNAL_STAGING_COOKIE_VALUE,
} from "@/lib/internalStagingAuth";

/**
 * Host routing for ShortKey multi-domain on one Vercel project.
 * shortkey.live → public Live Coming Soon (`/live`).
 * family.shortkey.world → INTERNAL STAGING Family Table home (preferred).
 * shortkey.studio → DNA Control Room (`/internal/studio`) — Studio P0.
 * shortkey.beauty (and vercel.app / localhost) keep the beauty app as-is.
 *
 * Philosophy lock:
 * - shortkey.world = public facing world
 * - family.shortkey.world = family home (internal house) — NOT public launch
 * - shortkey.studio = DNA Control Room (internal) — not Family Table
 *
 * Local surfaces:
 * - `npm run family:dev` (:3002) SHORTKEY_SURFACE=family → `/` → Family Table
 * - `npm run studio:dev` (:3003) SHORTKEY_SURFACE=studio → `/` → DNA Control Room
 * - `npm run dev` (:3001) Coming Soon stays on `/`
 *
 * Soft staging gate: when FAMILY_TABLE_STAGING_PASSWORD or INTERNAL_STAGING_SECRET
 * is set, family/studio host `/` and `/internal/*` (except login) require cookie.
 * Family Table + Studio paths gated on all hosts. Localhost / family|studio surface bypass.
 *
 * Full Rebuild preview stays at `/control/live.html` (family / control hub only).
 * Do not auto-publish unfinished livestream commerce — featureLocks stay closed.
 */
const LIVE_HOSTS = new Set(["shortkey.live", "www.shortkey.live"]);
/** Preferred Family Table home host going forward */
const FAMILY_HOME_HOSTS = new Set([
  "family.shortkey.world",
  "www.family.shortkey.world",
]);
/** Studio P0 — DNA Control Room (separate from Family Table) */
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

function isSurfaceBypass(): boolean {
  const s = process.env.SHORTKEY_SURFACE;
  return s === "family" || s === "studio";
}

function requiresStagingGate(host: string, pathname: string): boolean {
  if (pathname === "/internal/login" || pathname.startsWith("/internal/login/")) return false;
  if (isLocalHost(host) || isSurfaceBypass()) return false;
  if (!stagingSecretConfigured()) return false;

  // Family home or studio host: `/` and all `/internal/*`
  if (FAMILY_HOME_HOSTS.has(host) || STUDIO_HOSTS.has(host)) {
    if (pathname === "/" || pathname === "" || pathname.startsWith("/internal")) {
      return true;
    }
    return false;
  }

  // All hosts: Family Table + Studio DNA paths
  if (
    pathname === "/internal/family-table" ||
    pathname.startsWith("/internal/family-table/") ||
    pathname === "/internal/studio" ||
    pathname.startsWith("/internal/studio/")
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

/**
 * family.shortkey.world → Family Table home.
 * Root and non-internal paths redirect to `/internal/family-table`.
 */
function handleFamilyTableHomeHost(
  request: NextRequest,
  pathname: string,
): NextResponse | null {
  if (isStaticOrSystem(pathname) || pathname.startsWith("/control")) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "" || !pathname.startsWith("/internal")) {
    const url = request.nextUrl.clone();
    url.pathname = "/internal/family-table";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * shortkey.studio → DNA Control Room (Studio P0).
 * Root and non-internal paths redirect to `/internal/studio`.
 */
function handleStudioHost(
  request: NextRequest,
  pathname: string,
): NextResponse | null {
  if (isStaticOrSystem(pathname) || pathname.startsWith("/control")) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "" || !pathname.startsWith("/internal")) {
    const url = request.nextUrl.clone();
    url.pathname = "/internal/studio";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0]?.toLowerCase() ?? "";

  // Family Table local workbench only (family:dev / PORT 3002). Never on 3001/3003.
  if (
    process.env.SHORTKEY_SURFACE === "family" &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/internal/family-table";
    return NextResponse.redirect(url);
  }

  // Studio DNA Control Room local surface (studio:dev / PORT 3003).
  if (
    process.env.SHORTKEY_SURFACE === "studio" &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/internal/studio";
    return NextResponse.redirect(url);
  }

  // Soft staging password gate (env secret + cookie)
  if (requiresStagingGate(host, pathname) && !hasStagingCookie(request)) {
    return redirectToLogin(request);
  }

  // ── shortkey.studio — DNA Control Room (Studio P0) ───────────────────────
  if (STUDIO_HOSTS.has(host)) {
    return handleStudioHost(request, pathname) ?? NextResponse.next();
  }

  // ── family.shortkey.world — Family Table home ────────────────────────────
  if (FAMILY_HOME_HOSTS.has(host)) {
    return handleFamilyTableHomeHost(request, pathname) ?? NextResponse.next();
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
