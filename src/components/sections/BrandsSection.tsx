import { siteContent } from "@/content/homepage";
import { FoundingBrandCheckoutButton } from "@/components/commerce/FoundingBrandCheckoutButton";
import { Button } from "@/components/ui/Button";
import { CmsZone } from "@/components/cms/CmsZone";
import { SectionLabel } from "@/components/ui/Panel";
import { SectionShortcutBar } from "@/components/ui/SectionShortcutBar";
import { BrandPartnerPanel } from "@/components/sections/BrandPartnerPanel";

export function BrandsSection() {
  const { brands } = siteContent;

  return (
    <CmsZone id="brands">
      <section id="brands" className="brands-panel py-14 text-white lg:py-20">
        <div className="px-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionShortcutBar shortcut="CTRL + B" label="PARTNER WITH SHORTKEY" dark />

            <div className="mb-12 lg:mb-16">
              <p className="type-section-muted mb-3 text-brand-light/80">{brands.tag}</p>
              <h2 className="type-section text-2xl font-bold normal-case tracking-tight text-white sm:text-3xl">
                {brands.title}
              </h2>
              <p className="type-body mt-4 max-w-2xl text-white/65">{brands.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-brand-light/70">
                {brands.slotsLabel}
              </p>
              <p className="mt-2 max-w-xl text-sm text-white/50">{brands.commissionNote}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={brands.cta.href} variant="outline-light" size="sm">
                  {brands.cta.label}
                </Button>
                <FoundingBrandCheckoutButton dark />
              </div>
            </div>

            <div className="mb-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-3">
                <SectionLabel spacing="mb-2">{brands.aim.label}</SectionLabel>
                <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {brands.aim.title}
                </h3>
                <p className="type-body mt-3 max-w-2xl text-white/60">{brands.aim.description}</p>
              </div>
              {brands.aim.cards.map((card) => (
                <div key={card.label} className="panel-card-inner !p-5">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-light/80">
                    {card.shortcut} — {card.label}
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-white">{card.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/55">{card.description}</p>
                </div>
              ))}
            </div>

            <BrandPartnerPanel />
          </div>
        </div>
      </section>
    </CmsZone>
  );
}
