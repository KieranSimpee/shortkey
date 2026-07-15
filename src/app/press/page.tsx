import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Press | Shortkey" };

export default function PressPage() {
  return (
    <MockPageShell
      shortcut="CTRL + P"
      badge="PRESS"
      title="Press & Media"
      description="Brand assets, boilerplate, and press contact for Shortkey — the AI Asian beauty platform."
      ctas={[
        { label: "Press enquiries →", href: "mailto:press@shortkey.beauty" },
        { label: "About us →", href: "/about", variant: "outline" },
      ]}
    >
      <MockNote>Press page mock — swap coverage placeholders with real links when live.</MockNote>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <MockBlock
          title="Boilerplate"
          body="Shortkey is the first AI-powered Asian beauty platform connecting K-Beauty, J-Beauty, and C-Beauty brands with Asian consumers in North America. The platform unites brands, creators, and consumers via AI try-on, creator-guided education, and curated assortment — at a flat 5% fee."
        />
        <MockBlock
          title="Key facts"
          body="Founded: 2026 · HQ: Hong Kong · Founder: Kieran Li · Markets: North America Phase 1 · Beauty blocs: K / J / C · Platform fee: 5% flat · Try-on: TINT AI · Commerce: Shopify + Stripe"
        />
        <MockBlock
          title="Brand assets (mock)"
          body="Shortkey logo (PNG, SVG) · Founder headshot · Platform screenshots · Product images. Contact press@shortkey.beauty to request the full media kit."
        />
        <MockBlock
          title="Press contact"
          body="press@shortkey.beauty · Response within 48 hours · For urgent enquiries please mark your subject: URGENT PRESS"
        />
      </div>

      <div className="mt-6">
        <MockBlock title="Featured coverage (mock — replace with real links)">
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {["Jing Daily", "WWD Beauty", "BeautyMatter", "Glossy", "Business of Fashion", "Beauty Independent"].map((pub) => (
              <div key={pub} className="rounded-lg border border-white/50 bg-white/40 px-3 py-2.5 text-center">
                <p className="text-[11px] font-semibold text-ink-muted">{pub}</p>
                <p className="mt-0.5 text-[10px] text-brand">Coverage placeholder →</p>
              </div>
            ))}
          </div>
        </MockBlock>
      </div>
    </MockPageShell>
  );
}
