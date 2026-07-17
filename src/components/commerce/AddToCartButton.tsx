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
  size?: "md" | "sm";
};

export function AddToCartButton({ sku, name, image, className, size = "md" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const compact = size === "sm";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => {
          addItem({ sku, name, image, quantity: 1 });
          setAdded(true);
        }}
        className={cn(
          "inline-flex rounded-full bg-brand font-medium uppercase text-white transition hover:bg-brand-dark",
          compact
            ? "px-2 py-1 text-[7px] tracking-[0.1em]"
            : "px-5 py-2.5 text-[11px] tracking-[0.14em]",
        )}
      >
        {added ? "Added" : "Add to bag"}
      </button>
      {added ? (
        <Link
          href="/checkout"
          className={cn(
            "inline-flex rounded-full border border-brand/30 bg-brand/10 font-medium uppercase text-brand",
            compact
              ? "px-2 py-1 text-[7px] tracking-[0.1em]"
              : "px-4 py-2.5 text-[11px] tracking-[0.14em]",
          )}
        >
          Checkout →
        </Link>
      ) : null}
    </div>
  );
}
