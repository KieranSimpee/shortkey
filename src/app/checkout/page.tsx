import { CheckoutClient } from "@/components/commerce/CheckoutClient";
import { MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = {
  title: "Checkout | Shortkey",
  description: "Stripe and Shopify ready checkout.",
};

export default function CheckoutPage() {
  return (
    <MockPageShell
      shortcut="CTRL + $"
      badge="CHECKOUT"
      title="Secure checkout"
      description="Cart checkout routes through /api/checkout to Stripe or Shopify once keys are set."
      ctas={[{ label: "Continue shopping →", href: "/shop", variant: "outline" }]}
    >
      <MockNote>
        Dual-gateway ready: choose Stripe (direct Checkout) or Shopify (Storefront cart URL). Mock
        mode activates automatically until env vars are present.
      </MockNote>
      <div className="mt-6">
        <CheckoutClient />
      </div>
    </MockPageShell>
  );
}
