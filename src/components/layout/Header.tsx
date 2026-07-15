import { siteContent } from "@/content/homepage";
import { MobileNav } from "@/components/layout/MobileNav";

/**
 * Slim sticky top bar — centered welcome + mobile menu.
 */
export function Header() {
  const { header } = siteContent;

  return (
    <header className="relative sticky top-0 z-[80] border-b border-transparent bg-transparent">
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-end px-4 sm:h-10 lg:px-8">
        <p className="pointer-events-none absolute inset-x-0 truncate px-12 text-center text-[11px] font-medium tracking-[0.04em] text-brand/80 sm:text-[12px]">
          {header.welcome}
        </p>
        <MobileNav />
      </div>
    </header>
  );
}
