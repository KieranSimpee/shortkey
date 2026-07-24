import type { ReactNode } from "react";

/**
 * shortkey.studio P0 — DNA Control Room (internal preview only).
 * Concept: One DNA. Many doors.
 * No backend · no login · no secrets · not production ready.
 */

const DNA_POINTS = [
  "Creator-first, brand-ready",
  "Asian beauty bridge",
  "Link-based promotion first",
  "ROI reporting is the value",
  "Simple transparent packages",
  "Trust and protection",
  "Premium editorial beauty",
  "Internal logic stays internal",
] as const;

const DOMAIN_MAP = [
  { domain: "shortkey.studio", purpose: "Internal DNA, assets, control room" },
  { domain: "shortkey.social", purpose: "Creator Early Access and waitlist" },
  { domain: "shortkey.beauty", purpose: "Main public beauty entrance" },
  { domain: "shortkey.live", purpose: "Future live layer, not main priority" },
  { domain: "shortkey.info", purpose: "Brand information and onboarding" },
  { domain: "shortkey.world", purpose: "Global expansion future layer" },
  { domain: "shortkey.store", purpose: "Consumer product discovery later" },
  { domain: "family.shortkey.world", purpose: "Internal AI Family Home only" },
] as const;

const COPY_BLOCKS = [
  {
    label: "Brand line",
    text: "ShortKey helps Asian beauty brands enter new markets through creator discovery, trackable campaigns, and clear performance reporting.",
  },
  {
    label: "Creator line",
    text: "ShortKey helps beauty creators become discoverable to brands looking for authentic product storytelling.",
  },
  {
    label: "Safety line",
    text: "Registration does not guarantee selection, paid campaigns, income, or sales results.",
  },
  {
    label: "Value line",
    text: "ShortKey is built around clarity: approved assets, link-based promotion, objective completion, and measurable reporting.",
  },
] as const;

const BUILD_ORDER = [
  "Studio P0",
  "Social P0",
  "Beauty polish",
  "Info brand page",
  "Live later",
  "World future",
] as const;

export function DnaControlRoom() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-silk to-silk-dark/50 text-ink">
      {/* Soft pearl atmosphere — no dark purple SaaS glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(185,179,255,0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(237,234,255,0.45), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <p className="mb-8 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Internal staging only · Studio P0 · not production ready
        </p>

        {/* 1. Hero */}
        <header className="mb-16 text-center sm:mb-20">
          <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            ShortKey Studio
          </p>
          <h1 className="font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl">
            One DNA. Many doors.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink-muted sm:text-base">
            ShortKey Studio is the internal place to lock the brand DNA, domain
            purpose, approved copy, launch priorities, and safety rules before
            pushing Beauty, Social, Live, Info, and World outward.
          </p>
        </header>

        {/* 2. ShortKey DNA */}
        <section className="mb-12 sm:mb-14" aria-labelledby="dna-heading">
          <SectionTitle id="dna-heading">ShortKey DNA</SectionTitle>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {DNA_POINTS.map((point, i) => (
              <li
                key={point}
                className="rounded-2xl border border-brand/15 bg-white/80 px-5 py-4 shadow-[0_8px_24px_rgba(140,130,252,0.06)] backdrop-blur-sm"
              >
                <span className="mb-1 block font-mono text-[10px] tracking-[0.14em] text-ink-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-sm font-semibold tracking-tight text-ink">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Domain Map */}
        <section className="mb-12 sm:mb-14" aria-labelledby="domains-heading">
          <SectionTitle id="domains-heading">Domain Map</SectionTitle>
          <div className="mt-6 overflow-hidden rounded-2xl border border-brand/15 bg-white/80 shadow-[0_8px_24px_rgba(140,130,252,0.06)]">
            <ul className="divide-y divide-brand/10">
              {DOMAIN_MAP.map((row) => (
                <li
                  key={row.domain}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="font-mono text-[13px] font-medium tracking-tight text-ink">
                    {row.domain}
                  </span>
                  <span className="text-sm text-ink-muted sm:text-right">
                    {row.purpose}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Approved Copy Blocks */}
        <section className="mb-12 sm:mb-14" aria-labelledby="copy-heading">
          <SectionTitle id="copy-heading">Approved Copy Blocks</SectionTitle>
          <div className="mt-6 space-y-4">
            {COPY_BLOCKS.map((block) => (
              <article
                key={block.label}
                className="rounded-2xl border border-brand/15 bg-white/80 px-5 py-5 shadow-[0_8px_24px_rgba(140,130,252,0.06)]"
              >
                <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                  {block.label}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">
                  {block.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Build Order */}
        <section aria-labelledby="order-heading">
          <SectionTitle id="order-heading">Build Order</SectionTitle>
          <ol className="mt-6 space-y-3">
            {BUILD_ORDER.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-2xl border border-brand/15 bg-white/80 px-5 py-4 shadow-[0_8px_24px_rgba(140,130,252,0.06)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink/10 bg-silk font-mono text-xs font-medium text-ink">
                  {i + 1}
                </span>
                <span className="font-display text-sm font-semibold tracking-tight text-ink">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-16 border-t border-brand/10 pt-8 text-center">
          <p className="text-xs leading-relaxed text-ink-subtle">
            Static internal preview · no payment · no login · no backend · DNA
            locks before domains push outward.
          </p>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl"
    >
      {children}
    </h2>
  );
}
