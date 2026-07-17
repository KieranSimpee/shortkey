import Link from "next/link";
import { MeetingSignupForm } from "@/components/signup/MeetingSignupForm";

export const metadata = {
  title: "Creator Signup | Shortkey",
  description: "Book a 1-hour creator signup meeting with the Shortkey team.",
};

export default function CreatorSignupPage() {
  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + CREATOR
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-ink">
          Creator Signup
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Tell us who you are, pick a 1-hour slot on the calendar, and we&apos;ll confirm your
          onboarding meeting by email.
        </p>

        <div className="mt-8">
          <MeetingSignupForm kind="creator" />
        </div>

        <p className="mt-8 text-[11px] text-ink-subtle">
          Prefer email?{" "}
          <a href="mailto:creators@shortkey.beauty" className="text-ink underline underline-offset-2">
            creators@shortkey.beauty
          </a>
          {" · "}
          <Link href="/about" className="text-ink underline underline-offset-2">
            Back to About
          </Link>
        </p>
      </div>
    </main>
  );
}
