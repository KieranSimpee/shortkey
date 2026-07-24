import type { BeautySignalContentCardData } from "@/lib/studio/brandIdentityLanes";

/**
 * Beauty Signal / lane rhythm content card — Preview educational only.
 */
export function BeautySignalContentCard({
  card,
}: {
  card: BeautySignalContentCardData;
}) {
  return (
    <article className="rounded-xl border border-brand/12 bg-silk/40 px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-violet-800">
          Preview
        </span>
        <span className="font-mono text-[10px] text-ink-subtle">{card.lane}</span>
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
          {card.kind.replace(/-/g, " ")}
        </span>
      </div>
      <h4 className="mt-2 text-[13px] font-semibold text-ink">{card.title}</h4>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{card.body}</p>
    </article>
  );
}
