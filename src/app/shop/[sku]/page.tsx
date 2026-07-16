import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { formatMoney, getUnitPriceUsd } from "@/lib/commerce/pricing";

type PageProps = { params: Promise<{ sku: string }> };

export async function generateStaticParams() {
  return getCatalogProducts().map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: PageProps) {
  const { sku } = await params;
  const product = getCatalogProduct(sku);
  return { title: product ? `${product.name} | Shortkey` : "Product | Shortkey" };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { sku } = await params;
  const product = getCatalogProduct(sku);
  if (!product) notFound();

  const priceUsd = getUnitPriceUsd(sku);

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <p className="mb-8 text-[10px] text-[#6E6E6E]">
          <Link href="/shop" className="hover:text-[#9A9A9A] transition">Shop</Link>
          {" / "}
          <span className="text-[#9A9A9A]">{product.name}</span>
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#1A1A1A]">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6E6E6E]">{sku}</p>
            {product.type && (
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9A9A9A]">{product.type}</p>
            )}
            <h1 className="mt-2 text-2xl font-bold leading-tight text-[#F4F4F4]">{product.name}</h1>

            {priceUsd != null && (
              <p className="mt-4 text-xl font-bold text-[#F4F4F4]">{formatMoney(priceUsd)}</p>
            )}

            <div className="mt-6">
              <AddToCartButton sku={sku} name={product.name} image={product.image} />
            </div>

            <div className="mt-8 space-y-2">
              {[
                { t: "Free returns", d: "Unopened items returned within 14 days." },
                { t: "Try before you buy", d: "Use TINT virtual try-on to see this product on your face first." },
                { t: "Creator guided", d: "Selected by Shortkey creators who use it in their routines." },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-4 py-3">
                  <p className="text-xs font-bold text-[#F4F4F4]">{item.t}</p>
                  <p className="mt-0.5 text-xs text-[#9A9A9A]">{item.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/try-on" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs font-semibold text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
                Try On →
              </Link>
              <Link href="/shop" className="rounded-full border border-[#2B2B2B] px-4 py-2 text-xs font-semibold text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
                ← Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
