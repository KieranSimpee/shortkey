import Link from "next/link";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import { siteContent } from "@/content/homepage";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { footer } = siteContent;

  return (
    <footer className="border-t border-white/40">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_repeat(4,1fr)_1.4fr] lg:gap-12">
          <div>
            <Logo size="footer" surface="light" />
            <p className="type-caption mt-2 text-brand/60">{siteContent.brand.tagline}</p>
          </div>

          {footer.linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="type-section-muted mb-5">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => {
                  const external = link.href.startsWith("http");

                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="type-body text-ink-muted transition-colors hover:text-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="type-section-muted mb-3">{footer.newsletter.title}</h4>
            <p className="type-body mb-4">{footer.newsletter.description}</p>
            <form className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder={footer.newsletter.placeholder}
                className="silk-surface flex-1 rounded-full border border-white/60 px-4 py-2.5 text-sm outline-none focus:border-brand/40"
              />
              <Button href="#" size="sm" className="shrink-0">
                {footer.newsletter.button}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/40 pt-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="type-caption">{footer.copyright}</p>
            <p className="type-caption mt-1 text-ink-muted">{footer.domains}</p>
            <p className="mt-1 text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
          </div>
          <div className="flex gap-4">
            {footer.social.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="type-caption transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
