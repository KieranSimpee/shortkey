import Link from "next/link";

export const metadata = { title: "Order Confirmed | Shortkey" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; mock?: string; items?: string }>;
}) {
  const params = await searchParams;
  const isMock = !params.session_id;

  return (
    <main className="page-shell flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-green-800 bg-green-900/30">
          <span className="text-green-400 text-lg">✓</span>
        </div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          {isMock ? "Mock Order" : `Order ${params.session_id?.slice(-6).toUpperCase()}`}
        </p>
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-[0.1em] text-ink">
          {isMock ? "Mock Confirmed" : "Thank You"}
        </h1>
        <p className="mb-2 text-sm text-ink-muted">
          {isMock
            ? "This is a mock order confirmation. No payment was taken."
            : "Your payment was received. Your Asian beauty order is on its way."}
        </p>
        {!isMock && (
          <p className="mb-6 text-xs text-ink-subtle">A confirmation email has been sent to you with your tracking details.</p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/shop" className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-brand-dark transition">
            Continue Shopping
          </Link>
          <Link href="/" className="rounded-full border border-white/50 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-muted hover:border-brand/40 hover:text-ink transition">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
