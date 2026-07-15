import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Cookie Policy | Shortkey" };

export default function CookiesPage() {
  const types = [
    { type: "Essential", purpose: "Authentication, cart, session management", canOptOut: "No — required for platform function", example: "Auth token, cart ID" },
    { type: "Analytics", purpose: "Platform usage and feature improvement", canOptOut: "Yes — toggle in cookie banner", example: "Page views, try-on interactions" },
    { type: "Preference", purpose: "Region, locale, and Beauty OS settings", canOptOut: "Yes — toggle in cookie banner", example: "Region selection, saved filters" },
    { type: "Commerce", purpose: "Checkout flow and order attribution", canOptOut: "No — required for commerce", example: "Stripe session, order ref" },
  ];

  return (
    <MockPageShell
      shortcut="CTRL + K"
      badge="LEGAL"
      title="Cookie Policy"
      description="How Shortkey uses cookies and similar technologies on our platform."
      ctas={[
        { label: "Privacy policy →", href: "/privacy" },
        { label: "Terms of service →", href: "/terms", variant: "outline" },
      ]}
    >
      <MockNote>Cookie policy mock — wire to consent manager before launch.</MockNote>

      <div className="mt-6">
        <MockBlock title="Cookie types we use">
          <div className="mt-3 space-y-2">
            {types.map((t) => (
              <div key={t.type} className="rounded-lg border border-white/50 bg-white/40 px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-ink">{t.type}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${t.canOptOut.startsWith("No") ? "bg-ink/10 text-ink-muted" : "bg-brand/10 text-brand"}`}>
                    {t.canOptOut.startsWith("No") ? "Required" : "Optional"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ink-muted">{t.purpose}</p>
                <p className="mt-1 text-[10px] text-ink-subtle">Example: {t.example}</p>
              </div>
            ))}
          </div>
        </MockBlock>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MockBlock
          title="Managing cookies"
          body="You can manage cookie preferences via the cookie banner shown on first visit. Essential and commerce cookies cannot be disabled as they are required for the platform to function."
        />
        <MockBlock
          title="Third-party cookies"
          body="Stripe sets cookies for payment processing. Analytics providers may set first-party cookies via Shortkey. We do not allow third-party advertising cookies on the platform."
        />
      </div>
    </MockPageShell>
  );
}
