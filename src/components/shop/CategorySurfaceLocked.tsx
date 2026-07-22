import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ShortcutChip } from "@/components/ui/KeyCap";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";

/**
 * Category market pages locked — header K/J/C Beauty until display-ready.
 */
export function CategorySurfaceLocked({
  title = "Category",
}: {
  title?: string;
}) {
  return (
    <main className="page-shell flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-8">
      <Logo size="header" surface="light" href="/" />
      <ShortcutChip shortcut="Locked" className="mt-6" />
      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        Beauty category pages are locked while we finish layout and display. They open with
        launch — thank you for waiting with us.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-dark"
        >
          Back home
        </Link>
        <Link
          href="/signup/creator"
          className="rounded-full border border-brand/30 px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand transition hover:bg-brand/5"
        >
          Book appointment
        </Link>
      </div>
      <p className="mt-10 text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
    </main>
  );
}
