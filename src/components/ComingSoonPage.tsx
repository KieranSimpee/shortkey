import { ShortcutKeysLogo } from "@/components/ui/ShortcutKeysLogo";

/** Temporary public landing — disable via `COMING_SOON` in `src/lib/comingSoon.ts`. */
export function ComingSoonPage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.55)_0%,rgba(235,228,246,0.2)_45%,transparent_75%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center">
        <p className="type-eyebrow text-brand/90">Shortkey</p>

        <h1 className="type-display-hero mt-5">
          Coming <span className="text-brand">soon</span>
        </h1>

        <p className="type-caption mt-5 max-w-md tracking-[0.12em] text-ink-muted">
          The first AI-powered Asian beauty platform is almost ready.
        </p>

        <div className="mt-10 w-full max-w-[220px]">
          <ShortcutKeysLogo className="mx-auto max-w-[220px]" />
        </div>

        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/70">
          Your style. Your ctrl.
        </p>
      </div>
    </div>
  );
}
