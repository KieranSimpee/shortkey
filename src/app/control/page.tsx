import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder Controller · Key first | Shortkey",
  description:
    "INTERNAL Founder Controller — Kieran + Key first. Soft PIN. Not a public product.",
  robots: { index: false, follow: false },
};

/** Key-first Founder Controller on the server. Full hub stays at /control/hub.html. */
export default function ControlPage() {
  return (
    <iframe
      src="/control/controller.html"
      title="ShortKey Founder Controller · Key first"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
