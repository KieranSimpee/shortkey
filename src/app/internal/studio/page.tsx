import type { Metadata } from "next";
import { StudioShell } from "@/components/internal/studio/StudioShell";

export const metadata: Metadata = {
  title: "ShortKey Studio v0.1 | Internal Control Center",
  description:
    "INTERNAL STAGING ONLY — ShortKey Studio v0.1 control center. Source of truth for Brand DNA, domains, assets, campaigns, deployment plan records, and version history. Not production ready. No publish.",
  robots: { index: false, follow: false },
  other: {
    googlebot: "noindex, nofollow",
  },
};

/**
 * shortkey.studio — Studio v0.1 internal control center.
 * Local: npm run studio:dev → :3003
 * Predecessor: Studio P0 DNA Control Room (content folded into Brand DNA Center).
 * Doc: src/brand/sky/SHORTKEY_STUDIO_v0_1.md
 */
export default function StudioPage() {
  return <StudioShell />;
}
