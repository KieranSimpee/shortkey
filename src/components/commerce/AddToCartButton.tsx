"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/commerce/CartProvider";
import { cn } from "@/lib/utils";

type Props = {
  sku: string;
  name: string;
  image: string;
  className?: string;
};

export function AddToCartButton({ sku, name, image, className }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => {
          addItem({ sku, name, image, quantity: 1 });
          setAdded(true);
        }}
        className="inline-flex rounded-full bg-brand px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-brand-dark"
      >
        {added ? "Added to bag" : "Add to bag"}
      </button>
      {added ? (
        <Link
          href="/checkout"
          className="inline-flex rounded-full border border-brand/30 bg-brand/10 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-brand"
        >
          Checkout →
        </Link>
      ) : null}
    </div>
  );
}
