import {
  LANE_FOCUS,
  type BrandIdentityLaneProfile,
} from "@/lib/studio/brandIdentityLanes";

/**
 * Brand Identity Lane profile card — Preview archetypes only.
 */
export function BrandIdentityLaneCard({
  profile,
}: {
  profile: BrandIdentityLaneProfile;
}) {
  const focus = LANE_FOCUS[profile.lane];
  return (
    <article className="rounded-xl border border-brand/15 bg-white px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-violet-800">
          Preview
        </span>
        <span className="rounded-md border border-brand/20 bg-silk/60 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
          {profile.lane}
        </span>
        {focus.vibe ? (
          <span className="rounded-md border border-brand/12 bg-white px-2 py-0.5 font-display text-[10px] font-medium tracking-wide text-ink-muted">
            {focus.vibe}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2.5 font-display text-sm font-semibold text-ink">
        {profile.label}
      </h3>
      <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">{focus.focus}</p>

      <dl className="mt-3 space-y-2 text-[12px]">
        <div>
          <dt className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Visual vibe
          </dt>
          <dd className="mt-0.5 text-ink">{profile.visualVibe}</dd>
        </div>
        <div>
          <dt className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Product story
          </dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {profile.productStory.map((s) => (
              <span
                key={s}
                className="rounded-md border border-brand/12 bg-silk/50 px-2 py-0.5 text-[11px]"
              >
                {s}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Creator fit
          </dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {profile.creatorFit.map((r) => (
              <span
                key={r}
                className="rounded-md border border-brand/12 bg-silk/50 px-2 py-0.5 text-[11px]"
              >
                {r}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-subtle">{profile.note}</p>
    </article>
  );
}
