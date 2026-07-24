import { BrandIdentityLaneCard } from "@/components/studio/BrandIdentityLaneCard";
import { CampaignFormulaCard } from "@/components/studio/CampaignFormulaCard";
import { ProductStoryReadinessCard } from "@/components/studio/ProductStoryReadinessCard";
import { createSeedIdentityBenchmark } from "@/lib/studio/brandIdentityLanes";
import { createSeedHallyuFormula } from "@/lib/studio/hallyuFormula";

/**
 * Creator Circle (/social) — light educational strip.
 * Identity lanes + ShortKey formula — not Studio admin.
 */
export function CreatorFormulaEducationStrip() {
  const formula = createSeedHallyuFormula();
  const map = createSeedIdentityBenchmark();
  const laneTeasers = map.laneProfiles.filter((p) =>
    ["J-Beauty", "K-Beauty", "C-Beauty"].includes(p.lane),
  );

  return (
    <section className="mt-10 space-y-10" aria-labelledby="creator-formula-strip">
      <div>
        <h2
          id="creator-formula-strip"
          className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl"
        >
          ShortKey Creator formula
        </h2>
        <p className="mt-2 text-sm text-ink-subtle">
          How product stories travel now: Creator Circle trust before consumer reach — not
          celebrity packaging drops.
        </p>
        <div className="mt-5 space-y-4">
          <CampaignFormulaCard formula={formula} compact />
          <ProductStoryReadinessCard readiness={formula.readiness} teaser />
        </div>
      </div>

      <div aria-labelledby="identity-lanes-strip">
        <h2
          id="identity-lanes-strip"
          className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl"
        >
          Brand Identity Lanes
        </h2>
        <p className="mt-2 text-sm text-ink-subtle">
          Asian beauty identity system — J / K / C focus differs. Preview archetypes only ·
          not partnerships.
        </p>
        <ul className="mt-3 space-y-1.5 text-[12px] text-ink-muted">
          <li>
            <span className="font-semibold text-ink">J-Beauty</span> — mood / fashion /
            personal creator identity
          </li>
          <li>
            <span className="font-semibold text-ink">K-Beauty</span> — content sharing /
            routine / product education / Hallyu rhythm
          </li>
          <li>
            <span className="font-semibold text-ink">C-Beauty</span> — packaging / color /
            brand personality / discovery energy
          </li>
        </ul>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {laneTeasers.map((p) => (
            <BrandIdentityLaneCard key={p.id} profile={p} />
          ))}
        </div>
        <p className="mt-3 text-[10px] text-ink-subtle">
          Full Identity Benchmark Map lives in ShortKey Studio · GOR_GOR_REVIEW · no fake
          reviews
        </p>
      </div>
    </section>
  );
}
