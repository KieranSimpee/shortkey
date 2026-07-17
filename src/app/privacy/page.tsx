import Link from "next/link";
export const metadata = { title: "Privacy Policy | Shortkey" };
export default function PrivacyPage() {
  return (
    <main className="page-shell px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">Legal</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-ink">Privacy Policy</h1>
        <p className="mb-10 text-sm text-ink-muted">Last updated: July 2026</p>
        <div className="space-y-6 text-sm leading-relaxed text-ink-muted">
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink">Who We Are</h2><p>Shortkey is operated by Simplex-ity Ltd. References to &quot;we&quot; or &quot;Shortkey&quot; refer to Simplex-ity Ltd.</p></section>
          <section><h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-ink">Data We Collect</h2>
            <div className="space-y-3">
              {[{t:"Account Data",d:"Name, email, and password when you create an account."},{t:"Order Data",d:"Shipping address and payment method (tokenised by Stripe — we never store card numbers)."},{t:"Usage Data",d:"Pages visited, products viewed, try-on interactions. Collected via analytics tools."},{t:"Try-On Data",d:"Image data is processed locally on your device. We do not store your face images on our servers."}].map(item=>(
                <div key={item.t} className="rounded-xl border border-white/50 bg-white/45 px-5 py-4"><p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-ink">{item.t}</p><p>{item.d}</p></div>
              ))}
            </div>
          </section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink">How We Use Your Data</h2><p>We use your data to process orders, personalise your experience, and improve our platform. We do not sell your personal data to advertisers.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink">Your Rights</h2><p>You may request access to, correction of, or deletion of your personal data. <Link href="/contact" className="text-ink underline underline-offset-2">Contact us</Link> — we will respond within 30 days.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink">Cookies</h2><p>See our <Link href="/cookies" className="text-ink underline underline-offset-2">Cookies Policy</Link> for full details.</p></section>
        </div>
      </div>
    </main>
  );
}
