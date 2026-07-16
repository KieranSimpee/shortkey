import Link from "next/link";

export const metadata = { title: "Help Center | Shortkey" };

const FAQS: Record<string, { q: string; a: string }[]> = {
  "Try-On": [
    { q: "How does AI try-on work?", a: "Shortkey uses TINT landmark technology to map your facial geometry in real time. Select any shade and see it applied to your live face or photo. No AR filter, no skin-smoothing — the real shade on your real face." },
    { q: "Is my camera data stored?", a: "No. Camera frames are processed locally and are never stored or sold. See our Privacy Policy for full details." },
    { q: "Which products can I try on?", a: "All products in the Beauty OS catalog with the try-on icon are compatible. Lip, cheek, and eye products are supported." },
  ],
  "Orders & Checkout": [
    { q: "How do I track my order?", a: "Order confirmation emails include your tracking link. For Shopify orders, track via the carrier link. For direct Stripe orders, check your email receipt." },
    { q: "What payment methods are accepted?", a: "Visa, Mastercard, Amex, and Apple Pay via Stripe. Shopify orders accept all Shopify Payments methods." },
    { q: "Can I cancel or change my order?", a: "Email help@shortkey.beauty within 1 hour of placing your order. After dispatch we cannot amend — please use our returns process." },
  ],
  "Creator Shops": [
    { q: "How do influencer shops work?", a: "Each creator has their own shop tab. Products are curated by the creator and link directly to checkout. Commission goes to the creator automatically." },
    { q: "How do I become a creator?", a: "Apply via creators@shortkey.beauty with your handle, content category, and engagement stats. We are actively onboarding K / J / C beauty creators." },
  ],
  "Brand Onboarding": [
    { q: "What is a founding brand?", a: "Founding brands are the first cohort of Asian beauty brands on Shortkey. They receive premium placement, creator matchmaking, and AI try-on activation at a flat 5% fee." },
    { q: "How do I register as a brand?", a: "Visit /brands to see the founding brand package and start your registration. Our team will respond within 2 business days." },
  ],
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">Support</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">Help Center</h1>
        <p className="mb-10 text-sm text-[#9A9A9A]">Answers to the most common questions about Shortkey.</p>

        <div className="space-y-8">
          {Object.entries(FAQS).map(([category, items]) => (
            <section key={category}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">{category}</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.q} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
                    <p className="mb-2 text-sm font-semibold text-[#F4F4F4]">{item.q}</p>
                    <p className="text-sm leading-relaxed text-[#9A9A9A]">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Still need help?</p>
          <p className="mb-4 text-sm text-[#9A9A9A]">Our support team is here. Response within 24 hours.</p>
          <Link href="/contact" className="inline-block rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
