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
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">CTRL + V</p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">Videos</h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">Tutorials, replays, and creator lives. Asian beauty in action.</p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button key={tab} className="rounded-full border border-[#2B2B2B] bg-[#111] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#6E6E6E] hover:text-[#F4F4F4] transition">
            {tab}
          </button>
        ))}
      </div>

      {/* Clip Grid */}
      {clips.length > 0 && (
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((clip, i) => (
            <a key={`${clip.hostId}-${i}`} href={clip.href} className="group rounded-xl border border-[#2B2B2B] bg-[#111] overflow-hidden hover:border-[#6E6E6E] transition">
              <div className="flex aspect-video items-center justify-center bg-[#1A1A1A]">
                <span className="text-[#6E6E6E] text-xs">▶</span>
              </div>
              <div className="px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6E6E6E]">{clip.hostName} · {clip.region}</p>
                <p className="mt-1 text-xs font-semibold text-[#F4F4F4] line-clamp-2">{clip.title}</p>
                <p className="mt-0.5 text-[9px] text-[#6E6E6E]">{clip.meta}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* External CTA */}
      <div className="rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">External Tutorial Library</p>
        <div className="flex flex-wrap gap-3">
          <a href="https://www.youtube.com/results?search_query=korean+asian+makeup+tutorial" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            Korean tutorials → YouTube
          </a>
          <a href="https://www.youtube.com/results?search_query=chinese+beauty+makeup" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            C-Beauty → YouTube
          </a>
          <a href="https://www.youtube.com/results?search_query=japanese+beauty+routine" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            J-Beauty routines → YouTube
          </a>
          <Link href="/makeover" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            Makeover page
          </Link>
        </div>
      </div>
    </main>
  );
}
