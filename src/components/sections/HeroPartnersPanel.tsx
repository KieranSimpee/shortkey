import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";

/** Brand & influencer poster — meeting signup CTAs */
export function HeroPartnersPanel({ className }: { className?: string }) {
  const hosts = siteContent.aiLab.hosts.slice(0, 3);
  const src = siteContent.hero.partnersImage;

  return (
    <div className={className}>
      <div className="hero-rotate-panel w-[min(100%,14.5rem)] overflow-hidden rounded-2xl border border-white/45 bg-white/30 shadow-[0_20px_50px_rgba(90,60,160,0.12)] backdrop-blur-md">
        <div className="relative aspect-[5/4] overflow-hidden">
          <Image
            src={src}
            alt="Shortkey brands and influencers"
            fill
            className="object-cover"
            sizes="240px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a2438]/80 via-transparent to-transparent" />
          <p className="absolute bottom-3 left-3 right-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
            Brands · Influencers · One stage
          </p>
        </div>

        <div className="space-y-2 p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand">
            Book a 1-hour meeting
          </p>
          <div className="flex -space-x-2">
            {hosts.map((host) => (
              <div
                key={host.id}
                className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/80"
              >
                <Image src={host.image} alt={host.name} fill className="object-cover" sizes="36px" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <Link
              href="/signup/creator"
              className="rounded-full bg-brand px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark"
            >
              Creator signup
            </Link>
            <Link
              href="/signup/brand"
              className="rounded-full border border-brand/30 bg-white/70 px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-brand transition hover:border-brand/50"
            >
              Brand signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
