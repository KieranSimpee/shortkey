import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { filterByShortKeyCategory } from "@/lib/category-map";

export const metadata = {
  title: "K-Beauty | Shortkey",
  description: "Korean beauty discovery on Shortkey.",
};

export default async function KBeautyPage() {
  const allProducts = await getProducts();
  const products = filterByShortKeyCategory(allProducts, "ctrl-k");

  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-white/50 pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + K
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-ink">
          K-Beauty
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Korean beauty. Glass skin to idol lip.
        </p>
        <p className="mt-1 font-mono text-xs text-ink-subtle">
          {products.length} products
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {["All", "Lip", "Face", "Eyes", "Skin"].map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-white/60 bg-white/50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted cursor-pointer hover:border-brand/40 hover:text-ink transition"
          >
            {filter}
          </span>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.shopify_sku}`}
            className="group overflow-hidden rounded-xl border border-white/50 bg-white/45 transition hover:border-brand/25 hover:shadow-soft"
          >
            <div className="relative aspect-square overflow-hidden bg-white/40">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 40vw, 20vw"
              />
            </div>
            <div className="border-t border-white/50 px-3 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                {product.brand_name}
              </p>
              <h2 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink group-hover:text-ink transition">
                {product.name}
              </h2>
              <p className="mt-1 text-[11px] text-ink-muted">
                ${product.price_usd}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-ink-subtle">No K-Beauty products found.</p>
        </div>
      )}
    </main>
  );
}
