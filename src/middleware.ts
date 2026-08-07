import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  INTERNAL_STAGING_COOKIE,
  INTERNAL_STAGING_COOKIE_VALUE,
} from "@/lib/internalStagingAuth";

/**
 * Host routing for ShortKey multi-domain on one Vercel project.
 * shortkey.live → public Live Coming Soon (`/live`).
 * shortkey.social → Creator Early Access (`/social`) — staging / Gor Gor Review.
 * family.shortkey.world → INTERNAL STAGING Family Table home (preferred).
 * desk.shortkey.world → Founder Control Desk (`/desk`) — optional once DNS CNAME lives.
 * shortkey.studio → DNA Control Room (`/internal/studio`) — Studio P0.
 * shortkey.beauty (and vercel.app / localhost) keep the beauty app as-is.
 *
 * Minion Chat Box (INTERNAL): prefer https://shortkey.beauty/desk/#family
 * (path on the apex that already deploys). Do not wait for desk.shortkey.world
 * or shortkey.world if those hosts are still parking / DNS-pending.
 *
 * Philosophy lock:
 * - shortkey.beauty = Beauty deploy (also INTERNAL `/desk/#family` Minion path)
 * - shortkey.world = public facing world (also `/desk` path when pointed at Vercel)
 * - desk.shortkey.world = optional founder desk host (rewrite `/` → `/desk`)
 * - family.shortkey.world = family home (internal house) — NOT public launch
 * - shortkey.studio = DNA Control Room (internal) — not Family Table
 * - shortkey.social = creator early access (public preview staging) — not production
 *
 * Local surfaces (LOCKED):
 * - `npm run family:dev` (:3002) SHORTKEY_SURFACE=family → `/` → Family Table
 * - `npm run studio:dev` (:3003) SHORTKEY_SURFACE=studio → `/` → DNA Control Room
 * - `npm run social:dev` (:3004) SHORTKEY_SURFACE=social → `/` → Creator Early Access
 * - `npm run dev` (:3005) Beauty Coming Soon stays on `/`
 * - `npm run maya:dev` (:3008) SHORTKEY_SURFACE=maya → `/` → Maya Editorial Lab (isolated · not in locals:dev)
 * - `npm run locals:dev` boots Beauty/Family/Studio/Social · never 3000 · 3001 is not Beauty · Maya stays separate on 3008
 *
 * Soft staging gate: when FAMILY_TABLE_STAGING_PASSWORD or INTERNAL_STAGING_SECRET
 * is set, family/studio host `/` and `/internal/*` (except login) require cookie.
 * Family Table + Studio paths gated on all hosts. Localhost / family|studio surface bypass.
 * Public outward demos (same pattern as `/control` — NOT staging-gated):
 * `/showcase`, `/magazine-demo`, `/control-center/magazine-demo`.
 *
 * Full Rebuild preview stays at `/control/live.html` (family / control hub only).
 * Do not auto-publish unfinished livestream commerce — featureLocks stay closed.
 */
const LIVE_HOSTS = new Set(["shortkey.live", "www.shortkey.live"]);
const SOCIAL_HOSTS = new Set(["shortkey.social", "www.shortkey.social"]);
/** Preferred Family Table home host going forward */
const FAMILY_HOME_HOSTS = new Set([
  "family.shortkey.world",
  "www.family.shortkey.world",
]);
/** Founder Control Desk — remote work bookmark on shortkey.world zone */
const DESK_HOSTS = new Set(["desk.shortkey.world", "www.desk.shortkey.world"]);
/** Public world apex — desk also available at /desk */
const WORLD_HOSTS = new Set(["shortkey.world", "www.shortkey.world"]);
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
    pathname.startsWith("/magazine-demo") ||
    pathname.startsWith("/shortkey-assets") ||
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
  return s === "family" || s === "studio" || s === "social" || s === "maya";
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

/**
 * desk.shortkey.world → Founder Control Desk.
 * Root rewrites to `/desk`. Desk / app / family APIs pass through.
 */
function handleDeskHost(
  request: NextRequest,
  pathname: string,
): NextResponse | null {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/desk") ||
    pathname.startsWith("/app") ||
    pathname.startsWith("/shortkey-assets") ||
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
    url.pathname = "/desk";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

/**
 * shortkey.social → Creator Early Access (staging).
 * Root rewrites to `/social` (like live → `/live`). Other paths pass through.
 */
function handleSocialHost(
  request: NextRequest,
  pathname: string,
): NextResponse | null {
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
    url.pathname = "/social";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0]?.toLowerCase() ?? "";

  // Founder Desk + Brand Preview + desk / family APIs — never gate behind Coming Soon
  // Soft PIN for Minion/Desk APIs is SITE_ACCESS_PASSWORD via verifyDeskPassword (not this middleware).
  if (
    pathname === "/desk" ||
    pathname.startsWith("/desk/") ||
    pathname === "/minion-app" ||
    pathname.startsWith("/minion-app/") ||
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/api/desk") ||
    pathname === "/api/family/ask" ||
    pathname.startsWith("/api/family/ask/") ||
    pathname === "/api/family/status" ||
    pathname.startsWith("/api/family/status/") ||
    pathname === "/api/minion/chat" ||
    pathname.startsWith("/api/minion/chat/") ||
    pathname === "/api/minion/relay" ||
    pathname.startsWith("/api/minion/relay/")
  ) {
    const res = NextResponse.next();
    if (
      pathname === "/desk" ||
      pathname.startsWith("/desk/") ||
      pathname === "/minion-app" ||
      pathname.startsWith("/minion-app/")
    ) {
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return res;
  }

  // Family Table local workbench only (family:dev / PORT 3002). Never on Beauty 3005 / Studio 3003 / Social 3004.
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

  // Creator Early Access local surface (social:dev / PORT 3004).
  if (
    process.env.SHORTKEY_SURFACE === "social" &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/social";
    return NextResponse.redirect(url);
  }

  // Maya Editorial Lab (maya:dev / PORT 3008) — isolated from Beauty 3005.
  if (
    process.env.SHORTKEY_SURFACE === "maya" &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/internal/maya";
    return NextResponse.redirect(url);
  }

  // Soft staging password gate (env secret + cookie)
  if (requiresStagingGate(host, pathname) && !hasStagingCookie(request)) {
    return redirectToLogin(request);
  }

  // ── desk.shortkey.world — Founder Control Desk ───────────────────────────
  if (DESK_HOSTS.has(host)) {
    return handleDeskHost(request, pathname) ?? NextResponse.next();
  }

  // ── shortkey.studio — DNA Control Room (Studio P0) ───────────────────────
  if (STUDIO_HOSTS.has(host)) {
    return handleStudioHost(request, pathname) ?? NextResponse.next();
  }

  // ── family.shortkey.world — Family Table home ────────────────────────────
  if (FAMILY_HOME_HOSTS.has(host)) {
    return handleFamilyTableHomeHost(request, pathname) ?? NextResponse.next();
  }

  // ── shortkey.social — Creator Early Access (staging) ─────────────────────
  if (SOCIAL_HOSTS.has(host)) {
    return handleSocialHost(request, pathname) ?? NextResponse.next();
  }

  // ── shortkey.world apex — public world; /desk stays available ────────────
  if (WORLD_HOSTS.has(host)) {
    return NextResponse.next();
  }

  // ── shortkey.live — Coming Soon gate (frozen surface; do not redesign) ───
  if (!LIVE_HOSTS.has(host)) return NextResponse.next();

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/control") ||
    pathname.startsWith("/internal") ||
    pathname.startsWith("/desk") ||
    pathname.startsWith("/app") ||
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
