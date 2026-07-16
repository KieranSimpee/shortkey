"use client";

import { useEffect, useState } from "react";
import { siteContent } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { ShortcutKeysLogo } from "@/components/ui/ShortcutKeysLogo";
import { HeroModelCutout } from "@/components/sections/HeroModelCutout";
import { HeroStatsStrip } from "@/components/sections/HeroStatsStrip";
import {
  HeroTryOnModelCutout,
  HeroTryOnPanel,
  useHeroTryOnState,
} from "@/components/sections/HeroTryOnStudio";
import { cn } from "@/lib/utils";

type PosterId = "skin-analysis" | "try-on";

function posterFromHash(): PosterId | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.replace(/^#/, "");
  if (h === "try-on" || h.startsWith("try-on")) return "try-on";
  if (h === "skin-analysis") return "skin-analysis";
  return null;
}

/** Hero board — desktop composition locked; tablet/phone reflow as one banner. */
export function HeroPosterBoard() {
  const { hero } = siteContent;
  const [poster, setPoster] = useState<PosterId>(hero.defaultPoster);
  const tryOn = useHeroTryOnState();

  useEffect(() => {
    const sync = () => {
      const fromHash = posterFromHash();
      if (fromHash) setPoster(fromHash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const selectPoster = (id: PosterId) => {
    setPoster(id);
    if (id === "try-on") {
      window.history.replaceState(null, "", "#try-on");
    } else if (window.location.hash === "#try-on") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const model =
    poster === "skin-analysis" ? (
      <HeroModelCutout />
    ) : (
      <HeroTryOnModelCutout src={hero.tryOnModelImage} tryOn={tryOn} />
    );

  const stagedModel =
    poster === "skin-analysis" ? (
      <HeroModelCutout fit="stage" />
    ) : (
      <HeroTryOnModelCutout fit="stage" src={hero.tryOnModelImage} tryOn={tryOn} />
    );

  return (
    <>
      {/* Desktop only — locked composition / current model display size */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-10 top-0 z-[56] hidden min-h-0 overflow-visible sm:-bottom-12 lg:block">
        <div className="mx-auto grid h-full min-h-0 max-w-7xl grid-cols-1 px-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(0,0.9fr)] lg:px-8">
          <div className="hidden min-h-0 lg:block" aria-hidden />
          <div className="relative mx-auto h-full min-h-0 w-full max-w-[380px] overflow-visible sm:max-w-[460px] lg:max-w-none">
            {model}
          </div>
          <div className="hidden min-h-0 lg:block" aria-hidden />
        </div>
      </div>

      <div
        id="try-on"
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-end gap-5 px-4 pb-6 pt-2 sm:gap-6 sm:pb-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(0,0.9fr)] lg:gap-4 lg:px-8 lg:pb-10"
      >
        <div className="relative z-[2] order-1 max-w-md self-end">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="type-eyebrow text-brand/90">{hero.badge}</span>
          </div>

          <h1 className="type-display-hero">
            {hero.headline.before}
            <span className="text-brand">{hero.headline.highlight1}</span>
            {hero.headline.middle}
            <span className="text-brand">{hero.headline.highlight2}</span>
            {hero.headline.after}
          </h1>

          <p className="type-caption mt-4 tracking-[0.14em] text-ink-muted">
            {hero.subheadline}
          </p>

          <div className="mt-6 max-w-sm">
            <ShortcutKeysLogo className="max-w-[180px] sm:max-w-[220px]" />
            {hero.subheadlineExtra ? (
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/80">
                {hero.subheadlineExtra}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {hero.posterControls.map((ctrl) => {
              const isActive = poster === ctrl.id;
              return (
                <button
                  key={ctrl.id}
                  type="button"
                  onClick={() => selectPoster(ctrl.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
                    isActive
                      ? "hero-tint-cta border border-brand/40 bg-gradient-to-r from-brand to-[#7b6fd4] text-white shadow-[0_0_0_1px_rgba(155,122,227,0.25),0_8px_24px_rgba(155,122,227,0.35)] ring-2 ring-brand/25"
                      : "border border-brand/25 bg-white/90 text-brand hover:border-brand/45 hover:bg-white",
                  )}
                >
                  {ctrl.label}
                </button>
              );
            })}

            {hero.buttons.map((btn) => (
              <Button key={btn.label} href={btn.href} variant={btn.variant} size="sm">
                {btn.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tablet / phone — model stage inside the banner flow (not a cropped overlay) */}
        <div className="relative order-2 mx-auto h-[min(36svh,20rem)] w-full max-w-[18rem] sm:h-[min(44svh,24rem)] sm:max-w-[22rem] lg:hidden">
          {stagedModel}
        </div>

        <div className="order-2 hidden min-h-[1px] lg:block" aria-hidden />

        <div className="relative z-[70] order-3 flex justify-start pb-1 sm:justify-end lg:self-start lg:pl-2 lg:pt-10">
          {poster === "skin-analysis" ? (
            <HeroStatsStrip className="hero-stats-float" />
          ) : (
            <HeroTryOnPanel tryOn={tryOn} />
          )}
        </div>
      </div>
    </>
  );
}
