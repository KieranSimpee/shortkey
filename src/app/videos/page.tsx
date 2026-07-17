import Link from "next/link";
import { siteContent } from "@/content/homepage";

export const metadata = { title: "Videos | Shortkey" };

const TABS = ["All", "LIVE", "Replay", "Clip", "K-Beauty", "J-Beauty", "C-Beauty"];

export default function VideosPage() {
  const clips = siteContent.aiLab.hosts.flatMap((host) =>
    host.liveClips.map((clip) => ({
      ...clip,
      hostName: host.name,
      hostId: host.id,
      region: host.region,
    }))
  );

  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-white/50 pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">CTRL + V</p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-ink">Videos</h1>
        <p className="mt-2 text-sm text-ink-muted">Tutorials, replays, and creator lives. Asian beauty in action.</p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button key={tab} className="rounded-full border border-white/50 bg-white/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted hover:border-brand/25 hover:shadow-soft hover:text-ink transition">
            {tab}
          </button>
        ))}
      </div>

      {/* Clip Grid */}
      {clips.length > 0 && (
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((clip, i) => (
            <a key={`${clip.hostId}-${i}`} href={clip.href} className="group rounded-xl border border-white/50 bg-white/45 overflow-hidden hover:border-brand/25 hover:shadow-soft transition">
              <div className="flex aspect-video items-center justify-center bg-white/40">
                <span className="text-ink-subtle text-xs">▶</span>
              </div>
              <div className="px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-subtle">{clip.hostName} · {clip.region}</p>
                <p className="mt-1 text-xs font-semibold text-ink line-clamp-2">{clip.title}</p>
                <p className="mt-0.5 text-[9px] text-ink-subtle">{clip.meta}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* External CTA */}
      <div className="rounded-xl border border-white/50 bg-white/45 px-6 py-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-ink-subtle">External Tutorial Library</p>
        <div className="flex flex-wrap gap-3">
          <a href="https://www.youtube.com/results?search_query=korean+asian+makeup+tutorial" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/50 px-4 py-2 text-xs text-ink-muted hover:text-ink hover:border-brand/25 hover:shadow-soft transition">
            Korean tutorials → YouTube
          </a>
          <a href="https://www.youtube.com/results?search_query=chinese+beauty+makeup" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/50 px-4 py-2 text-xs text-ink-muted hover:text-ink hover:border-brand/25 hover:shadow-soft transition">
            C-Beauty → YouTube
          </a>
          <a href="https://www.youtube.com/results?search_query=japanese+beauty+routine" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/50 px-4 py-2 text-xs text-ink-muted hover:text-ink hover:border-brand/25 hover:shadow-soft transition">
            J-Beauty routines → YouTube
          </a>
          <Link href="/makeover" className="rounded-full border border-white/50 px-4 py-2 text-xs text-ink-muted hover:text-ink hover:border-brand/25 hover:shadow-soft transition">
            Makeover page
          </Link>
        </div>
      </div>
    </main>
  );
}
