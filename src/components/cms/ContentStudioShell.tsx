"use client";

import { ContentStudioProvider } from "@/components/cms/ContentStudioProvider";
import { ContentStudioAutoScan } from "@/components/cms/ContentStudioAutoScan";
import { ContentStudioPanel } from "@/components/cms/ContentStudioPanel";

export function ContentStudioShell({ children }: { children: React.ReactNode }) {
  return (
    <ContentStudioProvider>
      {children}
      <ContentStudioAutoScan />
      <ContentStudioPanel />
    </ContentStudioProvider>
  );
}
