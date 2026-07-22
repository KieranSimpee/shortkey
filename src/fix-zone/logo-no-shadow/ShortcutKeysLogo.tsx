import Image from "next/image";
import { logoMeta } from "@/generated/logoMeta";
import { cn } from "@/lib/utils";

type ShortcutKeysLogoProps = {
  className?: string;
};

/**
 * Replacement mark (fix-zone): clear plate, no PNG drop-shadow, no CSS shadow.
 */
export function ShortcutKeysLogo({ className }: ShortcutKeysLogoProps) {
  return (
    <Image
      src={`${logoMeta.src}?v=${logoMeta.v}`}
      alt="shortkey — ctrl + alt + del"
      width={logoMeta.width}
      height={logoMeta.height}
      className={cn(
        "h-auto w-full max-w-[220px] shadow-none drop-shadow-none filter-none sm:max-w-[260px] lg:max-w-[280px]",
        className,
      )}
      priority
    />
  );
}
