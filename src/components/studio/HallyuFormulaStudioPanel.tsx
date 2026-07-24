"use client";

import type { ReactNode } from "react";
import { CampaignFormulaCard } from "@/components/studio/CampaignFormulaCard";
import { ProductStoryReadinessCard } from "@/components/studio/ProductStoryReadinessCard";
import {
  HALLYU_SEED_CAMPAIGN_ID,
  type CampaignHallyuFormula,
} from "@/lib/studio/hallyuFormula";
import type { StudioCampaign, StudioStatus } from "@/lib/studio/types";

/**
 * Studio Campaign / Preview block — Hallyu → Creator formula seed (GOR_GOR_REVIEW).
 */
export function HallyuFormulaStudioPanel({
  campaigns,
  statusPill,
  compact = false,
}: {
  campaigns: StudioCampaign[];
  statusPill: (status: StudioStatus) => ReactNode;
  compact?: boolean;
}) {
  const campaign =
    campaigns.find((c) => c.id === HALLYU_SEED_CAMPAIGN_ID) ??
    campaigns.find((c) => c.hallyuFormula?.enabled);
  const formula: CampaignHallyuFormula | undefined = campaign?.hallyuFormula;

  if (!formula || !campaign) {
    return (
      <p className="text-sm text-ink-subtle">
        No Hallyu → Creator formula campaign in seed yet. Reset to seed or add{" "}
        <span className="font-mono text-[11px]">{HALLYU_SEED_CAMPAIGN_ID}</span>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-base font-semibold text-ink">
          {campaign.name}
        </h2>
        {statusPill(campaign.status)}
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-violet-800">
          {formula.status}
        </span>
      </div>
      <CampaignFormulaCard formula={formula} compact={compact} />
      <ProductStoryReadinessCard readiness={formula.readiness} />
    </div>
  );
}
