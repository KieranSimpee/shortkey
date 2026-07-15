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

  return (
    <MockPageShell
      shortcut="CTRL + $"
      badge="PAID"
      title="Payment received"
      description="Thank you — your Shortkey order checkout completed."
      ctas={[
        { label: "Back to shop →", href: "/shop" },
        { label: "Try on →", href: "/try-on", variant: "outline" },
      ]}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <MockBlock
          title="Session"
          body={
            params.session_id
              ? `Stripe session: ${params.session_id}`
              : params.mock
                ? `Mock checkout · ${params.items ?? "0"} line(s)`
                : "No session id — open from a real Stripe redirect when live."
          }
        />
        <MockBlock
          title="Next"
          body="Wire webhooks at /api/webhooks/stripe and /api/webhooks/shopify to fulfill orders and sync inventory."
        />
      </div>
    </MockPageShell>
  );
}
