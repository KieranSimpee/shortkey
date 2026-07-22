import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "outline-light" | "on-dark" | "highlight" | "secondary";
  className?: string;
  size?: "sm" | "md" | "lg";
};

/** SHORTKEY V3.0 button system — Primary Lilac / Secondary outline */
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
      "bg-brand text-white shadow-soft hover:bg-brand-dark",
    secondary:
      "border border-brand bg-white text-brand hover:bg-brand-muted",
    outline:
      "border border-brand bg-white text-brand hover:bg-brand-muted",
    "on-dark":
      "border-2 border-white bg-white !text-brand hover:bg-brand-muted",
    "outline-light":
      "border border-white/80 bg-transparent !text-white hover:bg-white/10",
    /** Alias → primary (no neon gradients in V3) */
    highlight:
      "bg-brand text-white shadow-soft hover:bg-brand-dark",
  };

  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-display font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
