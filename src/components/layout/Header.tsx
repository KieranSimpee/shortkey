import { MobileNav } from "@/components/layout/MobileNav";

/**
 * Slim sticky top bar — mobile menu only (L1).
 * Hidden at lg+ so an empty sticky band doesn’t sit above brand nav.
 * SKY-UX-018 · Responsive Priority System
 */
export function Header() {
  return (
    <header className="relative sticky top-0 z-[80] border-b border-transparent bg-transparent lg:hidden">
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-end px-4 sm:h-10">
        <MobileNav />
      </div>
    </header>
  );
}
