"use client";

import { siteContent } from "@/content/homepage";
import { useBeautyOs } from "@/components/beauty-os/BeautyOsProvider";
import { BeautyOsProductRow } from "@/components/beauty-os/BeautyOsProductRow";
import { cn } from "@/lib/utils";

export function HeroShortcutBar() {
  const { beautyOs } = siteContent;
  const { activeId, setActiveId } = useBeautyOs();

  return (
    <div className="relative z-10 mt-2 px-4 lg:mt-3 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-1 flex items-center gap-2 px-1">
          <BarcodeIcon />
          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-ink-muted sm:text-[10px]">
            {beautyOs.label}
          </span>
        </div>

        <div
          role="tablist"
          aria-label={beautyOs.label}
          className="flex min-w-0 items-end gap-3 overflow-x-auto overflow-y-hidden sm:gap-5"
        >
          {beautyOs.categories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className={cn(
                "flex min-w-0 shrink-0 items-end gap-2 sm:gap-3",
                categoryIndex > 0 && "border-l border-white/30 pl-3 sm:pl-5",
              )}
            >
              <span className="mb-1.5 shrink-0 self-center text-[8px] font-semibold uppercase tracking-[0.16em] text-ink-muted sm:mb-2 sm:text-[9px]">
                {category.label}
              </span>
              <div className="flex items-end gap-0.5 sm:gap-1">
                {category.shortcuts.map((tab) => {
                  const isActive = activeId === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setActiveId(tab.id);
                      }}
                      className={cn(
                        "folder-tab group relative shrink-0 px-3 py-1 text-center leading-tight transition-all sm:px-4 sm:py-1.5",
                        isActive ? "folder-tab-active z-10" : "folder-tab-inactive z-0",
                      )}
                    >
                      <span
                        className={cn(
                          "block text-[10px] font-semibold uppercase tracking-[0.06em] sm:text-[11px]",
                          isActive ? "text-brand" : "text-ink/70 group-hover:text-ink",
                        )}
                      >
                        {tab.shortcut}
                      </span>
                      <span
                        className={cn(
                          "block text-[10px] leading-tight sm:text-[11px]",
                          isActive ? "text-brand/80" : "text-ink-muted",
                        )}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="folder-panel -mt-px rounded-b-2xl rounded-tr-2xl border border-white/60 px-3 py-3 sm:px-4 sm:py-4">
          <BeautyOsProductRow />
        </div>
      </div>
    </div>
  );
}

function BarcodeIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 18 22" fill="none" aria-hidden>
      {[0, 3, 5, 7, 9, 11, 14, 16].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={2}
          width={i % 3 === 0 ? 2 : 1}
          height={14}
          fill="currentColor"
          className="text-ink/60"
        />
      ))}
    </svg>
  );
}
