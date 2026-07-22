"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** teaser / scan = clean model + dock; match = model above + SKU dock (never text on face) */
export type BrandDemoVariant = "teaser" | "scan" | "match";

const BEAT_MS = 3800;

const ZONES = [
  { label: "Barrier", score: 82 },
  { label: "Tone", score: 76 },
  { label: "Hydration", score: 88 },
];

const SKUS = [
  { code: "SK-H001", name: "Hydro Glow Cream", match: 94 },
  { code: "SK-B001", name: "Bright First Essence", match: 91 },
  { code: "SK-Z001", name: "Daily Soft SPF", match: 89 },
  { code: "SK-D001", name: "Barrier Reset", match: 86 },
];

const DOCK_SHELL =
  "relative z-[2] shrink-0 border-t border-brand/15 bg-surface-dark/72 backdrop-blur-sm";

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduceMotion;
}

/** Clean model — Ken Burns + optional graphic-only scan cue (no labels on face) */
function ModelStage({
  imageSrc,
  imagePosition,
  reduceMotion,
  priority,
  showScanGraphic,
}: {
  imageSrc: string;
  imagePosition: string;
  reduceMotion: boolean;
  priority?: boolean;
  showScanGraphic?: boolean;
}) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div
        className={cn(
          "absolute inset-[-8%]",
          !reduceMotion && "hero-ken-burns",
        )}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: imagePosition }}
          priority={priority}
          sizes="50vw"
        />
      </div>
      {/* Graphic-only landmarks — no text; kept sparse and soft */}
      {showScanGraphic ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span className="brand-demo-landmark absolute left-[32%] top-[34%] h-1.5 w-1.5 rounded-full bg-brand-silver" />
          <span className="brand-demo-landmark absolute left-[54%] top-[32%] h-1.5 w-1.5 rounded-full bg-brand-silver" />
          <span className="brand-demo-landmark absolute left-[43%] top-[48%] h-1.5 w-1.5 rounded-full bg-brand-light" />
          <span className="brand-demo-landmark absolute left-[36%] top-[60%] h-1 w-1 rounded-full bg-brand/70" />
          <span className="brand-demo-landmark absolute left-[52%] top-[62%] h-1 w-1 rounded-full bg-brand/70" />
          {!reduceMotion ? <div className="brand-demo-scan-line" /> : null}
        </div>
      ) : null}
    </div>
  );
}

function ScanDock({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="space-y-1.5 px-2.5 py-2 sm:px-3 sm:py-2.5">
      {ZONES.map((z, i) => (
        <div key={z.label} className="space-y-0.5">
          <div className="flex items-center justify-between gap-1">
            <span className="font-display text-[8px] text-brand-silver sm:text-[9px]">{z.label}</span>
            <span className="font-mono text-[8px] text-brand-light sm:text-[9px]">{z.score}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-brand/20">
            <div
              className={cn(
                "h-full rounded-full bg-brand-light",
                !reduceMotion && "brand-demo-bar-fill",
              )}
              style={{
                width: `${z.score}%`,
                animationDelay: !reduceMotion ? `${i * 100}ms` : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchDock({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
      <ul className="space-y-1">
        {SKUS.map((sku, i) => (
          <li
            key={sku.code}
            className={cn(
              "flex items-center gap-1.5 rounded-sm bg-brand/10 px-1 py-0.5",
              !reduceMotion && "creator-demo-fan-row",
            )}
            style={!reduceMotion ? { animationDelay: `${i * 70}ms` } : undefined}
          >
            <span className="shrink-0 font-mono text-[8px] text-brand-light sm:text-[9px]">{sku.code}</span>
            <span className="min-w-0 flex-1 truncate text-[9px] text-silk">{sku.name}</span>
            <span className="shrink-0 font-mono text-[8px] text-brand-silver sm:text-[9px]">{sku.match}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Brand story — motion on clean model; metrics / SKUs docked below the face.
 */
export function BrandSkinAnalysisDemo({
  imageSrc,
  imagePosition = "62% center",
  variant = "teaser",
  className,
}: {
  imageSrc: string;
  imagePosition?: string;
  variant?: BrandDemoVariant;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [beat, setBeat] = useState<0 | 1>(0);

  useEffect(() => {
    if (reduceMotion || variant !== "teaser") return;
    const id = window.setInterval(() => {
      setBeat((b) => (b === 0 ? 1 : 0));
    }, BEAT_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, variant]);

  const dockMode: "scan" | "match" =
    variant === "match" ? "match" : variant === "scan" ? "scan" : reduceMotion ? "scan" : beat === 0 ? "scan" : "match";

  return (
    <div
      className={cn("absolute inset-0 flex flex-col overflow-hidden", className)}
      aria-hidden
      data-brand-demo={variant}
      data-no-text-on-model="true"
    >
      <ModelStage
        imageSrc={imageSrc}
        imagePosition={imagePosition}
        reduceMotion={reduceMotion}
        priority={variant === "scan"}
        showScanGraphic={variant === "scan" || (variant === "teaser" && dockMode === "scan")}
      />

      <div className={DOCK_SHELL}>
        <div className="flex items-center justify-between px-2.5 pt-1.5 sm:px-3">
          <span className="font-display text-[8px] font-semibold uppercase tracking-[0.14em] text-brand-silver sm:text-[9px]">
            {dockMode === "scan" ? "Skin scan" : "Matched SKUs"}
          </span>
          {variant === "teaser" ? (
            <div className="flex gap-1">
              {([0, 1] as const).map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 w-1 rounded-full",
                    (dockMode === "scan" ? 0 : 1) === i ? "bg-brand-light" : "bg-brand/30",
                  )}
                />
              ))}
            </div>
          ) : (
            <span className="font-mono text-[8px] text-brand-silver/70 sm:text-[9px]">
              {dockMode === "scan" ? "condition" : "catalog"}
            </span>
          )}
        </div>
        {variant === "teaser" ? (
          <div className="relative min-h-[3.75rem] sm:min-h-[4.25rem]">
            <div
              className={cn(
                "creator-demo-panel absolute inset-0",
                dockMode === "scan" ? "creator-demo-panel-active" : "creator-demo-panel-idle",
              )}
            >
              <ScanDock reduceMotion={reduceMotion} />
            </div>
            <div
              className={cn(
                "creator-demo-panel absolute inset-0",
                dockMode === "match" ? "creator-demo-panel-active" : "creator-demo-panel-idle",
              )}
            >
              <MatchDock reduceMotion={reduceMotion} />
            </div>
          </div>
        ) : dockMode === "scan" ? (
          <ScanDock reduceMotion={reduceMotion} />
        ) : (
          <MatchDock reduceMotion={reduceMotion} />
        )}
      </div>
    </div>
  );
}
