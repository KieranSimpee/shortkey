"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** teaser / live = clean model stage; studio = model above + UI dock below (never on face) */
export type CreatorDemoVariant = "teaser" | "live" | "studio";

const BEAT_MS = 3600;

const CHAT = [
  { user: "Soojin", text: "soft coral on me?" },
  { user: "Mira K.", text: "trying the cushion now" },
  { user: "Aiko", text: "glow looks so natural" },
  { user: "Lin Wei", text: "shade 21 matches" },
  { user: "Hana", text: "adding to bag ♡" },
];

/** Fan status dots — brand lilac scale only (locked tokens) */
const FANS = [
  { name: "Soojin", status: "Trying Soft Coral", tint: "bg-brand-light" },
  { name: "Mira K.", status: "Cushion #21", tint: "bg-brand" },
  { name: "Yuna", status: "Glow balm", tint: "bg-brand-silver" },
  { name: "Aiko", status: "Watching try-on", tint: "bg-silk-dark" },
];

/** Try-on swatches — silk / brand / brand-light / brand-dark */
const SHADES = ["bg-brand-silver", "bg-brand-light", "bg-brand", "bg-brand-dark"] as const;

const LIVE_BADGE =
  "inline-flex items-center gap-1 rounded-sm bg-brand px-1.5 py-0.5 font-display text-[8px] font-bold uppercase tracking-wider text-white sm:text-[9px]";

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

/** Clean model stage — Ken Burns only; zero text/chrome on the person */
function ModelStage({
  imageSrc,
  imagePosition,
  reduceMotion,
  priority,
}: {
  imageSrc: string;
  imagePosition: string;
  reduceMotion: boolean;
  priority?: boolean;
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
    </div>
  );
}

function TryOnDock({
  imageSrc,
  reduceMotion,
}: {
  imageSrc: string;
  reduceMotion: boolean;
}) {
  return (
    <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-sm border border-brand/30 sm:h-14 sm:w-10">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "60% 18%" }}
            sizes="40px"
          />
          {!reduceMotion ? <div className="creator-demo-shade-sweep" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex gap-1">
            {SHADES.map((swatch, i) => (
              <span
                key={swatch}
                className={cn(
                  "h-3 w-3 rounded-full border border-brand-light/40 sm:h-3.5 sm:w-3.5",
                  swatch,
                  i === 1 && "ring-1 ring-brand-light ring-offset-1 ring-offset-surface-dark",
                )}
              />
            ))}
          </div>
          <p className="mt-1 font-mono text-[8px] text-brand-light sm:text-[9px]">+48 trying · Soft Coral</p>
        </div>
      </div>
    </div>
  );
}

function FansDock({
  chatIndex,
  reduceMotion,
}: {
  chatIndex: number;
  reduceMotion: boolean;
}) {
  const comment = CHAT[chatIndex % CHAT.length];
  return (
    <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
      <ul className="space-y-1">
        {FANS.slice(0, 3).map((fan, i) => (
          <li
            key={fan.name}
            className={cn(
              "flex items-center gap-1.5",
              !reduceMotion && "creator-demo-fan-row",
            )}
            style={!reduceMotion ? { animationDelay: `${i * 70}ms` } : undefined}
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full border border-brand-light/35",
                fan.tint,
              )}
            />
            <span className="min-w-0 flex-1 truncate font-display text-[9px] text-silk">
              {fan.name}
            </span>
            <span className="shrink-0 text-[8px] text-brand-silver sm:text-[9px]">{fan.status}</span>
          </li>
        ))}
      </ul>
      <p
        className={cn(
          "mt-1.5 border-t border-brand/20 pt-1.5 text-[8px] text-brand-silver sm:text-[9px]",
          !reduceMotion && "creator-demo-chat-in",
        )}
      >
        <span className="text-brand-light">{comment.user}</span>
        {" · "}
        {comment.text}
      </p>
    </div>
  );
}

function LiveDock({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-2.5 sm:px-3">
      <span
        className={cn(LIVE_BADGE, !reduceMotion && "creator-demo-live-pulse")}
      >
        <span className="h-1 w-1 rounded-full bg-silk" />
        Live
      </span>
      <span className="font-mono text-[9px] text-brand-silver">1.2k</span>
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-brand/20">
        <span
          className={cn(
            "block h-full w-2/3 rounded-full bg-brand-light",
            !reduceMotion && "brand-demo-bar-fill",
          )}
        />
      </span>
      <span className="font-display text-[8px] uppercase tracking-[0.12em] text-brand-silver/80">
        watching
      </span>
    </div>
  );
}

/**
 * Creator story — Ken Burns on clean model; all UI in a dock below the face.
 */
export function CreatorLiveTryOnDemo({
  imageSrc,
  imagePosition = "62% center",
  variant = "teaser",
  className,
}: {
  imageSrc: string;
  imagePosition?: string;
  variant?: CreatorDemoVariant;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [studioBeat, setStudioBeat] = useState<0 | 1>(0);
  const [chatIndex, setChatIndex] = useState(0);
  const [teaserBeat, setTeaserBeat] = useState<0 | 1>(0);

  useEffect(() => {
    if (reduceMotion || variant !== "studio") return;
    const id = window.setInterval(() => {
      setStudioBeat((b) => (b === 0 ? 1 : 0));
    }, BEAT_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, variant]);

  useEffect(() => {
    if (reduceMotion || variant !== "teaser") return;
    const id = window.setInterval(() => {
      setTeaserBeat((b) => (b === 0 ? 1 : 0));
    }, BEAT_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, variant]);

  useEffect(() => {
    if (reduceMotion) return;
    if (variant !== "studio" && variant !== "teaser") return;
    const id = window.setInterval(() => {
      setChatIndex((i) => (i + 1) % CHAT.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [reduceMotion, variant]);

  const dockBeat = variant === "studio" ? (reduceMotion ? 1 : studioBeat) : reduceMotion ? 0 : teaserBeat;

  return (
    <div
      className={cn("absolute inset-0 flex flex-col overflow-hidden", className)}
      aria-hidden
      data-creator-demo={variant}
      data-no-text-on-model="true"
    >
      <ModelStage
        imageSrc={imageSrc}
        imagePosition={imagePosition}
        reduceMotion={reduceMotion}
        priority={variant !== "studio"}
      />

      <div className={DOCK_SHELL}>
        {variant === "live" ? (
          <LiveDock reduceMotion={reduceMotion} />
        ) : (
          <>
            <div className="flex items-center justify-between px-2.5 pt-1.5 sm:px-3">
              <div className="flex items-center gap-1.5">
                {variant === "teaser" ? (
                  <span
                    className={cn(
                      LIVE_BADGE,
                      "!px-1 !py-0.5 !text-[7px]",
                      !reduceMotion && "creator-demo-live-pulse",
                    )}
                  >
                    <span className="h-1 w-1 rounded-full bg-silk" />
                    Live
                  </span>
                ) : null}
                <span className="font-display text-[8px] font-semibold uppercase tracking-[0.14em] text-brand-silver sm:text-[9px]">
                  {dockBeat === 0 ? "Trying on" : "Comments"}
                </span>
              </div>
              <div className="flex gap-1">
                {([0, 1] as const).map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 w-1 rounded-full",
                      i === dockBeat ? "bg-brand-light" : "bg-brand/30",
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="relative min-h-[3.5rem] sm:min-h-[4rem]">
              <div
                className={cn(
                  "creator-demo-panel absolute inset-0",
                  dockBeat === 0 ? "creator-demo-panel-active" : "creator-demo-panel-idle",
                )}
              >
                <TryOnDock imageSrc={imageSrc} reduceMotion={reduceMotion} />
              </div>
              <div
                className={cn(
                  "creator-demo-panel absolute inset-0",
                  dockBeat === 1 ? "creator-demo-panel-active" : "creator-demo-panel-idle",
                )}
              >
                <FansDock chatIndex={chatIndex} reduceMotion={reduceMotion} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
