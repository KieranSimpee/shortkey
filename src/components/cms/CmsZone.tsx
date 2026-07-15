"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getZoneById, zoneStatusColors, type ZoneStatus } from "@/content/zones";
import { useContentStudioSafe } from "@/components/cms/ContentStudioProvider";

type CmsZoneProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function CmsZone({ id, children, className }: CmsZoneProps) {
  const studio = useContentStudioSafe();
  const ref = useRef<HTMLDivElement>(null);

  const isSelected = studio?.selectedZoneId === id;
  const status: ZoneStatus = studio?.annotations[id]?.status ?? "none";
  const isTargetMode = studio?.isTargetMode ?? false;
  const isActive = isTargetMode || studio?.isOpen;
  const zone = getZoneById(id);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSelected]);

  if (!studio) {
    return <div className={className}>{children}</div>;
  }

  const handleClick = (e: MouseEvent) => {
    if (!isTargetMode) return;
    e.preventDefault();
    e.stopPropagation();
    studio.selectZone(id);
  };

  return (
    <div
      ref={ref}
      data-cms-zone={id}
      onClickCapture={isTargetMode ? handleClick : undefined}
      className={cn("relative", isTargetMode && "cursor-crosshair", className)}
    >
      {children}

      {isActive && (
        <>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 z-[60] rounded-sm transition-all duration-200",
              isSelected && "ring-2 ring-brand ring-offset-2",
              !isSelected && status === "needs-change" && "ring-2 ring-red-400/60",
              !isSelected && status === "in-progress" && "ring-2 ring-sky-400/60",
              !isSelected && status === "review" && "ring-2 ring-brand/50",
              !isSelected && status === "approved" && "ring-2 ring-emerald-400/50",
              isTargetMode && !isSelected && status === "none" && "ring-1 ring-brand/20",
            )}
          />

          {(isSelected || isTargetMode || status !== "none") && (
            <div
              className={cn(
                "pointer-events-none absolute left-3 top-3 z-[61] flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md",
                isSelected ? "bg-brand" : "bg-ink/75",
              )}
            >
              {zone?.label ?? id}
              {status !== "none" && (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: zoneStatusColors[status] }}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
