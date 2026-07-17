import Link from "next/link";

export const metadata = { title: "Careers | Shortkey" };

const ROLES = [
  { title: "Product Designer", type: "Full-time · Remote", desc: "Shape the Beauty OS interface, try-on studio, and influencer live commerce UX. Deep appreciation for Asian beauty culture required." },
  { title: "Frontend Engineer", type: "Full-time · Remote", desc: "Build the Next.js platform with Tailwind and TypeScript. Experience with commerce and real-time UI a strong plus." },
  { title: "Creator Partnerships Lead", type: "Full-time · HK / Remote", desc: "Recruit and onboard K / J / C beauty influencers. Own the creator commerce flywheel from discovery to first live." },
  { title: "Brand Success Manager", type: "Full-time · HK / Remote", desc: "Manage founding brand relationships from onboarding to first sales. Be the Shortkey expert every partner brand leans on." },
];

const PERKS = [
  { t: "Remote-first", d: "Work from anywhere. We run on async and trust." },
  { t: "Beauty allowance", d: "Monthly budget for K / J / C beauty products. Research is part of the role." },
  { t: "Equity", d: "Early team members share in the upside. We are building something real." },
  { t: "Creator access", d: "Front-row seat to influencer lives, brand launches, and try-on sessions." },
];

export default function CareersPage() {
  return (
    <main className="page-shell px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">Company</p>
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.1em] text-ink">Careers</h1>
        <p className="mb-10 text-sm text-ink-muted">Build the platform that makes Asian beauty trusted, guided, and discoverable in North America.</p>

        {/* Open Roles */}
        <div className="mb-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-ink-subtle">Open Roles</p>
          <div className="space-y-3">
            {ROLES.map((r) => (
              <div key={r.title} className="rounded-xl border border-white/50 bg-white/45 px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-ink">{r.title}</p>
                    <p className="mt-0.5 font-mono text-[9px] text-ink-subtle">{r.type}</p>
                    <p className="mt-2 text-sm text-ink-muted">{r.desc}</p>
                  </div>
                  <a href="mailto:careers@shortkey.beauty" className="shrink-0 rounded-full border border-white/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted hover:border-brand/40 hover:text-ink transition">
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perks */}
        <div className="mb-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-ink-subtle">Life at Shortkey</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PERKS.map((p) => (
              <div key={p.t} className="rounded-xl border border-white/50 bg-white/45 px-5 py-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-ink">{p.t}</p>
                <p className="text-sm text-ink-muted">{p.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-white/50 bg-white/45 px-6 py-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-ink-subtle">No role listed?</p>
          <p className="mb-4 text-sm text-ink-muted">We are always looking for people who understand Asian beauty culture and want to build something meaningful. Send an open application.</p>
          <a href="mailto:careers@shortkey.beauty" className="inline-block rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-brand-dark transition">
            careers@shortkey.beauty
          </a>
        </div>
      </div>
    </main>
  );
}
