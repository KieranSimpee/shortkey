"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import type { CatalogProduct } from "@/lib/catalog";
import { formatMoney, getUnitPriceUsd } from "@/lib/commerce/pricing";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Makeup", "Skin Care", "K-Beauty", "J-Beauty", "C-Beauty", "Sync ready"] as const;
type Filter = (typeof FILTERS)[number];

type Props = {
  products: CatalogProduct[];
};

export function ShopProductGrid({ products }: Props) {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (filter === "All") return true;
      if (filter === "Makeup") return product.category === "Makeup";
      if (filter === "Skin Care") return product.category === "Skin Care";
      if (filter === "Sync ready") return product.syncReady === true;
      return product.region === filter || product.region === "Multi";
    });
  }, [filter, products]);

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition",
              filter === item
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-white/60 bg-white/50 text-ink-muted hover:border-brand/25 hover:text-ink",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-ink-muted">
        Showing {filtered.length} of {products.length} products
        {filter === "Sync ready" ? " · ready for Shopify sku-map" : null}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {filtered.map((product) => {
          const price = getUnitPriceUsd(product.sku);
          return (
            <article
              key={product.sku}
              className="group overflow-hidden rounded-xl border border-white/50 bg-white/45 transition hover:shadow-soft"
            >
              <Link href={`/shop/${product.sku}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 40vw, 20vw"
                  />
                  {product.syncReady ? (
                    <span className="absolute left-2 top-2 rounded-full bg-brand/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white">
                      Sync
                    </span>
                  ) : null}
                </div>
                <div className="border-t border-white/40 px-2.5 pt-2">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-brand/70">
                    {product.sku}
                  </p>
                  <h2 className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
                    {product.name}
                  </h2>
                  {product.type ? (
                    <p className="mt-0.5 text-[10px] text-ink-muted">{product.type}</p>
                  ) : null}
                  <p className="mt-1 text-[12px] font-semibold text-ink">{formatMoney(price)}</p>
                </div>
              </Link>
              <div className="px-2.5 pb-2.5 pt-1.5">
                <AddToCartButton
                  size="sm"
                  sku={product.sku}
                  name={product.name}
                  image={product.image}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
