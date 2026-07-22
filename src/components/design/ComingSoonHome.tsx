import Image from "next/image";
import Link from "next/link";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { EmailCaptureForm } from "@/components/signup/EmailCaptureForm";
import { HeroLanguageTaps } from "@/components/design/HeroLanguageTaps";

const KEYCAP_CTA =
  "!rounded-md !normal-case !tracking-wide border border-white/90 bg-gradient-to-b from-white to-brand-muted !text-brand shadow-[0_2px_0_rgba(140,130,252,0.2),0_4px_12px_rgba(140,130,252,0.1)] hover:!bg-brand-muted hover:!text-brand";

const TRY_ON_IMG = "/images/posters/hero/hero-bloom-skin.png";
const SKIN_IMG = "/images/posters/hero/hero-skin-analysis.png";

/**
 * Public shortkey.beauty — Coming Soon / Pre-Register.
 * Blueprint: SHORTKEY_MASTER_BLUEPRINT_v1.md § Public experience.
 * Gor Gor Review required before any public push — see FAMILY_SPRINT_SONNET5_LEAD.md.
 *
 * Allowed sections only: Hero · AI Try-On Preview (light) · Skin Analysis Preview (light) ·
 * Creator Signup CTA · Brand Signup CTA · Email Capture · Social Proof Placeholder · Premium Footer.
 * No Product Grid, Store, Pricing, Creator Twin mechanics, or Content Studio/admin surfaces.
 */
export function ComingSoonHome() {
  return (
    <div className="relative min-h-screen bg-silk text-ink">
      {/* Minimal top bar — logo only, no shop nav/cart/search */}
      <header className="relative z-20 border-b border-white/40 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
          <Logo size="header" surface="light" />
        </div>
      </header>

      {/* Hero — one composition: eyebrow, headline, tagline, CTAs. No cards, no stacked focal points. */}
      <section
        aria-label="Shortkey — AI Asian Beauty Platform, Coming Soon"
        className="relative isolate overflow-hidden bg-surface-dark px-4 py-16 text-white sm:px-8 sm:py-24 lg:py-28"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(140,130,252,0.28), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="type-display-hero text-brand-light">Coming Soon</p>
          <h1 className="type-display-hero mt-3 text-white">AI Asian Beauty Platform</h1>
          <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-light sm:text-base">
            Your Style. Your CTRL.
          </p>
          <h2 className="mt-8 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            A Warm Welcome to Our Shared Beauty Space
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            We believe in the power of moving forward together. Whether you are a brand ready to
            expand or a creator ready to inspire, let&apos;s cultivate a supportive space for Asian
            beauty to thrive globally.
          </p>
          <HeroLanguageTaps />
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/signup/creator" variant="primary" size="md" className={KEYCAP_CTA}>
              Book Creator Appointment
            </Button>
            <Button href="/signup/brand" variant="primary" size="md" className={KEYCAP_CTA}>
              Book Brand Appointment
            </Button>
          </div>
          <div className="mx-auto mt-8 max-w-md">
            <EmailCaptureForm surface="dark" buttonClassName={KEYCAP_CTA} />
            <p className="mt-2 text-[11px] text-white/50">
              No spam — just one email before launch.
            </p>
          </div>
        </div>
      </section>

      {/* AI Try-On Preview (light) — static, no mechanics or matched-SKU detail exposed */}
      <section className="border-b border-brand/10 bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="type-section-muted text-brand">AI Try-On</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              See the shade on your face — before you buy.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
              Point your camera, try a shade, decide in seconds. AI Try-On opens with launch.
            </p>
          </div>
          <div className="order-1 aspect-[4/3] overflow-hidden rounded-card border border-brand/10 shadow-card lg:order-2">
            <div className="relative h-full w-full">
              <Image
                src={TRY_ON_IMG}
                alt="AI Try-On preview"
                fill
                className="object-cover"
                style={{ objectPosition: "62% center" }}
                sizes="(min-width: 1024px) 480px, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-dark/70 to-transparent p-4">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Try-On Preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skin Analysis Preview (light) — static, no metrics/SKU-match detail exposed */}
      <section className="border-b border-brand/10 bg-silk px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-card border border-brand/10 shadow-card">
            <div className="relative h-full w-full">
              <Image
                src={SKIN_IMG}
                alt="Skin Analysis preview"
                fill
                className="object-cover"
                style={{ objectPosition: "62% center" }}
                sizes="(min-width: 1024px) 480px, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-dark/70 to-transparent p-4">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Skin Analysis Preview
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="type-section-muted text-brand">Skin Analysis</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              An AI skin read, matched to your routine.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
              Understand your skin, then discover what actually fits it. Skin Analysis opens with
              launch.
            </p>
          </div>
        </div>
      </section>

      {/* Creator appointment CTA */}
      <section id="creator" className="border-b border-brand/10 bg-white px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <p className="type-section-muted text-brand">For Creators</p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Book a meeting — appointment only for now.
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Arrange a 1-hour appointment. Rates and offers stay in the conversation.
            </p>
          </div>
          <Button href="/signup/creator" variant="primary" size="md">
            Book Creator Appointment
          </Button>
        </div>
      </section>

      {/* Brand appointment CTA */}
      <section id="brand" className="border-b border-brand/10 bg-surface-dark px-4 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-light">
              For Brands
            </p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
              Book a meeting — appointment only for now.
            </h2>
            <p className="mt-2 text-sm text-white/65">
              Arrange a 1-hour appointment. Founding terms stay in the conversation.
            </p>
          </div>
          <Button href="/signup/brand" variant="outline-light" size="md">
            Book Brand Appointment
          </Button>
        </div>
      </section>

      {/* Social Proof Placeholder — reserved slot, no fabricated stats */}
      <section className="border-b border-brand/10 bg-white px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="type-section-muted text-brand">Already Joining</p>
          <p className="mt-2 text-sm text-ink-muted">
            Creators and brands across K-Beauty, J-Beauty, and C-Beauty are pre-registering ahead
            of launch.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {["Creators", "K-Beauty Brands", "J-Beauty Brands", "C-Beauty Brands"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-brand/15 bg-brand/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer — logo, legal, contact. No shop/store/product links. */}
      <footer className="bg-silk px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <Logo size="footer" surface="light" />
          <p className="type-caption text-brand/60">Your Style. Your CTRL.</p>
          <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Legal">
            <Link href="/privacy" className="type-caption transition-colors hover:text-brand">
              Privacy
            </Link>
            <Link href="/terms" className="type-caption transition-colors hover:text-brand">
              Terms
            </Link>
            <Link href="/cookies" className="type-caption transition-colors hover:text-brand">
              Cookies
            </Link>
            <a
              href="mailto:info@shortkey.beauty"
              className="type-caption transition-colors hover:text-brand"
            >
              info@shortkey.beauty
            </a>
          </nav>
          <p className="type-caption text-ink-muted">© 2026 Shortkey. All rights reserved.</p>
          <p className="mt-1 text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
        </div>
      </footer>
    </div>
  );
}
