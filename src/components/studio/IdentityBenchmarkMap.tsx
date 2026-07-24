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
        <div className="max-w-2xl space-y-2">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Studio safety checklist
          </p>
          <ul className="space-y-1">
            {map.guardrails.map((g) => (
              <li key={g} className="text-[11px] leading-relaxed text-ink-subtle">
                · {g}
              </li>
            ))}
          </ul>
        </div>
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
          Fresh Texture · Signal Sprint · Color Persona — flexible map, not one generic
          Asian style. Studio keeps J / K / C separate.
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
            K Signal Sprint · C Color Persona · J Fresh Texture — no brand scrapes · no fake
            「真」 badge.
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
