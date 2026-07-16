import Link from "next/link";
import { FoundingBrandCheckoutButton } from "@/components/commerce/FoundingBrandCheckoutButton";
import { siteContent } from "@/content/homepage";

export const metadata = {
  title: "For Brands | Shortkey",
  description: "Join Shortkey as a founding brand — 5% flat fee, creator-led discovery, AI try-on.",
};

export default function BrandsLandingPage() {
  const { brands } = siteContent;

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">{brands.tag}</p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">{brands.title}</h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">{brands.description}</p>
      </div>

      {/* Founding Package */}
      <div className="mb-10 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">{brands.slotsLabel}</p>
        <p className="mt-2 text-sm text-[#9A9A9A]">{brands.commissionNote}</p>
        <p className="mt-3 text-3xl font-bold text-[#F4F4F4]">{brands.foundingFee}</p>
        <div className="mt-4">
          <FoundingBrandCheckoutButton />
        </div>
      </div>

      {/* Aim Cards */}
      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        {brands.aim.cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
            <p className="mb-0.5 font-mono text-[9px] text-[#6E6E6E]">{card.shortcut}</p>
            <p className="text-sm font-bold text-[#F4F4F4]">{card.label}</p>
            <p className="mt-2 text-xs text-[#9A9A9A]">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        {brands.features.map((f) => (
          <div key={f.label} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
            <p className="mb-1 font-mono text-[9px] text-[#6E6E6E]">{f.shortcut}</p>
            <p className="text-sm text-[#F4F4F4]">{f.label}</p>
          </div>
        ))}
      </div>

      {/* Channel comparison */}
      <div className="mb-10 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#F4F4F4]">Why Shortkey vs Other Channels</p>
        <div className="space-y-2 text-sm">
          {[
            { ch: "Amazon", fee: "30%", sk: "5%", save: "25%" },
            { ch: "TikTok Shop", fee: "8%", sk: "5%", save: "3%" },
            { ch: "Sephora / Ulta", fee: "45–55%", sk: "5%", save: "40–50%" },
          ].map((row) => (
            <div key={row.ch} className="flex items-center gap-4 rounded-lg border border-[#1A1A1A] bg-[#0A0A0A] px-4 py-3">
              <span className="w-24 text-xs font-semibold text-[#9A9A9A]">{row.ch}</span>
              <span className="w-16 text-xs text-[#9A9A9A]">{row.fee}</span>
              <span className="w-16 text-xs font-bold text-[#F4F4F4]">Shortkey {row.sk}</span>
              <span className="ml-auto text-xs font-bold text-green-400">YOU SAVE {row.save}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link href="/contact" className="rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
          Contact Partnerships
        </Link>
        <Link href="/#brands" className="rounded-full border border-[#2B2B2B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
          View Homepage Section
        </Link>
      </div>
    </main>
  );
}
