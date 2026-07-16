import Image from "next/image";
import Link from "next/link";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "C-Beauty | Shortkey",
  description: "Chinese beauty discovery on Shortkey — elevated, curated, creator-led.",
};

const FEATURED_BRANDS = [
  { name: "SHEGLAM", tag: "SHEIN Group · Makeup", note: "Amazon + TikTok dominant" },
  { name: "Florasis", tag: "Flower-Engraved Luxury", note: "$850M global · Ulta expansion" },
  { name: "Flower Knows", tag: "Fantasy Packaging", note: "Ulta Beauty Dec 2025" },
  { name: "Perfect Diary", tag: "Yatsen Group · NYSE: YSG", note: "Amazon + TikTok dual-channel" },
  { name: "Judydoll", tag: "Joy Group · Accessible", note: "Amazon + TikTok creator-led" },
  { name: "ColorKey", tag: "Lip & Face Specialist", note: "Amazon · US growing" },
];

const HERO_INSIGHTS = [
  { label: "C-Beauty US Imports (HS 3304)", value: "$605M", tag: "VERIFIED" },
  { label: "De Minimis Suspended", value: "May 2025", tag: "VERIFIED" },
  { label: "Brands in Retail Pivot", value: "12+", tag: "PROJECTED" },
];

export default function CBeautyPage() {
  const allProducts = getCatalogProducts();

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">
          CTRL + C
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">C-Beauty</h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">
          Chinese beauty. Elevated craft, bold colour, creator-led discovery.
        </p>
      </div>

      {/* Market Intelligence Tiles */}
      <div className="mb-10 grid grid-cols-3 gap-3">
        {HERO_INSIGHTS.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-4 py-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6E6E6E]">{tile.label}</p>
            <p className="mt-1 text-xl font-bold text-[#F4F4F4]">{tile.value}</p>
            <span className={`mt-2 inline-block rounded px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${tile.tag === "VERIFIED" ? "bg-green-900/40 text-green-400" : "bg-amber-900/40 text-amber-400"}`}>
              {tile.tag}
            </span>
          </div>
        ))}
      </div>

      {/* C-Beauty Context */}
      <div className="mb-10 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">The C-Beauty Shift — 2025</p>
        <p className="text-sm leading-relaxed text-[#9A9A9A]">
          The May 2025 suspension of the Section 321 de minimis exemption changed C-Beauty&apos;s US playbook overnight. Brands that shipped duty-free parcels directly to consumers now face 25-54% Section 301 tariffs. The fastest-moving brands — Florasis, Flower Knows, Judydoll — are pivoting to retail distribution via Ulta and Sephora. Shortkey is purpose-built to help C-Beauty brands navigate this transition with curated discovery, creator-led education, and a 5% platform fee versus Amazon&apos;s 30%.
        </p>
      </div>

      {/* Featured C-Beauty Brands */}
      <div className="mb-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">
          Featured C-Beauty Brands on Shortkey
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_BRANDS.map((brand) => (
            <div key={brand.name} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-5 py-4">
              <p className="text-sm font-bold text-[#F4F4F4]">{brand.name}</p>
              <p className="mt-0.5 text-[10px] text-[#6E6E6E]">{brand.tag}</p>
              <p className="mt-2 text-xs text-[#9A9A9A]">{brand.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      {allProducts.length > 0 && (
        <div className="mb-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">
            {allProducts.length} Products Available
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allProducts.slice(0, 8).map((p) => (
              <Link key={p.sku} href={p.href} className="group rounded-xl border border-[#2B2B2B] bg-[#111] overflow-hidden hover:border-[#6E6E6E] transition">
                <div className="relative aspect-square bg-[#1A1A1A]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="px-3 py-3">
                  <p className="text-xs font-semibold text-[#F4F4F4] line-clamp-2">{p.name}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-[#6E6E6E]">{p.sku}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/shop" className="inline-block rounded-full border border-[#2B2B2B] px-6 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#9A9A9A] hover:border-[#F4F4F4] hover:text-[#F4F4F4] transition">
              Shop All C-Beauty
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-6 text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Are You a C-Beauty Brand?</p>
        <p className="mb-4 text-sm text-[#9A9A9A]">
          5% platform fee. Creator-led discovery. US retail expansion support.
        </p>
        <Link href="/brands" className="inline-block rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
          Partner with Shortkey
        </Link>
      </div>
    </main>
  );
}
