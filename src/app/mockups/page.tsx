import Link from "next/link";
import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { allMockRoutes } from "@/content/mockPages";

export const metadata = {
  title: "Mockup Index | Shortkey",
  description: "Review all mock landing pages before wiring production content.",
};

export default function MockupsIndexPage() {
  return (
    <MockPageShell
      shortcut="CTRL + /"
      title="All mockup pages"
      badge="REVIEW INDEX"
      description="Open each page, note changes, and we’ll update copy, layout, or links."
      ctas={[{ label: "Back to homepage →", href: "/", variant: "outline" }]}
    >
      <MockNote>
        These are review mocks — navigation chrome (header/footer) is real; page bodies are
        stand-ins until you approve.
      </MockNote>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allMockRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="rounded-xl border border-white/50 bg-white/45 px-4 py-3 transition hover:border-brand/30 hover:bg-white/70"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand/80">
              {route.href}
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{route.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <MockBlock
          title="Still on homepage anchors"
          body="#try-on, #commands, #ai-lab, #brands remain on /. New routes duplicate key destinations for standalone review."
        />
      </div>
    </MockPageShell>
  );
}
