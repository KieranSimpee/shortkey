"use client";

import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { signupPosterSeries } from "@/content/signupPosters";
import { Button } from "@/components/ui/Button";
import {
  SignupPlusFiveLockup,
  SignupPlusFiveSeal,
} from "@/components/ui/SignupPlusFiveSeal";
import { ShortcutChip } from "@/components/ui/KeyCap";
import { HomeCategoryLanesSection } from "@/components/sections/HomeCategoryLanesSection";
import { HomeCommerceSection } from "@/components/sections/HomeCommerceSection";
import { HomeWhySection } from "@/components/sections/HomeWhySection";
import { DualAudienceHero } from "@/components/design/DualAudienceHero";
import { cn } from "@/lib/utils";

type Props = {
  /** When true, shows the temporary “design preview” banner */
  preview?: boolean;
};

/**
 * Homepage redesign — dual-audience hero, S+→+5 signup strip, category lanes, commerce.
 * Live at `/`; optional preview chrome at `/design`.
 */
export function HomeDesignPreview({ preview = false }: Props) {
  const { homeCollections, aiLab, homeCommunity, brands } = siteContent;
  const hosts = aiLab.hosts.filter((h) => h.onPlatform).slice(0, 2);

  return (
    <div className="design-preview relative min-h-screen bg-silk text-ink">
      {preview ? (
        <div className="bg-ink px-3 py-1 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/85">
            Design preview ·{" "}
            <Link href="/" className="underline decoration-brand-light underline-offset-2">
              live site
            </Link>
          </p>
        </div>
      ) : null}

      {/* L2 — compact signup strip (sit below mobile Header; flush at lg+) */}
      <div className="sticky top-9 z-[70] border-b border-brand/10 bg-white/90 px-4 py-1 sm:top-10 sm:px-8 lg:top-0">
        <div className="mx-auto flex h-7 max-w-6xl items-center justify-between gap-2 sm:h-8">
          <div className="flex min-w-0 items-center gap-1.5">
            <SignupPlusFiveSeal size="sm" className="!h-6 !w-6 !text-[9px]" />
            <SignupPlusFiveLockup className="hidden truncate text-[10px] sm:inline" />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              href="/signup/creator"
              variant="primary"
              size="sm"
              className="!px-2 !py-0.5 !text-[9px]"
            >
              <span className="sm:hidden">Join →</span>
              <span className="hidden sm:inline">Creator →</span>
            </Button>
            <Button
              href="/signup/brand"
              variant="outline"
              size="sm"
              className="hidden !px-2 !py-0.5 !text-[9px] sm:inline-flex"
            >
              Brand →
            </Button>
          </div>
        </div>
      </div>

      {/* 3-part hero — Creator Try-On | brand bridge (seam) | Brand Skin Analysis */}
      <DualAudienceHero />

      {/* V3 §2 — AI Beauty Match (Level 1) */}
      <section
        id="beauty-match"
        data-comp="COMP-008"
        className="border-b border-brand/10 bg-white px-6 py-14 sm:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
            AI Beauty Match
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Match. Recommend. Shop.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">
            Create a profile → AI beauty analysis → match score → personalized recommendations →
            shop products.
          </p>
          <div className="mt-8">
            <Button href="/influencers" variant="primary" size="md">
              Match Me Now
            </Button>
          </div>
        </div>
      </section>

      {/* L3 — poster themes; hidden on mobile (Sky collapse rule) */}
      <section className="hidden border-b border-brand/10 bg-silk px-6 py-10 sm:block sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {signupPosterSeries.posters.map((p) => (
              <Link
                key={p.id}
                href={p.ctaHref}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-card border border-transparent text-left transition hover:border-brand/25",
                )}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 to-transparent" />
                <p className="absolute bottom-2.5 left-2.5 right-2.5 font-display text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                  {p.googleHotSearch}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeCategoryLanesSection variant="design" />

      {/* Collections strip (secondary) */}
      <section className="border-y border-white/60 bg-white/30 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            {homeCollections.eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-bold uppercase tracking-[0.08em] text-ink">
            {homeCollections.title}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {homeCollections.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group relative aspect-[4/5] overflow-hidden rounded-card"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2438]/85 via-[#2a2438]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-brand-light">
                    {item.shortcut}
                  </p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.1em] text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/75">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeCommerceSection variant="design" />
      <HomeWhySection variant="design" />

      {/* V3 §5 — Creator Hub */}
      <section id="creator-hub" className="px-4 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                Creator Hub
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Build. Create. Earn. Grow.
              </h2>
              <p className="mt-2 max-w-lg text-sm text-ink-muted">
                Creator storefront, affiliate program, dashboard, and analytics — short brand-promo
                clips that open shop.
              </p>
            </div>
            <Button href="/signup/creator" variant="primary" size="sm">
              Become A Creator
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {hosts.map((host) => (
              <article
                key={host.id}
                className="overflow-hidden rounded-card border border-brand/10 bg-white shadow-card"
              >
                <div className="grid grid-cols-[0.4fr_0.6fr]">
                  <div className="relative min-h-[160px]">
                    <Image
                      src={host.image}
                      alt={host.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-3.5">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-brand">
                        On platform · brand promo
                      </p>
                      <p className="mt-1 text-sm font-bold uppercase tracking-[0.1em] text-ink">
                        {host.name}
                      </p>
                      <p className="text-[11px] text-ink-muted">{host.handle}</p>
                      <p className="mt-2 line-clamp-2 text-[11px] text-ink/80">{host.tagline}</p>
                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
                        {host.brands.map((b) => b.name).join(" · ")}
                      </p>
                    </div>
                    <Link
                      href={`/influencers/${host.id}`}
                      className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ink hover:text-brand"
                    >
                      Short clips + shop →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="border-t border-white/60 bg-white/25 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            {homeCommunity.eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-bold uppercase tracking-[0.08em] text-ink">
            {homeCommunity.title}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {homeCommunity.stories.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="rounded-card border border-brand/10 bg-white p-1 shadow-card transition hover:border-brand/25"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image src={s.image} alt="" fill className="object-cover" sizes="280px" />
                </div>
                <div className="px-2.5 py-3">
                  <ShortcutChip shortcut={s.shortcut} className="text-[7px]" />
                  <p className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
                    {s.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink-muted">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* V3 §6 — Brand Hub */}
      <section id="brand-hub" className="bg-surface-dark px-4 py-14 text-white sm:px-8 lg:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-light">
              Brand Hub
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
              Launch. Reach. Grow.
            </h2>
            <p className="mt-3 text-sm text-white/65">
              Launch products, access creators, track performance, and use AI growth tools.
              {brands.slotsLabel ? ` ${brands.slotsLabel}.` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/signup/brand" variant="primary" size="sm">
              Join As Brand
            </Button>
            <Button href="/signup/creator" variant="outline-light" size="sm">
              Become A Creator
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
