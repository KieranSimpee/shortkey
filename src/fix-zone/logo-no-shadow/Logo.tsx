import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { logoMeta } from "@/generated/logoMeta";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
  showTagline?: boolean;
};

/**
 * Replacement home/footer mark (fix-zone): no CSS drop-shadow.
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
        src={`${logoMeta.src}?v=${logoMeta.v}`}
        alt={`${brand.name} — ${brand.tagline}`}
        width={logoMeta.width}
        height={logoMeta.height}
        className={cn(
          "h-auto w-auto shadow-none drop-shadow-none filter-none",
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
