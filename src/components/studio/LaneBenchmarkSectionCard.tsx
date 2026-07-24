import { BeautySignalContentCard } from "@/components/studio/BeautySignalContentCard";
import {
  LANE_FOCUS,
  type BeautySignalContentCardData,
  type LaneBenchmarkSection,
} from "@/lib/studio/brandIdentityLanes";

/**
 * J / K / C (and option) benchmark section — education, not scraped brand pages.
 */
export function LaneBenchmarkSectionCard({
  section,
  cards,
}: {
  section: LaneBenchmarkSection;
  cards: BeautySignalContentCardData[];
}) {
  const focus = LANE_FOCUS[section.lane];
  const linked = section.signalCardIds
    .map((id) => cards.find((c) => c.id === id))
    .filter(Boolean) as BeautySignalContentCardData[];

  return (
    <section className="rounded-2xl border border-brand/15 bg-white/90 p-5">
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
        {section.lane}
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
        {section.headline}
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{focus.rhythm}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink">{section.education}</p>
      {linked.length > 0 ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {linked.map((card) => (
            <BeautySignalContentCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[12px] text-ink-subtle">
          Lane option — use with Brand Identity Lane fields; no forced single aesthetic.
        </p>
      )}
    </section>
  );
}
