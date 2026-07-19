import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { CmsZone } from "@/components/cms/CmsZone";
import { ShortcutChip } from "@/components/ui/KeyCap";

/** Collections + markets + brands strip — product variety under Beauty OS */
export function HomeCollectionsSection() {
  const { homeCollections: c } = siteContent;

  return (
    <CmsZone id="home-collections">
      <section id="collections" className="pb-4 pt-1 lg:pb-5">
        <div className="px-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="folder-panel rounded-2xl border border-white/60 px-4 py-5 sm:px-6 sm:py-6">
              <p className="type-section-muted text-brand/80">{c.eyebrow}</p>
              <h2 className="type-section mt-1">{c.title}</h2>
              <p className="type-caption mt-1 max-w-xl normal-case tracking-normal text-ink-muted">
                {c.subtitle}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
                {c.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group overflow-hidden rounded-xl border border-white/50 bg-white/40 transition-shadow hover:shadow-soft"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 45vw, 22vw"
                      />
                    </div>
                    <div className="border-t border-white/40 px-2.5 py-2">
                      <ShortcutChip shortcut={item.shortcut} className="text-[7px]" />
                      <h3 className="type-nav-label mt-1 text-[11px] text-ink">{item.title}</h3>
                      <p className="mt-0.5 line-clamp-2 text-[9px] text-ink-muted">
                        {item.description}
                      </p>
                      <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-brand/70">
                        {item.countLabel}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-white/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
                    {c.markets.label}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {c.markets.items.map((m) => (
                      <Link
                        key={m.label}
                        href={m.href}
                        className="rounded-full border border-white/60 bg-white/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-brand/35 hover:text-brand"
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="min-w-0 sm:text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
                    {c.brandsStrip.label}
                  </p>
                  <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                    {c.brandsStrip.names.join(" · ")}
                  </p>
                  <Link
                    href={c.brandsStrip.href}
                    className="mt-1 inline-flex text-[9px] font-bold uppercase tracking-[0.12em] text-brand hover:text-brand-dark"
                  >
                    See brands →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CmsZone>
  );
}
