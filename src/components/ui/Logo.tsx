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
   * header · bridge (centered across chrome) · hero · footer · icon
   */
  size?: "header" | "bridge" | "hero" | "footer" | "icon";
  /** light = lilac on light · dark = soft lilac on Dark Luxury */
  surface?: "dark" | "light";
};

const sizeClass: Record<NonNullable<LogoProps["size"]>, string> = {
  /** Header / Coming Soon / Signup — founder lock: 1.5in display height */
  header: "h-[1.5in] w-auto max-w-none",
  /** Dual-hero seam — small top brand bridge, clear of headline copy below */
  bridge:
    "h-auto w-[min(30vw,112px)] max-h-[68px] sm:w-[min(20vw,128px)] sm:max-h-[80px] lg:w-[140px] lg:max-h-[88px]",
  hero: "h-[1.5in] w-auto max-w-none",
  /** Footer mark — same 1.5in height as header (Coming Soon dual logos) */
  footer: "h-[1.5in] w-auto max-w-none",
  icon: "h-8 w-8",
};

/**
 * SHORTKEY production logo — lilac (Simplex-ity registered).
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
      alt={`${brand.name} — ${brand.tagline}`}
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
