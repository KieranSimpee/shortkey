import Image from "next/image";

import { siteContent } from "@/content/homepage";

type Scatter = {
  top: string;
  left: string;
  rotate: string;
  z: number;
};

/**
 * Vertical random column:
 * 4 highlighted brands on top → unbranded Shortkey cards pooled at the bottom.
 */
const featuredLayout: Scatter[] = [
  { top: "0%", left: "18%", rotate: "-7deg", z: 20 },
  { top: "9%", left: "48%", rotate: "6deg", z: 21 },
  { top: "18%", left: "12%", rotate: "4deg", z: 19 },
  { top: "22%", left: "52%", rotate: "-5deg", z: 22 },
];

const pileLayout: Scatter[] = [
  { top: "38%", left: "8%", rotate: "-14deg", z: 4 },
  { top: "42%", left: "36%", rotate: "11deg", z: 5 },
  { top: "46%", left: "62%", rotate: "-8deg", z: 3 },
  { top: "56%", left: "14%", rotate: "9deg", z: 6 },
  { top: "58%", left: "42%", rotate: "-12deg", z: 4 },
  { top: "62%", left: "66%", rotate: "7deg", z: 5 },
  { top: "72%", left: "20%", rotate: "-6deg", z: 3 },
  { top: "74%", left: "48%", rotate: "13deg", z: 4 },
  { top: "78%", left: "70%", rotate: "-10deg", z: 2 },
  { top: "86%", left: "10%", rotate: "8deg", z: 3 },
  { top: "88%", left: "38%", rotate: "-15deg", z: 2 },
  { top: "90%", left: "60%", rotate: "5deg", z: 3 },
];

export function HeroBrandStage() {
  const { brandProducts, pileProducts } = siteContent.hero;

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[200px] sm:h-[460px] sm:max-w-[220px] lg:h-[500px] lg:max-w-[240px]">
      <p className="absolute -left-1 -top-6 z-30 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand/70 sm:text-[10px]">
        New brands joining
      </p>

      {/* Top of pile — 4 highlighted partner brands */}
      {brandProducts.map((product, index) => {
        const layout = featuredLayout[index % featuredLayout.length];
        return (
          <MiniCard
            key={`feat-${product.brand}`}
            product={product}
            layout={layout}
            size="md"
            featured
            delay={0.1 + index * 0.1}
          />
        );
      })}

      {/* Bottom of pile — unbranded Shortkey catalogue cards */}
      {pileProducts.map((product, index) => {
        const layout = pileLayout[index % pileLayout.length];
        return (
          <MiniCard
            key={`pile-${product.name}-${index}`}
            product={product}
            layout={layout}
            size="sm"
            delay={0.35 + index * 0.04}
          />
        );
      })}
    </div>
  );
}

function MiniCard({
  product,
  layout,
  size,
  featured = false,
  delay = 0,
}: {
  product: { brand: string; name: string; image: string };
  layout: Scatter;
  size: "sm" | "md";
  featured?: boolean;
  delay?: number;
}) {
  const width = size === "md" ? "w-[56px] sm:w-[62px]" : "w-[42px] sm:w-[46px]";

  return (
    <div
      className={`hero-brand-enter absolute ${width}`}
      style={{
        top: layout.top,
        left: layout.left,
        zIndex: layout.z,
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{ transform: `rotate(${layout.rotate})` }}>
        <div
          className={
            featured
              ? "overflow-hidden rounded-md border border-brand/40 bg-white/95 p-0.5 shadow-[0_10px_20px_rgba(100,70,160,0.24)]"
              : "overflow-hidden rounded-md border border-white/65 bg-white/50 p-0.5 shadow-[0_5px_12px_rgba(80,60,120,0.1)]"
          }
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[3px] bg-[#faf8fc]">
            <Image
              src={product.image}
              alt={featured ? `${product.brand} — ${product.name}` : product.name}
              fill
              className={`object-cover object-center ${featured ? "" : "opacity-75"}`}
              sizes={size === "md" ? "62px" : "46px"}
            />
          </div>
        </div>
        {featured ? (
          <p className="mt-0.5 text-center text-[7px] font-semibold uppercase tracking-[0.1em] text-ink sm:text-[8px]">
            {product.brand}
          </p>
        ) : null}
      </div>
    </div>
  );
}
