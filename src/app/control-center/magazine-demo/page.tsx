import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazine Demo · Nihon Sakura Issue 01 | Shortkey Control",
  description:
    "Control Panel example — Interactive Asian Beauty Magazine demo. GOR_GOR_REVIEW · not live Beauty V1.",
  robots: { index: false, follow: false },
};

/** Staging magazine demo — does not replace Beauty V1 Coming Soon home. */
export default function ControlCenterMagazineDemoPage() {
  return (
    <iframe
      src="/magazine-demo/#/cover"
      title="Magazine Demo · Nihon Sakura Issue 01"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
