import Image from "next/image";
import Link from "next/link";
import { MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Influencers | Shortkey",
  description: "Meet Shortkey creators — intro, shop, live, and photo/blog.",
};

function statusStyles(status: "LIVE" | "UP NEXT" | "REPLAY") {
  if (status === "LIVE") return "bg-[#e11d48] text-white";
  if (status === "UP NEXT") return "bg-ink text-white";
  return "border border-brand/25 bg-brand/10 text-brand";
}

export default function InfluencersIndexPage() {
  const { hosts } = siteContent.aiLab;

  return (
    <MockPageShell
      shortcut="CTRL + I"
      badge="INFLUENCERS"
      title="Meet the influencers"
      description="Eight creators. Open a profile for Intro, Shop, Live, and Photo & Blog."
      ctas={[
        { label: "Watch on homepage →", href: "/#ai-lab", variant: "outline" },
        { label: "Shop →", href: "/shop" },
      ]}
    >
      <MockNote>Same 8 hosts as homepage grid — this is the standalone index mock.</MockNote>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {hosts.map((host) => (
          <Link
            key={host.id}
            href={`/influencers/${host.id}`}
            className="group overflow-hidden rounded-xl border border-white/50 bg-white/45 transition hover:shadow-soft"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={host.image}
                alt={host.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 45vw, 20vw"
              />
              <span
                className={cn(
                  "absolute left-2 top-2 inline-flex rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]",
                  statusStyles(host.status),
                )}
              >
                {host.status}
              </span>
            </div>
            <div className="border-t border-white/40 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand/80">
                {host.region}
              </p>
              <h2 className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink">
                {host.name}
              </h2>
              <p className="text-[10px] text-ink-muted">{host.handle}</p>
            </div>
          </Link>
        ))}
      </div>
    </MockPageShell>
  );
}
