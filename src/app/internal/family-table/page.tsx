import type { Metadata } from "next";
import { FamilyTableWorkbench } from "@/components/internal/FamilyTableWorkbench";

export const metadata: Metadata = {
  title: "Family Table v0.8 | family.shortkey.world (Internal Staging)",
  description:
    "INTERNAL STAGING ONLY — family home · One Room Per Family Member · localStorage house. Not public world launch · Gor Gor Review pending.",
  robots: { index: false, follow: false },
  other: {
    googlebot: "noindex, nofollow",
  },
};

/**
 * Internal Family Table v0.8 — One Room Per Family Member (house architecture).
 * Preferred host: family.shortkey.world (also shortkey.studio).
 * NOT linked from public nav/footer or Coming Soon `/`.
 * Doc: src/brand/sky/FAMILY_TABLE_v0_8.md
 */
export default function FamilyTablePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-silk via-silk to-silk-dark/40 text-ink">
      <FamilyTableWorkbench />
    </div>
  );
}
