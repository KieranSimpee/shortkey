import Link from "next/link";

export const metadata = { title: "About Shortkey | AI Asian Beauty Platform" };
const STATS = [
  { v: "51+", l: "Brands Profiled" },
  { v: "3", l: "Beauty Blocs" },
  { v: "5%", l: "Flat Platform Fee" },
  { v: "2026", l: "Phase 1 Launch" },
];

export default function AboutPage() {
  return (
    <main className="page-shell px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">CTRL + A</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-ink">About Shortkey</h1>
        <p className="mb-10 text-sm text-ink-muted">Asian beauty, made easier to trust, learn, and love.</p>

        {/* Mission */}
        <div className="mb-8 rounded-xl border border-white/50 bg-white/45 px-6 py-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-ink">Our Mission</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Shortkey collapses the fragmented Asian beauty discovery-to-purchase journey into one trusted, teachable retail experience. We connect K-Beauty, J-Beauty, and C-Beauty brands with consumers raised in Western markets who love Asian beauty but find mainstream local retail incomplete for their skin tones, features, and cultural references.
          </p>
        </div>

        {/* What We Build */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {[
            { t: "Beauty OS Discovery", d: "Keyboard-shortcut navigation for K, J, and C beauty. CTRL + K, CTRL + J, CTRL + C. Your style, your ctrl." },
            { t: "AI Virtual Try-On", d: "TINT landmark technology maps your face in real time. No filter, no softening — the real shade on your real face before you buy." },
            { t: "Creator-Led Commerce", d: "Every creator has their own live shop. Products are selected by creators who use them — guided discovery, not algorithmic noise." },
            { t: "Founding Brand Platform", d: "We partner directly with Asian beauty brands at a flat 5% fee. No hidden commissions. No channel complexity." },
          ].map((item) => (
            <div key={item.t} className="rounded-xl border border-white/50 bg-white/45 px-5 py-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-ink">{item.t}</p>
              <p className="text-sm text-ink-muted">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-4 gap-3">
          {STATS.map((s) => (
            <div key={s.l} className="rounded-xl border border-white/50 bg-white/45 px-4 py-4 text-center">
              <p className="text-2xl font-bold text-ink">{s.v}</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mb-8 rounded-xl border border-white/50 bg-white/45 px-6 py-6 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink-subtle">Contact</p>
          <a
            href="mailto:info@shortkey.beauty"
            className="text-sm font-semibold text-ink transition hover:text-brand"
          >
            info@shortkey.beauty
          </a>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup/creator"
            className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-brand-dark"
          >
            Creator Signup
          </Link>
          <Link
            href="/signup/brand"
            className="rounded-full border border-white/50 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/40 hover:text-ink"
          >
            Brand Signup
          </Link>
        </div>
        <p className="mt-3 text-[11px] text-ink-subtle">
          Fill in your details, pick a <span className="font-semibold text-ink-muted">1-hour</span>{" "}
          slot, then we email <span className="font-semibold text-ink-muted">info@shortkey.beauty</span>.
        </p>
      </div>
    </main>
  );
}
