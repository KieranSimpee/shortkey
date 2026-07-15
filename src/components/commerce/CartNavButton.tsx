"use client";

import Link from "next/link";
import { useCart } from "@/components/commerce/CartProvider";

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 8h12l-1 12H7L6 8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartNavButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/checkout"
      aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-brand/80 transition hover:bg-brand/10 hover:text-brand"
    >
      <BagIcon />
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
