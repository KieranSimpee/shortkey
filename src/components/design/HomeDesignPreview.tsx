"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteContent } from "@/content/homepage";
import { signupPosterSeries } from "@/content/signupPosters";
import { Button } from "@/components/ui/Button";
import { ShortcutKeysLogo } from "@/components/ui/ShortcutKeysLogo";
import {
  SignupPlusFiveLockup,
  SignupPlusFiveSeal,
} from "@/components/ui/SignupPlusFiveSeal";
import { ShortcutChip } from "@/components/ui/KeyCap";
import { HomeCategoryLanesSection } from "@/components/sections/HomeCategoryLanesSection";
import { HomeCommerceSection } from "@/components/sections/HomeCommerceSection";
import { HomeWhySection } from "@/components/sections/HomeWhySection";
import { cn } from "@/lib/utils";

type Props = {
  /** When true, shows the temporary “design preview” banner */
  preview?: boolean;
};

/**
 * Homepage redesign — poster hero, S+→+5 signup strip, category lanes, commerce.
 * Live at `/`; optional preview chrome at `/design`.
 */
export function HomeDesignPreview({ preview = false }: Props) {
  const { homeCollections, aiLab, homeCommunity, brands } = siteContent;
  const fees = siteContent.hero.launchFees;
  const teaser = fees?.heroTeaser;
  const posters = signupPosterSeries.posters;
  const hosts = aiLab.hosts.filter((h) => h.onPlatform).slice(0, 2);
  const [posterIdx, setPosterIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPosterIdx((i) => (i + 1) % posters.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [posters.length]);

  const active = posters[posterIdx] ?? posters[0];

  return (
    <div className="design-preview min-h-screen bg-[#f3eef8] text-ink">
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

      {/* S+ → +5 signup strip (markets live in site header) */}
      <div className="sticky top-0 z-[70] border-b border-white/50 bg-white/80 px-3 py-1 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <SignupPlusFiveSeal size="sm" className="!h-8 !w-8 !text-[11px]" />
            <SignupPlusFiveLockup className="truncate text-[10px] sm:text-[11px]" />
            <span className="hidden text-[9px] font-medium uppercase tracking-[0.1em] text-ink-subtle md:inline">
              {teaser?.whisper}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button href="/signup/creator" variant="highlight" size="sm" className="!px-2.5 !py-1 !text-[9px]">
              Creator →
            </Button>
            <Button
              href="/signup/brand"
              variant="outline"
              size="sm"
              className="!border-brand/40 !bg-white !px-2.5 !py-1 !text-[9px] !font-semibold !text-brand-dark"
            >
              Brand →
            </Button>
          </div>
        </div>
      </div>

      {/* HERO — split layout: copy NEVER overlays the photo (auto-safe at every width) */}
      <section className="grid min-h-[min(78vh,640px)] overflow-hidden bg-[#1c1628] lg:grid-cols-[minmax(300px,42%)_minmax(0,1fr)]">
        {/* Copy column — solid atmosphere, no photo behind */}
        <div className="relative z-10 order-2 flex flex-col justify-center px-5 py-8 sm:px-8 lg:order-1 lg:px-10 lg:py-12 xl:px-14">
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-light">
              {active?.googleHotSearch}
            </p>
            <h1 className="mt-2 text-balance text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-[2.35rem]">
              {active?.headline}
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/80">
              {active?.subline}
            </p>

            {teaser ? (
              <p className="mt-3 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                <SignupPlusFiveLockup className="text-[11px] text-white [&_span:first-child]:text-brand-light [&_span:last-child]:text-white" />
                <span className="text-white/35">·</span>
                <span className="font-medium text-white/70">{teaser.whisper}</span>
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button href="/signup/creator" variant="highlight" size="sm">
                Creator signup →
              </Button>
              <Button href="/signup/brand" variant="on-dark" size="sm">
                Brand signup →
              </Button>
              <Button
                href="#category-lanes"
                variant="outline-light"
                size="sm"
                className="!border-white/70 !bg-white/20 !text-white"
              >
                Shop AI lanes →
              </Button>
            </div>

            <div className="mt-6">
              <ShortcutKeysLogo className="max-w-[170px] !drop-shadow-none sm:max-w-[200px]" />
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {posters.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPosterIdx(i)}
                  aria-label={`Show ${p.googleHotSearch}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === posterIdx ? "w-7 bg-brand-light" : "w-1.5 bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Photo column — image only, face stays in this pane */}
        <div className="relative order-1 min-h-[240px] sm:min-h-[320px] lg:order-2 lg:min-h-full">
          {posters.map((p, i) => (
            <div
              key={p.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
                i === posterIdx ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={i !== posterIdx}
            >
              <Image
                src={p.heroSrc}
                alt=""
                fill
                className="object-cover"
                style={{ objectPosition: p.heroObjectPosition ?? "70% center" }}
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-[#1c1628] to-transparent lg:block" />
        </div>
      </section>

      {/* Poster strip — remaining Google themes (teaser grid) */}
      <section className="border-b border-white/60 bg-white/35 px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
            {posters.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPosterIdx(i)}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-xl border text-left transition",
                  i === posterIdx
                    ? "border-brand/45 ring-1 ring-brand/30"
                    : "border-white/60 hover:border-brand/30",
                )}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2438]/70 to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                  {p.googleHotSearch}
                </p>
              </button>
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
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
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

      {/* Influencer hub teaser */}
      <section className="px-4 py-10 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                {aiLab.badge}
              </p>
              <h2 className="mt-2 text-xl font-bold uppercase tracking-[0.08em] text-ink">
                On-platform creators
              </h2>
              <p className="mt-1 max-w-lg text-sm text-ink-muted">
                Two creators live — short brand-promo samples (15–45s). Drop MP4s from your app;
                each clip names the brand and opens shop.
              </p>
            </div>
            <Button href="/signup/creator" variant="highlight" size="sm">
              Book creator meeting →
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {hosts.map((host) => (
              <article
                key={host.id}
                className="overflow-hidden rounded-2xl border border-white/60 bg-white/50"
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
                className="rounded-2xl border border-white/60 bg-white/55 p-1 transition hover:border-brand/30"
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

      {/* Brands teaser */}
      <section className="bg-[#2a2438] px-4 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-light">
              {brands.tag}
            </p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.08em]">
              {brands.title}
            </h2>
            <p className="mt-3 text-sm text-white/65">
              Lock founding terms + reach CTRL Twin creators. Full fee breakdown on brand signup.
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
              {brands.slotsLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/signup/brand" variant="highlight" size="sm">
              Brand meeting →
            </Button>
            <Button href="/signup/creator" variant="outline" size="sm">
              Creator meeting →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
