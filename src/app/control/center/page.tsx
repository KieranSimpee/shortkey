import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShortKey Runway | Studio Control Console",
  description:
    "Master Operation Desk — channel select, creator seed briefs, agent vibe-gate stream, and live smartphone magazine preview with TINT AR.",
  robots: { index: false, follow: false },
};

/** Full-screen Operational Terminal (control_center.html). */
export default function ControlCenterPage() {
  return (
    <iframe
      src="/control_center.html"
      title="ShortKey Runway Studio Control Console"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
