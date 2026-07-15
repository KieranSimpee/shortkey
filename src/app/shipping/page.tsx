import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Shipping | Shortkey" };

export default function ShippingPage() {
  const regions = [
    { region: "United States", eta: "5–8 business days", carrier: "USPS / FedEx", note: "Free over $75" },
    { region: "Canada", eta: "7–10 business days", carrier: "Canada Post / DHL", note: "Free over $100 CAD" },
    { region: "Hong Kong", eta: "3–5 business days", carrier: "SF Express / DHL", note: "Free over $500 HKD" },
    { region: "Singapore / Malaysia", eta: "5–7 business days", carrier: "DHL / Ninja Van", note: "Free over $60 SGD" },
    { region: "Taiwan / South Korea / Japan", eta: "5–8 business days", carrier: "DHL / EMS", note: "Flat rate $12" },
    { region: "Other regions", eta: "10–15 business days", carrier: "DHL International", note: "Calculated at checkout" },
  ];

  return (
    <MockPageShell
      shortcut="CTRL + S"
      badge="SHIPPING"
      title="Shipping"
      description="We ship Asian beauty direct to you — across North America, Asia Pacific, and select international regions."
      ctas={[
        { label: "Returns policy →", href: "/returns" },
        { label: "Help center →", href: "/help", variant: "outline" },
      ]}
    >
      <MockNote>Shipping rates are mock — replace with live carrier rates before launch.</MockNote>

      <div className="mt-6">
        <MockBlock title="Delivery regions and estimates">
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="pb-2 pr-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Region</th>
                  <th className="pb-2 pr-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Est. delivery</th>
                  <th className="pb-2 pr-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Carrier</th>
                  <th className="pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Free shipping</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((r, i) => (
                  <tr key={r.region} className={`border-b border-white/20 ${i % 2 === 0 ? "bg-white/10" : ""}`}>
                    <td className="py-2.5 pr-4 font-medium text-ink">{r.region}</td>
                    <td className="py-2.5 pr-4 text-ink-muted">{r.eta}</td>
                    <td className="py-2.5 pr-4 text-ink-muted">{r.carrier}</td>
                    <td className="py-2.5 text-brand font-medium">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MockBlock>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MockBlock title="Order processing" body="Orders are processed within 1–2 business days. You will receive a dispatch confirmation with tracking link." />
        <MockBlock title="Customs and duties" body="Import duties may apply for international shipments. Shortkey is not responsible for customs fees — check your local regulations." />
        <MockBlock title="Track your order" body="Tracking links are emailed at dispatch. For order queries contact help@shortkey.beauty with your order reference." />
      </div>
    </MockPageShell>
  );
}
