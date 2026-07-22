"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { BrandSkinAnalysisDemo } from "@/components/design/BrandSkinAnalysisDemo";
import { CreatorLiveTryOnDemo } from "@/components/design/CreatorLiveTryOnDemo";
import { cn } from "@/lib/utils";

type HeroMode = "split" | "creator" | "brand";

type PanelCopy = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
};

const CREATOR_IMG = "/images/posters/hero/hero-bloom-skin.png";
const BRAND_IMG = "/images/posters/hero/hero-skin-analysis.png";

/** Keycap chrome from KeyCap — register CTAs echo the logo keypad without a new mark */
const KEYCAP_CTA =
  "!rounded-md !normal-case !tracking-wide border border-white/90 bg-gradient-to-b from-white to-brand-muted !text-brand shadow-[0_2px_0_rgba(140,130,252,0.2),0_4px_12px_rgba(140,130,252,0.1)] hover:!bg-brand-muted hover:!text-brand";

const MODE_BTN =
  "rounded-sm px-2 py-1 font-display text-[8px] font-semibold uppercase tracking-[0.14em] transition-colors sm:text-[9px]";

/**
 * Dual hero (founder sketch): Creator left | Brand right — always side-by-side.
 * Activate Creator / AI Try On → both banners tell Creator story.
 * Activate Brand / Skin Analysis → both banners tell Brand story.
 * Esc or “Both” returns to the default split.
 */
export function DualAudienceHero() {
  const [mode, setMode] = useState<HeroMode>("split");
  const labelId = useId();

  useEffect(() => {
    if (mode === "split") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode("split");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  const enterCreator = () => setMode("creator");
  const enterBrand = () => setMode("brand");
  const backToSplit = () => setMode("split");

  const leftCopy: PanelCopy =
    mode === "brand"
      ? {
          eyebrow: "Brand",
          title: "Skin Analysis",
          body: "Condition map linked to your line.",
          ctaLabel: "brand signup",
          ctaHref: "/signup/brand",
          secondaryLabel: "Skin Analysis",
        }
      : {
          eyebrow: "Creator",
          title: "AI Try On",
          body:
            mode === "creator"
              ? "Now fans can try — shades live with you."
              : "Before they couldn’t try. Now they can.",
          ctaLabel: "creator signup",
          ctaHref: "/signup/creator",
          secondaryLabel: "Try On",
        };

  const rightCopy: PanelCopy =
    mode === "creator"
      ? {
          eyebrow: "Creator",
          title: "Multi-screen",
          body: "See who’s trying on · and their comments.",
          ctaLabel: "creator signup",
          ctaHref: "/signup/creator",
          secondaryLabel: "Try On",
        }
      : {
          eyebrow: "Brand",
          title: mode === "brand" ? "SKU match" : "Skin Analysis",
          body:
            mode === "brand"
              ? "Recommend from your catalog, then shop."
              : "AI analysis linked to your brand and SKUs.",
          ctaLabel: "brand signup",
          ctaHref: "/signup/brand",
          secondaryLabel: "Skin Analysis",
        };

  const leftVisual =
    mode === "brand" ? (
      <BrandSkinAnalysisDemo
        imageSrc={BRAND_IMG}
        imagePosition="62% center"
        variant="scan"
      />
    ) : (
      <CreatorLiveTryOnDemo
        imageSrc={CREATOR_IMG}
        imagePosition="62% center"
        variant={mode === "creator" ? "live" : "teaser"}
      />
    );

  const rightVisual =
    mode === "creator" ? (
      <CreatorLiveTryOnDemo
        imageSrc={CREATOR_IMG}
        imagePosition="60% center"
        variant="studio"
      />
    ) : (
      <BrandSkinAnalysisDemo
        imageSrc={BRAND_IMG}
        imagePosition="62% center"
        variant={mode === "brand" ? "match" : "teaser"}
      />
    );

  return (
    <section
      data-comp="COMP-001"
      data-hero-mode={mode}
      aria-label="Shortkey — Creator try-on and Brand skin analysis"
      className="relative isolate grid min-h-[min(60vh,480px)] grid-cols-2 overflow-x-clip overflow-y-visible bg-surface-dark sm:min-h-[min(66vh,560px)] md:min-h-[min(72vh,640px)] lg:min-h-[min(76vh,700px)]"
    >
      {/* Soft seam veil */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-[4] w-[min(36vw,220px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_72%)]"
        aria-hidden
      />

      {/* Vertical seam — brand mark lives in site header, not mid-hero (founder lock) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-[5] w-px -translate-x-1/2 bg-brand/25"
        aria-hidden
      />

      {/* Mode switch — top center; titles stay in bottom overlay */}
      <div
        className="absolute left-1/2 top-3 z-[20] flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-brand/30 bg-surface-dark/90 p-0.5 shadow-soft backdrop-blur-sm sm:top-4"
        role="group"
        aria-labelledby={labelId}
      >
        <span id={labelId} className="sr-only">
          Hero view mode
        </span>
        <button
          type="button"
          onClick={enterCreator}
          className={cn(
            MODE_BTN,
            mode === "creator"
              ? "bg-brand text-white"
              : "text-brand-silver hover:bg-brand/15 hover:text-silk",
          )}
          aria-pressed={mode === "creator"}
        >
          Creator
        </button>
        <button
          type="button"
          onClick={backToSplit}
          className={cn(
            MODE_BTN,
            mode === "split"
              ? "bg-brand-muted text-brand"
              : "text-brand-silver hover:bg-brand/15 hover:text-silk",
          )}
          aria-pressed={mode === "split"}
          title="Creator | Brand split (Esc)"
        >
          Both
        </button>
        <button
          type="button"
          onClick={enterBrand}
          className={cn(
            MODE_BTN,
            mode === "brand"
              ? "bg-brand text-white"
              : "text-brand-silver hover:bg-brand/15 hover:text-silk",
          )}
          aria-pressed={mode === "brand"}
        >
          Brand
        </button>
      </div>

      {([0, 1] as const).map((i) => {
        const isLeft = i === 0;
        const copy = isLeft ? leftCopy : rightCopy;
        const activate = isLeft
          ? mode === "brand"
            ? enterBrand
            : enterCreator
          : mode === "creator"
            ? enterCreator
            : enterBrand;
        const cornerLabel =
          mode === "creator" ? "Creator" : mode === "brand" ? "Brand" : isLeft ? "Creator" : "Brand";

        return (
          <article
            key={isLeft ? "hero-left" : "hero-right"}
            className={cn(
              "relative z-0 min-h-0 overflow-hidden",
              isLeft ? "border-r border-brand/15" : "",
            )}
          >
            {/* Full-bleed visual stage — model fills the whole panel, no copy dock stealing height */}
            {isLeft ? leftVisual : rightVisual}

            {/* Copy/CTAs — absolute bottom overlay on a soft scrim, never a card over the model */}
            <div className="hero-copy-scrim absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-14 sm:px-6 sm:pb-6 sm:pt-20 md:px-8 md:pb-8 md:pt-24">
              <button
                type="button"
                onClick={activate}
                className="text-left transition-colors hover:opacity-90"
                aria-label={`${cornerLabel} — ${copy.title}`}
              >
                <p className="font-display text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-light sm:text-[9px] sm:tracking-[0.2em]">
                  {copy.eyebrow}
                </p>
                <h2 className="mt-0.5 max-w-[19rem] font-display text-base font-bold tracking-tight text-white sm:mt-1 sm:max-w-sm sm:text-lg md:text-xl lg:max-w-md lg:text-[1.4rem]">
                  {copy.title}
                </h2>
              </button>
              <p className="mt-1 max-w-[19rem] text-[11px] leading-snug text-white/70 sm:max-w-sm sm:text-[12px] md:text-[13px] lg:max-w-md">
                <span className="mr-0.5 font-display text-base font-light text-white/35 sm:mr-1 sm:text-lg" aria-hidden>
                  (
                </span>
                {copy.body}
              </p>
              <div className="mt-2.5 flex flex-col items-stretch gap-2 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button href={copy.ctaHref} variant="primary" size="sm" className={KEYCAP_CTA}>
                  {copy.ctaLabel}
                </Button>
                <button
                  type="button"
                  onClick={
                    copy.secondaryLabel === "Try On" || copy.eyebrow === "Creator"
                      ? enterCreator
                      : enterBrand
                  }
                  className="inline-flex items-center justify-center rounded-full border border-white/80 bg-transparent px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10 sm:text-sm"
                >
                  {copy.secondaryLabel}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
