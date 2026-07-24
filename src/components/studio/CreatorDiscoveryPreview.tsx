import type { CreatorDiscoveryPreviewSlot } from "@/lib/studio/brandIdentityLanes";

/**
 * Creator Discovery Preview — role slots only, never fake named creators.
 */
export function CreatorDiscoveryPreview({
  slots,
}: {
  slots: CreatorDiscoveryPreviewSlot[];
}) {
  return (
    <section className="rounded-2xl border border-brand/15 bg-gradient-to-br from-white to-silk/60 p-5">
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
        Creator Discovery Preview
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
        Fit slots — not a social network
      </h3>
      <p className="mt-2 text-sm text-ink-muted">
        Lightweight matching roles for Brand Identity Lanes. No fake creators, reviews, or
        partnerships.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className="rounded-xl border border-brand/12 bg-white px-3.5 py-3"
          >
            <span className="rounded-md border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-violet-800">
              Preview
            </span>
            <p className="mt-2 text-[13px] font-semibold text-ink">{slot.roleLabel}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {slot.laneFit.map((l) => (
                <span
                  key={l}
                  className="rounded-md border border-brand/15 bg-silk/50 px-1.5 py-0.5 text-[10px] text-ink"
                >
                  {l}
                </span>
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {slot.fitRoles.map((r) => (
                <span
                  key={r}
                  className="rounded-md border border-ink/8 bg-white px-1.5 py-0.5 text-[10px] text-ink-muted"
                >
                  {r}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-subtle">{slot.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
