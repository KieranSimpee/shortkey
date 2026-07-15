import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Help Center | Shortkey" };

export default function HelpPage() {
  const faqs = {
    "Try-On": [
      { q: "How does AI try-on work?", a: "Shortkey uses TINT landmark technology to map your facial geometry in real time. Select any shade — lip, cheek, or eye — and see it applied to your live face or uploaded photo. No AR filter. No skin-smoothing. Just the real shade on your real face." },
      { q: "Is my camera data stored?", a: "No. Camera frames are processed locally for try-on and are never stored or sold. See our Privacy Policy for full details." },
      { q: "Which shades can I try on?", a: "All products in the Beauty OS catalog are try-on ready. Look for the try-on icon on any product card." },
    ],
    "Orders & Checkout": [
      { q: "How do I check my order?", a: "Order confirmation emails include your tracking link. For Shopify orders, track via the carrier link. For direct Stripe orders, check your email receipt." },
      { q: "What payment methods are accepted?", a: "Visa, Mastercard, Amex, and Apple Pay via Stripe. Shopify orders accept all Shopify Payments methods." },
      { q: "Can I cancel or change my order?", a: "Contact help@shortkey.beauty within 1 hour of placing your order. After dispatch we cannot amend orders — please use our returns process." },
    ],
    "Creator Shops": [
      { q: "How do influencer shops work?", a: "Each creator on Shortkey has their own shop tab. Products are curated by the creator and link directly to checkout. Commission goes to the creator automatically." },
      { q: "How do I become a creator on Shortkey?", a: "Apply via creators@shortkey.beauty with your handle, content category, and engagement stats. We are actively onboarding K / J / C beauty creators." },
    ],
    "Brand Onboarding": [
      { q: "What is a founding brand?", a: "Founding brands are the first cohort of Asian beauty brands on the Shortkey platform. They receive premium placement, creator matchmaking, and AI try-on activation at a flat 5% fee — no hidden commissions." },
      { q: "How do I register as a brand?", a: "Visit /brands to see the founding brand package and start your registration. Our team will reach out within 2 business days." },
    ],
  };

  return (
    <MockPageShell
      shortcut="CTRL + ?"
      badge="SUPPORT"
      title="Help Center"
      description="Answers for try-on, orders, creator shops, and brand onboarding. If you cannot find what you need, we are one message away."
      ctas={[
        { label: "Contact support →", href: "/contact" },
        { label: "Returns →", href: "/returns", variant: "outline" },
      ]}
    >
      <MockNote>Help content mock — expand with real FAQs before launch.</MockNote>

      <div className="mt-6 space-y-6">
        {Object.entries(faqs).map(([cat, items]) => (
          <MockBlock key={cat} title={cat}>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item.q} className="rounded-lg border border-white/50 bg-white/40 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{item.q}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </MockBlock>
        ))}
      </div>
    </MockPageShell>
  );
}
