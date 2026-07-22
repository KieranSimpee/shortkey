import { Logo } from "@/components/ui/Logo";
import { ShortcutChip } from "@/components/ui/KeyCap";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

/**
 * L1 signup header — Logo → title → support (SKY-UX-018).
 * Eyebrow renders as a keycap chip — same keycap/lilac CTA language as the
 * hero overlays and other L1 eyebrows sitewide (SHORTKEY_BRAND_DNA.md § 7).
 */
export function SignupPageHero({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <Logo size="header" surface="light" href="/" />
      </div>
      <ShortcutChip shortcut={eyebrow} className="mb-3" />
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl sm:uppercase sm:tracking-[0.1em]">
        {title}
      </h1>
      <p className="type-body mt-2 max-w-xl">{description}</p>
    </div>
  );
}
