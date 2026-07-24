import type { CampaignHallyuFormula } from "@/lib/studio/hallyuFormula";

/**
 * Educational card — Historical K-beauty pattern vs ShortKey Creator formula.
 * Learn only · no brand/celeb scrapes · pearl / lilac editorial.
 */
export function CampaignFormulaCard({
  formula,
  compact = false,
}: {
  formula: CampaignHallyuFormula;
  compact?: boolean;
}) {
  return (
    <article
      className={
        compact
          ? "rounded-xl border border-brand/15 bg-white/80 px-4 py-4"
          : "rounded-2xl border border-brand/15 bg-gradient-to-br from-white via-silk/80 to-white p-5 shadow-[0_8px_24px_rgba(140,130,252,0.05)] sm:p-6"
      }
    >
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
        Campaign formula
      </p>
      <h3
        className={`mt-2 font-display font-semibold tracking-tight text-ink ${compact ? "text-base" : "text-lg sm:text-xl"}`}
      >
        From Hallyu star drops to Creator Circle trust
      </h3>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
        Educational contrast only — ShortKey does not recreate celebrity packaging ads.
      </p>

      <div className={`mt-5 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="rounded-xl border border-ink/8 bg-silk/40 px-4 py-3.5">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Historical pattern
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink">
            {formula.historicalFormula}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
            Flow: {formula.flowShift.historical}
          </p>
        </div>
        <div className="rounded-xl border border-brand/20 bg-white px-4 py-3.5">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
            ShortKey formula
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink">
            {formula.shortkeyFormula}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
            Flow: {formula.flowShift.shortkey}
          </p>
        </div>
      </div>

      {!compact ? (
        <ul className="mt-4 space-y-1.5 border-t border-brand/10 pt-4">
          {formula.guardrails.slice(0, 3).map((g) => (
            <li key={g} className="text-[11px] leading-relaxed text-ink-subtle">
              · {g}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
