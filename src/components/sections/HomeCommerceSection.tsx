import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { CmsZone } from "@/components/cms/CmsZone";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  /** Softer spacing when embedded in /design preview */
  variant?: "live" | "design";
};

/** Best sellers · gift card · subscription info */
export function HomeCommerceSection({ variant = "live" }: Props) {
  const { homeCommerce: c } = siteContent;
  const wrap = variant === "design" ? "px-4 py-10 sm:px-8" : "pb-4 pt-1 lg:pb-5";
  const panel =
    variant === "design"
      ? "mx-auto max-w-6xl space-y-4"
      : "mx-auto max-w-7xl space-y-3 px-4 lg:px-8";

  return (
    <CmsZone id="home-commerce">
      <section id="commerce" className={wrap}>
        <div className={panel}>
          {/* Best sellers */}
          <div className="folder-panel rounded-2xl border border-white/60 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="type-section-muted text-brand/80">{c.bestsellers.eyebrow}</p>
                <h2 className="type-section mt-1">{c.bestsellers.title}</h2>
                <p className="mt-1 max-w-lg text-[11px] text-ink-muted">
                  {c.bestsellers.subtitle}
                </p>
              </div>
              <Button href={c.bestsellers.href} variant="outline" size="sm">
                {c.bestsellers.cta}
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
              {c.bestsellers.products.map((p) => (
                <Link
                  key={p.sku}
                  href={p.href}
                  className="group overflow-hidden rounded-xl border border-white/50 bg-white/45 transition hover:shadow-soft"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes="200px"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white">
                      {p.badge}
                    </span>
                  </div>
                  <div className="border-t border-white/40 px-2.5 py-2">
                    <p className="font-mono text-[8px] text-brand/70">{p.sku}</p>
                    <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
                      {p.name}
                    </p>
                    <p className="mt-0.5 flex items-center justify-between text-[10px] text-ink-muted">
                      <span className="truncate">{p.type}</span>
                      <span className="font-semibold text-ink">{p.price}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Gift card + subscription */}
          <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="folder-panel overflow-hidden rounded-2xl border border-white/60">
              <div className="relative aspect-[16/9] sm:aspect-[5/3]">
                <Image
                  src={c.giftCard.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="480px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2438]/90 via-[#2a2438]/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-light">
                    {c.giftCard.eyebrow}
                  </p>
                  <h3 className="mt-1 text-lg font-bold uppercase tracking-[0.1em] text-white">
                    {c.giftCard.title}
                  </h3>
                  <p className="mt-1 max-w-sm text-[11px] leading-snug text-white/75">
                    {c.giftCard.subtitle}
                  </p>
                </div>
              </div>
              <div className="bg-white/45 px-4 py-4 sm:px-5">
                <div className="flex flex-wrap gap-1.5">
                  {c.giftCard.amounts.map((amt) => (
                    <span
                      key={amt}
                      className="rounded-full border border-brand/25 bg-white/80 px-3 py-1 text-[11px] font-bold text-brand"
                    >
                      {amt}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-ink-subtle">{c.giftCard.note}</p>
                <div className="mt-3">
                  <Button href={c.giftCard.href} variant="highlight" size="sm">
                    {c.giftCard.cta}
                  </Button>
                </div>
              </div>
            </div>

            <div className="folder-panel rounded-2xl border border-white/60 px-4 py-5 sm:px-5 sm:py-5">
              <p className="type-section-muted text-brand/80">{c.subscription.eyebrow}</p>
              <h3 className="type-section mt-1 text-[12px]">{c.subscription.title}</h3>
              <p className="mt-1 text-[11px] text-ink-muted">{c.subscription.subtitle}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {c.subscription.plans.map((plan, i) => (
                  <div
                    key={plan.id}
                    className={cn(
                      "rounded-xl border px-3 py-3",
                      i === 1
                        ? "border-brand/40 bg-brand/10"
                        : "border-white/60 bg-white/50",
                    )}
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {plan.cadence}
                    </p>
                    <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-lg font-bold text-brand">{plan.price}</p>
                    <ul className="mt-2 space-y-1">
                      {plan.perks.map((perk) => (
                        <li key={perk} className="text-[10px] leading-snug text-ink-muted">
                          · {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[9px] text-ink-subtle">{c.subscription.footnote}</p>
              <div className="mt-3">
                <Button href={c.subscription.href} variant="outline" size="sm">
                  {c.subscription.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CmsZone>
  );
}
