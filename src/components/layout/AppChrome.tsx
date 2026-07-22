"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { HeaderBrandSection } from "@/components/layout/HeaderBrandSection";
import { Footer } from "@/components/layout/Footer";
import { CmsHeader, CmsHeaderBrand, CmsFooter } from "@/components/cms/CmsLayoutZones";

/**
 * Marketing chrome (shop nav/cart/full footer) is skipped for:
 * - the all-in-one Master Control hub (`/control`)
 * - internal-only Studio surfaces (`/internal/*`)
 * - the public Coming Soon gate (`/`) — it owns its own minimal header + Premium Footer
 *   so no shop/store links leak onto the public gate (SHORTKEY_MASTER_BLUEPRINT_v1.md).
 * - shortkey.live Coming Soon (`/live`) — same rule; no shop leaks on the live host gate.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isControlHub = pathname === "/control" || pathname.startsWith("/control/");
  const isInternal = pathname === "/internal" || pathname.startsWith("/internal/");
  const isComingSoon = pathname === "/";
  const isLiveComingSoon = pathname === "/live" || pathname.startsWith("/live/");

  if (isControlHub || isInternal || isComingSoon || isLiveComingSoon) {
    return <main className="min-h-screen min-w-0">{children}</main>;
  }

  return (
    <>
      <CmsHeader>
        <Header />
      </CmsHeader>
      <CmsHeaderBrand>
        <HeaderBrandSection />
      </CmsHeaderBrand>
      <main className="min-w-0">{children}</main>
      <CmsFooter>
        <Footer />
      </CmsFooter>
    </>
  );
}
