import { FoundingBrandCheckoutButton } from "@/components/commerce/FoundingBrandCheckoutButton";
import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { siteContent } from "@/content/homepage";

export const metadata = {
  title: "For Brands | Shortkey",
  description: "Join as a founding brand — mock landing for review.",
};

export default function BrandsLandingPage() {
  const { brands } = siteContent;

  return (
    <MockPageShell
      shortcut="CTRL + B"
      badge={brands.tag}
      title={brands.title}
      description={brands.description}
      ctas={[
        { label: "View homepage section →", href: "/#brands", variant: "outline" },
        { label: "Contact partnerships →", href: "/contact" },
      ]}
    >
      <MockNote>
        Founding fee checkout is Stripe-ready via /api/checkout/brand. Retail orders use Shopify or
        Stripe from /checkout.
      </MockNote>

      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-brand/80">
        {brands.slotsLabel}
      </p>
      <p className="mt-2 text-sm text-ink-muted">{brands.commissionNote}</p>
      <p className="mt-2 text-2xl font-semibold text-brand">{brands.foundingFee}</p>
      <FoundingBrandCheckoutButton className="mt-4" />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {brands.aim.cards.map((card) => (
          <MockBlock key={card.label} title={`${card.shortcut} · ${card.label}`} body={card.description} />
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {brands.features.map((feature) => (
          <div
            key={feature.label}
            className="rounded-xl border border-white/50 bg-white/40 px-4 py-3 text-sm text-ink"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand/80">
              {feature.shortcut}
            </span>
            <p className="mt-1">{feature.label}</p>
          </div>
        ))}
      </div>
    </MockPageShell>
  );
}
