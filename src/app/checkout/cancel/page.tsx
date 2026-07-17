import Link from "next/link";

export const metadata = { title: "Checkout Cancelled | Shortkey" };

export default function CheckoutCancelPage() {
  return (
    <main className="page-shell flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">Checkout</p>
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-[0.1em] text-ink">Order Cancelled</h1>
        <p className="mb-8 text-sm text-ink-muted">No charge was made. Your bag is still saved.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/checkout" className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-brand-dark transition">
            Return to Checkout
          </Link>
          <Link href="/shop" className="rounded-full border border-white/50 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-muted hover:border-brand/40 hover:text-ink transition">
            Keep Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
