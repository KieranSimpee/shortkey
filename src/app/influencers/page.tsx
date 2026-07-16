import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Creators | Shortkey",
  description: "Meet Shortkey creators — K, J, and C beauty influencers with their own live shops.",
};

function statusStyles(status: "LIVE" | "UP NEXT" | "REPLAY") {
  if (status === "LIVE") return "bg-[#e11d48] text-white";
  if (status === "UP NEXT") return "bg-[#F4F4F4] text-[#0A0A0A]";
  return "border border-[#2B2B2B] text-[#9A9A9A]";
}

export default function InfluencersIndexPage() {
  const { hosts } = siteContent.aiLab;

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">CTRL + I</p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">Creators</h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">
          {hosts.length} creators. K-Beauty, J-Beauty, C-Beauty specialists. Each with their own live shop.
        </p>
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hosts.map((host) => (
          <Link
            key={host.id}
            href={`/influencers/${host.id}`}
            className="group overflow-hidden rounded-xl border border-[#2B2B2B] bg-[#111] hover:border-[#6E6E6E] transition"
          >
            <div className="relative aspect-[3/4] bg-[#1A1A1A]">
              <Image src={host.image} alt={host.name} fill className="object-cover" />
              <div className="absolute left-3 top-3">
                <span className={cn("rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider", statusStyles(host.status))}>
                  {host.status}
                </span>
              </div>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm font-bold text-[#F4F4F4]">{host.name}</p>
              <p className="mt-0.5 text-[10px] text-[#9A9A9A]">{host.handle}</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#6E6E6E]">{host.region}</p>
              <p className="mt-2 text-xs text-[#9A9A9A] line-clamp-2">{host.tagline}</p>
              <p className="mt-2 font-mono text-[9px] text-[#6E6E6E]">{host.viewers} viewers</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Become a Creator CTA */}
      <div className="mt-10 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-6 text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Become a Creator</p>
        <p className="mb-4 text-sm text-[#9A9A9A]">
          K / J / C beauty creators — apply to get your own Shortkey live shop and earn commission on every product your audience buys.
        </p>
        <a href="mailto:creators@shortkey.beauty" className="inline-block rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
          Apply Now
        </a>
      </div>
    </main>
  );
}
