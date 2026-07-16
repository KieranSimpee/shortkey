import Image from "next/image";

import { siteContent } from "@/content/homepage";

/**
 * Soft floating cutout — no hard bottom shelf flush with the content grid.
 * Feet dissolve into atmosphere near the CTA line; head soft-extends to brand/nav.
 */
export function HeroModelCutout({ className = "" }: { className?: string }) {
  const { hero } = siteContent;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 -bottom-10 top-0 flex min-h-0 items-end justify-center overflow-visible [perspective:1200px] sm:-bottom-12 ${className}`}
    >
      {/* Soft ground glow — reads as float, not a shelf */}
      <div className="absolute bottom-[6%] left-1/2 h-[28%] w-[78%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(255,255,255,0.45)_0%,rgba(214,198,245,0.2)_40%,transparent_72%)] blur-2xl" />
      <div className="absolute left-1/2 top-[6%] h-[34%] w-[64%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(214,198,245,0.18)_45%,transparent_70%)] blur-3xl" />

      <div className="relative z-[1] flex h-full w-full min-h-0 items-end justify-center pb-2">
        <Image
          src={hero.modelHeadImage}
          alt=""
          width={1000}
          height={1300}
          priority
          className="hero-model-blend h-[106%] w-auto max-w-none origin-bottom"
          sizes="(max-width: 1024px) 70vw, 560px"
        />
      </div>
    </div>
  );
}
