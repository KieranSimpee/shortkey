"use client";

import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { CmsZone } from "@/components/cms/CmsZone";
import { ShortcutChip } from "@/components/ui/KeyCap";

/** Command cards only — SKU strip now lives under the Beauty OS tabs. */
export function CommandsSection() {
  const { commands } = siteContent;

  return (
    <CmsZone id="commands">
      <section id="commands" className="pb-4 pt-2 lg:pb-5 lg:pt-3">
        <div className="px-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="folder-panel rounded-2xl border border-white/60 px-4 py-5 sm:px-6 sm:py-6">
              <div className="mb-4">
                <h2 className="type-section">{commands.titleLeft}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
                {commands.cards.map((card) => {
                  const external = card.href.startsWith("http");

                  return (
                    <Link
                      key={card.title}
                      href={card.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group overflow-hidden rounded-xl border border-white/50 bg-white/40 transition-shadow hover:shadow-soft"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 1024px) 30vw, 160px"
                        />
                      </div>
                      <div className="border-t border-white/40 px-2 py-2">
                        <ShortcutChip shortcut={card.shortcut} className="text-[7px]" />
                        <h3 className="type-nav-label mt-1 text-[10px] text-ink">{card.title}</h3>
                        <p className="type-caption mt-0.5 line-clamp-2 text-[9px] normal-case tracking-normal text-ink-muted">
                          {card.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </CmsZone>
  );
}
