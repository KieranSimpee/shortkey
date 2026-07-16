import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfluencerProfileClient } from "@/components/influencers/InfluencerProfileClient";
import { siteContent } from "@/content/homepage";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return siteContent.aiLab.hosts.map((host) => ({ id: host.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const host = siteContent.aiLab.hosts.find((h) => h.id === id);
  return {
    title: host ? `${host.name} | Shortkey` : "Creator | Shortkey",
    description: host ? `${host.handle} · ${host.tagline}` : "Creator profile on Shortkey.",
  };
}

export default async function InfluencerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const host = siteContent.aiLab.hosts.find((h) => h.id === id);
  if (!host) notFound();

  const tabs = siteContent.aiLab.hostTabs;

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="relative h-64 w-full bg-[#1A1A1A] sm:h-80">
        <Image src={host.image} alt={host.name} fill className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent" />
        <div className="absolute bottom-6 left-4 sm:left-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6E6E6E]">{host.region}</p>
          <h1 className="text-2xl font-bold text-[#F4F4F4]">{host.name}</h1>
          <p className="text-sm text-[#9A9A9A]">{host.handle}</p>
        </div>
      </div>

      {/* Profile tabs (client) */}
      <div className="px-4 sm:px-8">
        <InfluencerProfileClient host={host} tabs={tabs} />
      </div>

      {/* Back */}
      <div className="px-4 pb-12 sm:px-8">
        <Link href="/influencers" className="text-xs text-[#6E6E6E] hover:text-[#9A9A9A] transition">
          ← All Creators
        </Link>
      </div>
    </main>
  );
}
