import Link from "next/link";

export const metadata = { title: "Blog | Shortkey" };

const POSTS = [
  { tag: "K-BEAUTY", title: "Glass skin in 5 steps: the routine that actually works", excerpt: "Our creator Hanna breaks down the 5-step glass skin stack — double cleanse, essence, ampoule, barrier cream, SPF. Products from our shop, try-on links inside.", date: "Jul 2026" },
  { tag: "J-BEAUTY", title: "Why J-Beauty texture is a skin type answer, not a trend", excerpt: "Milky toners, whip essences, petal-soft SPF — Japanese formulas solve texture anxiety better than any Western alternative.", date: "Jul 2026" },
  { tag: "C-BEAUTY", title: "C-Beauty lip picks: the matte finishes worth switching for", excerpt: "Three lip muds, two velvet stains, one clear gloss. Our C-Beauty edit has a finish for every look — and every skin tone. Try them on first.", date: "Jul 2026" },
  { tag: "PLATFORM", title: "How Shortkey try-on works — no filter, just your real face", excerpt: "TINT landmark technology maps your face geometry in real time. Every shade you see is the shade you will get.", date: "Jul 2026" },
  { tag: "K-BEAUTY", title: "Barrier repair season: the actives to pause and the ones to keep", excerpt: "Summer humidity meets winter heating — barrier confusion is real. Our creators built routines that protect without stripping.", date: "Jun 2026" },
  { tag: "CREATOR EDIT", title: "Five looks, five creators, five minutes each", excerpt: "Speed round. Five creators. Five complete looks. Timestamped so you can jump straight to the technique you want.", date: "Jun 2026" },
];

const CATEGORIES = ["All", "K-Beauty", "J-Beauty", "C-Beauty", "Platform", "Creator Edit"];

const TAG_COLOURS: Record<string, string> = {
  "K-BEAUTY": "text-blue-400",
  "J-BEAUTY": "text-red-400",
  "C-BEAUTY": "text-pink-400",
  "PLATFORM": "text-green-400",
  "CREATOR EDIT": "text-amber-400",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">CTRL + B</p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">Journal</h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">Routines, edits, and creator guides from the Shortkey team.</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} className="rounded-full border border-[#2B2B2B] bg-[#111] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#6E6E6E] hover:text-[#F4F4F4] transition">
            {c}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <article key={post.title} className="group flex flex-col rounded-xl border border-[#2B2B2B] bg-[#111] overflow-hidden hover:border-[#6E6E6E] transition cursor-pointer">
            <div className="aspect-[16/9] bg-[#1A1A1A]" />
            <div className="flex flex-1 flex-col px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${TAG_COLOURS[post.tag] || "text-[#9A9A9A]"}`}>{post.tag}</span>
                <span className="text-[9px] text-[#6E6E6E]">{post.date}</span>
              </div>
              <p className="mb-2 text-sm font-bold leading-snug text-[#F4F4F4]">{post.title}</p>
              <p className="text-xs leading-relaxed text-[#9A9A9A] line-clamp-3">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-5 text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">More on the way</p>
        <p className="text-sm text-[#9A9A9A]">New guides every week. Try the products in the virtual try-on studio before reading.</p>
      </div>
    </main>
  );
}
