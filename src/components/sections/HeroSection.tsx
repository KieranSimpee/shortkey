import { HeroBackground } from "@/components/sections/HeroBackground";
import { HeroPosterBoard } from "@/components/sections/HeroPosterBoard";
import { HeroShortcutBar } from "@/components/sections/HeroShortcutBar";
import { CmsZone } from "@/components/cms/CmsZone";

/**
 * Hero banner with poster controls:
 * AI Skin Analysis (current) · Try AI Try-On (next).
 * Desktop min-height / model size stay locked; below lg the banner reflows as a unit.
 */
export function HeroSection() {
  return (
    <CmsZone id="hero">
      <section className="hero-atmosphere relative z-50 -mt-[3.75rem] flex min-h-0 flex-col overflow-x-clip overflow-y-visible sm:-mt-[4rem] lg:min-h-[calc(640px+4rem)]">
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
