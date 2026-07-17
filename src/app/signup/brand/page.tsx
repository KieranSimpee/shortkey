import Link from "next/link";
import { MeetingSignupForm } from "@/components/signup/MeetingSignupForm";

export const metadata = {
  title: "Brand Signup | Shortkey",
  description: "Book a 1-hour brand signup meeting with the Shortkey team.",
};

export default function BrandSignupPage() {
  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + BRAND
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-ink">
          Brand Signup
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Share your brand details, choose a 1-hour meeting slot, and our team will follow up to
          start founding-partner onboarding.
        </p>

        <div className="mt-8">
          <MeetingSignupForm kind="brand" />
        </div>

        <p className="mt-8 text-[11px] text-ink-subtle">
          Prefer email?{" "}
          <a href="mailto:brands@shortkey.beauty" className="text-ink underline underline-offset-2">
            brands@shortkey.beauty
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
