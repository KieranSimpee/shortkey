export const metadata = { title: "Contact | Shortkey" };

const CHANNELS = [
  { label: "Fans & Shoppers", email: "help@shortkey.beauty", desc: "Order questions, try-on support, account help. Response within 24 hours." },
  { label: "Creators", email: "creators@shortkey.beauty", desc: "Creator applications, live setup, commission questions. Response within 48 hours." },
  { label: "Brands", email: "brands@shortkey.beauty", desc: "Founding brand enquiries, partnership discussions, onboarding. Response within 2 business days." },
  { label: "Press", email: "press@shortkey.beauty", desc: "Media enquiries, brand assets, coverage requests. Mark urgent subject URGENT PRESS." },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">CTRL + M</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">Get in Touch</h1>
        <p className="mb-10 text-sm text-[#9A9A9A]">Fans, creators, and brands — we have a channel for every conversation.</p>

        <div className="space-y-3">
          {CHANNELS.map((c) => (
            <div key={c.label} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-5">
              <p className="mb-0.5 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">{c.label}</p>
              <a href={`mailto:${c.email}`} className="font-mono text-[11px] text-[#9A9A9A] hover:text-[#F4F4F4] transition">{c.email}</a>
              <p className="mt-2 text-sm text-[#9A9A9A]">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Based in Hong Kong</p>
          <p className="text-sm text-[#9A9A9A]">Shortkey is operated by Simplex-ity Ltd, Hong Kong. All response times are in HKT (UTC+8).</p>
        </div>
      </div>
    </main>
  );
}
