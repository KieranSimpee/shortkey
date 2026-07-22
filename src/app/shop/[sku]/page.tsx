export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ProductSurfaceLocked } from "@/components/shop/ProductSurfaceLocked";
import { PRODUCT_SURFACE_LOCKED } from "@/content/featureLocks";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { formatMoney, getUnitPriceUsd } from "@/lib/commerce/pricing";

type PageProps = { params: Promise<{ sku: string }> };

export async function generateStaticParams() {
  if (PRODUCT_SURFACE_LOCKED) return [];
  return getCatalogProducts().map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: PageProps) {
  if (PRODUCT_SURFACE_LOCKED) {
    return { title: "Product | Shortkey" };
  }
  const { sku } = await params;
  const product = getCatalogProduct(sku);
  return { title: product ? `${product.name} | Shortkey` : "Product | Shortkey" };
}

export default async function ProductDetailPage({ params }: PageProps) {
  if (PRODUCT_SURFACE_LOCKED) {
    return <ProductSurfaceLocked title="Product" />;
  }

  const { sku } = await params;
  const product = getCatalogProduct(sku);
  if (!product) notFound();

  const priceUsd = getUnitPriceUsd(sku);

  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-8 text-[10px] text-ink-subtle">
          <Link href="/shop" className="transition hover:text-ink-muted">
            Shop
          </Link>
          {" / "}
          <span className="text-ink-muted">{product.name}</span>
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white/40">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>

          <div className="flex flex-col">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-subtle">{sku}</p>
            {product.type && (
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {product.type}
              </p>
            )}
            <h1 className="mt-2 text-2xl font-bold leading-tight text-ink">{product.name}</h1>

            {priceUsd != null && (
              <p className="mt-4 text-xl font-bold text-ink">{formatMoney(priceUsd)}</p>
            )}

            <div className="mt-6">
              <AddToCartButton sku={sku} name={product.name} image={product.image} />
            </div>

            <div className="mt-8 space-y-2">
              {[
                { t: "Free returns", d: "Unopened items returned within 14 days." },
                {
                  t: "Try before you buy",
                  d: "Use TINT virtual try-on to see this product on your face first.",
                },
                {
                  t: "Creator guided",
                  d: "Selected by Shortkey creators who use it in their routines.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-white/50 bg-white/45 px-4 py-3"
                >
                  <p className="text-xs font-bold text-ink">{item.t}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{item.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/try-on"
                className="rounded-full border border-white/50 px-4 py-2 text-xs font-semibold text-ink-muted transition hover:border-brand/40 hover:text-ink"
              >
                Try On →
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-white/50 px-4 py-2 text-xs font-semibold text-ink-muted transition hover:border-brand/40 hover:text-ink"
              >
                ← Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
