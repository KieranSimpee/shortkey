import Image from "next/image";
import { siteContent } from "@/content/homepage";
import { CmsZone } from "@/components/cms/CmsZone";
import { Button } from "@/components/ui/Button";

type Props = { variant?: "live" | "design" };

/**
 * Olive Young–style split: product stage (left) + Why Shortkey join copy (right).
 * Message: catch market attention before big retail affiliate programs.
 */
export function HomeWhySection({ variant = "live" }: Props) {
  const w = siteContent.homeWhy;
  const outer =
    variant === "design"
      ? "px-4 py-10 sm:px-8"
      : "pb-4 pt-1 lg:pb-5";
  const inner = variant === "design" ? "mx-auto max-w-6xl" : "mx-auto max-w-7xl px-4 lg:px-8";

  return (
    <CmsZone id="home-why">
      <section id="why-shortkey" className={outer}>
        <div className={inner}>
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-soft">
            <div className="grid lg:grid-cols-2">
              {/* Product stage */}
              <div className="relative min-h-[280px] overflow-hidden bg-gradient-to-br from-[#e8f5ef] via-[#f7f0e4] to-[#f8e8ee] px-6 py-8 sm:min-h-[340px] sm:px-8 sm:py-10">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                  <div className="absolute left-[8%] top-[18%] h-24 w-40 rounded-[2rem] bg-[#b8e0d2]" />
                  <div className="absolute bottom-[12%] left-[22%] h-28 w-48 rounded-[2rem] bg-[#f0e6a8]" />
                  <div className="absolute right-[10%] top-[28%] h-32 w-36 rounded-[2rem] bg-[#f3c4d4]" />
                </div>
                <p className="relative z-[1] text-center text-sm font-bold uppercase tracking-[0.2em] text-ink/80">
                  {w.stageLabel}
                </p>
                <div className="relative z-[1] mx-auto mt-6 grid max-w-md grid-cols-3 gap-3 sm:gap-4">
                  {w.products.map((p, i) => (
                    <div
                      key={p.sku}
                      className="flex flex-col items-center"
                      style={{ marginTop: i % 3 === 1 ? "1.25rem" : i % 3 === 2 ? "0.5rem" : 0 }}
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/80 bg-white/90 shadow-soft">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy */}
              <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                  {w.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {w.titleBefore}
                  <span className="text-brand">{w.titleHighlight}</span>
                  {w.titleAfter}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">{w.body}</p>
                <ul className="mt-5 space-y-2">
                  {w.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[12px] leading-snug text-ink/85"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <Button href={w.ctaCreator.href} variant="highlight" size="sm">
                    {w.ctaCreator.label}
                  </Button>
                  <Button href={w.ctaBrand.href} variant="outline" size="sm">
                    {w.ctaBrand.label}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CmsZone>
  );
}
