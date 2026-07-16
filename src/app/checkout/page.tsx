import Link from "next/link";
import { CheckoutClient } from "@/components/commerce/CheckoutClient";

export const metadata = { title: "Checkout | Shortkey" };

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-lg">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">CTRL + $</p>
        <h1 className="mb-8 text-3xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">Checkout</h1>
        <CheckoutClient />
        <p className="mt-6 text-center text-xs text-[#6E6E6E]">
          Secure checkout via Stripe.{" "}
          <Link href="/shop" className="text-[#9A9A9A] underline underline-offset-2 hover:text-[#F4F4F4]">
            Continue shopping
          </Link>
        </p>
      </div>
    </main>
  );
}
