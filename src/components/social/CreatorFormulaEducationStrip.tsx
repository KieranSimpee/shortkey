import { CampaignFormulaCard } from "@/components/studio/CampaignFormulaCard";
import { ProductStoryReadinessCard } from "@/components/studio/ProductStoryReadinessCard";
import { createSeedHallyuFormula } from "@/lib/studio/hallyuFormula";

/**
 * Creator Circle (/social) — light educational strip.
 * References ShortKey formula; optional Product Story Readiness teaser.
 * Not Studio admin.
 */
export function CreatorFormulaEducationStrip() {
  const formula = createSeedHallyuFormula();

  return (
    <section className="mt-10" aria-labelledby="creator-formula-strip">
      <h2
        id="creator-formula-strip"
        className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl"
      >
        ShortKey Creator formula
      </h2>
      <p className="mt-2 text-sm text-ink-subtle">
        How product stories travel now: Creator Circle trust before consumer reach —
        not celebrity packaging drops.
      </p>
      <div className="mt-5 space-y-4">
        <CampaignFormulaCard formula={formula} compact />
        <ProductStoryReadinessCard readiness={formula.readiness} teaser />
      </div>
    </section>
  );
}
