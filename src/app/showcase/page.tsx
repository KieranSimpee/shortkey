import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ShortKey Showcase | Control + Magazine",
  description:
    "Private staging showcase — Master Control Panel and Magazine Demo (Nihon Sakura Issue 01). Soft gate · GOR_GOR_REVIEW · not Beauty V1 home.",
  robots: { index: false, follow: false },
};

/**
 * Private showcase hub — soft staging cookie gate (FAMILY_TABLE_STAGING_PASSWORD).
 * Beauty Coming Soon `/` stays locked; these paths are separate demos.
 */
export default function ShowcasePage() {
  return (
    <main
      className="min-h-screen px-5 py-12 text-[#2C3E6B]"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(196,120,122,0.16), transparent 65%), linear-gradient(180deg, #efe8da, #F5F0E6)",
      }}
    >
      <p className="mb-8 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C4787A]">
        ShortKey · Private Showcase · GOR_GOR_REVIEW
      </p>
      <h1
        className="text-center text-4xl font-bold text-[#C9A962] sm:text-5xl"
        style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        Showcase
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm opacity-80">
        Staging links for Control Panel and Magazine — unlock via{" "}
        <code className="font-mono text-xs">/internal/login</code>. Not the locked Beauty V1 home.
      </p>
      <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
        <Link
          href="/showcase/magazine"
          className="rounded-xl bg-[#2C3E6B] px-5 py-4 text-center text-sm font-semibold text-white"
        >
          Magazine Demo · Issue 01
        </Link>
        <Link
          href="/magazine-demo/#/cover"
          className="rounded-xl border border-[#2C3E6B]/25 bg-white/50 px-5 py-4 text-center text-sm font-semibold"
        >
          Magazine direct · /magazine-demo/#/cover
        </Link>
        <Link
          href="/control"
          className="rounded-xl border border-[#C9A962]/50 bg-[#C9A962]/15 px-5 py-4 text-center text-sm font-semibold"
        >
          Master Control Panel
        </Link>
      </div>
    </main>
  );
}
