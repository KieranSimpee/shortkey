import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Returns | Shortkey" };

export default function ReturnsPage() {
  const steps = [
    { n: "01", title: "Contact us", body: "Email help@shortkey.beauty within 14 days of delivery. Include your order number and reason for return." },
    { n: "02", title: "Receive return label", body: "We will send a prepaid return label within 2 business days for eligible items." },
    { n: "03", title: "Pack and ship", body: "Return items in original sealed packaging. Drop at your nearest carrier location." },
    { n: "04", title: "Refund issued", body: "Refund processed within 5 business days of receiving the returned item to your original payment method." },
  ];

  return (
    <MockPageShell
      shortcut="CTRL + R"
      badge="RETURNS"
      title="Returns"
      description="Simple 14-day returns for unopened Asian beauty items. We make it easy."
      ctas={[
        { label: "Contact support →", href: "/contact" },
        { label: "Shipping policy →", href: "/shipping", variant: "outline" },
      ]}
    >
      <MockNote>Returns policy mock — confirm with legal before publishing.</MockNote>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="rounded-xl border border-white/50 bg-white/45 px-4 py-4">
            <p className="text-2xl font-semibold text-brand/30">{s.n}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{s.title}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <MockBlock
          title="Eligible for return"
          body="Unopened, sealed products in original packaging · Incorrect or damaged items sent to you · Items within 14 days of delivery date"
        />
        <MockBlock
          title="Not eligible for return"
          body="Opened or used beauty products · Hygiene-sealed lip, eye, and face products once opened · Items outside the 14-day window · Sale and clearance items marked final sale"
        />
        <MockBlock
          title="Refund timeline"
          body="Refunds are issued to your original payment method within 5 business days of receiving your return. Card refunds may take a further 3–5 days to appear depending on your bank."
        />
        <MockBlock
          title="Exchanges"
          body="We do not offer direct exchanges. Return the original item for a refund and place a new order for the replacement shade or product."
        />
      </div>
    </MockPageShell>
  );
}
