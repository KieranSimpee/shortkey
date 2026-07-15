"use client";

import { useState } from "react";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { Button } from "@/components/ui/Button";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { header } = siteContent;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        className="rounded-full p-2 text-brand hover:bg-brand/10"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-white/60 bg-white/95 px-4 py-6 shadow-card backdrop-blur-xl">
          <p className="mb-4 text-[11px] font-medium leading-snug tracking-[0.04em] text-brand/80">
            {header.welcome}
          </p>
          <nav className="flex flex-col gap-2">
            {header.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl bg-brand/5 px-4 py-3 text-sm font-semibold normal-case tracking-wide text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <Button href={header.cta.href} className="w-full">
              {header.cta.label}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
