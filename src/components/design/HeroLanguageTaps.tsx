"use client";

import { cn } from "@/lib/utils";
import {
  COMING_SOON_LOCALES,
  type ComingSoonLocale,
} from "@/components/design/comingSoonMessages";

type Props = {
  value: ComingSoonLocale;
  onChange: (locale: ComingSoonLocale) => void;
  label: string;
  /** Pearl / light hero vs legacy on-dark */
  tone?: "light" | "dark";
};

/**
 * Coming Soon — compact page language switcher (translates signup copy).
 * Not a J/K/C Beauty market switcher; does not unlock category routes.
 * Board locales: EN / 繁中 / KO.
 */
export function HeroLanguageTaps({ value, onChange, label, tone = "light" }: Props) {
  const isLight = tone === "light";

  return (
    <div className="mx-auto mt-7 max-w-2xl sm:mt-8">
      <p
        className={cn(
          "font-display text-[10px] font-semibold uppercase tracking-[0.2em]",
          isLight ? "text-brand" : "text-brand-light",
        )}
      >
        {label}
      </p>
      <div
        role="group"
        aria-label={label}
        className="mt-3 flex flex-wrap items-center justify-center gap-2"
      >
        {COMING_SOON_LOCALES.map((locale) => {
          const isOn = value === locale.id;
          return (
            <button
              key={locale.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => onChange(locale.id)}
              className={cn(
                "min-w-[4.25rem] rounded-md border px-3 py-2 text-center font-display text-[11px] font-semibold tracking-[0.04em] transition sm:min-w-[5rem] sm:text-xs",
                isOn
                  ? "border-brand/40 bg-gradient-to-b from-white to-brand-muted text-brand shadow-[0_2px_0_rgba(140,130,252,0.18)]"
                  : isLight
                    ? "border-brand/20 bg-white/70 text-ink-muted hover:border-brand/40 hover:bg-white hover:text-ink"
                    : "border-white/25 bg-white/5 text-white/80 hover:border-white/45 hover:bg-white/10",
              )}
            >
              {locale.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
