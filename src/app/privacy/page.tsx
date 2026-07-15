import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Privacy Policy | Shortkey" };

export default function PrivacyPage() {
  return (
    <MockPageShell
      shortcut="CTRL + V"
      badge="LEGAL"
      title="Privacy Policy"
      description="How Shortkey collects, uses, and protects your personal data — including try-on and commerce data."
      ctas={[
        { label: "Terms of service →", href: "/terms" },
        { label: "Cookie policy →", href: "/cookies", variant: "outline" },
      ]}
    >
      <MockNote>Privacy policy mock — replace with counsel-approved GDPR/PDPA compliant copy before launch.</MockNote>

      <div className="mt-6 space-y-3">
        {[
          { title: "What data we collect", body: "Account data (name, email, password hash) · Order and transaction data · Try-on session data (processed locally, not stored) · Device and browser session data · Creator content and engagement data." },
          { title: "Try-on and camera data", body: "Virtual try-on is processed entirely on your device. Camera frames are never uploaded to Shortkey servers. Uploaded photos for try-on are processed in memory and discarded after your session ends." },
          { title: "How we use your data", body: "To fulfil orders and process payments · To personalise your Beauty OS recommendations · To enable creator shops and commissions · To improve platform features and try-on accuracy · To send transactional emails (order confirmations, shipping updates)." },
          { title: "Data sharing", body: "We share data with Stripe and Shopify to process payments, carriers to fulfil shipments, and analytics providers to improve the platform. We do not sell personal data." },
          { title: "Your rights", body: "You have the right to access, correct, or delete your personal data. Contact privacy@shortkey.beauty. We will respond within 30 days." },
          { title: "Data retention", body: "Account data is retained while your account is active. Order data is retained for 7 years for legal compliance. Try-on data is not retained beyond your session." },
          { title: "Security", body: "We use industry-standard encryption for data in transit and at rest. Payment data is handled entirely by Stripe — Shortkey does not store card details." },
          { title: "Contact", body: "Privacy enquiries: privacy@shortkey.beauty. Data Protection Officer contact available on request." },
        ].map((s) => (
          <MockBlock key={s.title} title={s.title} body={s.body} />
        ))}
      </div>
    </MockPageShell>
  );
}
