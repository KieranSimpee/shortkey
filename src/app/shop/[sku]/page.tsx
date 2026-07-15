import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { siteContent } from "@/content/homepage";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { formatMoney, getUnitPriceUsd } from "@/lib/commerce/pricing";

type PageProps = {
  params: Promise<{ sku: string }>;
};

export async function generateStaticParams() {
  return getCatalogProducts().map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: PageProps) {
  const { sku } = await params;
  const product = getCatalogProduct(sku);
  return {
    title: product ? `${product.name} | Shortkey` : "Product | Shortkey",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { sku } = await params;
  const product = getCatalogProduct(sku);
  if (!product) notFound();

  const seenOn = siteContent.aiLab.hosts.filter((host) =>
    host.shopProducts.some((p) => p.sku.toUpperCase() === product.sku.toUpperCase()),
  );

  return (
    <MockPageShell
      shortcut="CTRL + P"
      badge="PRODUCT"
      title={product.name}
      description={`${product.sku}${product.type ? ` · ${product.type}` : ""} — mock PDP for review.`}
      ctas={[
        { label: "Try this shade →", href: "/try-on" },
        { label: "Back to shop →", href: "/shop", variant: "outline" },
      ]}
    >
      <MockNote>
        Cart is live in-browser. Checkout uses Stripe or Shopify via /api/checkout once env keys are
        set.
      </MockNote>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/50 bg-white/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 40vw"
            priority
          />
        </div>

        <div className="space-y-4">
          <MockBlock title="Purchase">
            <p className="text-2xl font-semibold text-ink">
              {formatMoney(getUnitPriceUsd(product.sku))}
            </p>
            <p className="mt-1 text-sm text-ink-muted">Catalog price · override in commerce pricing map</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["01", "02", "03", "04"].map((shade) => (
                <span
                  key={shade}
                  className="rounded-full border border-white/60 bg-white/60 px-3 py-1 text-[10px] font-semibold text-ink"
                >
                  Shade {shade}
                </span>
              ))}
            </div>
            <AddToCartButton
              className="mt-4"
              sku={product.sku}
              name={product.name}
              image={product.image}
            />
          </MockBlock>

          <MockBlock title="Seen on influencer shops">
            {seenOn.length ? (
              <ul className="space-y-2">
                {seenOn.map((host) => (
                  <li key={host.id}>
                    <Link
                      href={`/influencers/${host.id}`}
                      className="text-sm font-semibold text-brand hover:text-brand/80"
                    >
                      {host.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">Not featured on a creator shop yet.</p>
            )}
          </MockBlock>
        </div>
      </div>
    </MockPageShell>
  );
}
