import { HeroBackground } from "@/components/sections/HeroBackground";
import { HeroPosterBoard } from "@/components/sections/HeroPosterBoard";
import { HeroShortcutBar } from "@/components/sections/HeroShortcutBar";
import { CmsZone } from "@/components/cms/CmsZone";

/**
 * Hero banner with poster controls:
 * AI Skin Analysis (current) · Try AI Try-On (next).
 */
export function HeroSection() {
  return (
    <CmsZone id="hero">
      <section className="hero-atmosphere relative z-50 -mt-[3.75rem] flex min-h-[clamp(28rem,78svh,42rem)] flex-col overflow-visible sm:-mt-[4rem] sm:min-h-[clamp(30rem,82svh,44rem)] lg:min-h-[clamp(32rem,85svh,46rem)]">
        <HeroBackground />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-[3.75rem] sm:pt-[4rem]">
          <HeroPosterBoard />
        </div>

        <CmsZone id="beauty-os">
          <HeroShortcutBar />
        </CmsZone>
      </section>
    </CmsZone>
  );
}
