"use client";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Larger seal for hero; compact for sticky bar */
  size?: "sm" | "md" | "lg";
};

/**
 * Sky AI signifier inside ShortKey = official mark’s S+ (Brand Guidelines V2026).
 * UI seal: S+ turns around → +5 (pre-register). Never replaces the primary logo PNG.
 */
export function SignupPlusFiveSeal({ className, size = "md" }: Props) {
  const dim =
    size === "lg" ? "h-28 w-28 text-[2.75rem]" : size === "sm" ? "h-11 w-11 text-sm" : "h-16 w-16 text-xl";

  return (
    <div
      className={cn("signup-plus-five group relative shrink-0", dim, className)}
      aria-label="Shortkey S plus — pre-register plus five percent"
      title="S+ → +5 · pre-register"
    >
      <div
        className={cn(
          "signup-plus-five-disk relative flex h-full w-full items-center justify-center rounded-full border border-brand/40 bg-white/70 shadow-[0_8px_24px_rgba(80,50,140,0.12)] backdrop-blur-sm",
          "transition-transform duration-700 ease-out group-hover:[transform:rotateY(180deg)]",
          "[transform-style:preserve-3d]",
          size === "lg" && "signup-plus-five-flip",
        )}
      >
        {/* Face A — brand S+ */}
        <span
          className="absolute inset-0 flex items-center justify-center font-bold tracking-tight text-brand [backface-visibility:hidden]"
          aria-hidden
        >
          S+
        </span>
        {/* Face B — turned around = +5 */}
        <span
          className="absolute inset-0 flex items-center justify-center font-bold tracking-tight text-ink [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden
        >
          +5
        </span>
      </div>
    </div>
  );
}

/** Static beauty lockup for when hover-flip isn’t ideal (hero line) */
export function SignupPlusFiveLockup({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.14em]",
        className,
      )}
      aria-label="S plus turns to plus five — pre-register five percent"
    >
      <span className="text-brand">S+</span>
      <span className="text-ink-subtle/50" aria-hidden>
        →
      </span>
      <span className="text-ink">+5</span>
    </span>
  );
}
