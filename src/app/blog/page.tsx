import Link from "next/link";
import { MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Blog | Shortkey" };

const posts = [
  { tag: "K-BEAUTY", title: "Glass skin in 5 steps: the routine that actually works", excerpt: "Our creator Hanna breaks down the 5-step glass skin stack — double cleanse, essence, ampoule, barrier cream, SPF. Products from our shop, try-on links inside.", href: "#" },
  { tag: "J-BEAUTY", title: "Why J-Beauty texture is a skin type answer, not a trend", excerpt: "Milky toners, whip essences, petal-soft SPF — Japanese formulas solve texture anxiety better than any Western alternative. Here is why.", href: "#" },
  { tag: "C-BEAUTY", title: "C-Beauty lip picks: the matte finishes worth switching for", excerpt: "Three lip muds, two velvet stains, one clear gloss. Our C-Beauty edit has a finish for every look — and every skin tone. Try them on first.", href: "#" },
  { tag: "PLATFORM", title: "How Shortkey try-on works — no filter, just your real face", excerpt: "TINT landmark technology maps your face geometry in real time. No AR filter softening. Every shade you see is the shade you will get.", href: "#" },
  { tag: "K-BEAUTY", title: "Barrier repair season: the actives to pause and the ones to keep", excerpt: "Summer humidity meets winter heating — barrier confusion is real. Our creators built routines that protect without stripping.", href: "#" },
  { tag: "CREATOR EDIT", title: "This month on Shortkey: five looks, five creators, five minutes each", excerpt: "Speed round. Five creators. Five complete looks. Timestamped so you can jump straight to the technique you want.", href: "#" },
];

export default function BlogPage() {
  const categories = ["All", "K-Beauty", "J-Beauty", "C-Beauty", "Platform", "Creator Edit"];

  return (
    <MockPageShell
      shortcut="CTRL + B"
      badge="EDITORIAL"
      title="Shortkey blog"
      description="Looks, lives, routines, and notes from across K / J / C beauty — written by creators, for the community."
      ctas={[
        { label: "Watch videos →", href: "/videos" },
        { label: "Influencers →", href: "/influencers", variant: "outline" },
      ]}
    >
      <MockNote>Blog mock — wire to CMS (Contentful connected) when copy is approved.</MockNote>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span key={c} className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted cursor-pointer hover:border-brand/30 hover:text-brand transition-colors">
            {c}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.title} href={p.href} className="group rounded-xl border border-white/50 bg-white/45 overflow-hidden transition hover:shadow-soft hover:border-brand/20">
            <div className="h-36 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/50">{p.tag} · Image placeholder</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">{p.tag}</p>
              <p className="mt-1 text-sm font-semibold text-ink leading-snug group-hover:text-brand transition-colors">{p.title}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">{p.excerpt}</p>
              <p className="mt-3 text-[10px] font-semibold text-brand">Read →</p>
            </div>
          </Link>
        ))}
      </div>
    </MockPageShell>
  );
}
