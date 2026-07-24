import type { Metadata } from "next";
import { DnaControlRoom } from "@/components/internal/DnaControlRoom";

export const metadata: Metadata = {
  title: "DNA Control Room | shortkey.studio (Internal)",
  description:
    "INTERNAL STAGING ONLY — One DNA. Many doors. Lock brand DNA, domain purpose, approved copy, and build order before pushing domains outward. Not production ready.",
  robots: { index: false, follow: false },
  other: {
    googlebot: "noindex, nofollow",
  },
};

/**
 * shortkey.studio P0 — DNA Control Room.
 * Local: npm run studio:dev → :3003
 * Host: shortkey.studio → this route (not Family Table).
 * Doc: src/brand/sky/SHORTKEY_STUDIO_P0_DNA_CONTROL.md
 */
export default function StudioDnaControlPage() {
  return <DnaControlRoom />;
}
