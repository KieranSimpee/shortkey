import type { Metadata } from "next";
import { HomeDesignPreview } from "@/components/design/HomeDesignPreview";

export const metadata: Metadata = {
  title: "Homepage Design Preview | Shortkey",
  description: "Full homepage design reference — internal only, not the public Coming Soon gate.",
  robots: { index: false, follow: false },
};

/**
 * Internal-only full homepage design reference.
 * The public `/` route is the Coming Soon gate (see src/app/page.tsx) —
 * this route keeps the full HomeDesignPreview reachable for review without
 * exposing Product Grid / Store / pricing / Creator Twin mechanics publicly.
 */
export default function DesignPreviewPage() {
  return <HomeDesignPreview preview />;
}
