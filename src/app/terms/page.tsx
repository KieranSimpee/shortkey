import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Terms of Service | Shortkey" };

export default function TermsPage() {
  return (
    <MockPageShell
      shortcut="CTRL + T"
      badge="LEGAL"
      title="Terms of Service"
      description="These terms govern your use of the Shortkey platform, including try-on, shopping, and creator features."
      ctas={[
        { label: "Privacy policy →", href: "/privacy" },
        { label: "Cookie policy →", href: "/cookies", variant: "outline" },
      ]}
    >
      <MockNote>Mock terms — must be replaced with counsel-approved copy before launch. Internal review only.</MockNote>

      <div className="mt-6 space-y-3">
        {[
          { title: "1. Acceptance of terms", body: "By accessing or using Shortkey, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform." },
          { title: "2. Platform use", body: "Shortkey is for personal, non-commercial use unless you are a registered brand or creator partner. You must be 16 or older to create an account." },
          { title: "3. Try-on and camera data", body: "Virtual try-on uses your device camera or uploaded images. Camera frames are processed locally and are not stored on Shortkey servers. See our Privacy Policy." },
          { title: "4. Creator content", body: "Creators retain ownership of their content but grant Shortkey a licence to display it on the platform. Creators are responsible for ensuring their content complies with applicable laws." },
          { title: "5. Brand partnerships", body: "Founding brand agreements are governed by separate Brand Partnership Agreements. The platform fee is 5% of gross sales processed through Shortkey." },
          { title: "6. Orders and commerce", body: "Commerce is processed via Stripe or Shopify. Shortkey acts as agent for brand partners. Refunds and returns are governed by our Returns Policy." },
          { title: "7. Intellectual property", body: "Shortkey and its licensors own all platform IP including the Beauty OS interface, TINT try-on integration, and Shortkey brand assets. Do not reproduce without permission." },
          { title: "8. Limitation of liability", body: "To the maximum extent permitted by law, Shortkey is not liable for indirect, incidental, or consequential damages arising from platform use." },
          { title: "9. Changes to terms", body: "We may update these terms at any time. Continued use after changes constitutes acceptance. We will notify registered users of material changes." },
          { title: "10. Contact", body: "Questions about these terms: legal@shortkey.beauty" },
        ].map((s) => (
          <MockBlock key={s.title} title={s.title} body={s.body} />
        ))}
      </div>
    </MockPageShell>
  );
}
