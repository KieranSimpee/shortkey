import type { Metadata } from "next";
import Link from "next/link";
import "./sky-asia.css";

export const metadata: Metadata = {
  title: "SKY ASIA OS · MVP",
  description: "Internal ops MVP — Season 01 · Tasks · Knowledge Hub · Databases",
  robots: { index: false, follow: false },
};

const NAV: { href: string; label: string }[] = [
  { href: "/sky-asia", label: "HOME" },
  { href: "/sky-asia/seasons", label: "SEASONS" },
  { href: "/sky-asia/tasks", label: "TASKS" },
  { href: "/sky-asia/intake", label: "INTAKE" },
  { href: "/sky-asia/knowledge", label: "KNOWLEDGE HUB" },
  { href: "/sky-asia/artists", label: "ARTISTS" },
  { href: "/sky-asia/creators", label: "CREATORS" },
  { href: "/sky-asia/brands", label: "BRANDS" },
  { href: "/sky-asia/festivals", label: "FESTIVALS" },
  { href: "/sky-asia/content", label: "CONTENT" },
  { href: "/sky-asia/media", label: "MEDIA" },
  { href: "/sky-asia/analytics", label: "ANALYTICS" },
];

export default function SkyAsiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sao-root">
      <header className="sao-header">
        <div className="sao-brand">
          <Link href="/sky-asia">SKY ASIA OS</Link>
          <span className="sao-badge">MVP · GOR_GOR_REVIEW</span>
        </div>
        <nav className="sao-nav" aria-label="SKY ASIA modules">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="sao-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="sao-main">{children}</main>
      <footer className="sao-footer">
        Internal ops only · No auto social post · No public pricing · Discover Asia.
        Support Creators. Celebrate Culture.
      </footer>
    </div>
  );
}
