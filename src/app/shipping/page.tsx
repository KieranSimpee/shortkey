import Link from "next/link";

export const metadata = { title: "Shipping | Shortkey" };

const REGIONS = [
  { region: "United States", eta: "5–8 business days", carrier: "USPS / FedEx", note: "Free over $75" },
  { region: "Canada", eta: "7–10 business days", carrier: "Canada Post / DHL", note: "Free over $100 CAD" },
  { region: "Hong Kong", eta: "3–5 business days", carrier: "SF Express / DHL", note: "Free over $500 HKD" },
  { region: "Singapore / Malaysia", eta: "5–7 business days", carrier: "DHL / Ninja Van", note: "Free over $60 SGD" },
  { region: "Taiwan / South Korea / Japan", eta: "5–8 business days", carrier: "DHL / EMS", note: "Flat rate $12" },
  { region: "Other regions", eta: "10–15 business days", carrier: "DHL International", note: "Calculated at checkout" },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">Orders</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">Shipping</h1>
        <p className="mb-10 text-sm text-[#9A9A9A]">We ship Asian beauty direct to you — across North America, Asia Pacific, and select international regions.</p>

        {/* Shipping Table */}
        <div className="mb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Delivery Times & Carriers</p>
          <div className="space-y-2">
            {REGIONS.map((r) => (
              <div key={r.region} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#F4F4F4]">{r.region}</p>
                    <p className="mt-0.5 text-xs text-[#9A9A9A]">{r.carrier} · {r.eta}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#1A1A1A] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#9A9A9A]">{r.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8 space-y-3">
          {[
            { t: "Order Processing", d: "Orders are processed within 1–2 business days of payment confirmation. You will receive a dispatch confirmation email with your tracking link." },
            { t: "Duties & Tariffs", d: "US imports from China-origin brands may be subject to Section 301 tariffs following the May 2025 de minimis suspension. Applicable duties are calculated at checkout. K-Beauty and J-Beauty shipments to the US benefit from KORUS and US-Japan tariff agreements." },
            { t: "Shipping Address", d: "Ensure your shipping address is correct at checkout. We cannot redirect parcels once dispatched." },
          ].map((n) => (
            <div key={n.t} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">{n.t}</p>
              <p className="text-sm leading-relaxed text-[#9A9A9A]">{n.d}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/returns" className="rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
            Returns Policy
          </Link>
          <Link href="/contact" className="rounded-full border border-[#2B2B2B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
