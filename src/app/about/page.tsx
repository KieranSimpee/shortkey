import Link from "next/link";

export const metadata = { title: "About Shortkey | AI Asian Beauty Platform" };

const STATS = [
  { v: "51+", l: "Brands Profiled" },
  { v: "3", l: "Beauty Blocs" },
  { v: "5%", l: "Flat Platform Fee" },
  { v: "2026", l: "Phase 1 Launch" },
];

const TEAM = [
  { name: "Kieran Li", role: "Founder & CEO", note: "Simplex-ity · Asian beauty commerce" },
  { name: "Wilson T", role: "Head of Technology", note: "Platform architecture & wiring" },
  { name: "Jenny Au", role: "Head of Operations", note: "Playbook accuracy & brand relations" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">CTRL + A</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">About Shortkey</h1>
        <p className="mb-10 text-sm text-[#9A9A9A]">Asian beauty, made easier to trust, learn, and love.</p>

        {/* Mission */}
        <div className="mb-8 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Our Mission</p>
          <p className="text-sm leading-relaxed text-[#9A9A9A]">
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
            <div key={item.t} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">{item.t}</p>
              <p className="text-sm text-[#9A9A9A]">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-4 gap-3">
          {STATS.map((s) => (
            <div key={s.l} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-4 py-4 text-center">
              <p className="text-2xl font-bold text-[#F4F4F4]">{s.v}</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6E6E6E]">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Founding Team</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {TEAM.map((m) => (
              <div key={m.name} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
                <div className="mb-3 h-10 w-10 rounded-full bg-[#2B2B2B]" />
                <p className="text-sm font-bold text-[#F4F4F4]">{m.name}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A9A9A]">{m.role}</p>
                <p className="mt-1 text-[10px] text-[#6E6E6E]">{m.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link href="/influencers" className="rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
            Meet Creators
          </Link>
          <Link href="/brands" className="rounded-full border border-[#2B2B2B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
            For Brands
          </Link>
        </div>
      </div>
    </main>
  );
}
