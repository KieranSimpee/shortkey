import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Host routing for ShortKey multi-domain on one Vercel project.
 * shortkey.live → public Live Coming Soon (`/live`).
 * shortkey.beauty (and vercel.app / localhost) keep the beauty app as-is.
 *
 * Local Family Table surface (`npm run family:dev` → :3002):
 * SHORTKEY_SURFACE=family → `/` redirects to `/internal/family-table`.
 * ShortKey `npm run dev` (:3001) does NOT set this — Coming Soon stays on `/`.
 *
 * Full Rebuild preview stays at `/control/live.html` (family / control hub only).
 * Do not auto-publish unfinished livestream commerce — featureLocks stay closed.
 */
const LIVE_HOSTS = new Set(["shortkey.live", "www.shortkey.live"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Family Table local workbench only (family:dev / PORT 3002). Never on 3001.
  if (
    process.env.SHORTKEY_SURFACE === "family" &&
    (pathname === "/" || pathname === "")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/internal/family-table";
    return NextResponse.redirect(url);
  }

  const host = (request.headers.get("host") ?? "").split(":")[0]?.toLowerCase() ?? "";
  if (!LIVE_HOSTS.has(host)) return NextResponse.next();

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
