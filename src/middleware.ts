import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Host routing for ShortKey multi-domain on one Vercel project.
 * shortkey.live → public Live Coming Soon (`/live`).
 * shortkey.beauty (and vercel.app / localhost) keep the beauty app as-is.
 *
 * Full Rebuild preview stays at `/control/live.html` (family / control hub only).
 * Do not auto-publish unfinished livestream commerce — featureLocks stay closed.
 */
const LIVE_HOSTS = new Set(["shortkey.live", "www.shortkey.live"]);

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0]?.toLowerCase() ?? "";
  if (!LIVE_HOSTS.has(host)) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Pass through Next internals, APIs, static assets, control/internal surfaces
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

  // Root (and bare paths) on .live → Live Coming Soon gate
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
