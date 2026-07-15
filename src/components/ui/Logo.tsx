import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
  showTagline?: boolean;
};

/**
 * Uses locked-then-cleared logo (black plate removed from original visual lock).
 * Sits on the atmosphere without a backing card.
 */
export function Logo({ className, href = "/", showTagline = false }: LogoProps) {
  const { brand } = siteContent;

  return (
    <Link
      href={href}
      className="inline-block transition-opacity hover:opacity-85"
      aria-label="shortkey home"
    >
      <Image
        src={brand.logoSrc}
        alt={`${brand.name} — ${brand.tagline}`}
        width={280}
        height={120}
        className={cn(
          "h-auto w-auto drop-shadow-[0_4px_12px_rgba(40,25,80,0.2)]",
          showTagline
            ? "max-w-[180px] sm:max-w-[220px] lg:max-w-[240px]"
            : "max-w-[120px] sm:max-w-[140px]",
          className,
        )}
        priority
      />
    </Link>
  );
}
