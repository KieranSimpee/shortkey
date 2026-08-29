import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import { MakeupTryOnSimulator } from "@/components/tryon/MakeupTryOnSimulator";
import { makeupTryOnDemo } from "@/content/makeupTryOnDemo";

export const metadata = {
  title: "AI Try-On | Shortkey",
  description:
    "Makeup try-on studio — SIMULATOR overlays for lip, blush, eye, base. TINT merchant wiring pending; no fake medical skin claims.",
};

/**
 * Honest status (GOR_GOR_REVIEW):
 * - TintVtoWidget exists but is not mounted app-wide without NEXT_PUBLIC_TINT_MERCHANT_ID.
 * - Makeup selection + face overlay = local SIMULATOR (not live Banuba camera CRM).
 * - Skin analysis on homepage Brand demo = motion placeholder, not clinical diagnosis.
 */
export default async function TryOnPage({
  searchParams,
}: {
  searchParams?: Promise<{ sku?: string; mode?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const allProducts = await getProducts();
  const tryOnSkus = new Set(makeupTryOnDemo.map((m) => m.sku.toUpperCase()));
  const tryOnProducts = allProducts.filter(
    (p) =>
      p.category === "Makeup" ||
      p.category === "Lip" ||
      p.category === "Eyes" ||
      p.category === "Face" ||
      tryOnSkus.has(p.shopify_sku.toUpperCase()),
  );
  const merchantId = process.env.NEXT_PUBLIC_TINT_MERCHANT_ID?.trim() || "";
  const tintReady = Boolean(merchantId);

  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      <div className="mb-10 border-b border-white/50 pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + T · Staging honesty
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-ink">
          AI Try-On Studio
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Makeup available for try-on: lip, blush, eye, base. Live ShortKey × TINT guest CRM is{" "}
          <span className="font-semibold text-ink">
            {tintReady ? "merchant ID present — widget mount still required" : "not wired yet"}
          </span>
          .
        </p>
      </div>

      <MakeupTryOnSimulator initialSku={params.sku} className="mb-10" />

      <div className="mb-8 rounded-2xl border border-brand/30 bg-brand/5 p-6 sm:p-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brand">
          Honest status · GOR_GOR_REVIEW
        </p>
        <ul className="space-y-2 text-sm leading-relaxed text-ink-muted">
          <li>
            Makeup picker above = <strong className="text-ink">SIMULATOR</strong> — CSS overlay on a
            face placeholder. Correlated to catalog SKUs; not live Banuba camera.
          </li>
          <li>
            Control Center / Runway Try On + Skin Scan = <strong className="text-ink">local simulator</strong>{" "}
            overlays. Clicks append a staging Customer Beauty Record in this browser only.
          </li>
          <li>
            Magazine demo Issue 01 = same honesty · open{" "}
            <Link href="/magazine-demo/#/try-on" className="font-semibold text-brand underline-offset-2 hover:underline">
              /magazine-demo/#/try-on
            </Link>
            .
          </li>
          <li>
            Banuba TINT widget code exists (`TintVtoWidget`) but is{" "}
            <strong className="text-ink">
              {tintReady
                ? "not yet mounted on this page — set merchant catalog SKUs next"
                : "inactive until NEXT_PUBLIC_TINT_MERCHANT_ID is set and provider is mounted"}
            </strong>
            .
          </li>
          <li>
            External vendor demo ≠ ShortKey per-customer CRM. No production Base44 beauty-record store
            claimed here.
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          {tintReady ? (
            <span className="inline-block rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
              Merchant ID set · mount TintVtoProvider to go live
            </span>
          ) : (
            <a
              href="https://demo.tintvto.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-ink/20 bg-white/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-ink transition hover:border-brand/40"
            >
              Open TINT vendor demo (external) →
            </a>
          )}
          <Link
            href="/control/customer-records"
            className="inline-block rounded-full border border-brand/40 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-brand transition hover:bg-brand/10"
          >
            Staging beauty records
          </Link>
          <Link
            href="/control/center"
            className="inline-block rounded-full border border-ink/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-ink-muted transition hover:border-ink/30"
          >
            Control Center (Phone | Desktop)
          </Link>
          <Link
            href="/runway"
            className="inline-block rounded-full border border-ink/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-ink-muted transition hover:border-ink/30"
          >
            Runway try-on
          </Link>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-ink-muted">
          Makeup catalog (try-on eligible)
        </h2>
        {tryOnProducts.length === 0 ? (
          <p className="text-sm text-ink-muted">No makeup products in catalog fallback.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {tryOnProducts.map((product) => (
              <Link
                key={product.id}
                href={`/try-on?sku=${encodeURIComponent(product.shopify_sku)}`}
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
                    {product.brand_name} · {product.category}
                  </p>
                  <h3 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink transition group-hover:text-ink">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-ink-muted">${product.price_usd}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
