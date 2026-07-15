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

  const price = getUnitPriceUsd(sku);

  const seenOn = siteContent.aiLab.hosts.filter((host) =>
    host.shopProducts.some((p) => p.sku.toUpperCase() === product.sku.toUpperCase()),
  );

  const related = getCatalogProducts()
    .filter((p) => p.sku !== product.sku)
    .slice(0, 4);

  return (
    <MockPageShell
      shortcut="CTRL + P"
      badge="PRODUCT"
      title={product.name}
      description={`${product.sku}${product.type ? ` · ${product.type}` : ""} — Asian beauty, curated and try-on ready.`}
      ctas={[
        { label: "Try this shade →", href: "/try-on" },
        { label: "Back to shop →", href: "/shop", variant: "outline" },
      ]}
    >
      <MockNote>
        Cart is live in-browser. Checkout routes to Stripe or Shopify via /api/checkout once env keys are set.
      </MockNote>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/50 bg-white/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col justify-center gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">{product.sku}{product.type ? ` · ${product.type}` : ""}</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{product.name}</h1>
            {price ? (
              <p className="mt-2 text-xl font-semibold text-brand">{formatMoney(price)}</p>
            ) : null}
          </div>

          <div className="space-y-2 text-sm text-ink-muted">
            <p>Curated from K / J / C beauty. Try-on ready — see this shade on your face before you buy.</p>
            <p className="text-[11px]">Free shipping over $75 · 14-day returns on sealed items · Authentic brands only</p>
          </div>

          <AddToCartButton sku={product.sku} name={product.name} image={product.image} />

          <div className="grid grid-cols-2 gap-3">
            <MockBlock title="Try it on first" body="Open AI try-on to see this shade mapped to your face in real time." />
            <MockBlock title="Authentic guaranteed" body="All Shortkey products are sourced direct from verified Asian beauty brands." />
          </div>
        </div>
      </div>

      {/* Seen on creators */}
      {seenOn.length > 0 && (
        <div className="mt-8">
          <MockBlock title="Seen in creator shops">
            <div className="mt-3 flex flex-wrap gap-2">
              {seenOn.map((host) => (
                <Link
                  key={host.id}
                  href={`/influencers/${host.id}`}
                  className="rounded-full border border-brand/25 bg-brand/5 px-3 py-1.5 text-[11px] font-semibold text-brand transition hover:bg-brand/10"
                >
                  {host.name} →
                </Link>
              ))}
            </div>
          </MockBlock>
        </div>
      )}

      {/* Related products */}
      <div className="mt-6">
        <MockBlock title="You might also like">
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.sku}
                href={`/shop/${p.sku}`}
                className="group overflow-hidden rounded-xl border border-white/50 bg-white/40 transition hover:border-brand/20 hover:shadow-soft"
              >
                <div className="relative aspect-square">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="25vw" />
                </div>
                <div className="px-2 py-2">
                  <p className="text-[10px] font-semibold text-ink leading-snug group-hover:text-brand transition-colors">{p.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </MockBlock>
      </div>
    </MockPageShell>
  );
}
