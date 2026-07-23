import type { Metadata } from "next";
import { FamilyTableWorkbench } from "@/components/internal/FamilyTableWorkbench";

export const metadata: Metadata = {
  title: "Family Table v0.7 | Shortkey Studio (Internal)",
  description:
    "Kieran Vision + Brand Data Vault — writable Family Table concept scaffold. Internal only · local persistence · Gor Gor Review required.",
  robots: { index: false, follow: false },
};

/**
 * Internal Family Table v0.7 — Kieran Vision + Brand Data Vault.
 * NOT linked from public nav/footer or Coming Soon `/`.
 * Doc: src/brand/sky/FAMILY_TABLE_v0_7_VISION.md
 */
export default function FamilyTablePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-silk via-silk to-silk-dark/40 text-ink">
      <FamilyTableWorkbench />
    </div>
  );
}
