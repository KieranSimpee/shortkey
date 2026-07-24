import type {
  LocalMarketOption,
  LocalMarketSignalData,
  ReadinessLevel,
} from "@/lib/studio/hallyuFormula";

function levelTone(level: ReadinessLevel): string {
  switch (level) {
    case "ready":
      return "bg-brand/12 text-brand-dark border-brand/25";
    case "partial":
      return "bg-violet-50 text-violet-800 border-violet-200";
    default:
      return "bg-ink/5 text-ink-subtle border-ink/10";
  }
}

/**
 * Local market fit chips — localized commerce intent, not live storefronts.
 */
export function LocalMarketSignal({
  data,
  compact = false,
}: {
  data: LocalMarketSignalData;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "rounded-lg border border-brand/12 bg-white/70 px-3 py-2.5"
          : "rounded-xl border border-brand/15 bg-white px-4 py-3.5"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
          Local market
        </p>
        <span
          className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide ${levelTone(data.strength)}`}
        >
          {data.strength}
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {data.markets.map((market: LocalMarketOption) => (
          <span
            key={market}
            className="rounded-md border border-brand/15 bg-silk/60 px-2 py-1 font-mono text-[11px] text-ink"
          >
            {market}
          </span>
        ))}
      </div>
      {data.note && !compact ? (
        <p className="mt-2.5 text-[11px] leading-relaxed text-ink-muted">{data.note}</p>
      ) : null}
    </div>
  );
}
