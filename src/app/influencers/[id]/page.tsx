import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { InfluencerProfileClient } from "@/components/influencers/InfluencerProfileClient";
import { siteContent } from "@/content/homepage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return siteContent.aiLab.hosts.map((host) => ({ id: host.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const host = siteContent.aiLab.hosts.find((h) => h.id === id);
  return {
    title: host ? `${host.name} | Shortkey` : "Influencer | Shortkey",
    description: host ? `${host.handle} · ${host.tagline}` : "Creator profile on Shortkey.",
  };
}

export default async function InfluencerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const host = siteContent.aiLab.hosts.find((h) => h.id === id);
  if (!host) notFound();

  return (
    <MockPageShell
      shortcut="CTRL + I"
      badge={host.region}
      title={host.name}
      description={`${host.handle} · ${host.tagline}`}
      ctas={[
        { label: "Shop look →", href: "/shop" },
        { label: "All influencers →", href: "/influencers", variant: "outline" },
      ]}
    >
      <MockNote>Creator profile mock — Intro / Shop / Live / Photo tabs are wired from homepage content.</MockNote>

      {/* Creator hero strip */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-white/50 bg-white/40 px-4 py-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-brand/25">
          <Image src={host.image} alt={host.name} fill className="object-cover" sizes="64px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-ink">{host.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
              host.status === "LIVE" ? "bg-[#e11d48] text-white" :
              host.status === "UP NEXT" ? "bg-ink text-white" :
              "border border-brand/25 bg-brand/10 text-brand"
            }`}>
              {host.status}
            </span>
          </div>
          <p className="text-[11px] font-medium text-brand">{host.handle}</p>
          <p className="text-[11px] text-ink-muted">{host.activity} · {host.viewers} watching</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand/70">{host.region}</p>
          <p className="mt-0.5 text-[11px] text-ink-muted">{host.bio}</p>
        </div>
      </div>

      {/* Tabs: wired via InfluencerProfileClient */}
      <InfluencerProfileClient host={host} tabs={siteContent.aiLab.hostTabs} />

      {/* Brand affiliations */}
      {host.brands.length > 0 && (
        <div className="mt-6">
          <MockBlock title="Brand affiliations (mock)">
            <div className="mt-3 flex flex-wrap gap-2">
              {host.brands.map((brand) => (
                <span
                  key={brand.name}
                  className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-[11px] font-semibold text-ink-muted"
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </MockBlock>
        </div>
      )}

      {/* Blog posts */}
      {host.blogPosts.length > 0 && (
        <div className="mt-4">
          <MockBlock title="Latest from the blog">
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {host.blogPosts.map((post) => (
                <Link
                  key={post.title}
                  href={post.href}
                  className="rounded-lg border border-white/50 bg-white/40 px-3 py-3 transition hover:border-brand/20"
                >
                  <p className="text-[12px] font-semibold text-ink">{post.title}</p>
                  <p className="mt-1 text-[11px] text-ink-muted">{post.excerpt}</p>
                  <p className="mt-2 text-[10px] font-semibold text-brand">Read →</p>
                </Link>
              ))}
            </div>
          </MockBlock>
        </div>
      )}
    </MockPageShell>
  );
}
