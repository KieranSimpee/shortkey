import type { Metadata } from "next";
import { LiveComingSoonHome } from "@/components/design/LiveComingSoonHome";

export const metadata: Metadata = {
  title: "ShortKey Live — Asian Beauty Live Commerce",
  description:
    "shortkey.live — Where Asian beauty comes alive. AI try-on, live streaming, VIP experiences with top K-Beauty, J-Beauty, and T-Beauty influencers.",
  alternates: {
    canonical: "https://shortkey.live",
  },
};

/**
 * Public shortkey.live — Asian Beauty Live Commerce Platform.
 * TINT AI Try-On · VIP Polaroid System · Live Schedule · Influencer Hub.
 */
export default function LivePage() {
  return <LiveComingSoonHome />;
}