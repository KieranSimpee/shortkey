"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORY_SURFACE_LOCKED } from "@/content/featureLocks";
import { siteContent } from "@/content/homepage";
import { Button } from "@/components/ui/Button";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { header } = siteContent;
  const navItems = CATEGORY_SURFACE_LOCKED ? [] : header.nav;

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
          {navItems.length > 0 ? (
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
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
          ) : (
            <p className="rounded-xl border border-brand/15 bg-brand/5 px-4 py-3 text-[12px] text-ink-muted">
              Category pages are locked for now — appointment booking stays open.
            </p>
          )}
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
