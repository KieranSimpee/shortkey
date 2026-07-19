"use client";

import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { ShortcutChip } from "@/components/ui/KeyCap";
import { cn } from "@/lib/utils";

type Variant = "live" | "design";

/** Makeup+Try-On · Skin+Analysis · Creator video jobs */
export function HomeCategoryLanesSection({ variant = "live" }: { variant?: Variant }) {
  const c = siteContent.homeCategoryLanes;
  const isDesign = variant === "design";

  return (
    <section
      id="category-lanes"
      className={cn(isDesign ? "px-4 py-10 sm:px-8 lg:py-12" : "pb-4 pt-1 lg:pb-5")}
    >
      <div className={cn(isDesign ? "mx-auto max-w-6xl" : "mx-auto max-w-7xl px-4 lg:px-8")}>
        <p
          className={cn(
            "font-semibold uppercase tracking-[0.2em] text-brand",
            isDesign ? "text-[10px]" : "type-section-muted text-brand/80",
          )}
        >
          {c.eyebrow}
        </p>
        <h2
          className={cn(
            "mt-2 font-bold uppercase tracking-[0.08em] text-ink",
            isDesign ? "text-xl" : "type-section",
          )}
        >
          {c.title}
        </h2>
        <p
          className={cn(
            "mt-1 max-w-xl text-ink-muted",
            isDesign ? "text-sm" : "type-caption normal-case tracking-normal",
          )}
        >
          {c.subtitle}
        </p>

        <div className="mt-6 space-y-5">
          {c.lanes.map((lane, i) => {
            const isCreator = Boolean(lane.videoOffers);
            return (
              <article
                key={lane.id}
                id={lane.id}
                className={cn(
                  "overflow-hidden rounded-2xl border border-white/60",
                  isDesign ? "bg-white/45" : "folder-panel bg-white/40",
                  i % 2 === 1 && "border-brand/20",
                )}
              >
                <div
                  className={cn(
                    "grid gap-0",
                    isCreator
                      ? "lg:grid-cols-1"
                      : "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]",
                  )}
                >
                  {/* Lane intro + AI CTA */}
                  <div
                    className={cn(
                      "flex flex-col justify-between border-b border-white/50 p-4 sm:p-5",
                      !isCreator && "lg:border-b-0 lg:border-r",
                      i % 2 === 1 && !isCreator && "lg:order-2 lg:border-l lg:border-r-0",
                    )}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <ShortcutChip shortcut={lane.shortcut} />
                        <span className="rounded-full bg-brand/12 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-brand">
                          {lane.aiLabel}
                        </span>
                      </div>
                      <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
                        {lane.category}
                      </p>
                      <h3 className="mt-1 text-lg font-bold uppercase tracking-[0.08em] text-ink sm:text-xl">
                        {lane.title}
                      </h3>
                      <p className="mt-2 max-w-md text-[12px] leading-relaxed text-ink-muted">
                        {lane.description}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button href={lane.aiHref} variant="highlight" size="sm">
                        {lane.aiCta}
                      </Button>
                      <Button href={lane.shopHref} variant="outline" size="sm">
                        {lane.shopCta}
                      </Button>
                    </div>
                  </div>

                  {/* Products or video offers */}
                  {isCreator && lane.videoOffers ? (
                    <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                      {[lane.videoOffers.jobOffer, lane.videoOffers.platformOffer].map(
                        (offer) => (
                          <div
                            key={offer.label}
                            className="rounded-xl border border-brand/25 bg-brand/8 px-4 py-4"
                          >
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                              {offer.label}
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
                              {offer.range}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                              {offer.qty}
                            </p>
                            <p className="mt-2 text-[11px] leading-snug text-ink/75">
                              {offer.note}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4",
                        i % 2 === 1 && "lg:order-1",
                      )}
                    >
                      {lane.products.map((p) => (
                        <Link
                          key={p.sku}
                          href={p.href}
                          className="group overflow-hidden rounded-xl border border-white/60 bg-white/70 transition hover:border-brand/30"
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                              sizes="160px"
                            />
                          </div>
                          <div className="border-t border-white/50 px-2 py-1.5">
                            <p className="font-mono text-[8px] text-brand/70">{p.sku}</p>
                            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-ink">
                              {p.name}
                            </p>
                            <p className="truncate text-[9px] text-ink-muted">{p.type}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
