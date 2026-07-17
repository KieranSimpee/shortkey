export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { CheckoutContent } from "@/components/commerce/CheckoutClient";

export const metadata = { title: "Checkout | Shortkey" };

function CheckoutFallback() {
  return (
    <div className="rounded-xl border border-white/50 bg-white/45 p-6 text-center text-sm text-ink-muted">
      Loading…
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="page-shell px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-lg lg:max-w-4xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          CTRL + $
        </p>
        <h1 className="mb-8 text-3xl font-bold uppercase tracking-[0.1em] text-ink">
          Checkout
        </h1>

        <Suspense fallback={<CheckoutFallback />}>
          <CheckoutContent />
        </Suspense>

        <p className="mt-6 text-center text-xs text-ink-subtle">
          Secure checkout via Stripe or Shopify.{" "}
          <Link
            href="/shop"
            className="text-ink-muted underline underline-offset-2 hover:text-ink"
          >
            Continue shopping
          </Link>
        </p>
      </div>
    </main>
  );
}
