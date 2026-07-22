import Link from "next/link";
import { MeetingSignupForm } from "@/components/signup/MeetingSignupForm";
import { SignupPageHero } from "@/components/signup/SignupPageHero";
import { SIGNUP_APPOINTMENT_ONLY } from "@/content/featureLocks";
import { ShortcutChip } from "@/components/ui/KeyCap";

export const metadata = {
  title: "Creator Appointment | Shortkey",
  description: "Book a 1-hour creator appointment with the Shortkey team.",
};

export default function CreatorSignupPage() {
  return (
    <main className="page-shell px-4 py-10 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <SignupPageHero
          eyebrow="CTRL + CREATOR"
          title={SIGNUP_APPOINTMENT_ONLY ? "Book a Creator Appointment" : "Creator Signup"}
          description={
            SIGNUP_APPOINTMENT_ONLY
              ? "Appointment arrangement only for now — tell us who you are, pick a 1-hour slot, and we confirm by email. Rates and offers are discussed in the meeting."
              : "Book a 1-hour meeting to unlock CTRL Twin licensing, brand job rates, and platform offers. Tell us who you are, pick a slot — we confirm by email."
          }
        />

        {SIGNUP_APPOINTMENT_ONLY ? (
          <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-4">
            <ShortcutChip shortcut="Appointment only" />
            <p className="mt-3 text-sm font-semibold text-ink">Meeting booking — no public rates</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
              Signup is locked to appointment arrangement while we prepare launch. Share your
              details and choose a time; commercial terms stay in the conversation with our team.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-brand/25 bg-brand/8 px-4 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">CTRL Twin</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.08em] text-ink">
                Do less on camera · earn more offline
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                License your approved AI twin for try-on + shade Q&amp;A in your CTRL shop. Human
                brand jobs and platform spots discussed in the meeting.
              </p>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                  Brand job offer video
                </p>
                <p className="mt-2 text-xl font-bold text-ink">USD 1,500 – 3,000</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  × 10 videos
                </p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                  Platform offer video
                </p>
                <p className="mt-2 text-xl font-bold text-ink">USD 500 – 800</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  per video
                </p>
              </div>
            </div>
          </>
        )}

        <div className="mt-8">
          <MeetingSignupForm kind="creator" />
        </div>

        <p className="mt-6 text-[12px] text-ink-muted">
          Brand?{" "}
          <Link href="/signup/brand" className="font-semibold text-ink underline underline-offset-2">
            Brand appointment →
          </Link>
        </p>

        <p className="mt-4 text-[11px] text-ink-subtle">
          Prefer email?{" "}
          <a href="mailto:creators@shortkey.beauty" className="text-ink underline underline-offset-2">
            creators@shortkey.beauty
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
