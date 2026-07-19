import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "outline-light" | "on-dark" | "highlight";
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  size = "md",
}: ButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-[11px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-6 py-3 text-xs",
  };

  const variants = {
    primary:
      "bg-brand text-white hover:bg-brand-dark",
    outline:
      "border border-brand/25 bg-white/90 text-brand hover:border-brand/45 hover:bg-white",
    /** Solid white plate + dark lilac label — readable on dark hero panels */
    "on-dark":
      "border-2 border-white bg-white !text-brand-dark hover:bg-brand-muted",
    "outline-light":
      "border border-white/70 bg-white/20 !text-white backdrop-blur-sm hover:bg-white/30",
    highlight:
      "border border-brand/40 bg-gradient-to-r from-brand to-[#7b6fd4] text-white shadow-[0_0_0_1px_rgba(155,122,227,0.25),0_8px_24px_rgba(155,122,227,0.35)] ring-2 ring-brand/25 hover:brightness-105",
  };

  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium uppercase tracking-[0.14em] transition-colors duration-300",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
