import Link from "next/link";
import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { siteContent } from "@/content/homepage";

export const metadata = {
  title: "Videos | Shortkey",
  description: "Tutorial and live video library for Asian beauty.",
};

export default function VideosPage() {
  const clips = siteContent.aiLab.hosts.flatMap((host) =>
    host.liveClips.map((clip) => ({
      ...clip,
      hostName: host.name,
      hostId: host.id,
      region: host.region,
    })),
  );

  return (
    <MockPageShell
      shortcut="CTRL + V"
      badge="VIDEOS"
      title="Tutorials & live library"
      description="Aggregated creator lives, replays, and clips. External YouTube makeover search stays available."
      ctas={[
        {
          label: "Korean / Asian tutorials on YouTube →",
          href: "https://www.youtube.com/results?search_query=korean+asian+makeup+tutorial",
        },
        { label: "Makeover landing →", href: "/makeover", variant: "outline" },
      ]}
    >
      <MockNote>Embeds are mocked as cards — swap for players later.</MockNote>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", "LIVE", "Replay", "Clip", "K-Beauty", "J-Beauty", "C-Beauty"].map((tab) => (
          <span
            key={tab}
            className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted"
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((clip) => (
          <div
            key={`${clip.hostId}-${clip.title}`}
            className="rounded-xl border border-white/50 bg-white/45 p-4"
          >
            <div className="flex aspect-video items-center justify-center rounded-lg border border-white/50 bg-ink/10 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Video placeholder
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand/80">
              {clip.meta} · {clip.region}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-ink">{clip.title}</h2>
            <Link
              href={`/influencers/${clip.hostId}`}
              className="mt-2 inline-flex text-[11px] font-semibold text-brand hover:text-brand/80"
            >
              {clip.hostName} →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <MockBlock
          title="Also open Makeover"
          body="Command card Makeover can land here or on /makeover with YouTube deep links."
        />
      </div>
    </MockPageShell>
  );
}
