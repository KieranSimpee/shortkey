import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";

type Props = {
  /** dark = hero Dark Luxury · light = light surfaces */
  surface?: "dark" | "light";
  className?: string;
};

/**
 * Hero brand as wording (SKY-UX-021).
 * Official PNG mark lives on the centered bridge — hero uses type only
 * to avoid keycap fringe on dark and keep L1 clarity.
 */
export function BrandWordmark({ surface = "dark", className }: Props) {
  const { brand } = siteContent;
  const onDark = surface === "dark";

  return (
    <div className={cn("select-none", className)}>
      <p
        className={cn(
          "font-display text-[2rem] font-bold lowercase leading-none tracking-tight sm:text-[2.35rem] lg:text-[2.6rem]",
          onDark ? "text-brand-light" : "text-brand",
        )}
      >
        {brand.name}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]",
          onDark ? "text-white/75" : "text-ink-muted",
        )}
      >
        {brand.tagline}
      </p>
    </div>
  );
}
