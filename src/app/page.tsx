import type { Metadata } from "next";
import { ComingSoonHome } from "@/components/design/ComingSoonHome";

export const metadata: Metadata = {
  title: "Shortkey — AI Asian Beauty Platform | Coming Soon",
  description:
    "AI Asian Beauty Platform. Your Style. Your CTRL. Launching August 14 — pre-register now.",
};

/**
 * Public shortkey.beauty root — Coming Soon / Pre-Register gate.
 * Blueprint: SHORTKEY_MASTER_BLUEPRINT_v1.md · FAMILY_SPRINT_SONNET5_LEAD.md
 * Full homepage design (HomeDesignPreview) lives at /design — internal reference only.
 */
export default function HomePage() {
  return <ComingSoonHome />;
}
