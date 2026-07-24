"use client";

import { useState, type FormEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import {
  SOCIAL_CATEGORIES,
  SOCIAL_COLLAB_TYPES,
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
} from "@/lib/social/types";

/**
 * shortkey.social — Creator Early Access portal (staging).
 * Soft pearl / light lilac · Studio Brand DNA voice · GOR_GOR_REVIEW.
 * Prefer POST /api/social/early-access (file store in dev); localStorage fallback.
 */

const SAFETY_LINE =
  "Registration does not guarantee selection, paid campaigns, income, or sales results.";

const CREATOR_LINE =
  "ShortKey helps beauty creators become discoverable to brands looking for authentic product storytelling.";

const DNA_POINTS = [
  "Creator-first, brand-ready",
  "Asian beauty bridge",
  "Link-based promotion first",
  "ROI reporting is the value",
  "Simple transparent packages",
  "Trust and protection",
] as const;

const HONESTY_LOCAL =
  "Browser localStorage fallback (`shortkey-social-early-access-v01`) · this device only · staging · not a shared production database.";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-brand/20 bg-white/90 px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-brand/45 focus:ring-2 focus:ring-brand/15";

const labelClass = "block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted";

type FormState = {
  name: string;
  handleOrEmail: string;
  platform: SocialPlatform | "";
  category: SocialCategory | "";
  followerRange: SocialFollowerRange | "";
  location: string;
  collabType: SocialCollabType | "";
  payoutBand: SocialPayoutBand | "";
};

const emptyForm: FormState = {
  name: "",
  handleOrEmail: "",
  platform: "",
  category: "",
  followerRange: "",
  location: "",
  collabType: "",
  payoutBand: "",
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
  const [error, setError] = useState<string | null>(null);
  const [storageLabel, setStorageLabel] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const payload = {
      name: form.name.trim(),
      handleOrEmail: form.handleOrEmail.trim(),
      platform: form.platform,
      category: form.category,
      followerRange: form.followerRange,
      location: form.location.trim(),
      collabType: form.collabType,
      payoutBand: form.payoutBand,
    };

    if (
      !payload.name ||
      !payload.handleOrEmail ||
      !payload.platform ||
      !payload.category ||
      !payload.followerRange ||
      !payload.location ||
      !payload.collabType ||
      !payload.payoutBand
    ) {
      setError("Please complete every required field.");
      setBusy(false);
      return;
    }

    const localEntry: SocialEarlyAccessEntry = {
      id: `sea_local_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      name: payload.name,
      handleOrEmail: payload.handleOrEmail,
      platform: payload.platform,
      category: payload.category,
      followerRange: payload.followerRange,
      location: payload.location,
      collabType: payload.collabType,
      payoutBand: payload.payoutBand,
    };

    try {
      const res = await fetch("/api/social/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          meta?: { honesty?: string };
        };
        setStorageLabel(data.meta?.honesty ?? "Saved to staging store");
        setDone(true);
        setForm(emptyForm);
      } else {
        saveLocalFallback(localEntry);
        setStorageLabel(HONESTY_LOCAL);
        setDone(true);
        setForm(emptyForm);
      }
    } catch {
      saveLocalFallback(localEntry);
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
        <section className="text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
            Creator Early Access
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            ShortKey
          </h1>
          <p className="mt-2 font-display text-lg font-medium text-brand-dark sm:text-xl">
            One DNA. Many doors.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {CREATOR_LINE}
          </p>
        </section>

        <section className="mt-10" aria-label="What ShortKey stands for">
          <ul className="grid gap-2 sm:grid-cols-2">
            {DNA_POINTS.map((point) => (
              <li
                key={point}
                className="rounded-xl border border-brand/12 bg-white/70 px-3.5 py-2.5 text-left text-[13px] text-ink-muted backdrop-blur-sm"
              >
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-brand/15 bg-white/80 p-5 shadow-soft backdrop-blur-sm sm:p-8">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
            Register your interest
          </h2>
          <p className="mt-1.5 text-sm text-ink-subtle">
            Tell us where you create — we will review interest lists in staging only.
          </p>

          {done ? (
            <div className="mt-6 rounded-xl border border-brand/20 bg-brand/5 px-4 py-5 text-center">
              <p className="font-display text-base font-semibold text-ink">
                Interest received
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
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
                <div className="sm:col-span-2">
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

                <div className="sm:col-span-2">
                  <label htmlFor="sea-contact" className={labelClass}>
                    Handle or email <span className="text-brand">*</span>
                  </label>
                  <input
                    id="sea-contact"
                    name="handleOrEmail"
                    required
                    value={form.handleOrEmail}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, handleOrEmail: e.target.value }))
                    }
                    className={fieldClass}
                    placeholder="@handle or you@email.com"
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
                  <label htmlFor="sea-category" className={labelClass}>
                    Category <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-category"
                    name="category"
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as SocialCategory | "",
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
                  <label htmlFor="sea-location" className={labelClass}>
                    Location <span className="text-brand">*</span>
                  </label>
                  <input
                    id="sea-location"
                    name="location"
                    required
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className={fieldClass}
                    placeholder="City / country"
                  />
                </div>

                <div>
                  <label htmlFor="sea-collab" className={labelClass}>
                    Preferred collaboration <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-collab"
                    name="collabType"
                    required
                    value={form.collabType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        collabType: e.target.value as SocialCollabType | "",
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

                <div>
                  <label htmlFor="sea-payout" className={labelClass}>
                    Preferred payout band <span className="text-brand">*</span>
                  </label>
                  <select
                    id="sea-payout"
                    name="payoutBand"
                    required
                    value={form.payoutBand}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        payoutBand: e.target.value as SocialPayoutBand | "",
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
                {busy ? "Saving…" : "Join early access"}
              </button>
            </form>
          )}
        </section>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-subtle">
          Staging interest store only · no marketplace · no production publish from this surface.
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
