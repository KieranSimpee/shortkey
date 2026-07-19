"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  type InfluencerHostTab,
  type InfluencerHostTabId,
  type InfluencerLiveHost,
} from "@/content/homepage";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { MockNote } from "@/components/mock/MockPageShell";
import { ShortcutChip } from "@/components/ui/KeyCap";
import { cn } from "@/lib/utils";

function statusStyles(status: "LIVE" | "UP NEXT" | "REPLAY") {
  if (status === "LIVE") return "bg-[#e11d48] text-white";
  if (status === "UP NEXT") return "bg-ink text-white";
  return "border border-brand/25 bg-brand/10 text-brand";
}

export function InfluencerProfileClient({
  host,
  tabs,
}: {
  host: InfluencerLiveHost;
  tabs: InfluencerHostTab[];
}) {
  const [activeTab, setActiveTab] = useState<InfluencerHostTabId>("intro");

  return (
    <div>
      <MockNote>
        Mock profile — tabs mirror homepage cards. Share feedback on layout before wiring CMS.
      </MockNote>

      <div
        role="tablist"
        aria-label={`${host.name} sections`}
        className="mt-6 flex min-w-0 items-end gap-0.5 overflow-x-auto sm:gap-1"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "folder-tab group relative shrink-0 px-3 py-1 text-center leading-tight transition-all sm:px-4 sm:py-1.5",
                isActive ? "folder-tab-active z-10" : "folder-tab-inactive z-0",
              )}
            >
              <span
                className={cn(
                  "block text-[10px] font-semibold uppercase tracking-[0.06em]",
                  isActive ? "text-brand" : "text-ink/70",
                )}
              >
                {tab.shortcut}
              </span>
              <span
                className={cn(
                  "block text-[10px]",
                  isActive ? "text-brand/80" : "text-ink-muted",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="folder-panel -mt-px rounded-b-2xl rounded-tr-2xl border border-white/60 p-4 sm:p-5">
        {activeTab === "intro" ? (
          <div className="grid gap-4 sm:grid-cols-[0.4fr_0.6fr]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/50">
              <Image
                src={host.image}
                alt={host.name}
                fill
                className="object-cover"
                sizes="40vw"
                priority
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]",
                    statusStyles(host.status),
                  )}
                >
                  {host.status}
                </span>
                <span className="rounded-full border border-brand/20 bg-brand/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-brand">
                  {host.region}
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  {host.viewers}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold uppercase tracking-[0.12em] text-ink">
                {host.name}
              </h2>
              <p className="text-sm text-ink-muted">{host.handle}</p>
              <p className="mt-3 text-sm text-ink-muted">{host.tagline}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{host.bio}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {host.brands.map((b) => (
                  <li
                    key={b.name}
                    className="rounded-full border border-white/60 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
                  >
                    {b.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {activeTab === "shop" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {host.shopProducts.map((product) => (
              <div
                key={product.sku}
                className="overflow-hidden rounded-xl border border-white/50 bg-white/50"
              >
                <Link href={`/shop/${product.sku}`} className="block">
                  <div className="relative aspect-square">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="160px" />
                  </div>
                  <div className="border-t border-white/40 px-2 pt-1.5">
                    <p className="font-mono text-[8px] text-brand/70">{product.sku}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink">
                      {product.name}
                    </p>
                  </div>
                </Link>
                <div className="px-2 pb-2 pt-1">
                  <AddToCartButton
                    size="sm"
                    sku={product.sku}
                    name={product.name}
                    image={product.image}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "live" ? (
          <ul className="space-y-2">
            {host.liveClips.map((clip) => (
              <li
                key={clip.title}
                className="flex items-center justify-between rounded-xl border border-white/50 bg-white/50 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{clip.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted">{clip.meta}</p>
                </div>
                <ShortcutChip shortcut="PLAY" className="text-[7px]" />
              </li>
            ))}
          </ul>
        ) : null}

        {activeTab === "photo" ? (
          <div className="space-y-4">
            {host.shortClips && host.shortClips.length > 0 ? (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                  Brand promo · short samples
                </p>
                <p className="mt-1 text-[11px] text-ink-muted">
                  App-length clips (15–45s). Enough to name the brand and open shop.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {host.shortClips.map((clip) => (
                    <article
                      key={clip.id}
                      className="overflow-hidden rounded-xl border border-white/50 bg-white/55"
                    >
                      <div className="relative aspect-[9/16] max-h-[280px] bg-ink/5 sm:aspect-video sm:max-h-none">
                        {clip.videoSrc ? (
                          <video
                            className="h-full w-full object-cover"
                            controls
                            playsInline
                            preload="metadata"
                            poster={clip.poster}
                          >
                            <source src={clip.videoSrc} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            src={clip.poster}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="320px"
                          />
                        )}
                        <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                          {clip.duration}
                        </span>
                      </div>
                      <div className="border-t border-white/40 px-3 py-2.5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-brand">
                          {clip.brandName}
                        </p>
                        <p className="mt-0.5 text-[12px] font-semibold text-ink">{clip.title}</p>
                        <p className="text-[10px] text-ink-muted">{clip.productName}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Link
                            href={clip.productHref}
                            className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand hover:text-brand-dark"
                          >
                            Shop brand SKU →
                          </Link>
                          <AddToCartButton
                            size="sm"
                            sku={clip.productSku}
                            name={clip.productName}
                            image={clip.poster}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-4 gap-2">
              {host.photos.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-white/50">
                  <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
            <ul className="space-y-2">
              {host.blogPosts.map((post) => (
                <li key={post.title} className="rounded-xl border border-white/50 bg-white/50 px-3 py-3">
                  <p className="text-sm font-semibold text-ink">{post.title}</p>
                  <p className="mt-1 text-xs text-ink-muted">{post.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
