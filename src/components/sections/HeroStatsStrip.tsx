import Image from "next/image";
import Link from "next/link";

import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";

/**
 * Skin analysis + routine suggestions matched to that analysis
 * (toner → serum → cream across Asian beauty).
 */
export function HeroStatsStrip({ className }: { className?: string }) {
  const { statsCard, skincareRoutine, sealLabel } = siteContent.hero;
  const glowLevel = statsCard.glowLevel ?? 4;

  return (
    <div className={cn("flex w-[min(100%,12rem)] flex-col gap-2", className)}>
      {/* Skin analysis */}
      <div className="rounded-2xl border border-white/35 bg-white/25 px-3 py-2.5 backdrop-blur-[6px]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand/80">
          {statsCard.title}
        </p>
        <p className="mt-0.5 text-lg font-semibold leading-none text-brand">{statsCard.value}</p>

        <p className="mt-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand/80">
          Glow level
        </p>
        <div className="mt-1.5 flex w-full max-w-[5.5rem] gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= glowLevel ? "bg-brand/80" : "bg-brand/20"}`}
            />
          ))}
        </div>

        <ul className="mt-2.5 flex flex-col gap-1">
          {statsCard.bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-lg border border-white/30 bg-white/15 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-brand/85"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Routine suggested from analysis */}
      <div className="rounded-2xl border border-white/35 bg-white/25 px-2.5 py-2 backdrop-blur-[6px]">
        <p className="px-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand/80">
          {skincareRoutine.title}
        </p>
        {skincareRoutine.subtitle ? (
          <p className="mt-0.5 px-0.5 text-[8px] font-medium leading-snug tracking-[0.03em] text-ink-muted">
            {skincareRoutine.subtitle}
          </p>
        ) : null}

        <ul className="mt-2 flex flex-col gap-1.5">
          {skincareRoutine.steps.map((step) => (
            <li key={step.role}>
              <Link
                href={step.href}
                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/20 p-1 pr-2 transition hover:border-brand/35 hover:bg-white/40"
              >
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/50">
                  <Image
                    src={step.image}
                    alt={`${step.brand} — ${step.name}`}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[7px] font-bold uppercase tracking-[0.12em] text-brand">
                    {step.step} · {step.role}
                  </span>
                  <span className="mt-0.5 block truncate text-[8px] font-semibold uppercase tracking-[0.06em] text-ink">
                    {step.brand}
                  </span>
                  <span className="block truncate text-[7px] font-medium text-ink-muted">
                    {step.region} · {step.name}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {sealLabel ? (
        <div className="hero-seal-flash relative mt-1 flex h-24 w-24 items-center justify-center self-end rounded-full border border-brand/30 bg-white/25 p-2.5 text-center text-[11px] font-bold uppercase leading-tight tracking-[0.08em] backdrop-blur-[6px]">
          <span className="hero-seal-text">{sealLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
