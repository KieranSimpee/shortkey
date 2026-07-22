import Image from "next/image";
import Link from "next/link";
import { CategorySurfaceLocked } from "@/components/shop/CategorySurfaceLocked";
import { CATEGORY_SURFACE_LOCKED } from "@/content/featureLocks";
import { getProducts } from "@/lib/products";
import { filterByShortKeyCategory } from "@/lib/category-map";

export const metadata = {
  title: "C-Beauty | Shortkey",
  description: "Chinese beauty discovery on Shortkey.",
};

export default async function CBeautyPage() {
  if (CATEGORY_SURFACE_LOCKED) {
    return <CategorySurfaceLocked title="C-Beauty" />;
  }

  const allProducts = await getProducts();
  const products = filterByShortKeyCategory(allProducts, "ctrl-c-beauty");

  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      <div className="mb-10 border-b border-white/50 pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + C
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-ink">
          C-Beauty
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Chinese beauty. Bold. Palace-inspired.
        </p>
        <p className="mt-1 font-mono text-xs text-ink-subtle">
          {products.length} products
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {["All", "Lip", "Face", "Eyes", "Skin"].map((filter) => (
          <span
            key={filter}
            className="cursor-pointer rounded-full border border-white/60 bg-white/50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/40 hover:text-ink"
          >
            {filter}
          </span>
        ))}
      </div>

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
              <h2 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink transition group-hover:text-ink">
                {product.name}
              </h2>
              <p className="mt-1 text-[11px] text-ink-muted">${product.price_usd}</p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-ink-subtle">No C-Beauty products found.</p>
        </div>
      )}
    </main>
  );
}
