import { siteContent } from "@/content/homepage";
import { KeyCap } from "@/components/ui/KeyCap";

export function BrandPartnerPanel() {
  const { brands } = siteContent;
  const { stats, featuresHeading } = brands;

  return (
    <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
      <div className="flex flex-col justify-center">
        {featuresHeading ? (
          <p className="type-section-muted mb-4 text-brand-light/70">{featuresHeading}</p>
        ) : null}
        <ul className="space-y-4">
          {brands.features.map((feature) => (
            <li key={feature.label} className="flex items-center gap-3">
              <KeyCap
                size="sm"
                className="shrink-0 border-white/30 from-white/90 to-white/70 lowercase text-brand-dark"
              >
                {feature.shortcut.split("+").pop()?.trim().toLowerCase()}
              </KeyCap>
              <span className="text-sm font-normal text-white/80">{feature.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:col-span-2 lg:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-medium text-brand-light sm:text-3xl">{stat.value}</p>
            <p className="mt-1.5 text-xs font-normal uppercase tracking-[0.15em] text-white/45">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
