import Link from "next/link";
import { CartNavButton } from "@/components/commerce/CartNavButton";
import { CATEGORY_SURFACE_LOCKED } from "@/content/featureLocks";
import { siteContent } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/**
 * COMP-010 NAVIGATION — L1 logo left · markets · search · cart · AI Lab
 * Home hero carries the large brand mark (SKY-UX-022).
 * Category nav locked when featureLocks.categorySurface is true.
 */
export function HeaderBrandSection() {
  const { header } = siteContent;

  return (
    <section
      aria-label="Brand navigation"
      data-comp="COMP-010"
      className="relative z-[54] min-h-[3.75rem] border-b border-brand/10 bg-white sm:min-h-[4rem]"
    >
      <div className="mx-auto flex h-full min-h-[3.75rem] max-w-7xl flex-nowrap items-center justify-between gap-2 px-3 py-2 sm:min-h-[4rem] sm:gap-3 sm:px-4 sm:py-2.5 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-5">
          <div className="shrink-0">
            <Logo size="header" surface="light" href="/" />
          </div>

          {!CATEGORY_SURFACE_LOCKED ? (
            <nav
              className="hidden min-w-0 items-center gap-1 md:flex"
              aria-label="Beauty markets"
            >
              {header.nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative z-[60] rounded-full px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.12em]",
                    "text-ink-muted transition-colors hover:bg-brand/10 hover:text-brand",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="relative z-[70] flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          <label className="relative hidden min-w-0 sm:block sm:w-[140px] md:w-[180px] lg:w-[220px]">
            <span className="sr-only">Search</span>
            <input
              type="search"
              name="q"
              placeholder={header.searchPlaceholder}
              className="relative z-[60] h-8 w-full rounded-full border border-brand/25 bg-silk px-3 pr-8 text-[10px] uppercase tracking-[0.1em] text-ink placeholder:text-ink-subtle outline-none transition focus:border-brand/50 focus:bg-white"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-brand/60">
              <SearchIcon />
            </span>
          </label>

          <div className="relative z-[60] flex items-center gap-0.5">
            <IconButton label="Search" className="sm:hidden">
              <SearchIcon />
            </IconButton>
            <IconButton label="Account">
              <UserIcon />
            </IconButton>
            <CartNavButton />
          </div>

          <Button
            href={header.cta.href}
            size="sm"
            className="relative z-[60] !px-2.5 !py-1.5 !text-[10px] whitespace-nowrap sm:!px-3"
          >
            <span className="sm:hidden">AI LAB +</span>
            <span className="hidden sm:inline">{header.cta.label}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

function IconButton({
  label,
  badge,
  children,
  className = "",
}: {
  label: string;
  badge?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`relative rounded-full p-1.5 text-brand/80 transition-colors hover:bg-brand/10 hover:text-brand ${className}`}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand font-numbers text-[9px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
