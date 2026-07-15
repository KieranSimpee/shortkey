import { MockBlock, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = {
  title: "Order confirmed | Shortkey",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; mock?: string; items?: string }>;
}) {
  const params = await searchParams;
  const isMock = !params.session_id;

  return (
    <MockPageShell
      shortcut="CTRL + $"
      badge="ORDER CONFIRMED"
      title="Thank you for your order"
      description="Your payment was received. Your Asian beauty order is on its way."
      ctas={[
        { label: "Continue shopping →", href: "/shop" },
        { label: "Try on more shades →", href: "/try-on", variant: "outline" },
      ]}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <MockBlock
          title={isMock ? "Mock order reference" : "Order reference"}
          body={
            params.session_id
              ? `Stripe session: ${params.session_id.slice(0, 24)}...`
              : `Mock checkout confirmed · ${params.items ?? "0"} item(s) · Reference: MOCK-${Date.now().toString(36).toUpperCase()}`
          }
        />
        <MockBlock
          title="What happens next"
          body="You will receive a confirmation email shortly. Orders are processed within 1–2 business days. Track your shipment via the link in your email."
        />
        <MockBlock
          title="Questions about your order"
          body="Contact help@shortkey.beauty with your order reference. We respond within 24 hours."
        />
        <MockBlock
          title="Returns"
          body="14-day returns on unopened sealed items. Visit /returns for the full policy and to start a return."
        />
      </div>

      {isMock && (
        <div className="mt-4 rounded-lg border border-dashed border-brand/30 bg-brand/5 px-4 py-3">
          <p className="text-[11px] font-medium text-brand">
            Mock mode — add STRIPE_SECRET_KEY + SHOPIFY keys to .env.local to go live. Webhooks ready at /api/webhooks/stripe and /api/webhooks/shopify.
          </p>
        </div>
      )}
    </MockPageShell>
  );
}
