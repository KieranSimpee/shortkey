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
 * Coming Soon hero — 3 language / market taps (JA · KO · ZH).
 * Informational only — does not open locked category pages.
 * Styled for Shortkey lilac keycap DNA (not Copilot pastel mock).
 */
export function HeroLanguageTaps() {
  const [active, setActive] = useState<MarketId>("ko");
  const current = MARKETS.find((m) => m.id === active) ?? MARKETS[1];

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-light">
        Asian beauty · three languages
      </p>

      <div
        role="tablist"
        aria-label="Beauty languages"
        className="mt-3 flex flex-wrap items-center justify-center gap-2"
      >
        {MARKETS.map((m) => {
          const isOn = active === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={isOn}
              onClick={() => setActive(m.id)}
              className={cn(
                "rounded-md border px-3 py-2 font-display text-[11px] font-semibold transition sm:px-4 sm:text-xs",
                isOn
                  ? "border-white/90 bg-gradient-to-b from-white to-brand-muted text-brand shadow-[0_2px_0_rgba(140,130,252,0.2)]"
                  : "border-white/25 bg-white/5 text-white/80 hover:border-white/45 hover:bg-white/10",
              )}
            >
              <span className="block tracking-[0.04em]">{m.lang}</span>
              <span
                className={cn(
                  "mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.14em]",
                  isOn ? "text-brand/70" : "text-white/45",
                )}
              >
                {m.market}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="relative mt-5 overflow-hidden rounded-md border border-white/15 bg-white/5 px-4 py-5 backdrop-blur-sm"
      >
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[4.5rem] font-bold leading-none text-white/[0.06] sm:text-[5.5rem]"
          aria-hidden
        >
          {current.script}
        </span>
        <p className="relative font-display text-sm font-bold uppercase tracking-[0.16em] text-brand-light">
          {current.market}
        </p>
        <p className="relative mt-2 text-sm leading-relaxed text-white/75">{current.line}</p>
        <p className="relative mt-2 text-[11px] text-white/45">
          Connecting J-Beauty, K-Beauty &amp; C-Beauty through AI intelligence — pages open at
          launch.
        </p>
      </div>
    </div>
  );
}
