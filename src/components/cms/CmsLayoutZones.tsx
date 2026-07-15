"use client";

import { CmsZone } from "@/components/cms/CmsZone";

export function CmsHeader({ children }: { children: React.ReactNode }) {
  return <CmsZone id="header">{children}</CmsZone>;
}

export function CmsHeaderBrand({ children }: { children: React.ReactNode }) {
  return <CmsZone id="header-brand">{children}</CmsZone>;
}

export function CmsFooter({ children }: { children: React.ReactNode }) {
  return <CmsZone id="footer">{children}</CmsZone>;
}
