import Link from "next/link";

export const metadata = { title: "Checkout Cancelled | Shortkey" };

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">Checkout</p>
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">Order Cancelled</h1>
        <p className="mb-8 text-sm text-[#9A9A9A]">No charge was made. Your bag is still saved.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/checkout" className="rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
            Return to Checkout
          </Link>
          <Link href="/shop" className="rounded-full border border-[#2B2B2B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
            Keep Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
