import Image from "next/image";
import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";

type ShortcutKeysLogoProps = {
  className?: string;
};

/**
 * Same visual-locked logo as header — plate cleared, mark intact.
 */
export function ShortcutKeysLogo({ className }: ShortcutKeysLogoProps) {
  const { brand, hero } = siteContent;
  const logoSrc = hero.logoSrc ?? brand.logoSrc;

  return (
    <Image
      src={logoSrc}
      alt="shortkey — ctrl + alt + del"
      width={280}
      height={120}
      className={cn(
        "h-auto w-full max-w-[220px] drop-shadow-[0_8px_18px_rgba(40,25,80,0.22)] sm:max-w-[260px] lg:max-w-[280px]",
        className,
      )}
      priority
    />
  );
}
