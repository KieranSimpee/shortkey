import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "AI Try-On | Shortkey",
  description: "Virtual try-on studio — try any lip, face or eye product live via your camera.",
};

export default async function TryOnPage() {
  const allProducts = await getProducts();
  const tryOnProducts = allProducts.filter(
    (p) => p.category === "Lip" || p.category === "Eyes" || p.category === "Face"
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">
          CTRL + T
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">
          AI Try-On Studio
        </h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">
          Try any product live. No download required.
        </p>
      </div>

      {/* TINT Studio embed panel */}
      <div className="mb-12 rounded-2xl border border-[#2B2B2B] bg-[#111111] p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#2B2B2B] bg-[#1A1A1A]">
          <span className="text-2xl">👁</span>
        </div>
        <h2 className="mb-2 text-lg font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">
          Live Try-On
        </h2>
        <p className="mb-1 text-sm text-[#9A9A9A]">
          Powered by TINT × Banuba — real-time AR via your camera.
        </p>
        <p className="mb-6 font-mono text-xs text-[#6E6E6E]">
          250,000 try-on sessions per month. No app download needed.
        </p>
        <a
          href="https://demo.tintvto.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-[#F4F4F4] px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] transition hover:bg-[#D7D7D7]"
        >
          Launch Try-On Studio →
        </a>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          {[
            { stat: "1,000%", label: "Add-to-cart lift" },
            { stat: "60%", label: "Return rate reduction" },
            { stat: "Real-time", label: "Skin tone detection" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[#2B2B2B] bg-[#0A0A0A] p-4">
              <p className="text-lg font-bold text-[#F4F4F4]">{item.stat}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-[#6E6E6E]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Try-on eligible products */}
      <div>
        <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-[#9A9A9A]">
          Try these products
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {tryOnProducts.map((product) => (
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
                <h3 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D7D7D7] group-hover:text-[#F4F4F4] transition">
                  {product.name}
                </h3>
                <p className="mt-1 text-[11px] text-[#9A9A9A]">${product.price_usd}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
