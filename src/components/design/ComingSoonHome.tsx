"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { EmailCaptureForm } from "@/components/signup/EmailCaptureForm";
import { HeroLanguageTaps } from "@/components/design/HeroLanguageTaps";
import { useLaunchCountdown } from "@/components/design/useLaunchCountdown";
import {
  comingSoonMessages,
  type ComingSoonLocale,
} from "@/components/design/comingSoonMessages";

/** DNA keycap CTA — lilac fill language on pearl surfaces (SHORTKEY_BRAND_DNA §7). */
const KEYCAP_CTA =
  "!rounded-md !normal-case !tracking-wide border border-brand/30 bg-gradient-to-b from-white to-brand-muted !text-brand shadow-[0_2px_0_rgba(140,130,252,0.2),0_4px_12px_rgba(140,130,252,0.1)] hover:!bg-brand-muted hover:!text-brand";

const KEYCAP_SECONDARY =
  "!rounded-md !normal-case !tracking-wide border border-brand/25 bg-white/80 !text-brand hover:!bg-brand-muted";

const TRY_ON_IMG = "/images/posters/hero/hero-bloom-skin.png";
const SKIN_IMG = "/images/posters/hero/hero-skin-analysis.png";
const HERO_ATMOSPHERE = "/images/posters/hero/hero-bloom-skin.png";

/**
 * Public shortkey.beauty — Coming Soon / Pre-Register.
 * Draft Design DNA: pearl · soft lilac · editorial beauty (not dark tech).
 * Authority: SHORTKEY_BRAND_DNA · tokens · SIMPEE_DOMAIN_ROLLOUT_BOARD beauty P0.
 * Gor Gor Review required before any public push.
 */
export function ComingSoonHome() {
  const [locale, setLocale] = useState<ComingSoonLocale>("en");
  const t = comingSoonMessages[locale];
  const proofLabels = [t.proofCreators, t.proofKBeauty, t.proofJBeauty, t.proofCBeauty];
  const countdown = useLaunchCountdown();
  const htmlLang = locale === "zh-Hant" ? "zh-Hant" : locale;

  const countdownUnits = [
    { value: countdown.days, label: t.countdownDays },
    { value: countdown.hours, label: t.countdownHours },
    { value: countdown.minutes, label: t.countdownMinutes },
    { value: countdown.seconds, label: t.countdownSeconds },
  ];

  return (
    <div className="relative min-h-screen bg-silk text-ink" lang={htmlLang}>
      {/* Minimal top bar — logo only, no shop nav/cart/search */}
      <header className="relative z-20 border-b border-brand/10 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
          <Logo size="header" surface="light" />
        </div>
      </header>

      {/* Hero — one pearl composition: brand · headline · discovery · CTAs · atmosphere */}
      <section
        aria-label={t.heroAria}
        className="relative isolate min-h-[min(92vh,820px)] overflow-hidden px-4 pb-16 pt-12 text-ink sm:px-8 sm:pb-20 sm:pt-16 lg:pt-20"
      >
        {/* Full-bleed soft beauty atmosphere */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={HERO_ATMOSPHERE}
            alt=""
            fill
            priority
            className="object-cover object-[62%_center] opacity-[0.42] sm:opacity-[0.48]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, rgba(255,255,255,0.92) 0%, rgba(247,245,255,0.88) 42%, rgba(237,234,255,0.82) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 50% -10%, rgba(185,179,255,0.35), transparent 58%), radial-gradient(ellipse 50% 40% at 85% 70%, rgba(140,130,252,0.12), transparent 55%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="type-display-hero text-brand">{t.comingSoon}</p>
          <h1 className="type-display-hero mt-3 text-ink">{t.platformTitle}</h1>
          <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand sm:text-base">
            {t.tagline}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {t.discoveryBody}
          </p>

          <HeroLanguageTaps
            value={locale}
            onChange={setLocale}
            label={t.langSwitcherLabel}
            tone="light"
          />

          <div className="mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
            <Button href="/signup/creator" variant="primary" size="md" className={KEYCAP_CTA}>
              {t.bookCreator}
            </Button>
            <Button href="/signup/brand" variant="primary" size="md" className={KEYCAP_CTA}>
              {t.bookBrand}
            </Button>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
            {t.registerMeeting}
          </p>

          <div className="mx-auto mt-8 w-full max-w-md">
            <EmailCaptureForm
              surface="light"
              buttonClassName={KEYCAP_CTA}
              copy={{
                placeholder: t.emailPlaceholder,
                notifyMe: t.notifyMe,
                sending: t.sending,
                invalid: t.emailInvalid,
                fail: t.emailFail,
                network: t.emailNetwork,
                success: t.emailSuccess,
              }}
            />
            <p className="mt-2 text-[11px] text-ink-subtle">{t.noSpam}</p>
          </div>
        </div>
      </section>

      {/* Before I Meet The World — countdown story (one job) */}
      <section
        aria-labelledby="meet-world-heading"
        className="relative border-b border-brand/10 bg-white/70 px-4 py-14 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="type-section-muted text-brand">{t.meetWorldEyebrow}</p>
          <h2
            id="meet-world-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            {t.meetWorldHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {t.meetWorldBody}
          </p>
          <p className="mt-5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            {t.launchLabel}
          </p>
          <div
            className="mx-auto mt-6 grid max-w-lg grid-cols-4 gap-2 sm:gap-3"
            role="timer"
            aria-live="polite"
          >
            {countdownUnits.map((unit) => (
              <div key={unit.label} className="px-1 py-2 sm:py-3">
                <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-ink sm:text-3xl">
                  {String(unit.value).padStart(2, "0")}
                </p>
                <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Try-On Preview (light) — static, no mechanics */}
      <section className="border-b border-brand/10 bg-silk px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="type-section-muted text-brand">{t.tryOnEyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t.tryOnHeading}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">{t.tryOnBody}</p>
          </div>
          <div className="order-1 aspect-[4/3] overflow-hidden rounded-card border border-brand/10 shadow-card lg:order-2">
            <div className="relative h-full w-full">
              <Image
                src={TRY_ON_IMG}
                alt={t.tryOnAlt}
                fill
                className="object-cover"
                style={{ objectPosition: "62% center" }}
                sizes="(min-width: 1024px) 480px, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-4">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {t.tryOnPreview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skin Analysis Preview (light) */}
      <section className="border-b border-brand/10 bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-card border border-brand/10 shadow-card">
            <div className="relative h-full w-full">
              <Image
                src={SKIN_IMG}
                alt={t.skinAlt}
                fill
                className="object-cover"
                style={{ objectPosition: "62% center" }}
                sizes="(min-width: 1024px) 480px, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-4">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {t.skinPreview}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="type-section-muted text-brand">{t.skinEyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t.skinHeading}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">{t.skinBody}</p>
          </div>
        </div>
      </section>

      {/* Creator meeting CTA */}
      <section id="creator" className="border-b border-brand/10 bg-silk px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <p className="type-section-muted text-brand">{t.forCreators}</p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {t.creatorHeading}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{t.creatorBody}</p>
          </div>
          <Button href="/signup/creator" variant="primary" size="md" className={KEYCAP_CTA}>
            {t.bookCreator}
          </Button>
        </div>
      </section>

      {/* Brand / founder invitation CTA — soft pearl, not dark tech */}
      <section id="brand" className="border-b border-brand/10 bg-white px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <p className="type-section-muted text-brand">{t.forBrands}</p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {t.brandHeading}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{t.brandBody}</p>
          </div>
          <Button href="/signup/brand" variant="primary" size="md" className={KEYCAP_SECONDARY}>
            {t.bookBrand}
          </Button>
        </div>
      </section>

      {/* Social Proof Placeholder — reserved slot, no fabricated stats */}
      <section className="border-b border-brand/10 bg-silk px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="type-section-muted text-brand">{t.alreadyJoining}</p>
          <p className="mt-2 text-sm text-ink-muted">{t.socialProof}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {proofLabels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-brand/15 bg-white/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer — logo, legal, contact. No shop/store/product links. */}
      <footer className="bg-white px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <Logo size="footer" surface="light" />
          <nav className="flex flex-wrap items-center justify-center gap-4" aria-label={t.legalNav}>
            <Link href="/privacy" className="type-caption transition-colors hover:text-brand">
              {t.privacy}
            </Link>
            <Link href="/terms" className="type-caption transition-colors hover:text-brand">
              {t.terms}
            </Link>
            <Link href="/cookies" className="type-caption transition-colors hover:text-brand">
              {t.cookies}
            </Link>
            <a
              href="mailto:info@shortkey.beauty"
              className="type-caption transition-colors hover:text-brand"
            >
              info@shortkey.beauty
            </a>
          </nav>
          <p className="type-caption text-ink-muted">{t.copyright}</p>
          <p className="mt-1 text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
        </div>
      </footer>
    </div>
  );
}
