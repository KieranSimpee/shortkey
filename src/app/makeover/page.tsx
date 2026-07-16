import Link from "next/link";

export const metadata = {
  title: "Makeover | Shortkey",
  description: "Full-face Korean and Asian makeup tutorials — guided by Shortkey creators.",
};

const TUTORIAL_STYLES = [
  { name: "Glass Skin Base", desc: "Lightweight, hydrated, luminous — the K-Beauty foundation look.", tag: "K-Beauty", shortcut: "CTRL + K" },
  { name: "Idol Eye", desc: "Puppy liner, monolid-optimised eye looks worn by Korean idols.", tag: "K-Beauty", shortcut: "CTRL + K" },
  { name: "Gradient Lip", desc: "Blotted, bitten-lip finish — the signature K-Beauty lip.", tag: "K-Beauty", shortcut: "CTRL + K" },
  { name: "Clean Girl", desc: "Minimal skin, barely-there coverage, your-skin-but-better.", tag: "Multi", shortcut: "CTRL + S" },
  { name: "Soft Matte", desc: "Velvet-skin finish with no-transfer lip. J-Beauty technique.", tag: "J-Beauty", shortcut: "CTRL + J" },
  { name: "Fantasy Full Face", desc: "Flower Knows-inspired editorial — bold pigment, high craft.", tag: "C-Beauty", shortcut: "CTRL + C" },
];

const CREATOR_STYLE_LANES = [
  { name: "Dear Peachie", spec: "Monolid techniques, eyeshadow fundamentals, K-Beauty guides" },
  { name: "Hyojin Cho", spec: "Korean idol-inspired makeup, gradient lip master class" },
  { name: "Risabae", spec: "Korean artist-grade makeup, full transformation looks" },
  { name: "Yunying Li", spec: "C-Beauty editorial, Florasis and luxury Chinese brands" },
];

export default function MakeoverPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">CTRL + M</p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">Makeover</h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">
          Full-face Korean and Asian makeup tutorials. Guided by creators who know exactly why each product was selected.
        </p>
      </div>

      {/* Tutorial Styles */}
      <div className="mb-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Tutorial Styles</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TUTORIAL_STYLES.map((t) => (
            <div key={t.name} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-[#F4F4F4]">{t.name}</p>
                <span className="rounded-full bg-[#1A1A1A] px-2 py-0.5 font-mono text-[8px] text-[#6E6E6E]">{t.shortcut}</span>
              </div>
              <p className="text-xs text-[#9A9A9A]">{t.desc}</p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-[#6E6E6E]">{t.tag}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Style Lanes */}
      <div className="mb-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Creator Style Lanes</p>
        <div className="space-y-2">
          {CREATOR_STYLE_LANES.map((c) => (
            <div key={c.name} className="flex items-start gap-4 rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-3">
              <p className="min-w-[110px] text-xs font-bold text-[#F4F4F4]">{c.name}</p>
              <p className="text-xs text-[#9A9A9A]">{c.spec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Try On CTA */}
      <div className="mb-6 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Try Before You Buy</p>
        <p className="mb-4 text-sm text-[#9A9A9A]">
          Test every shade, lip colour, and eye look with the Shortkey virtual try-on studio before adding to cart.
        </p>
        <Link href="/try-on" className="inline-block rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
          Open Try-On Studio
        </Link>
      </div>

      {/* External Tutorials */}
      <div className="rounded-xl border border-[#2B2B2B] bg-[#0A0A0A] px-6 py-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">External Tutorial Library</p>
        <div className="flex flex-wrap gap-3">
          <a href="https://www.youtube.com/results?search_query=korean+makeup+tutorial" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            Korean makeup → YouTube
          </a>
          <a href="https://www.youtube.com/results?search_query=chinese+beauty+makeup+tutorial" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            C-Beauty → YouTube
          </a>
          <a href="https://www.youtube.com/results?search_query=japanese+skincare+routine+2025" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            J-Beauty routines → YouTube
          </a>
          <Link href="/videos" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs text-[#9A9A9A] hover:text-[#F4F4F4] hover:border-[#6E6E6E] transition">
            Shortkey video library
          </Link>
        </div>
      </div>
    </main>
  );
}
