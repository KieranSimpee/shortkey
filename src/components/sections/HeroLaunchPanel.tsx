import Image from "next/image";
import { siteContent } from "@/content/homepage";

const FEATURES = [
  { shortcut: "CTRL + AI", label: "Skin analysis & try-on" },
  { shortcut: "CTRL + LIVE", label: "Creator-led shops" },
  { shortcut: "CTRL + MATCH", label: "Brand → customer care" },
  { shortcut: "CTRL + OS", label: "Shortcut discovery" },
];

/** Launch-month poster — ambition + feature highlight */
export function HeroLaunchPanel({ className }: { className?: string }) {
  const src = siteContent.hero.launchImage;

  return (
    <div className={className}>
      <div className="hero-rotate-panel w-[min(100%,14.5rem)] overflow-hidden rounded-2xl border border-white/45 bg-white/30 shadow-[0_20px_50px_rgba(90,60,160,0.12)] backdrop-blur-md">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={src}
            alt="Shortkey launch"
            fill
            className="object-cover transition duration-700"
            sizes="240px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a2438]/85 via-[#2a2438]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-light">
              Launch month
            </p>
            <p className="mt-1 text-[12px] font-bold uppercase leading-snug tracking-[0.08em] text-white">
              Connect brands to the customers who will love them
            </p>
          </div>
        </div>
        <ul className="space-y-1.5 p-3">
          {FEATURES.map((f) => (
            <li
              key={f.shortcut}
              className="flex items-center gap-2 rounded-lg border border-white/40 bg-white/40 px-2 py-1.5"
            >
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-brand">
                {f.shortcut}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-ink">
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
