import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { filterByShortKeyCategory } from "@/lib/category-map";

export const metadata = {
  title: "J-Beauty | Shortkey",
  description: "Japanese beauty discovery on Shortkey.",
};

export default async function JBeautyPage() {
  const allProducts = await getProducts();
  const products = filterByShortKeyCategory(allProducts, "ctrl-j");

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">
          CTRL + J
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">
          J-Beauty
        </h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">
          Japanese beauty. Effortless, refined.
        </p>
        <p className="mt-1 font-mono text-xs text-[#6E6E6E]">
          {products.length} products
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {["All", "Lip", "Face", "Eyes", "Skin"].map((filter) => (
          <span
            key={filter}
            className="cursor-pointer rounded-full border border-[#2B2B2B] bg-[#0A0A0A] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A9A9A] transition hover:border-[#F4F4F4] hover:text-[#F4F4F4]"
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
            className="group overflow-hidden rounded-xl border border-[#2B2B2B] bg-[#111111] transition hover:border-[#6E6E6E]"
          >
            <div className="relative aspect-square overflow-hidden bg-[#1A1A1A]">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 40vw, 20vw"
              />
            </div>
            <div className="border-t border-[#2B2B2B] px-3 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#6E6E6E]">
                {product.brand_name}
              </p>
              <h2 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D7D7D7] transition group-hover:text-[#F4F4F4]">
                {product.name}
              </h2>
              <p className="mt-1 text-[11px] text-[#9A9A9A]">${product.price_usd}</p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-[#6E6E6E]">No J-Beauty products found.</p>
        </div>
      )}
    </main>
  );
}
