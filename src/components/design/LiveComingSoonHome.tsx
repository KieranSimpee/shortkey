import Link from "next/link";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const KEYCAP_CTA =
  "!rounded-md !normal-case !tracking-wide border border-white/90 bg-gradient-to-b from-white to-brand-muted !text-brand shadow-[0_2px_0_rgba(140,130,252,0.2),0_4px_12px_rgba(140,130,252,0.1)] hover:!bg-brand-muted hover:!text-brand";

/**
 * Public shortkey.live — Coming Soon gate (Phase 2).
 * Founder homework ready 2026-07-23 · Full Rebuild preview: /control/live.html
 * Honest public surface only — no fake streams, shop grids, or unlock of featureLocks.
 */
export function LiveComingSoonHome() {
  return (
    <div className="relative min-h-screen bg-silk text-ink">
      <header className="relative z-20 border-b border-white/40 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
          <Logo size="header" surface="light" />
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
            shortkey.live
          </p>
        </div>
      </header>

      <section
        aria-label="ShortKey Live Coming Soon"
        className="relative isolate overflow-hidden bg-surface-dark px-4 py-20 text-white sm:px-8 sm:py-28 lg:py-32"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(140,130,252,0.3), transparent 62%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="type-display-hero text-brand-light">Coming Soon</p>
          <h1 className="type-display-hero mt-3 text-white">ShortKey Live</h1>
          <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-light sm:text-base">
            Live streaming · calendar · creator go-live
          </p>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            The livestream hub is ready to wire — schedule, watch, and creator paths
            land here after Phase 1. Meanwhile, join ShortKey Beauty and book a
            creator appointment if you want to go live with us.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/signup/creator" variant="primary" size="md" className={KEYCAP_CTA}>
              Book creator appointment
            </Button>
            <Button
              href="https://shortkey.beauty"
              variant="primary"
              size="md"
              className={KEYCAP_CTA}
            >
              Visit shortkey.beauty
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-silk px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <Logo size="footer" surface="light" />
          <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Legal">
            <Link href="/privacy" className="type-caption transition-colors hover:text-brand">
              Privacy
            </Link>
            <Link href="/terms" className="type-caption transition-colors hover:text-brand">
              Terms
            </Link>
            <a
              href="mailto:creators@shortkey.beauty"
              className="type-caption transition-colors hover:text-brand"
            >
              creators@shortkey.beauty
            </a>
          </nav>
          <p className="type-caption text-ink-muted">
            © {new Date().getFullYear()} ShortKey · shortkey.live
          </p>
          <p className="mt-1 text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
        </div>
      </footer>
    </div>
  );
}
