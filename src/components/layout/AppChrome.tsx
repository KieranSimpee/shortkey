"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { HeaderBrandSection } from "@/components/layout/HeaderBrandSection";
import { Footer } from "@/components/layout/Footer";
import { CmsHeader, CmsHeaderBrand, CmsFooter } from "@/components/cms/CmsLayoutZones";

/** Marketing chrome is skipped for the all-in-one Master Control hub. */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isControlHub = pathname === "/control" || pathname.startsWith("/control/");

  if (isControlHub) {
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
