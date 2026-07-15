import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = { title: "Careers | Shortkey" };

export default function CareersPage() {
  const roles = [
    { title: "Product Designer", type: "Full-time · Remote", desc: "Shape the Beauty OS interface, try-on studio, and influencer live commerce UX. Deep appreciation for Asian beauty culture required." },
    { title: "Frontend Engineer", type: "Full-time · Remote", desc: "Build the Next.js platform with Tailwind and TypeScript. Experience with commerce and real-time UI a strong plus." },
    { title: "Creator Partnerships Lead", type: "Full-time · HK / Remote", desc: "Recruit and onboard K / J / C beauty influencers. Own the creator commerce flywheel from discovery to first live." },
    { title: "Brand Success Manager", type: "Full-time · HK / Remote", desc: "Manage founding brand relationships from onboarding to first sales. Be the ShortKey expert every partner brand leans on." },
  ];

  const perks = [
    { title: "Remote-first", body: "Work from anywhere in the world. We run on async and trust." },
    { title: "Beauty allowance", body: "Monthly budget for K / J / C beauty products. Research is part of the role." },
    { title: "Equity", body: "Early team members share in the upside. We are building something real." },
    { title: "Creator access", body: "Front-row seat to influencer lives, brand launches, and try-on sessions." },
  ];

  return (
    <MockPageShell
      shortcut="CTRL + C"
      badge="CAREERS"
      title="Join Shortkey"
      description="We are building the AI Asian beauty operating system. Come build it with us."
      ctas={[
        { label: "Apply now →", href: "/contact" },
        { label: "About us →", href: "/about", variant: "outline" },
      ]}
    >
      <MockNote>Roles are mock — wire to application form or Notion jobs board when ready.</MockNote>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {roles.map((r) => (
          <div key={r.title} className="rounded-xl border border-white/50 bg-white/45 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">{r.type}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{r.title}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">{r.desc}</p>
            <a href="mailto:careers@shortkey.beauty" className="mt-3 inline-block text-[11px] font-semibold text-brand underline-offset-2 hover:underline">
              Apply → careers@shortkey.beauty
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <MockBlock title="Why Shortkey">
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title} className="rounded-xl border border-white/50 bg-white/40 px-3 py-3">
                <p className="text-[11px] font-semibold text-brand">{p.title}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </MockBlock>
      </div>
    </MockPageShell>
  );
}
