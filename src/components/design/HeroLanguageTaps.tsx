"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MARKETS = [
  {
    id: "ja",
    lang: "日本語",
    market: "J-Beauty",
    script: "美麗",
    line: "Minimal · Precise · Timeless",
  },
  {
    id: "ko",
    lang: "한국어",
    market: "K-Beauty",
    script: "뷰티",
    line: "Innovative · Trendsetting · Global",
  },
  {
    id: "zh",
    lang: "简体中文",
    market: "C-Beauty",
    script: "美",
    line: "Modern · Sophisticated · Fast-Growing",
  },
] as const;

type MarketId = (typeof MARKETS)[number]["id"];

/**
 * Coming Soon hero — equal JA / KO / ZH market taps.
 * Same layout for every market — no country photos or one-sided highlights.
 */
export function HeroLanguageTaps() {
  const [active, setActive] = useState<MarketId>("ko");

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-light">
        Asian beauty · three languages
      </p>

      {/* Equal scripts — all three always present */}
      <div className="mt-4 flex items-end justify-center gap-6 sm:gap-10" aria-hidden>
        {MARKETS.map((m) => (
          <span
            key={m.id}
            className={cn(
              "font-display text-3xl font-bold leading-none transition sm:text-4xl",
              active === m.id ? "text-brand-light/90" : "text-white/18",
            )}
          >
            {m.script}
          </span>
        ))}
      </div>

      <div
        role="tablist"
        aria-label="Beauty languages"
        className="mt-4 flex flex-wrap items-center justify-center gap-2"
      >
        {MARKETS.map((m) => {
          const isOn = active === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={isOn}
              aria-controls={`market-panel-${m.id}`}
              id={`market-tab-${m.id}`}
              onClick={() => setActive(m.id)}
              className={cn(
                "min-w-[6.5rem] rounded-md border px-3 py-2.5 text-center transition sm:min-w-[7.5rem]",
                isOn
                  ? "border-white/90 bg-gradient-to-b from-white to-brand-muted text-brand shadow-[0_2px_0_rgba(140,130,252,0.2)]"
                  : "border-white/25 bg-white/5 text-white/80 hover:border-white/45 hover:bg-white/10",
              )}
            >
              <span className="block font-display text-[11px] font-semibold tracking-[0.04em] sm:text-xs">
                {m.lang}
              </span>
              <span
                className={cn(
                  "mt-0.5 block font-display text-[9px] font-semibold uppercase tracking-[0.14em]",
                  isOn ? "text-brand/70" : "text-white/45",
                )}
              >
                {m.market}
              </span>
            </button>
          );
        })}
      </div>

      {/* Equal three-up panel — same card for J, K, and C */}
      <div
        role="tabpanel"
        id={`market-panel-${active}`}
        aria-labelledby={`market-tab-${active}`}
        className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3"
      >
        {MARKETS.map((m) => {
          const isOn = active === m.id;
          return (
            <div
              key={m.id}
              className={cn(
                "rounded-md border px-3 py-4 text-center transition",
                isOn
                  ? "border-brand/45 bg-brand/15"
                  : "border-white/10 bg-white/[0.03]",
              )}
            >
              <p
                className={cn(
                  "font-display text-[10px] font-bold uppercase tracking-[0.16em]",
                  isOn ? "text-brand-light" : "text-white/45",
                )}
              >
                {m.market}
              </p>
              <p
                className={cn(
                  "mt-2 text-[11px] leading-snug sm:text-[12px]",
                  isOn ? "text-white/85" : "text-white/40",
                )}
              >
                {m.line}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-white/45">
        Connecting J-Beauty, K-Beauty &amp; C-Beauty through AI intelligence.
      </p>
    </div>
  );
}
