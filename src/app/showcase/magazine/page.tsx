import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazine Showcase · Nihon Sakura Issue 01 | ShortKey",
  description:
    "Public magazine flipper showcase — Control Panel example. GOR_GOR_REVIEW · not live Beauty V1.",
  robots: { index: false, follow: false },
};

/** Full-bleed magazine demo — mirrors /control iframe pattern. */
export default function ShowcaseMagazinePage() {
  return (
    <iframe
      src="/magazine-demo/#/cover"
      title="Magazine Showcase · Nihon Sakura Issue 01"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
