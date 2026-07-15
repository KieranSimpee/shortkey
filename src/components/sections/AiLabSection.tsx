"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  siteContent,
  type InfluencerHostTab,
  type InfluencerHostTabId,
  type InfluencerLiveHost,
} from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { SectionShortcutBar } from "@/components/ui/SectionShortcutBar";
import { ShortcutChip } from "@/components/ui/KeyCap";
import { cn } from "@/lib/utils";

type Props = { embedded?: boolean };

function statusStyles(status: "LIVE" | "UP NEXT" | "REPLAY") {
  if (status === "LIVE") {
    return "bg-[#e11d48] text-white";
  }
  if (status === "UP NEXT") {
    return "bg-ink text-white";
  }
  return "border border-brand/25 bg-brand/10 text-brand";
}

function InfluencerHostCard({
  host,
  tabs,
}: {
  host: InfluencerLiveHost;
  tabs: InfluencerHostTab[];
}) {
  const [activeTab, setActiveTab] = useState<InfluencerHostTabId>("intro");

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-white/50 bg-white/30">
      <div className="flex items-center justify-between gap-2 border-b border-white/40 px-3 py-2">
        <div className="min-w-0">
          <h3 className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
            {host.name}
          </h3>
          <p className="truncate text-[10px] font-medium text-ink-muted">{host.handle}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]",
            statusStyles(host.status),
          )}
        >
          {host.status === "LIVE" ? (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          ) : null}
          {host.status}
        </span>
      </div>

      <div
        role="tablist"
        aria-label={`${host.name} sections`}
        className="flex min-w-0 items-end gap-0.5 overflow-x-auto px-2 pt-2 sm:gap-1 sm:px-3"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={`${host.id}-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "folder-tab group relative shrink-0 px-2.5 py-1 text-center leading-tight transition-all sm:px-3 sm:py-1.5",
                isActive ? "folder-tab-active z-10" : "folder-tab-inactive z-0",
              )}
            >
              <span
                className={cn(
                  "block text-[9px] font-semibold uppercase tracking-[0.06em] sm:text-[10px]",
                  isActive ? "text-brand" : "text-ink/70 group-hover:text-ink",
                )}
              >
                {tab.shortcut}
              </span>
              <span
                className={cn(
                  "block text-[9px] leading-tight sm:text-[10px]",
                  isActive ? "text-brand/80" : "text-ink-muted",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="folder-panel -mt-px rounded-b-xl border border-white/60 border-t-0 px-2.5 py-2.5 sm:px-3 sm:py-3">
        {activeTab === "intro" ? <IntroPanel host={host} /> : null}
        {activeTab === "shop" ? <ShopPanel host={host} /> : null}
        {activeTab === "live" ? <LivePanel host={host} /> : null}
        {activeTab === "photo" ? <PhotoPanel host={host} /> : null}
      </div>
    </article>
  );
}

function IntroPanel({ host }: { host: InfluencerLiveHost }) {
  return (
    <div className="grid grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-2.5 sm:gap-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/50 bg-white/40">
        <Image
          src={host.image}
          alt={host.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 40vw, 20vw"
        />
      </div>
      <div className="flex flex-col justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-brand/20 bg-brand/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-brand">
              {host.region}
            </span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              {host.viewers}
            </span>
          </div>
          <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.1em] text-brand/80">
            {host.activity}
          </p>
          <p className="mt-1 text-[10px] font-medium leading-snug text-ink-muted">{host.tagline}</p>
          <p className="mt-2 text-[10px] leading-relaxed text-ink/80">{host.bio}</p>
        </div>
        <div>
          <ul className="flex flex-wrap gap-1.5">
            {host.brands.map((brand) => (
              <li
                key={`${host.id}-intro-${brand.name}`}
                className="rounded-full border border-white/60 bg-white/70 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-ink"
              >
                {brand.name}
              </li>
            ))}
          </ul>
          <Link
            href={host.shopHref}
            className="mt-2 inline-flex text-[9px] font-semibold uppercase tracking-[0.1em] text-brand transition hover:text-brand/80"
          >
            {host.shopLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ShopPanel({ host }: { host: InfluencerLiveHost }) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand/80">
          {host.name} shop
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {host.brands.map((brand) => (
            <li
              key={`${host.id}-shop-${brand.name}`}
              className="flex items-center gap-1 rounded-md border border-white/60 bg-white/70 px-1.5 py-0.5"
            >
              <span className="relative h-4 w-4 overflow-hidden rounded-sm bg-white">
                <Image src={brand.logo} alt="" fill className="object-cover" sizes="16px" />
              </span>
              <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-ink">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {host.shopProducts.map((product) => (
          <Link
            key={`${host.id}-${product.sku}`}
            href={product.href}
            className="group min-w-0 overflow-hidden rounded-lg border border-white/50 bg-white/55 transition-shadow hover:shadow-soft"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 30vw, 12vw"
              />
            </div>
            <div className="border-t border-white/40 px-1.5 py-1">
              <p className="truncate font-mono text-[7px] uppercase tracking-wider text-brand/70">
                {product.sku}
              </p>
              <h4 className="type-nav-label truncate text-[9px] text-ink">{product.name}</h4>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href={host.shopHref}
        className="inline-flex rounded-full border border-ink/15 bg-white/70 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-ink transition hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
      >
        Shop look
      </Link>
    </div>
  );
}

function LivePanel({ host }: { host: InfluencerLiveHost }) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]",
            statusStyles(host.status),
          )}
        >
          {host.status}
        </span>
        <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
          {host.viewers}
        </span>
      </div>
      <p className="text-[10px] font-medium text-ink-muted">{host.activity}</p>
      <ul className="space-y-1.5">
        {host.liveClips.map((clip) => (
          <li key={`${host.id}-${clip.title}`}>
            <Link
              href={clip.href}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/50 bg-white/50 px-2.5 py-2 transition hover:bg-white/70"
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-ink">{clip.title}</p>
                <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                  {clip.meta}
                </p>
              </div>
              <ShortcutChip shortcut="PLAY" className="text-[7px]" />
            </Link>
          </li>
        ))}
      </ul>
      <Link
                    href="/try-on"
                    className="inline-flex rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-brand transition hover:bg-brand/20"
                  >
                    Screenshot look
                  </Link>
    </div>
  );
}

function PhotoPanel({ host }: { host: InfluencerLiveHost }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand/80">
        Photo · blog · fans
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {host.photos.map((src, index) => (
          <div
            key={`${host.id}-photo-${index}`}
            className="relative aspect-square overflow-hidden rounded-md border border-white/50 bg-white/40"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        ))}
      </div>
      <ul className="space-y-1.5">
        {host.blogPosts.map((post) => (
          <li key={`${host.id}-${post.title}`}>
            <Link
              href={post.href}
              className="block rounded-lg border border-white/50 bg-white/50 px-2.5 py-2 transition hover:bg-white/70"
            >
              <p className="text-[10px] font-semibold text-ink">{post.title}</p>
              <p className="mt-0.5 text-[9px] leading-snug text-ink-muted">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Homepage influencer grid — 2 columns × 4 rows, each with Intro / Shop / Live / Photo tabs */
export function AiLabSection({ embedded = false }: Props) {
  const { aiLab } = siteContent;

  const inner = (
    <div className="section-panel rounded-2xl border border-white/60 p-4 sm:p-5 lg:p-6">
      <SectionShortcutBar shortcut="CTRL + I" label={aiLab.poweredBy} />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-xl">
          <span className="type-eyebrow inline-flex w-fit rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1 text-brand">
            {aiLab.badge}
          </span>
          <h2 className="type-section mt-3">{aiLab.title}</h2>
          <p className="mt-2 text-[11px] font-medium leading-relaxed tracking-[0.04em] text-ink-muted sm:text-xs">
            {aiLab.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button href={aiLab.cta.href} size="sm">
            {aiLab.cta.label}
          </Button>
          <Button href={aiLab.secondaryCta.href} size="sm" variant="outline">
            {aiLab.secondaryCta.label}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
        {aiLab.hosts.map((host) => (
          <InfluencerHostCard key={host.id} host={host} tabs={aiLab.hostTabs} />
        ))}
      </div>
    </div>
  );

  if (embedded) return <div id="ai-lab">{inner}</div>;

  return (
    <section id="ai-lab" className="py-16 lg:py-24">
      <div className="px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">{inner}</div>
      </div>
    </section>
  );
}
