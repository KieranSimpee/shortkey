import Link from "next/link";
import { MeetingSignupForm } from "@/components/signup/MeetingSignupForm";
import { SignupPageHero } from "@/components/signup/SignupPageHero";
import { SIGNUP_APPOINTMENT_ONLY } from "@/content/featureLocks";
import { ShortcutChip } from "@/components/ui/KeyCap";
import { siteContent } from "@/content/homepage";

export const metadata = {
  title: "Brand Appointment | Shortkey",
  description: "Book a 1-hour brand appointment with the Shortkey team.",
};

export default function BrandSignupPage() {
  const { brands, hero } = siteContent;
  const fees = hero.launchFees;

  return (
    <main className="page-shell px-4 py-10 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <SignupPageHero
          eyebrow="CTRL + BRAND"
          title={SIGNUP_APPOINTMENT_ONLY ? "Book a Brand Appointment" : "Brand Signup"}
          description={
            SIGNUP_APPOINTMENT_ONLY
              ? "Appointment arrangement only for now — share your brand details, pick a 1-hour slot, and we confirm by email. Founding terms are discussed in the meeting."
              : "Book a 1-hour meeting to lock founding-partner terms, platform fee window, and access to CTRL Twin creators for try-on campaigns. Share your brand details — we confirm by email."
          }
        />

        {SIGNUP_APPOINTMENT_ONLY ? (
          <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-4">
            <ShortcutChip shortcut="Appointment only" />
            <p className="mt-3 text-sm font-semibold text-ink">Meeting booking — no public fees</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
              Signup is locked to appointment arrangement while we prepare launch. Pricing,
              founding entry, and commission stay in the conversation with our team.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-brand/25 bg-brand/8 px-4 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                {brands.tag}
              </p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.08em] text-ink">
                {brands.title}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">{brands.description}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
                {brands.slotsLabel}
              </p>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                  Founding entry
                </p>
                <p className="mt-2 text-xl font-bold text-ink">{brands.foundingFee}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  one-time
                </p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                  Commission
                </p>
                <p className="mt-2 text-xl font-bold text-ink">5%</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  locked for life
                </p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                  CTRL Twin access
                </p>
                <p className="mt-2 text-lg font-bold uppercase tracking-[0.06em] text-ink">
                  Creator campaigns
                </p>
                <p className="mt-1 text-[11px] leading-snug text-ink-muted">
                  Brief twins + human jobs — discussed in meeting
                </p>
              </div>
            </div>

            {fees ? (
              <div className="mt-3 rounded-xl border border-white/60 bg-white/40 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                  {fees.label}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {fees.tiers.map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-lg border px-2 py-1.5 text-center ${
                        t.emphasis
                          ? "border-brand/40 bg-brand/10"
                          : "border-white/50 bg-white/50"
                      }`}
                    >
                      <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                        {t.note}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-ink">{t.rate}</p>
                      <p className="text-[8px] uppercase tracking-[0.08em] text-ink-subtle">
                        {t.window}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}

        <div className="mt-8">
          <MeetingSignupForm kind="brand" />
        </div>

        <p className="mt-6 text-[12px] text-ink-muted">
          Creator?{" "}
          <Link
            href="/signup/creator"
            className="font-semibold text-ink underline underline-offset-2"
          >
            Creator appointment →
          </Link>
        </p>

        <p className="mt-4 text-[11px] text-ink-subtle">
          Prefer email?{" "}
          <a href="mailto:brands@shortkey.beauty" className="text-ink underline underline-offset-2">
            brands@shortkey.beauty
          </a>
          {" · "}
          <Link href="/" className="text-ink underline underline-offset-2">
            Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
