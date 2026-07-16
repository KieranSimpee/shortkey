import Image from "next/image";
import Link from "next/link";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "J-Beauty | Shortkey",
  description: "Japanese beauty discovery on Shortkey — precision, ritual, elevated routine.",
};

const FEATURED_BRANDS = [
  { name: "Shiseido", tag: "Tokyo · Public · $7.8B global", note: "Sephora + Ulta + DTC" },
  { name: "SK-II", tag: "P&G · Prestige Skincare", note: "Pitera essence iconic" },
  { name: "Hada Labo (Rohto)", tag: "Hyaluronic Acid Specialist", note: "Amazon bestseller" },
  { name: "DHC", tag: "DTC Pioneer · Oil Cleanse", note: "US DTC dominant" },
  { name: "Tatcha", tag: "Modern Japanese Ritual", note: "Sephora · Premium US" },
  { name: "Canmake", tag: "Affordable J-Beauty", note: "Amazon · Gen Z favourite" },
];

const HERO_INSIGHTS = [
  { label: "J-Beauty US Imports 2025", value: "$188M", tag: "VERIFIED" },
  { label: "YoY Change", value: "-16.9%", tag: "VERIFIED", neg: true },
  { label: "ShortKey Opportunity", value: "High", tag: "PROJECTED" },
];

export default function JBeautyPage() {
  const allProducts = getCatalogProducts();

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-10 border-b border-[#2B2B2B] pb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]">
          CTRL + J
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">J-Beauty</h1>
        <p className="mt-2 text-sm text-[#9A9A9A]">
          Japanese beauty. Precision ritual, minimal finish, lasting trust.
        </p>
      </div>

      {/* Market Intelligence Tiles */}
      <div className="mb-10 grid grid-cols-3 gap-3">
        {HERO_INSIGHTS.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-[#2B2B2B] bg-[#111] px-4 py-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6E6E6E]">{tile.label}</p>
            <p className={`mt-1 text-xl font-bold ${tile.neg ? "text-red-400" : "text-[#F4F4F4]"}`}>{tile.value}</p>
            <span className={`mt-2 inline-block rounded px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${tile.tag === "VERIFIED" ? "bg-green-900/40 text-green-400" : "bg-amber-900/40 text-amber-400"}`}>
              {tile.tag}
            </span>
          </div>
        ))}
      </div>

      {/* J-Beauty Context */}
      <div className="mb-10 rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#F4F4F4]">J-Beauty in the US — 2025 Landscape</p>
        <p className="text-sm leading-relaxed text-[#9A9A9A]">
          J-Beauty US imports declined 16.9% in 2025 — down 38% from their 2021 peak — as K-Beauty captured mindshare among younger Asian beauty consumers. But J-Beauty&apos;s premium positioning, ritual-based routines, and ingredient credibility (Pitera, hyaluronic acid, camellia oil) remain highly trusted. Shortkey is positioned to reintroduce J-Beauty to the North American consumer raised on K-Beauty discovery, bridging both blocs through shared creator education and virtual try-on.
        </p>
      </div>

      {/* Featured J-Beauty Brands */}
      <div className="mb-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">
          Featured J-Beauty Brands on Shortkey
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
              Shop All J-Beauty
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl border border-[#2B2B2B] bg-[#111] px-6 py-6 text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#6E6E6E]">Are You a J-Beauty Brand?</p>
        <p className="mb-4 text-sm text-[#9A9A9A]">
          5% platform fee. North America reach. Creator-led reintroduction.
        </p>
        <Link href="/brands" className="inline-block rounded-full bg-[#F4F4F4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] hover:bg-white transition">
          Partner with Shortkey
        </Link>
      </div>
    </main>
  );
}
