import type { Metadata } from "next";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";

/** All /internal/* surfaces — noindex, nofollow (family home / staging only). */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
      <p className="px-4 py-6 text-center text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
    </div>
  );
}
