import type { Metadata } from "next";
import { LiveComingSoonHome } from "@/components/design/LiveComingSoonHome";

export const metadata: Metadata = {
  title: "ShortKey Live — Coming Soon",
  description:
    "shortkey.live — Live streaming hub, calendar, and creator go-live. Coming soon.",
  alternates: {
    canonical: "https://shortkey.live",
  },
};

/**
 * Public shortkey.live gate (also previewable at /live on beauty / localhost).
 * Full Rebuild HTML: /control/live.html — family / control only.
 */
export default function LiveComingSoonPage() {
  return <LiveComingSoonHome />;
}
