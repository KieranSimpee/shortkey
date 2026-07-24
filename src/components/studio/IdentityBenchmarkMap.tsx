"use client";

import { BrandIdentityLaneCard } from "@/components/studio/BrandIdentityLaneCard";
import { CreatorDiscoveryPreview } from "@/components/studio/CreatorDiscoveryPreview";
import { HallyuFormulaStudioPanel } from "@/components/studio/HallyuFormulaStudioPanel";
import { LaneBenchmarkSectionCard } from "@/components/studio/LaneBenchmarkSectionCard";
import type { BrandIdentityBenchmarkMap } from "@/lib/studio/brandIdentityLanes";
import type { StudioCampaign, StudioStatus } from "@/lib/studio/types";
import type { ReactNode } from "react";

/**
 * Studio Identity Benchmark Map — P0 lightweight preview layers.
 * Identity system, not decoration. GOR_GOR_REVIEW · Preview-only samples.
 */
export function IdentityBenchmarkMap({
  map,
  campaigns,
  statusPill,
}: {
  map: BrandIdentityBenchmarkMap;
  campaigns: StudioCampaign[];
  statusPill: (status: StudioStatus) => ReactNode;
}) {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {statusPill(map.status)}
          <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-violet-800">
            Preview layers · not production
          </span>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{map.framing}</p>
        <ul className="max-w-2xl space-y-1">
          {map.guardrails.slice(0, 4).map((g) => (
            <li key={g} className="text-[11px] leading-relaxed text-ink-subtle">
              · {g}
            </li>
          ))}
        </ul>
      </header>

      {/* 1. Brand Identity Lanes */}
      <section aria-labelledby="identity-lanes">
        <h2
          id="identity-lanes"
          className="font-display text-base font-semibold text-ink"
        >
          1 · Brand Identity Lanes
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Lane · Visual vibe · Product story · Creator fit — flexible map, not one generic
          Asian style.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {map.laneProfiles.map((p) => (
            <BrandIdentityLaneCard key={p.id} profile={p} />
          ))}
        </div>
      </section>

      {/* 2. Creator Discovery Preview */}
      <section aria-labelledby="creator-discovery">
        <h2 id="creator-discovery" className="sr-only">
          2 · Creator Discovery Preview
        </h2>
        <CreatorDiscoveryPreview slots={map.creatorDiscovery} />
      </section>

      {/* 3. Product Story / Campaign Formula */}
      <section aria-labelledby="product-story-formula">
        <h2
          id="product-story-formula"
          className="font-display text-base font-semibold text-ink"
        >
          3 · Product Story / Campaign Formula
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Flow: Brand → Creator Circle → Community → Consumer. Historical pattern is
          educational only.
        </p>
        <div className="mt-4">
          <HallyuFormulaStudioPanel
            campaigns={campaigns}
            statusPill={statusPill}
            compact
          />
        </div>
      </section>

      {/* 4–5. Beauty Signal + J/K/C benchmarks */}
      <section aria-labelledby="lane-benchmarks" className="space-y-4">
        <div>
          <h2
            id="lane-benchmarks"
            className="font-display text-base font-semibold text-ink"
          >
            4–5 · Beauty Signal cards · J / K / C benchmarks
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            K-Beauty content-sharing rhythm · C-Beauty concept cards · J-Beauty mood lane —
            no brand scrapes.
          </p>
        </div>
        {map.laneBenchmarks.map((section) => (
          <LaneBenchmarkSectionCard
            key={section.lane}
            section={section}
            cards={map.beautySignalCards}
          />
        ))}
      </section>
    </div>
  );
}
