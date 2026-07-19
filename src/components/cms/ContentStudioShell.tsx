"use client";

import { usePathname } from "next/navigation";
import { ContentStudioProvider } from "@/components/cms/ContentStudioProvider";
import { ContentStudioAutoScan } from "@/components/cms/ContentStudioAutoScan";
import { ContentStudioPanel } from "@/components/cms/ContentStudioPanel";

export function ContentStudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isControlHub = pathname === "/control" || pathname.startsWith("/control/");

  return (
    <ContentStudioProvider>
      {children}
      {!isControlHub ? (
        <>
          <ContentStudioAutoScan />
          <ContentStudioPanel />
        </>
      ) : null}
    </ContentStudioProvider>
  );
}
