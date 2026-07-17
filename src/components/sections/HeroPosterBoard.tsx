"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteContent } from "@/content/homepage";
import type { HeroPosterId, HeroPosterSlide } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { ShortcutKeysLogo } from "@/components/ui/ShortcutKeysLogo";
import { HeroModelCutout } from "@/components/sections/HeroModelCutout";
import { HeroStatsStrip } from "@/components/sections/HeroStatsStrip";
import { HeroLaunchPanel } from "@/components/sections/HeroLaunchPanel";
import { HeroPartnersPanel } from "@/components/sections/HeroPartnersPanel";
import {
  HeroTryOnModelCutout,
  HeroTryOnPanel,
  useHeroTryOnState,
} from "@/components/sections/HeroTryOnStudio";
import { cn } from "@/lib/utils";

function posterFromHash(): HeroPosterId | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.replace(/^#/, "");
  if (h === "try-on" || h.startsWith("try-on")) return "try-on";
  if (h === "skin-analysis") return "skin-analysis";
  if (h === "launch") return "launch";
  if (h === "partners") return "partners";
  return null;
}

function syncHash(id: HeroPosterId) {
  if (id === "try-on") {
    window.history.replaceState(null, "", "#try-on");
  } else if (id === "skin-analysis") {
    window.history.replaceState(null, "", "#skin-analysis");
  } else if (id === "launch") {
    window.history.replaceState(null, "", "#launch");
  } else if (id === "partners") {
    window.history.replaceState(null, "", "#partners");
  }
}

/** Hero board — 4-poster rotation with high-end crossfade + per-slide CTAs */
export function HeroPosterBoard() {
  const { hero } = siteContent;
  const posters = hero.posters as HeroPosterSlide[];
  const rotateMs = hero.rotateMs ?? 7500;
  const [poster, setPoster] = useState<HeroPosterId>(hero.defaultPoster);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const tryOn = useHeroTryOnState();
  const indexRef = useRef(0);

  const activeIndex = Math.max(
    0,
    posters.findIndex((p) => p.id === poster),
  );
  const slide = posters[activeIndex] ?? posters[0];

  const selectPoster = useCallback(
    (id: HeroPosterId, opts?: { manual?: boolean }) => {
      setPoster(id);
      setAnimKey((k) => k + 1);
      setProgress(0);
      syncHash(id);
      const idx = posters.findIndex((p) => p.id === id);
      if (idx >= 0) indexRef.current = idx;
      if (opts?.manual) setPaused(true);
    },
    [posters],
  );

  useEffect(() => {
    const sync = () => {
      const fromHash = posterFromHash();
      if (fromHash) selectPoster(fromHash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [selectPoster]);

  // Auto-rotate with progress
  useEffect(() => {
    if (paused) return;
    const tick = 50;
    const step = (tick / rotateMs) * 100;
    const id = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          const nextIndex = (indexRef.current + 1) % posters.length;
          indexRef.current = nextIndex;
          const nextId = posters[nextIndex].id;
          setPoster(nextId);
          setAnimKey((k) => k + 1);
          syncHash(nextId);
          return 0;
        }
        return next;
      });
    }, tick);
    return () => window.clearInterval(id);
  }, [paused, posters, rotateMs]);

  // Resume auto-rotate after manual pause
  useEffect(() => {
    if (!paused) return;
    const t = window.setTimeout(() => setPaused(false), rotateMs * 1.2);
    return () => window.clearTimeout(t);
  }, [paused, poster, rotateMs]);

  const desktopModel =
    poster === "skin-analysis" ? (
      <HeroModelCutout />
    ) : poster === "try-on" ? (
      <HeroTryOnModelCutout src={hero.tryOnModelImage} tryOn={tryOn} />
    ) : poster === "launch" ? (
      <HeroLaunchStage image={hero.launchImage} />
    ) : (
      <HeroPartnersStage image={hero.partnersImage} />
    );

  const stagedModel =
    poster === "skin-analysis" ? (
      <HeroModelCutout fit="stage" />
    ) : poster === "try-on" ? (
      <HeroTryOnModelCutout fit="stage" src={hero.tryOnModelImage} tryOn={tryOn} />
    ) : poster === "launch" ? (
      <HeroLaunchStage fit="stage" image={hero.launchImage} />
    ) : (
      <HeroPartnersStage fit="stage" image={hero.partnersImage} />
    );

  const sidePanel =
    poster === "skin-analysis" ? (
      <HeroStatsStrip className="hero-stats-float" />
    ) : poster === "try-on" ? (
      <HeroTryOnPanel tryOn={tryOn} />
    ) : poster === "launch" ? (
      <HeroLaunchPanel className="hero-stats-float" />
    ) : (
      <HeroPartnersPanel className="hero-stats-float" />
    );

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {/* Desktop only — locked composition / current model display size */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-10 top-0 z-[56] hidden min-h-0 overflow-visible sm:-bottom-12 lg:block">
        <div className="mx-auto grid h-full min-h-0 max-w-7xl grid-cols-1 px-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(0,0.9fr)] lg:px-8">
          <div className="hidden min-h-0 lg:block" aria-hidden />
          <div
            key={`desk-${animKey}`}
            className="hero-rotate-visual relative mx-auto h-full min-h-0 w-full max-w-[380px] overflow-visible sm:max-w-[460px] lg:max-w-none"
          >
            {desktopModel}
          </div>
          <div className="hidden min-h-0 lg:block" aria-hidden />
        </div>
      </div>

      <div
        id="try-on"
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-end gap-5 px-4 pb-6 pt-2 sm:gap-6 sm:pb-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(0,0.9fr)] lg:gap-4 lg:px-8 lg:pb-10"
      >
        <div
          key={`copy-${animKey}`}
          className="hero-rotate-copy relative z-[2] order-1 max-w-md self-end"
        >
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            <span className="type-eyebrow text-brand/90">{slide.badge}</span>
          </div>

          <h1 className="type-display-hero">
            {slide.headline.before}
            <span className="text-brand">{slide.headline.highlight1}</span>
            {slide.headline.middle}
            <span className="text-brand">{slide.headline.highlight2}</span>
            {slide.headline.after}
          </h1>

          <p className="type-caption mt-4 tracking-[0.14em] text-ink-muted">
            {slide.subheadline}
          </p>

          <div className="mt-6 max-w-sm">
            <ShortcutKeysLogo className="max-w-[180px] sm:max-w-[220px]" />
            {slide.subheadlineExtra ? (
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/80">
                {slide.subheadlineExtra}
              </p>
            ) : null}
          </div>

          {/* Per-slide 3 CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {slide.buttons.map((btn) => {
              const isPosterHash =
                btn.href === "#try-on" ||
                btn.href === "#skin-analysis" ||
                btn.href === "#launch" ||
                btn.href === "#partners";
              if (isPosterHash) {
                const target = btn.href.slice(1) as HeroPosterId;
                return (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => selectPoster(target, { manual: true })}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
                      btn.variant === "highlight"
                        ? "hero-tint-cta border border-brand/40 bg-gradient-to-r from-brand to-[#7b6fd4] text-white shadow-[0_0_0_1px_rgba(155,122,227,0.25),0_8px_24px_rgba(155,122,227,0.35)] ring-2 ring-brand/25"
                        : "border border-brand/25 bg-white/90 text-brand hover:border-brand/45 hover:bg-white",
                    )}
                  >
                    {btn.label}
                  </button>
                );
              }
              return (
                <Button
                  key={btn.label}
                  href={btn.href}
                  variant={btn.variant}
                  size="sm"
                  className={btn.variant === "highlight" ? "hero-tint-cta" : undefined}
                >
                  {btn.label}
                </Button>
              );
            })}
          </div>

          {/* Rotation rail */}
          <div className="mt-7 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {posters.map((p, i) => {
                const active = p.id === poster;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPoster(p.id, { manual: true })}
                    aria-label={`Show ${p.controlLabel}`}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all duration-500",
                      active
                        ? "bg-ink text-white shadow-soft"
                        : "bg-white/50 text-ink-muted hover:bg-white/80 hover:text-ink",
                    )}
                  >
                    <span className="mr-1.5 font-mono text-[8px] opacity-60">0{i + 1}</span>
                    {p.controlLabel}
                  </button>
                );
              })}
            </div>
            <div className="h-[2px] w-full max-w-[220px] overflow-hidden rounded-full bg-brand/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-[#7b6fd4] transition-[width] duration-75 ease-linear"
                style={{ width: `${paused ? 0 : progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tablet / phone — model stage inside the banner flow */}
        <div
          key={`stage-${animKey}`}
          className="hero-rotate-visual relative order-2 mx-auto h-[min(36svh,20rem)] w-full max-w-[18rem] sm:h-[min(44svh,24rem)] sm:max-w-[22rem] lg:hidden"
        >
          {stagedModel}
        </div>

        <div className="order-2 hidden min-h-[1px] lg:block" aria-hidden />

        <div
          key={`panel-${animKey}`}
          className="hero-rotate-panel-enter relative z-[70] order-3 flex justify-start pb-1 sm:justify-end lg:self-start lg:pl-2 lg:pt-10"
        >
          {sidePanel}
        </div>
      </div>

      {/* Anchors for hash CTAs */}
      <div id="skin-analysis" className="sr-only" aria-hidden />
      <div id="launch" className="sr-only" aria-hidden />
      <div id="partners" className="sr-only" aria-hidden />
    </div>
  );
}

function HeroLaunchStage({
  image,
  fit = "desktop",
}: {
  image: string;
  fit?: "desktop" | "stage";
}) {
  const staged = fit === "stage";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none flex min-h-0 items-end justify-center overflow-visible",
        staged ? "absolute inset-0" : "absolute inset-x-0 -bottom-10 top-0 sm:-bottom-12",
      )}
    >
      <div className="relative z-[1] flex h-full w-full min-h-0 items-end justify-center pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className={cn(
            "hero-model-blend max-h-full w-auto object-contain object-bottom",
            staged ? "h-[100%] max-w-[92%]" : "h-[106%] max-w-none",
          )}
        />
      </div>
    </div>
  );
}

function HeroPartnersStage({
  image,
  fit = "desktop",
}: {
  image: string;
  fit?: "desktop" | "stage";
}) {
  const staged = fit === "stage";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none flex min-h-0 items-end justify-center overflow-visible",
        staged ? "absolute inset-0" : "absolute inset-x-0 -bottom-10 top-0 sm:-bottom-12",
      )}
    >
      <div className="relative z-[1] flex h-full w-full min-h-0 items-end justify-center pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className={cn(
            "hero-model-blend max-h-full w-auto object-contain object-bottom",
            staged ? "h-[100%] max-w-[92%]" : "h-[106%] max-w-none",
          )}
        />
      </div>
    </div>
  );
}
