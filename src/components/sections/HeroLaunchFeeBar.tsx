import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";

/** Slim launch-fee timeline under hero CTAs — existing lilac glass style */
export function HeroLaunchFeeBar() {
  const fees = siteContent.hero.launchFees;
  if (!fees) return null;

  return (
    <div className="mt-5 max-w-md rounded-xl border border-white/50 bg-white/40 px-3 py-2.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand">{fees.label}</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {fees.tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "rounded-lg border px-2 py-1.5 text-center",
              tier.emphasis
                ? "border-brand/40 bg-brand/10"
                : "border-white/50 bg-white/50",
            )}
          >
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              {tier.note}
            </p>
            <p className="mt-0.5 text-sm font-bold text-ink">{tier.rate}</p>
            <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.08em] text-ink-subtle">
              {tier.window}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[9px] leading-snug text-ink-subtle">{fees.footnote}</p>
    </div>
  );
}
