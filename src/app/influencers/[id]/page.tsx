import { notFound } from "next/navigation";
import { MockPageShell } from "@/components/mock/MockPageShell";
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
      description={`${host.handle} · ${host.activity}. Mock creator landing with Intro / Shop / Live / Photo tabs.`}
      ctas={[
        { label: "Shop look →", href: "/shop" },
        { label: "All influencers →", href: "/influencers", variant: "outline" },
        { label: "Homepage card →", href: "/#ai-lab", variant: "outline" },
      ]}
    >
      <InfluencerProfileClient host={host} tabs={siteContent.aiLab.hostTabs} />
    </MockPageShell>
  );
}
