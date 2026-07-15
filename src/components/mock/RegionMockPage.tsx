import Image from "next/image";
import Link from "next/link";
import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { mockRegionPages } from "@/content/mockPages";
import { siteContent } from "@/content/homepage";

type RegionId = (typeof mockRegionPages)[number]["id"];

export function RegionMockPage({ regionId }: { regionId: RegionId }) {
  const region = mockRegionPages.find((r) => r.id === regionId)!;
  const hosts = siteContent.aiLab.hosts.filter((h) => h.region === region.region);

  return (
    <MockPageShell
      shortcut="CTRL + R"
      badge={region.title.toUpperCase()}
      title={region.title}
      description={region.description}
      ctas={[
        { label: "Shop →", href: "/shop" },
        { label: "Influencers →", href: "/influencers", variant: "outline" },
        { label: "Try on →", href: "/try-on", variant: "outline" },
      ]}
    >
      <MockNote>
        Region mock filters homepage creators by {region.region}. Product rails can be region-tagged later.
      </MockNote>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hosts.map((host) => (
          <Link
            key={host.id}
            href={`/influencers/${host.id}`}
            className="overflow-hidden rounded-xl border border-white/50 bg-white/45"
          >
            <div className="relative aspect-[4/3]">
              <Image src={host.image} alt={host.name} fill className="object-cover" sizes="30vw" />
            </div>
            <div className="px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
                {host.name}
              </p>
              <p className="text-[10px] text-ink-muted">{host.tagline}</p>
            </div>
          </Link>
        ))}
      </div>

      {!hosts.length ? (
        <div className="mt-6">
          <MockBlock title="No creators yet" body="Add hosts with this region tag in homepage content." />
        </div>
      ) : null}
    </MockPageShell>
  );
}
