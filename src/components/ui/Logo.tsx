import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { logoMeta } from "@/generated/logoMeta";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** When false, mark-only. Default `/` wraps a home link. */
  href?: string | false;
  /**
   * header \u00b7 bridge (centered across chrome) \u00b7 hero \u00b7 footer \u00b7 icon
   */
  size?: "header" | "bridge" | "hero" | "footer" | "icon";
  /** light = lilac on light \u00b7 dark = soft lilac on Dark Luxury */
  surface?: "dark" | "light";
};

const sizeClass: Record<NonNullable<LogoProps["size"]>, string> = {
  /** Header \u2014 responsive: small on phone, full size on desktop */
  header: "h-9 w-auto max-w-none sm:h-12 md:h-14 lg:h-[1.5in]",
  /** Dual-hero seam \u2014 small top brand bridge, clear of headline copy below */
  bridge:
    "h-auto w-[min(30vw,112px)] max-h-[68px] sm:w-[min(20vw,128px)] sm:max-h-[80px] lg:w-[140px] lg:max-h-[88px]",
  /** Hero \u2014 responsive: smaller on phone, full on desktop */
  hero: "h-12 w-auto max-w-none sm:h-16 md:h-20 lg:h-[1.5in]",
  /** Footer mark \u2014 responsive */
  footer: "h-9 w-auto max-w-none sm:h-12 md:h-14 lg:h-[1.5in]",
  icon: "h-8 w-8",
};

/**
 * SHORTKEY production logo \u2014 lilac (Simplex-ity registered).
 * Never redraw. No filters / shadows / opacity / blend.
 */
export function Logo({
  className,
  href = "/",
  size = "header",
  surface = "light",
}: LogoProps) {
  const { brand } = siteContent;

  const src =
    size === "icon"
      ? `${logoMeta.icon}?v=${logoMeta.v}`
      : surface === "dark"
        ? `${logoMeta.dark}?v=${logoMeta.v}`
        : `${logoMeta.light}?v=${logoMeta.v}`;

  const mark = (
    <Image
      src={src}
      alt={`${brand.name} \u2014 ${brand.tagline}`}
      width={size === "icon" ? 512 : logoMeta.width}
      height={size === "icon" ? 512 : logoMeta.height}
      className={cn(
        sizeClass[size],
        "object-contain",
        size === "bridge" ? "object-center" : "max-w-none object-left",
        className,
      )}
      priority={size === "hero" || size === "header" || size === "bridge"}
      unoptimized
      draggable={false}
    />
  );

  if (href === false) {
    return mark;
  }

  return (
    <Link href={href} className="inline-block" aria-label="shortkey home">
      {mark}
    </Link>
  );
}
