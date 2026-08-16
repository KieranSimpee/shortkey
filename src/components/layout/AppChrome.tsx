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
 * - the public magazine cover homepage (`/`) — full-bleed cover owns its own nav (bottom bar); no site header/footer
 * - magazine interior spreads (`/magazine/*`) — same full-bleed magazine chrome
 * - shortkey.live Coming Soon (`/live`) — same rule; no shop leaks on the live host gate.
 * - shortkey.social Creator Early Access (`/social`) — own chrome; no shop leaks.
 * - ShortKey Runway phone frame (`/runway`) — own magazine chrome; no site header/footer.
 * - Direction compare boards (`/compare`) — founder comment boards; own chrome.
 * - SKY ASIA OS MVP (`/sky-asia`) — internal ops; own chrome.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isControlHub = pathname === "/control" || pathname.startsWith("/control/");
  const isShowcase = pathname === "/showcase" || pathname.startsWith("/showcase/");
  const isInternal = pathname === "/internal" || pathname.startsWith("/internal/");
  const isMagazineHome = pathname === "/";
  const isMagazineSpread = pathname === "/magazine" || pathname.startsWith("/magazine/");
  const isLiveComingSoon = pathname === "/live" || pathname.startsWith("/live/");
  const isSocialEarlyAccess = pathname === "/social" || pathname.startsWith("/social/");
  const isRunwayFrame = pathname === "/runway" || pathname.startsWith("/runway/");
  const isCompareBoard = pathname === "/compare" || pathname.startsWith("/compare/");
  const isSkyAsiaOs = pathname === "/sky-asia" || pathname.startsWith("/sky-asia/");

  if (
    isControlHub ||
    isShowcase ||
    isInternal ||
    isMagazineHome ||
    isMagazineSpread ||
    isLiveComingSoon ||
    isSocialEarlyAccess ||
    isRunwayFrame ||
    isCompareBoard ||
    isSkyAsiaOs
  ) {
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
