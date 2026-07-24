import { CreatorFitSignal } from "@/components/studio/CreatorFitSignal";
import { LocalMarketSignal } from "@/components/studio/LocalMarketSignal";
import type {
  ProductStoryReadiness,
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
 * Product Story Readiness — educational checklist / score for campaign staging.
 * Not a live ranking or marketplace engine.
 */
export function ProductStoryReadinessCard({
  readiness,
  teaser = false,
}: {
  readiness: ProductStoryReadiness;
  /** Lighter teaser for Creator Circle /social */
  teaser?: boolean;
}) {
  if (teaser) {
    return (
      <article className="rounded-xl border border-brand/15 bg-white/75 px-4 py-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            Product Story Readiness
          </p>
          <span className="font-mono text-[11px] font-medium text-brand-dark">
            {readiness.score}/100
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
          Brands win when the visual story, product signal, and creator fit are clear —
          before any matching runs.
        </p>
        <ul className="mt-3 space-y-1.5">
          {readiness.checklist.slice(0, 3).map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 text-[12px]"
            >
              <span className="text-ink">{item.label}</span>
              <span
                className={`inline-flex rounded-md border px-1.5 py-0.5 font-mono text-[9px] ${levelTone(item.level)}`}
              >
                {item.level}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-ink-subtle">
          Teaser only · full checklist lives in ShortKey Studio
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-brand/15 bg-white/90 p-5 shadow-[0_8px_24px_rgba(140,130,252,0.05)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Product Story Readiness
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
            Campaign signal checklist
          </h3>
        </div>
        <div className="rounded-xl border border-brand/20 bg-silk/50 px-4 py-2 text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
            Score
          </p>
          <p className="font-display text-2xl font-semibold text-brand-dark">
            {readiness.score}
            <span className="text-sm font-normal text-ink-muted">/100</span>
          </p>
        </div>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
        Educational staging score from packaging, product signal, creator fit, content angle,
        and local market — not a live engine or sales promise.
      </p>

      <ul className="mt-5 space-y-2.5">
        {readiness.checklist.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-brand/12 bg-silk/40 px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-ink">{item.label}</span>
              <span
                className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium ${levelTone(item.level)}`}
              >
                {item.level}
              </span>
            </div>
            {item.note ? (
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">
                {item.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-brand/12 bg-white px-4 py-3">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Product signals
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {readiness.productSignal.signals.map((s) => (
              <span
                key={s}
                className="rounded-md border border-brand/15 bg-silk/60 px-2 py-1 text-[11px] text-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-brand/12 bg-white px-4 py-3">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Content angles
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {readiness.contentAngle.angles.map((a) => (
              <span
                key={a}
                className="rounded-md border border-brand/15 bg-silk/60 px-2 py-1 text-[11px] text-ink"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <CreatorFitSignal data={readiness.creatorFit} />
        <LocalMarketSignal data={readiness.localMarket} />
      </div>
    </article>
  );
}
