import type { Metadata, Viewport } from "next";
import { MobilePortal } from "@/components/portal/MobilePortal";

export const metadata: Metadata = {
  title: "ShortKey — Mobile Portal",
  description:
    "Thirty-second ShortKey soul demo. Brand Story, Creator Hub, and AI Soul Lab. Staging. Not the public Coming Soon homepage.",
  robots: { index: false, follow: false },
  manifest: "/portal/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ShortKey",
    statusBarStyle: "default",
  },
  other: {
    googlebot: "noindex, nofollow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#8C82FC",
};

/**
 * Mobile-first PWA demo — /portal
 * Local: npm run dev → http://localhost:3001/portal
 * Does not replace Coming Soon on /
 */
export default function PortalPage() {
  return <MobilePortal />;
}
