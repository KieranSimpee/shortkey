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
};

/**
 * Coming Soon — compact page language switcher (translates signup copy).
 * Not a J/K/C Beauty market switcher; does not unlock category routes.
 */
export function HeroLanguageTaps({ value, onChange, label }: Props) {
  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-light">
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
                "min-w-[4.5rem] rounded-md border px-3 py-2 text-center font-display text-[11px] font-semibold tracking-[0.04em] transition sm:min-w-[5.25rem] sm:text-xs",
                isOn
                  ? "border-white/90 bg-gradient-to-b from-white to-brand-muted text-brand shadow-[0_2px_0_rgba(140,130,252,0.2)]"
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
