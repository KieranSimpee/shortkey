import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { CmsZone } from "@/components/cms/CmsZone";
import { Button } from "@/components/ui/Button";
import { ShortcutChip } from "@/components/ui/KeyCap";

/** Who we are + join echo + tutorials / gratitude / Asia trends */
export function HomeCommunitySection() {
  const { homeCommunity: c } = siteContent;

  return (
    <CmsZone id="home-community">
      <section id="community" className="pb-4 pt-1 lg:pb-6">
        <div className="px-4 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-3">
            <div className="folder-panel rounded-2xl border border-white/60 px-4 py-5 sm:px-6 sm:py-6">
              <p className="type-section-muted text-brand/80">{c.eyebrow}</p>
              <h2 className="type-section mt-1">{c.title}</h2>
              <p className="type-caption mt-1 max-w-xl normal-case tracking-normal text-ink-muted">
                {c.subtitle}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
                {c.stories.map((story) => (
                  <Link
                    key={story.id}
                    href={story.href}
                    className="group overflow-hidden rounded-xl border border-white/50 bg-white/40 transition-shadow hover:shadow-soft"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 45vw, 22vw"
                      />
                    </div>
                    <div className="border-t border-white/40 px-2.5 py-2">
                      <ShortcutChip shortcut={story.shortcut} className="text-[7px]" />
                      <h3 className="type-nav-label mt-1 text-[11px] text-ink">{story.title}</h3>
                      <p className="mt-0.5 line-clamp-3 text-[9px] leading-snug text-ink-muted">
                        {story.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="folder-panel rounded-2xl border border-white/60 px-4 py-5 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-lg">
                  <h3 className="type-section text-[11px]">{c.joinEcho.title}</h3>
                  <p className="mt-1 text-[11px] text-ink-muted">{c.joinEcho.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.joinEcho.buttons.map((btn) => (
                    <Button key={btn.label} href={btn.href} variant={btn.variant} size="sm">
                      {btn.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CmsZone>
  );
}
