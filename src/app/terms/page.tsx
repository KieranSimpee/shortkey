import Link from "next/link";
export const metadata = { title: "Terms of Service | Shortkey" };
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">Legal</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-[#F4F4F4]">Terms of Service</h1>
        <p className="mb-10 text-sm text-[#9A9A9A]">Last updated: July 2026</p>
        <div className="space-y-6 text-sm leading-relaxed text-[#9A9A9A]">
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Acceptance</h2><p>By accessing Shortkey, you agree to these Terms. If you do not agree, please do not use the platform.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Platform Use</h2><p>Shortkey grants a limited, non-exclusive licence to use the platform for personal shopping. You may not scrape, reproduce, or resell any content without written permission.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Orders and Payments</h2><p>All orders are subject to product availability and payment authorisation. Payment is processed via Stripe. We reserve the right to cancel orders that cannot be fulfilled.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Returns</h2><p>Our return policy is on the <Link href="/returns" className="text-[#F4F4F4] underline underline-offset-2">Returns page</Link>. Contact us within 14 days of delivery to initiate a return.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Brand and Creator Terms</h2><p>Brands and creators are subject to a separate Partnership Agreement. The 5% platform fee applies to all transactions processed through Shortkey.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Intellectual Property</h2><p>All Shortkey content and technology is the property of Simplex-ity Ltd. Brand assets remain the property of their respective owners.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Contact</h2><p>Legal questions: <Link href="/contact" className="text-[#F4F4F4] underline underline-offset-2">Contact us</Link>.</p></section>
        </div>
      </div>
    </main>
  );
}
