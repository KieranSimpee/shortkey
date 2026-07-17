import Link from "next/link";

export const metadata = { title: "Press & Media | Shortkey" };

const BOILERPLATE = `Shortkey is the first AI-powered Asian beauty platform for North American consumers. Built by Simplex-ity Ltd, Shortkey unites K-Beauty, J-Beauty, and C-Beauty brands with consumers through keyboard-shortcut discovery, TINT virtual try-on technology, and creator-led live commerce. The platform operates at a flat 5% fee — replacing the fragmented, high-cost channel model that has held Asian beauty brands back in the West.`;

const FACTS = [
  { label: "Founded", value: "2025" },
  { label: "HQ", value: "Hong Kong" },
  { label: "Target Market", value: "North America (Phase 1)" },
  { label: "Platform Fee", value: "5% flat — no hidden commissions" },
  { label: "Brands Profiled", value: "51 K / J / C Beauty brands" },
  { label: "Technology", value: "TINT AI Virtual Try-On · Beauty OS · Creator Live Commerce" },
];

export default function PressPage() {
  return (
    <main className="page-shell px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">CTRL + P</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-ink">Press & Media</h1>
        <p className="mb-10 text-sm text-ink-muted">Brand assets, boilerplate, and press contact for Shortkey.</p>

        {/* Boilerplate */}
        <div className="mb-8 rounded-xl border border-white/50 bg-white/45 px-6 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-ink">Company Boilerplate</p>
          <p className="text-sm leading-relaxed text-ink-muted">{BOILERPLATE}</p>
        </div>

        {/* Fast Facts */}
        <div className="mb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-ink-subtle">Fast Facts</p>
          <div className="space-y-2">
            {FACTS.map((f) => (
              <div key={f.label} className="flex items-start gap-4 rounded-xl border border-white/50 bg-white/45 px-5 py-3">
                <p className="min-w-[140px] text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-subtle">{f.label}</p>
                <p className="text-sm text-ink">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage (placeholder) */}
        <div className="mb-8 rounded-xl border border-white/50 bg-white/45 px-6 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-ink">Media Coverage</p>
          <p className="text-sm text-ink-subtle">Coverage links will appear here as Shortkey launches. Press enquiries welcome at press@shortkey.beauty.</p>
        </div>

        {/* Contact */}
        <div className="rounded-xl border border-white/50 bg-white/45 px-6 py-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-ink-subtle">Press Contact</p>
          <p className="mb-4 text-sm text-ink-muted">Media enquiries, brand asset requests, and interview coordination.</p>
          <a href="mailto:press@shortkey.beauty" className="inline-block rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-brand-dark transition">
            press@shortkey.beauty
          </a>
        </div>
      </div>
    </main>
  );
}
