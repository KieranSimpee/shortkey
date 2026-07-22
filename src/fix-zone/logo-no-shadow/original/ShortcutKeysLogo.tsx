import Image from "next/image";
import { logoMeta } from "@/generated/logoMeta";
import { cn } from "@/lib/utils";

type ShortcutKeysLogoProps = {
  className?: string;
};

/**
 * Sky workflow mark: visual-lock → plate clear (`shortkey-logo-clear.png`).
 * `logoMeta.v` busts browser cache after each workflow run.
 */
export function ShortcutKeysLogo({ className }: ShortcutKeysLogoProps) {
  return (
    <Image
      src={`${logoMeta.src}?v=${logoMeta.v}`}
      alt="shortkey — ctrl + alt + del"
      width={logoMeta.width}
      height={logoMeta.height}
      className={cn(
        "h-auto w-full max-w-[220px] drop-shadow-none sm:max-w-[260px] lg:max-w-[280px]",
        className,
      )}
      priority
    />
  );
}
