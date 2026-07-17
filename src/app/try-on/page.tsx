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
    <main className="page-shell px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-white/50 pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + T
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-ink">
          AI Try-On Studio
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Try any product live. No download required.
        </p>
      </div>

      {/* TINT Studio embed panel */}
      <div className="mb-12 rounded-2xl border border-white/50 bg-white/45 p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/40">
          <span className="text-2xl">👁</span>
        </div>
        <h2 className="mb-2 text-lg font-bold uppercase tracking-[0.1em] text-ink">
          Live Try-On
        </h2>
        <p className="mb-1 text-sm text-ink-muted">
          Powered by TINT × Banuba — real-time AR via your camera.
        </p>
        <p className="mb-6 font-mono text-xs text-ink-subtle">
          250,000 try-on sessions per month. No app download needed.
        </p>
        <a
          href="https://demo.tintvto.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-brand px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-brand-dark"
        >
          Launch Try-On Studio →
        </a>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          {[
            { stat: "1,000%", label: "Add-to-cart lift" },
            { stat: "60%", label: "Return rate reduction" },
            { stat: "Real-time", label: "Skin tone detection" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/60 bg-white/50 p-4">
              <p className="text-lg font-bold text-ink">{item.stat}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-subtle">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Try-on eligible products */}
      <div>
        <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-ink-muted">
          Try these products
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {tryOnProducts.map((product) => (
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
                <h3 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink group-hover:text-ink transition">
                  {product.name}
                </h3>
                <p className="mt-1 text-[11px] text-ink-muted">${product.price_usd}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
