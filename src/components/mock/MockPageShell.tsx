import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionShortcutBar } from "@/components/ui/SectionShortcutBar";
import { cn } from "@/lib/utils";

type MockCta = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
};

type MockPageShellProps = {
  eyebrow?: string;
  shortcut?: string;
  title: string;
  description: string;
  badge?: string;
  ctas?: MockCta[];
  children?: React.ReactNode;
  className?: string;
};

/** Shared chrome for reviewable mock landing pages */
export function MockPageShell({
  eyebrow = "MOCKUP · FOR REVIEW",
  shortcut = "CTRL + /",
  title,
  description,
  badge,
  ctas,
  children,
  className,
}: MockPageShellProps) {
  return (
    <div className={cn("pb-16 pt-8 lg:pb-24 lg:pt-10", className)}>
      <div className="px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/mockups"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand transition hover:text-brand/80"
            >
              ← All mockups
            </Link>
            <Link
              href="/"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted transition hover:text-ink"
            >
              Home
            </Link>
          </div>

          <div className="section-panel rounded-2xl border border-white/60 p-5 sm:p-6 lg:p-8">
            <SectionShortcutBar shortcut={shortcut} label={eyebrow} />

            {badge ? (
              <span className="type-eyebrow mt-2 inline-flex w-fit rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1 text-brand">
                {badge}
              </span>
            ) : null}

            <h1 className="type-section mt-3 text-2xl sm:text-3xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-ink-muted">
              {description}
            </p>

            {ctas?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {ctas.map((cta) => (
                  <Button
                    key={cta.href + cta.label}
                    href={cta.href}
                    size="sm"
                    variant={cta.variant ?? "primary"}
                  >
                    {cta.label}
                  </Button>
                ))}
              </div>
            ) : null}

            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

type MockBlockProps = {
  title: string;
  body?: string;
  children?: React.ReactNode;
};

export function MockBlock({ title, body, children }: MockBlockProps) {
  return (
    <div className="rounded-xl border border-white/50 bg-white/40 p-4 sm:p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand/80">
        {title}
      </h2>
      {body ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export function MockNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-brand/30 bg-brand/5 px-3 py-2 text-[11px] font-medium leading-relaxed text-brand">
      {children}
    </p>
  );
}
