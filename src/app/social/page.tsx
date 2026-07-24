import type { Metadata } from "next";
import { CreatorEarlyAccessPortal } from "@/components/social/CreatorEarlyAccessPortal";

export const metadata: Metadata = {
  title: "ShortKey Social — Creator Early Access",
  description:
    "shortkey.social — Creator Early Access staging preview. Register interest. Not production ready. Registration does not guarantee selection, paid campaigns, income, or sales results.",
  robots: { index: false, follow: false },
  other: {
    googlebot: "noindex, nofollow",
  },
};

/**
 * shortkey.social — Creator Early Access (staging / Gor Gor Review).
 * Local: npm run social:dev → :3004
 * Doc: src/brand/sky/SHORTKEY_SOCIAL_CREATOR_EARLY_ACCESS_v0_1.md
 */
export default function SocialCreatorEarlyAccessPage() {
  return <CreatorEarlyAccessPortal />;
}
