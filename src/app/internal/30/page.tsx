import type { Metadata } from "next";
import { ThirtyApp } from "@/components/internal/thirty/ThirtyApp";

export const metadata: Metadata = {
  title: "30 · Founder app | ShortKey :3003",
  description:
    "INTERNAL — Kieran trainer app on Studio :3003. Sky / Maya names unchanged. kSky / May / 30 are desks. Not Coming Soon.",
  robots: { index: false, follow: false },
  other: {
    googlebot: "noindex, nofollow",
  },
};

/** Founder remote. Local: npm run studio:dev → http://127.0.0.1:3003/internal/30 */
export default function ThirtyPage() {
  return <ThirtyApp />;
}
