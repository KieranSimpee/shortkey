import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Control Panel | Shortkey",
  description:
    "All-in-one ShortKey OS control — Studio v2, shortkey.live, Visual Blueprint, Homepage Execution, bridges, and Base44 agent briefs.",
  robots: { index: false, follow: false },
};

/** Full-bleed Studio v2 hub with Live, Blueprint, Execution, bridges, and agents. */
export default function ControlPage() {
  return (
    <iframe
      src="/control/hub.html"
      title="Shortkey Master Control Panel"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
