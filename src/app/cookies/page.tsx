import Link from "next/link";
export const metadata = { title: "Cookies Policy | Shortkey" };
export default function CookiesPage() {
  return (
    <main className="page-shell px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">Legal</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-ink">Cookies Policy</h1>
        <p className="mb-10 text-sm text-ink-muted">Last updated: July 2026</p>
        <div className="space-y-6 text-sm leading-relaxed text-ink-muted">
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink">What Are Cookies</h2><p>Cookies are small text files stored on your device when you visit Shortkey. They help us remember your preferences, keep you signed in, and understand how people use our platform.</p></section>
          <section><h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-ink">Cookies We Use</h2>
            <div className="space-y-3">
              {[{n:"Essential",d:"Required for the platform to function. Cannot be disabled."},{n:"Analytics",d:"Help us understand which pages are popular. Data is aggregated and anonymous."},{n:"Preference",d:"Remember your settings — skin tone selection, language, and display preferences."},{n:"Commerce",d:"Set by Shopify and Stripe to support secure checkout and fraud prevention."}].map(c=>(
                <div key={c.n} className="rounded-xl border border-white/50 bg-white/45 px-5 py-4"><p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-ink">{c.n}</p><p>{c.d}</p></div>
              ))}
            </div>
          </section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink">Managing Cookies</h2><p>You can control cookies through your browser settings. Disabling essential cookies will affect checkout functionality.</p></section>
          <section><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink">Contact</h2><p>Questions? <Link href="/contact" className="text-ink underline underline-offset-2">Contact us</Link> or review our <Link href="/privacy" className="text-ink underline underline-offset-2">Privacy Policy</Link>.</p></section>
        </div>
      </div>
    </main>
  );
}
