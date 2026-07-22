import { ProductSurfaceLocked } from "@/components/shop/ProductSurfaceLocked";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { PRODUCT_SURFACE_LOCKED } from "@/content/featureLocks";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop | Shortkey",
  description: "Shop Asian beauty essentials — makeup and skin care.",
};

export default async function ShopPage() {
  if (PRODUCT_SURFACE_LOCKED) {
    return <ProductSurfaceLocked title="Shop" />;
  }

  const products = getCatalogProducts();

  return (
    <main className="page-shell px-4 py-12 sm:px-8">
      <div className="mb-4 border-b border-white/50 pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + S
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-ink">Shop</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Asian beauty essentials. Curated, guided, trusted.
        </p>
      </div>
      <ShopProductGrid products={products} />
    </main>
  );
}
