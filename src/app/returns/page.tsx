import Link from "next/link";

export const metadata = { title: "Returns | Shortkey" };

const STEPS = [
  { n: "01", t: "Contact us", d: "Email help@shortkey.beauty within 14 days of delivery. Include your order number and reason for return." },
  { n: "02", t: "Receive return label", d: "We will send a prepaid return label within 2 business days for eligible items." },
  { n: "03", t: "Pack and ship", d: "Return items in original sealed packaging. Drop at your nearest carrier location." },
  { n: "04", t: "Refund issued", d: "Refund processed within 5 business days of receiving the returned item, to your original payment method." },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">Orders</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">Returns</h1>
        <p className="mb-10 text-sm text-[#9A9A9A]">Simple 14-day returns for unopened Asian beauty items.</p>

        {/* Process */}
        <div className="mb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Return Process</p>
          <div className="space-y-2">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4 rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
                <span className="font-mono text-xs font-bold text-[#6E6E6E] pt-0.5">{s.n}</span>
                <div>
                  <p className="text-sm font-bold text-[#F4F4F4]">{s.t}</p>
                  <p className="mt-1 text-sm text-[#9A9A9A]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div className="mb-8 space-y-2">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Eligibility</p>
          {[
            { t: "Eligible", d: "Unopened, sealed items in original packaging returned within 14 days of delivery." },
            { t: "Not Eligible", d: "Opened beauty products (hygiene policy), items marked final sale, or returns requested after 14 days." },
            { t: "Damaged or Incorrect Items", d: "If you receive a damaged or incorrect item, contact us immediately — we will resolve this at no cost to you." },
          ].map((e) => (
            <div key={e.t} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">{e.t}</p>
              <p className="text-sm text-[#9A9A9A]">{e.d}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="mailto:help@shortkey.beauty" className="rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
            Start a Return
          </a>
          <Link href="/shipping" className="rounded-full border border-[#2B2B2B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
            Shipping Info
          </Link>
        </div>
      </div>
    </main>
  );
}
