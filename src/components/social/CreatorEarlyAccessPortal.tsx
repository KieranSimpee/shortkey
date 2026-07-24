"use client";

import { useState, type FormEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { CreatorFormulaEducationStrip } from "@/components/social/CreatorFormulaEducationStrip";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import {
  SOCIAL_CATEGORIES,
  SOCIAL_COLLAB_TYPES,
  SOCIAL_DEFAULT_STATUS,
  SOCIAL_FOLLOWER_RANGES,
  SOCIAL_LOCAL_STORAGE_KEY,
  SOCIAL_PAYOUT_BANDS,
  SOCIAL_PLATFORMS,
  type SocialCategory,
  type SocialCollabType,
  type SocialEarlyAccessEntry,
  type SocialFollowerRange,
  type SocialPayoutBand,
  type SocialPlatform,
  type SocialSubmissionStatus,
} from "@/lib/social/types";
import "./creator-circle-signal.css";

/**
 * shortkey.social — Creator Circle Early Access portal (staging).
 * Soft pearl / light lilac · Studio Brand DNA voice · GOR_GOR_REVIEW.
 * AI Beauty Signal / Creator Wave motion (CSS-only) — not a TV-channel clone.
 * Prefer POST /api/social/early-access (file store in dev); localStorage fallback.
 */

const SAFETY_LINE =
  "Registration does not guarantee selection, paid campaigns, income, or sales results. There is no payment system on this surface.";

const WHY_POINTS = [
  {
    title: "Creator-first, brand-ready",
    body: "Built so beauty creators can show up clearly to brands — without a marketplace maze.",
  },
  {
    title: "Asian beauty bridge",
    body: "ShortKey connects K-Beauty and Asian beauty storytelling with creators who already speak that language.",
  },
  {
    title: "Link-based promotion first",
    body: "Simple, trackable links before heavy tooling — keep the work light and the signal strong.",
  },
  {
    title: "Trust and protection",
    body: "Transparent packages and clear expectations. No income promises. No forced deals.",
  },
] as const;

/** ShortKey-owned signal phrases (Studio DNA) — not competitor slogans. */
const SIGNAL_PHRASES = [
  "Creator-first",
  "Asian beauty bridge",
  "AI Beauty Signal",
  "Creator Wave",
  "Authentic product storytelling",
  "Link-based promotion",
  "Discoverable to brands",
  "One DNA · Many doors",
  "Trust before hype",
  "ShortKey Creator Circle",
] as const;

const CREATOR_STORIES = [
  {
    kicker: "Signal",
    title: "Show up clearly",
    body: "Your handle, category, and story in one place — so brands see the creator, not a spreadsheet row.",
  },
  {
    kicker: "Bridge",
    title: "Speak Asian beauty",
    body: "K-Beauty and Asian beauty storytelling already live in your voice. ShortKey helps that signal travel.",
  },
  {
    kicker: "Wave",
    title: "Stay light, stay real",
    body: "Start with links and honest interest — no marketplace maze, no income promises, no forced deals.",
  },
] as const;

const PROMO_BANNERS = [
  {
    tone: "soft-a" as const,
    title: "Early access interest list",
    body: "Join the Creator Circle staging list. Review is manual — interest is not selection.",
  },
  {
    tone: "soft-b" as const,
    title: "Discovery, not a guarantee",
    body: "Share how you create so ShortKey can learn fit. Discovery does not promise campaigns or deals.",
  },
  {
    tone: "soft-c" as const,
    title: "Collaboration preferences",
    body: "Tell us gifted, paid, affiliate, or hybrid preferences. Preferences are not offers.",
  },
] as const;

const DISCOVERY_POINTS = [
  "Share your platform, handle, and beauty category so brands can find the right fit.",
  "Interest lists stay in staging review — ShortKey looks for authentic product storytelling, not vanity metrics alone.",
  "If invited, you move from Submitted → Under Review → Invited. Selection is never automatic.",
] as const;

const COLLAB_BLURBS: Record<(typeof SOCIAL_COLLAB_TYPES)[number], string> = {
  Gifted: "Product-led seeding — try, create, share.",
  Paid: "Fixed-fee or package work when both sides agree.",
  Affiliate: "Performance links with clear tracking.",
  Hybrid: "Mix of gifted, paid, and affiliate — case by case.",
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-brand/20 bg-white/90 px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-brand/45 focus:ring-2 focus:ring-brand/15";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted";

const sectionTitleClass =
  "font-display text-lg font-semibold tracking-tight text-ink sm:text-xl";

const HONESTY_LOCAL =
  "Browser localStorage fallback (`shortkey-social-early-access-v02`) · this device only · staging · not a shared production database.";

type FormState = {
  name: string;
  email: string;
  country: string;
  platform: SocialPlatform | "";
  handle: string;
  followerRange: SocialFollowerRange | "";
  beautyCategory: SocialCategory | "";
  preferredCollabType: SocialCollabType | "";
  preferredPayoutBand: SocialPayoutBand | "";
  portfolioLink: string;
  notes: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  country: "",
  platform: "",
  handle: "",
  followerRange: "",
  beautyCategory: "",
  preferredCollabType: "",
  preferredPayoutBand: "",
  portfolioLink: "",
  notes: "",
};

function saveLocalFallback(entry: SocialEarlyAccessEntry) {
  try {
    const raw = localStorage.getItem(SOCIAL_LOCAL_STORAGE_KEY);
    const prev = raw ? (JSON.parse(raw) as SocialEarlyAccessEntry[]) : [];
    const next = [entry, ...(Array.isArray(prev) ? prev : [])].slice(0, 200);
    localStorage.setItem(SOCIAL_LOCAL_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}

export function CreatorEarlyAccessPortal() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [submissionStatus, setSubmissionStatus] =
    useState<SocialSubmissionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storageLabel, setStorageLabel] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      country: form.country.trim(),
      platform: form.platform,
      handle: form.handle.trim(),
      followerRange: form.followerRange,
      beautyCategory: form.beautyCategory,
      preferredCollabType: form.preferredCollabType,
      preferredPayoutBand: form.preferredPayoutBand,
      portfolioLink: form.portfolioLink.trim(),
      notes: form.notes.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.country ||
      !payload.platform ||
      !payload.handle ||
      !payload.followerRange ||
      !payload.beautyCategory ||
      !payload.preferredCollabType ||
      !payload.preferredPayoutBand
    ) {
      setError("Please complete every required field.");
      setBusy(false);
      return;
    }

    if (!payload.email.includes("@")) {
      setError("Please enter a valid email.");
      setBusy(false);
      return;
    }

    const localEntry: SocialEarlyAccessEntry = {
      id: `sea_local_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      status: SOCIAL_DEFAULT_STATUS,
      name: payload.name,
      email: payload.email,
      country: payload.country,
      platform: payload.platform,
      handle: payload.handle,
      followerRange: payload.followerRange,
      beautyCategory: payload.beautyCategory,
      preferredCollabType: payload.preferredCollabType,
      preferredPayoutBand: payload.preferredPayoutBand,
      portfolioLink: payload.portfolioLink,
      notes: payload.notes,
    };

    try {
      const res = await fetch("/api/social/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          status?: SocialSubmissionStatus;
          meta?: { honesty?: string };
        };
        setSubmissionStatus(data.status ?? SOCIAL_DEFAULT_STATUS);
        setStorageLabel(data.meta?.honesty ?? "Saved to staging store");
        setDone(true);
        setForm(emptyForm);
      } else {
        saveLocalFallback(localEntry);
        setSubmissionStatus(SOCIAL_DEFAULT_STATUS);
        setStorageLabel(HONESTY_LOCAL);
        setDone(true);
        setForm(emptyForm);
      }
    } catch {
      saveLocalFallback(localEntry);
      setSubmissionStatus(SOCIAL_DEFAULT_STATUS);
      setStorageLabel(HONESTY_LOCAL);
      setDone(true);
      setForm(emptyForm);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-silk to-silk-dark/50 text-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(185,179,255,0.28), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 30%, rgba(237,234,255,0.65), transparent 50%), radial-gradient(ellipse 45% 30% at 0% 70%, rgba(247,245,255,0.9), transparent 55%)",
        }}
      />

      {/* Staging banner */}
      <div className="relative z-20 border-b border-brand/20 bg-white/75 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-2.5 text-center sm:px-6">
          <p className="text-[11px] font-semibold tracking-tight text-ink">
            Internal staging / Gor Gor Review — not production-ready
          </p>
          <p className="mt-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-violet-800">
            GOR_GOR_REVIEW · shortkey.social preview
          </p>
        </div>
      </div>

      <header className="relative z-10 border-b border-brand/10 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo size="header" surface="light" />
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            shortkey.social
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* ShortKey Signal Hero */}
        <section className="cc-signal-hero text-center" aria-labelledby="creator-circle-hero">
          <div className="cc-signal-hero__sweep" aria-hidden />
          <div className="cc-signal-hero__wave" aria-hidden />
          <div className="cc-signal-hero__content">
            <div className="cc-logo-flash">
              <span className="cc-logo-flash__glow" aria-hidden />
              <Logo size="icon" surface="light" href={false} className="!h-10 !w-10" />
            </div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              Creator Early Access · AI Beauty Signal
            </p>
            <h1
              id="creator-circle-hero"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              Join the ShortKey Creator Circle
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              ShortKey helps beauty creators become discoverable to brands looking
              for authentic product storytelling.
            </p>
          </div>

          {/* Creator Circle video-preview panel — CSS poster only */}
          <div
            className="cc-preview"
            role="img"
            aria-label="ShortKey Creator Wave signal preview — abstract motion poster, no video"
          >
            <div className="cc-preview__chrome">
              <div className="cc-preview__bar">
                <span className="cc-preview__dot" aria-hidden />
                <span className="cc-preview__dot" aria-hidden />
                <span className="cc-preview__dot cc-preview__dot--live" aria-hidden />
                <span className="cc-preview__label">Creator Wave · preview</span>
              </div>
              <div className="cc-preview__stage">
                <div className="cc-preview__poster" aria-hidden />
                <div className="cc-signal-bars" aria-hidden>
                  <span /><span /><span /><span /><span />
                  <span /><span /><span /><span />
                </div>
              </div>
              <p className="cc-preview__caption">
                Signal frame · CSS motion only · no autoplay media
              </p>
            </div>
          </div>

          {/* Beauty Signal marquee */}
          <div className="cc-marquee" aria-label="ShortKey Beauty Signal phrases">
            <div className="cc-marquee__track">
              {[0, 1].map((copy) => (
                <div key={copy} className="cc-marquee__group" aria-hidden={copy === 1}>
                  {SIGNAL_PHRASES.map((phrase) => (
                    <span key={`${copy}-${phrase}`} className="contents">
                      <span className="cc-marquee__item">{phrase}</span>
                      <span className="cc-marquee__sep" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional banner stack */}
        <section className="mt-8" aria-labelledby="promo-banners">
          <h2 id="promo-banners" className="sr-only">
            Creator Circle highlights
          </h2>
          <div className="cc-banners">
            {PROMO_BANNERS.map((banner) => (
              <div
                key={banner.title}
                className={`cc-banner cc-banner--${banner.tone}`}
              >
                <p className="cc-banner__title">{banner.title}</p>
                <p className="cc-banner__body">{banner.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Creator story blocks */}
        <section className="mt-10" aria-labelledby="creator-stories">
          <h2 id="creator-stories" className={sectionTitleClass}>
            Creator stories
          </h2>
          <p className="mt-2 text-sm text-ink-subtle">
            Short notes from the ShortKey Creator Wave — original wording, staging voice.
          </p>
          <div className="cc-stories mt-5">
            {CREATOR_STORIES.map((story) => (
              <article key={story.title} className="cc-story">
                <p className="cc-story__kicker">{story.kicker}</p>
                <h3 className="cc-story__title">{story.title}</h3>
                <p className="cc-story__body">{story.body}</p>
              </article>
            ))}
          </div>
        </section>

        <CreatorFormulaEducationStrip />

        {/* 1. Why ShortKey */}
        <section className="mt-12" aria-labelledby="why-shortkey">
          <h2 id="why-shortkey" className={sectionTitleClass}>
            Why ShortKey
          </h2>
          <p className="mt-2 text-sm text-ink-subtle">
            One DNA. Many doors. Creator-ready without marketplace noise.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {WHY_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-brand/12 bg-white/70 px-4 py-3.5 text-left backdrop-blur-sm"
              >
                <p className="text-[13px] font-semibold text-ink">{point.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. How creators get discovered */}
        <section className="mt-12" aria-labelledby="discovery">
          <h2 id="discovery" className={sectionTitleClass}>
            How creators get discovered
          </h2>
          <p className="mt-2 text-sm text-ink-subtle">
            Early access is an interest list — not a live matching engine.
          </p>
          <ol className="mt-5 space-y-3">
            {DISCOVERY_POINTS.map((line, i) => (
              <li
                key={line}
                className="flex gap-3 rounded-xl border border-brand/12 bg-white/70 px-4 py-3 text-left backdrop-blur-sm"
              >
                <span className="font-display text-sm font-semibold text-brand">
                  {i + 1}
                </span>
                <p className="text-[13px] leading-relaxed text-ink-muted">{line}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] text-ink-subtle">
            Status path: Submitted · Under Review · Invited
          </p>
        </section>

        {/* 3. Collaboration types */}
        <section className="mt-12" aria-labelledby="collab-types">
          <h2 id="collab-types" className={sectionTitleClass}>
            Collaboration types
          </h2>
          <p className="mt-2 text-sm text-ink-subtle">
            Tell us what you prefer — nothing here is a contract or offer.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {SOCIAL_COLLAB_TYPES.map((type) => (
              <li
                key={type}
                className="rounded-xl border border-brand/12 bg-white/70 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-[13px] font-semibold text-ink">{type}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">{COLLAB_BLURBS[type]}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Preferred payout bands */}
        <section className="mt-12" aria-labelledby="payout-bands">
          <h2 id="payout-bands" className={sectionTitleClass}>
            Preferred payout bands
          </h2>
          <p className="mt-2 text-sm text-ink-subtle">
            Placeholder ranges only — no payment processing on this preview.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {SOCIAL_PAYOUT_BANDS.map((band) => (
              <li
                key={band}
                className="rounded-full border border-brand/15 bg-white/80 px-3.5 py-1.5 text-[12px] text-ink-muted"
              >
                {band}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] leading-relaxed text-ink-subtle">
            {SAFETY_LINE}
          </p>
        </section>

        {/* 5. Early access form */}
        <section
          className="mt-12 rounded-2xl border border-brand/15 bg-white/80 p-5 shadow-soft backdrop-blur-sm sm:p-8"
          aria-labelledby="early-access-form"
        >
          <h2 id="early-access-form" className={sectionTitleClass}>
            Early access form
          </h2>
          <p className="mt-1.5 text-sm text-ink-subtle">
            Join the Creator Circle interest list. Staging review only.
          </p>

          {done ? (
            <div className="mt-6 rounded-xl border border-brand/20 bg-brand/5 px-4 py-5 text-center">
              <p className="font-display text-base font-semibold text-ink">
                Interest received
              </p>
              <p className="mt-2 inline-flex items-center rounded-full border border-brand/25 bg-white/90 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand-dark">
                Status: {submissionStatus ?? SOCIAL_DEFAULT_STATUS}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Thank you — your details are on the staging interest list. This is
                not a campaign offer or selection.
              </p>
              {storageLabel ? (
                <p className="mt-3 text-[11px] leading-relaxed text-ink-subtle">
                  Storage: {storageLabel}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setSubmissionStatus(null);
                  setStorageLabel(null);
                }}
                className="mt-4 text-[12px] font-semibold text-brand-dark underline-offset-2 hover:underline"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sea-name" className={labelClass}>
                    Name <span className="text-brand">*</span>
                  </label>
                  <input
                    id="sea-name"
                    name="name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={fieldClass}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="sea-email" className={labelClass}>
                    Email <span className="text-brand">*</span>
                  </label>
                  <input
                    id="sea-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={fieldClass}
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="sea-country" className={labelClass}>
                    Country <span className="text-brand">*</span>
                  </label>
                  <input
                    id="sea-country"
                    name="country"
                    required
                    autoComplete="country-name"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className={fieldClass}
                    placeholder="Country"
                  />
                </div>

                <div>
                  <label htmlFor="sea-platform" className={labelClass}>
                    Platform <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-platform"
                    name="platform"
                    required
                    value={form.platform}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        platform: e.target.value as SocialPlatform | "",
                      }))
                    }
                    className={fieldClass}
                  >
                    <option value="">Select…</option>
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sea-handle" className={labelClass}>
                    Handle <span className="text-brand">*</span>
                  </label>
                  <input
                    id="sea-handle"
                    name="handle"
                    required
                    value={form.handle}
                    onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))}
                    className={fieldClass}
                    placeholder="@handle"
                  />
                </div>

                <div>
                  <label htmlFor="sea-followers" className={labelClass}>
                    Follower range <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-followers"
                    name="followerRange"
                    required
                    value={form.followerRange}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        followerRange: e.target.value as SocialFollowerRange | "",
                      }))
                    }
                    className={fieldClass}
                  >
                    <option value="">Select…</option>
                    {SOCIAL_FOLLOWER_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sea-category" className={labelClass}>
                    Beauty category <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-category"
                    name="beautyCategory"
                    required
                    value={form.beautyCategory}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        beautyCategory: e.target.value as SocialCategory | "",
                      }))
                    }
                    className={fieldClass}
                  >
                    <option value="">Select…</option>
                    {SOCIAL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sea-collab" className={labelClass}>
                    Preferred collaboration type <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-collab"
                    name="preferredCollabType"
                    required
                    value={form.preferredCollabType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        preferredCollabType: e.target.value as SocialCollabType | "",
                      }))
                    }
                    className={fieldClass}
                  >
                    <option value="">Select…</option>
                    {SOCIAL_COLLAB_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sea-payout" className={labelClass}>
                    Preferred payout band <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-payout"
                    name="preferredPayoutBand"
                    required
                    value={form.preferredPayoutBand}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        preferredPayoutBand: e.target.value as SocialPayoutBand | "",
                      }))
                    }
                    className={fieldClass}
                  >
                    <option value="">Select…</option>
                    {SOCIAL_PAYOUT_BANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-[11px] text-ink-subtle">
                    Placeholder ranges only — no payment system in this preview.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sea-portfolio" className={labelClass}>
                    Portfolio / media kit link
                  </label>
                  <input
                    id="sea-portfolio"
                    name="portfolioLink"
                    type="url"
                    value={form.portfolioLink}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, portfolioLink: e.target.value }))
                    }
                    className={fieldClass}
                    placeholder="https://"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sea-notes" className={labelClass}>
                    Notes
                  </label>
                  <textarea
                    id="sea-notes"
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className={fieldClass}
                    placeholder="Anything else we should know?"
                  />
                </div>
              </div>

              <p className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-[12px] leading-relaxed text-amber-950/80">
                {SAFETY_LINE}
              </p>

              {error ? (
                <p className="text-sm text-rose-700" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-soft transition hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
              >
                {busy ? "Saving…" : "Join the Creator Circle"}
              </button>
            </form>
          )}
        </section>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-subtle">
          Staging interest store only · no marketplace · no production publish from
          this surface.
        </p>
      </main>

      <footer className="relative z-10 border-t border-brand/10 bg-white/60 px-4 py-10 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <Logo size="footer" surface="light" />
          <p className="text-[12px] text-ink-muted">
            © {new Date().getFullYear()} ShortKey · shortkey.social
          </p>
          <p className="text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
        </div>
      </footer>
    </div>
  );
}
