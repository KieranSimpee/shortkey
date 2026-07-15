import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Contact | Shortkey" };

export default function ContactPage() {
  const channels = [
    { label: "Fans & Shoppers", email: "help@shortkey.beauty", desc: "Order questions, try-on support, account help. Response within 24 hours." },
    { label: "Creators", email: "creators@shortkey.beauty", desc: "Creator applications, live setup, commission questions. Response within 48 hours." },
    { label: "Brands", email: "brands@shortkey.beauty", desc: "Founding brand enquiries, partnership discussions, onboarding. Response within 2 business days." },
    { label: "Press", email: "press@shortkey.beauty", desc: "Media enquiries, brand assets, coverage requests. Mark urgent subject URGENT PRESS." },
  ];

  return (
    <MockPageShell
      shortcut="CTRL + M"
      badge="CONTACT"
      title="Get in touch"
      description="Fans, creators, and brands — we have a channel for every conversation. Choose yours below."
      ctas={[
        { label: "For brands →", href: "/brands" },
        { label: "Help center →", href: "/help", variant: "outline" },
      ]}
    >
      <MockNote>Contact form will be wired to backend — showing channel guide for review.</MockNote>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {channels.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/50 bg-white/45 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">{c.label}</p>
            <a href={`mailto:${c.email}`} className="mt-1 block text-sm font-semibold text-ink hover:text-brand transition-colors">{c.email}</a>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <MockBlock title="Send a message (form mock — not wired yet)">
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Your name", "Email address", "Topic", "Message"].map((field) => (
              <div key={field} className={`rounded-lg border border-white/60 bg-white/50 px-4 py-3 ${field === "Message" ? "sm:col-span-2" : ""}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{field}</p>
                <div className={`mt-1 rounded bg-white/40 ${field === "Message" ? "h-16" : "h-6"}`} />
              </div>
            ))}
          </div>
          <div className="mt-3 inline-block rounded-full bg-brand px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white opacity-60 cursor-not-allowed">
            Send message (mock)
          </div>
        </MockBlock>
      </div>

      <div className="mt-4">
        <MockBlock
          title="Based in"
          body="Hong Kong · Remote-first team across HKT timezone. For urgent brand matters, include your timezone in your first message."
        />
      </div>
    </MockPageShell>
  );
}
