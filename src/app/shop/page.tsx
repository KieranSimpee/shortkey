import Image from "next/image";
import Link from "next/link";
import { MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop | Shortkey",
  description: "Shop Asian beauty essentials — makeup and skin care.",
};

export default function ShopPage() {
  const products = getCatalogProducts();

  return (
    <MockPageShell
      shortcut="CTRL + S"
      badge="SHOP"
      title="Shop Asian beauty essentials"
      description="Browse catalog SKUs pulled from Beauty OS and influencer shops. Checkout is mocked."
      ctas={[
        { label: "Try on →", href: "/try-on" },
        { label: "Influencers →", href: "/influencers", variant: "outline" },
      ]}
    >
      <MockNote>Mock PLP — filters and cart not wired yet.</MockNote>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", "Makeup", "Skin Care", "K-Beauty", "J-Beauty", "C-Beauty"].map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted"
          >
            {filter}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {products.map((product) => (
          <Link
            key={product.sku}
            href={`/shop/${product.sku}`}
            className="group overflow-hidden rounded-xl border border-white/50 bg-white/45 transition hover:shadow-soft"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 40vw, 20vw"
              />
            </div>
            <div className="border-t border-white/40 px-2.5 py-2">
              <p className="font-mono text-[9px] uppercase tracking-wider text-brand/70">
                {product.sku}
              </p>
              <h2 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
                {product.name}
              </h2>
              {product.type ? (
                <p className="mt-0.5 text-[10px] text-ink-muted">{product.type}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </MockPageShell>
  );
}
