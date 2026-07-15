import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "About Shortkey | AI Asian Beauty Platform" };

export default function AboutPage() {
  return (
    <MockPageShell
      shortcut="CTRL + A"
      badge="COMPANY"
      title="About Shortkey"
      description="The first AI-powered Asian beauty platform — try, learn, shop, and discover K / J / C beauty through shortcuts."
      ctas={[
        { label: "Meet influencers →", href: "/influencers" },
        { label: "For brands →", href: "/brands", variant: "outline" },
      ]}
    >
      <MockNote>About page mock — copy approved by Kieran before going live.</MockNote>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <MockBlock
          title="Mission"
          body="Shortkey collapses the fragmented Asian beauty discovery-to-purchase journey into one trusted, teachable experience. We connect K-Beauty, J-Beauty, and C-Beauty brands with the consumers raised in Western markets who love them."
        />
        <MockBlock
          title="What we build"
          body="Beauty OS discovery · AI virtual try-on (TINT) · Influencer live commerce · Founding brand partnerships · Creator-led education. One platform — every shortcut."
        />
        <MockBlock
          title="Who we serve"
          body="Asian consumers in North America who find mainstream local retail incomplete for their skin tones, features, and cultural beauty references. We are their shortcut."
        />
        <MockBlock
          title="Platform model"
          body="Three sides: Brands get curated reach and 5% flat fee. Creators get their own live shop. Consumers get guided, trusted discovery with AI try-on before every purchase."
        />
      </div>

      <div className="mt-6">
        <MockBlock title="Founding team (mock)">
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { name: "Kieran Li", role: "Founder & CEO", note: "Simplex-ity · Asian beauty commerce" },
              { name: "Wilson T", role: "Head of Technology", note: "Platform architecture & wiring" },
              { name: "Jenny Au", role: "Head of Operations", note: "Playbook accuracy & brand relations" },
            ].map((m) => (
              <div key={m.name} className="rounded-xl border border-white/50 bg-white/40 px-4 py-3">
                <div className="h-10 w-10 rounded-full bg-brand/15 mb-2" />
                <p className="text-sm font-semibold text-ink">{m.name}</p>
                <p className="text-[11px] font-medium text-brand">{m.role}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{m.note}</p>
              </div>
            ))}
          </div>
        </MockBlock>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          { v: "50+", l: "Brands profiled" },
          { v: "3", l: "Beauty blocs" },
          { v: "5%", l: "Flat platform fee" },
          { v: "2026", l: "Phase 1 launch" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-white/50 bg-white/40 px-4 py-3 text-center">
            <p className="text-2xl font-semibold text-brand">{s.v}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{s.l}</p>
          </div>
        ))}
      </div>
    </MockPageShell>
  );
}
