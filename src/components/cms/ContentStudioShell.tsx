"use client";

import { usePathname } from "next/navigation";
import { ContentStudioProvider } from "@/components/cms/ContentStudioProvider";
import { ContentStudioAutoScan } from "@/components/cms/ContentStudioAutoScan";
import { ContentStudioPanel } from "@/components/cms/ContentStudioPanel";

export function ContentStudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isControlHub = pathname === "/control" || pathname.startsWith("/control/");
  const isInternal = pathname === "/internal" || pathname.startsWith("/internal/");
  /** Public Coming Soon gate must ship with zero admin/debug surfaces (blueprint § Hide from public). */
  const isComingSoon = pathname === "/";
  const hideStudioTooling = isControlHub || isInternal || isComingSoon;

  return (
    <ContentStudioProvider>
      {children}
      {!hideStudioTooling ? (
        <>
          <ContentStudioAutoScan />
          <ContentStudioPanel />
        </>
      ) : null}
    </ContentStudioProvider>
  );
}
