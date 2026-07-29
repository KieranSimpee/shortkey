import Link from "next/link";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

/**
 * shortkey.live — Asian Beauty Live Commerce Platform
 * Replaces "Coming Soon" with full platform landing page.
 * Asian culture-inspired design with TINT AI Try-On, VIP Polaroid, live schedule.
 *
 * Design: Apple-minimal × Asian warmth
 * Languages: EN / 繁中 / 日本語 / 한국어
 * Brand: ShortKey Digital Lavender system
 */

const KEYCAP_CTA =
  "!rounded-md !normal-case !tracking-wide border border-white/90 bg-gradient-to-b from-white to-brand-muted !text-brand shadow-[0_2px_0_rgba(140,130,252,0.2),0_4px_12px_rgba(140,130,252,0.1)] hover:!bg-brand-muted hover:!text-brand";

const KEYCAP_GHOST =
  "!rounded-md !normal-case !tracking-wide border border-brand/30 bg-transparent !text-brand hover:!bg-brand-muted";

const LIVE_SESSIONS = [
  {
    status: "live",
    date: "Wed Jul 29 · 9:00 PM HKT",
    title: "K-Beauty Night Routine",
    creator: "Yuki Tanaka",
    avatar: "Y",
    avatarBg: "from-[#FF6B9D] to-[#CD2E3A]",
    brands: ["COSRX", "Etude", "Innisfree"],
    vipFilled: 8,
    vipTotal: 10,
    viewers: "2,847",
  },
  {
    status: "upcoming",
    date: "Thu Jul 30 · 8:00 PM HKT",
    title: "J-Beauty Summer Glow",
    creator: "Hana Sato",
    avatar: "H",
    avatarBg: "from-[#FFB7C5] to-[#BC002D]",
    brands: ["Shiseido", "SK-II"],
    vipFilled: 3,
    vipTotal: 10,
    viewers: null,
  },
  {
    status: "upcoming",
    date: "Fri Jul 31 · 7:00 PM HKT",
    title: "T-Beauty Glass Skin",
    creator: "Mei Chen",
    avatar: "M",
    avatarBg: "from-[#7AC4E3] to-[#0072C6]",
    brands: ["Shiseido", "Dr. Wu"],
    vipFilled: 1,
    vipTotal: 10,
    viewers: null,
  },
  {
    status: "upcoming",
    date: "Sat Aug 1 · 8:00 PM HKT",
    title: "Full Face Friday",
    creator: "Sora Lee",
    avatar: "S",
    avatarBg: "from-brand to-brand-dark",
    brands: ["3CE", "Peripera", "Hera"],
    vipFilled: 0,
    vipTotal: 10,
    viewers: null,
  },
];

const TINT_FEATURES = [
  {
    icon: "💋",
    title: "Lip Try-On",
    desc: "Real-time lip shade matching. See any lipstick on your lips instantly.",
    stat: "94%",
    statLabel: "Match Accuracy",
    bg: "from-[#FF6B9D] to-[#CD2E3A]",
  },
  {
    icon: "💧",
    title: "Skin Analysis",
    desc: "AI-powered skin analysis: hydration, texture, tone. Get personalized recommendations.",
    stat: "7",
    statLabel: "Skin Metrics",
    bg: "from-[#7AC4E3] to-[#5BA8C9]",
  },
  {
    icon: "🎨",
    title: "Full Face",
    desc: "Complete makeup look try-on. Foundation, eyes, lips — all at once.",
    stat: "0.3s",
    statLabel: "Render Speed",
    bg: "from-[#D4A574] to-[#C49A5E]",
  },
  {
    icon: "👥",
    title: "Group Try-On",
    desc: "Try-on together during live. See how shades look on different skin tones.",
    stat: "10+",
    statLabel: "Simultaneous",
    bg: "from-brand to-brand-dark",
  },
];

const VIP_POLAROIDS = [
  {
    name: "Minji",
    country: "KR",
    flagBg: "#CD2E3A",
    quote: "입술이 정말 예뻐요!",
    emoji: "💋",
    emojiBg: "from-[#FF6B9D] to-[#CD2E3A]",
    fontClass: "font-['Noto_Sans_KR']",
  },
  {
    name: "Aiko",
    country: "JP",
    flagBg: "#BC002D",
    quote: "肌がしっとり！",
    emoji: "💧",
    emojiBg: "from-[#FFB7C5] to-[#BC002D]",
    fontClass: "font-['Noto_Sans_JP']",
  },
  {
    name: "Mei",
    country: "TW",
    flagBg: "#0072C6",
    quote: "美白超好！",
    emoji: "❤️",
    emojiBg: "from-[#FF4757] to-[#DE2910]",
    fontClass: "font-['Noto_Sans_SC']",
  },
  {
    name: "Sora",
    country: "KR",
    flagBg: "#CD2E3A",
    quote: "피부 빛나요!",
    emoji: "✨",
    emojiBg: "from-[#7AC4E3] to-[#0072C6]",
    fontClass: "font-['Noto_Sans_KR']",
  },
  {
    name: "Hana",
    country: "JP",
    flagBg: "#BC002D",
    quote: "最高です！",
    emoji: "🌸",
    emojiBg: "from-[#FFB7C5] to-[#BC002D]",
    fontClass: "font-['Noto_Sans_JP']",
  },
  {
    name: "Lisa",
    country: "SG",
    flagBg: "#ED2939",
    quote: "Skin glows!",
    emoji: "⭐",
    emojiBg: "from-[#F9CA24] to-[#ED2939]",
    fontClass: "",
  },
];

const INFLUENCERS = [
  { name: "Yuki Tanaka", tag: "K-Beauty · 247K followers", avatar: "Y", bg: "from-[#FF6B9D] to-[#CD2E3A]", sessions: "142", rating: "4.9" },
  { name: "Hana Sato", tag: "J-Beauty · 189K followers", avatar: "H", bg: "from-[#FFB7C5] to-[#BC002D]", sessions: "98", rating: "4.8" },
  { name: "Mei Chen", tag: "T-Beauty · 156K followers", avatar: "M", bg: "from-[#7AC4E3] to-[#0072C6]", sessions: "76", rating: "4.9" },
  { name: "Sora Lee", tag: "K-Beauty · 203K followers", avatar: "S", bg: "from-brand to-brand-dark", sessions: "118", rating: "4.7" },
  { name: "Lisa Wong", tag: "SG-Beauty · 98K followers", avatar: "L", bg: "from-[#F9CA24] to-[#ED2939]", sessions: "54", rating: "4.8" },
];

export function LiveComingSoonHome() {
  return (
    <div className="relative min-h-screen bg-silk text-ink overflow-x-hidden">
      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-50 border-b border-brand/8 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-8">
          <Logo size="header" surface="light" />
          <div className="ml-4 hidden items-center gap-2 sm:flex">
            <span className="rounded-md bg-brand px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-white">Live</span>
            <a href="https://shortkey.beauty" className="rounded-md border border-brand/15 px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-ink-subtle transition-colors hover:border-brand hover:text-brand">Beauty</a>
            <a href="https://shortkey.fashion" className="rounded-md border border-brand/15 px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-ink-subtle transition-colors hover:border-brand hover:text-brand">Fashion</a>
            <a href="https://shortkey.store" className="rounded-md border border-brand/15 px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-ink-subtle transition-colors hover:border-brand hover:text-brand">Store</a>
            <a href="https://shortkey.world" className="rounded-md border border-brand/15 px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-ink-subtle transition-colors hover:border-brand hover:text-brand">World</a>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-1 sm:flex">
              <span className="rounded-md bg-brand px-2 py-1 font-mono text-[9px] font-bold text-white">EN</span>
              <span className="rounded-md border border-brand/15 px-2 py-1 font-mono text-[9px] font-bold text-ink-subtle">繁中</span>
              <span className="rounded-md border border-brand/15 px-2 py-1 font-mono text-[9px] font-bold text-ink-subtle">日本語</span>
              <span className="rounded-md border border-brand/15 px-2 py-1 font-mono text-[9px] font-bold text-ink-subtle">한국어</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[#E84855] px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-white">3 Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-8 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-muted/30 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="type-eyebrow mb-4 text-brand">Asian Beauty Live Commerce</p>
          <h1 className="type-display-hero text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem]">
            <span className="font-['Noto_Serif_SC'] font-semibold text-brand">美</span> meets{" "}
            <span className="text-brand">live</span>.
            <br />
            Where Asia&apos;s beauty
            <br />
            comes alive.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-muted">
            The platform where Asian beauty influencers go live, fans try on in real-time,
            and every purchase is a personal moment.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="text-sm font-semibold text-brand">Beauty, live.</span>
            <span className="font-['Noto_Sans_KR'] text-sm font-semibold text-ink-subtle">아시아 뷰티, 라이브.</span>
            <span className="font-['Noto_Sans_JP'] text-sm font-semibold text-ink-subtle">アジア美容、ライブ。</span>
            <span className="font-['Noto_Sans_SC'] text-sm font-semibold text-ink-subtle">亞洲美妝，直播。</span>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#live-now" className={`inline-flex items-center rounded-full bg-brand px-7 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card`}>
              Watch Live Now
            </a>
            <a href="#schedule" className={`inline-flex items-center rounded-full border border-brand/30 bg-transparent px-7 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-brand transition-all hover:bg-brand-muted`}>
              View Schedule
            </a>
          </div>
        </div>
      </section>

      {/* ===== LIVE NOW ===== */}
      <section id="live-now" className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
        <div className="type-section-muted mb-4 flex items-center gap-3">
          <span>Streaming Now</span>
          <span className="h-px flex-1 bg-brand/10" />
        </div>
        <div className="overflow-hidden rounded-card border border-brand/8 bg-white shadow-soft">
          <div className="grid md:grid-cols-[1fr_300px]">
            {/* Player */}
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-brand-muted to-[#F5F0EB] md:aspect-auto">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(140,130,252,0.12),transparent_70%)]" />
              <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-[#E84855] px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-white">Live</span>
              </div>
              <div className="absolute right-4 top-4 z-10 rounded-full bg-[#1C1F26]/70 px-3 py-1.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                👁 2,847 watching
              </div>
              <div className="relative z-[2] text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform hover:scale-110">
                  <div className="ml-1 h-0 w-0 border-y-[13px] border-l-[20px] border-y-transparent border-l-brand" />
                </div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand-dark">Tap to Watch</p>
              </div>
            </div>
            {/* Info */}
            <div className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B9D] to-[#CD2E3A] text-sm font-bold text-white">Y</div>
                <div>
                  <p className="text-sm font-bold text-ink">Yuki Tanaka</p>
                  <p className="text-[10px] text-ink-subtle">K-Beauty · J-Beauty Live</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: "💋", name: "Juicy Tint #23", price: "$24" },
                  { icon: "💧", name: "Snail Mucin Essence", price: "$32" },
                  { icon: "✨", name: "Brightening Serum", price: "$48" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-2 rounded-lg bg-brand-muted px-3 py-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs">{p.icon}</div>
                    <span className="flex-1 text-[11px] font-semibold text-ink">{p.name}</span>
                    <span className="text-[11px] font-bold text-brand">{p.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex gap-2">
                <a href="#" className="flex-1 rounded-full bg-brand py-2.5 text-center font-mono text-[9px] font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90">Try-On Now</a>
                <a href="#" className="flex-1 rounded-full border border-brand/15 py-2.5 text-center font-mono text-[9px] font-bold uppercase tracking-wider text-ink-subtle transition-colors hover:border-brand hover:text-brand">Join VIP</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TINT FEATURES ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink">TINT <span className="text-brand">AI Try-On</span></h2>
          <p className="mx-auto mt-2 max-w-sm text-[13px] text-ink-subtle">Real-time AI beauty try-on. See it on you before you buy it.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TINT_FEATURES.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-brand/8 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.bg} text-xl`}>{f.icon}</div>
              <h3 className="mb-1.5 text-[15px] font-bold tracking-tight text-ink">{f.title}</h3>
              <p className="text-xs leading-relaxed text-ink-subtle">{f.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t border-brand/10 pt-3">
                <span className="text-lg font-bold tracking-tight text-brand">{f.stat}</span>
                <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-ink-subtle">{f.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VIP POLAROID WALL ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">VIP <span className="text-brand">Polaroid Wall</span></h2>
            <p className="mt-1 text-[11px] text-ink-subtle">First 10 fans who buy the full set get an exclusive photo with the influencer.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {VIP_POLAROIDS.map((p, i) => (
            <div
              key={p.name}
              className="group relative cursor-pointer bg-white p-2.5 pb-7 shadow-soft transition-all hover:z-10 hover:scale-105 hover:shadow-card"
              style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
            >
              <div className="relative aspect-square overflow-hidden rounded bg-gradient-to-br from-brand-muted to-[#F5F0EB]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/12 to-[#D4A574]/8" />
                {/* Stickers */}
                <span className="absolute left-1 top-1 z-[2] rounded-full bg-brand/85 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">S+</span>
                <span className="absolute right-1 top-1 z-[2] rounded-full bg-[#D4A574]/90 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">VIP</span>
                <span className="absolute bottom-1 left-1 z-[2] rounded-full bg-[#1C1F26]/70 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">TINT</span>
                {/* Country flag */}
                <span className="absolute right-1 top-7 z-[3] rounded px-1 py-0.5 text-[7px] font-bold text-white" style={{ background: p.flagBg }}>{p.country}</span>
                {/* Native quote */}
                <span className={`absolute bottom-1 left-1 right-1 z-[3] rounded bg-[#1C1F26]/75 px-1 py-0.5 text-center text-[6px] font-semibold leading-tight text-white backdrop-blur-sm ${p.fontClass}`}>{p.quote}</span>
                {/* Personalized emoji */}
                <span className={`absolute bottom-[30%] left-[-6px] z-[4] flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${p.emojiBg} text-xs shadow-md`}>{p.emoji}</span>
              </div>
              <p className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-semibold text-ink">Yuki x {p.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SCHEDULE ===== */}
      <section id="schedule" className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
        <div className="type-section-muted mb-4 flex items-center gap-3">
          <span>Upcoming Live Sessions</span>
          <span className="h-px flex-1 bg-brand/10" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIVE_SESSIONS.map((s) => {
            const fillPct = (s.vipFilled / s.vipTotal) * 100;
            return (
              <div
                key={s.title}
                className={`rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-card ${
                  s.status === "live" ? "border-brand shadow-soft" : "border-brand/8"
                }`}
              >
                {s.status === "live" && (
                  <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#E84855] px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-white">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-white" /> Live Now
                  </div>
                )}
                <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wider text-brand">{s.date}</p>
                <h3 className="mb-1 text-sm font-bold tracking-tight text-ink">{s.title}</h3>
                <p className="mb-3 text-[11px] text-ink-subtle">{s.creator}</p>
                <div className="mb-3 flex flex-wrap gap-1">
                  {s.brands.map((b) => (
                    <span key={b} className="rounded-full bg-brand-muted px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-brand">{b}</span>
                  ))}
                </div>
                <div className="mb-3">
                  <div className="mb-1 flex justify-between font-mono text-[8px] text-ink-subtle">
                    <span>VIP Slots</span>
                    <span>{s.vipFilled}/{s.vipTotal} filled</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-brand/10">
                    <div
                      className={`h-full rounded-full ${fillPct > 80 ? "bg-[#E84855]" : "bg-brand"}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href="#" className="flex-1 rounded-full bg-brand py-2 text-center font-mono text-[8px] font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90">
                    {s.status === "live" ? "Watch Now" : "Set Reminder"}
                  </a>
                  <a href="#" className="flex-1 rounded-full border border-brand/15 py-2 text-center font-mono text-[8px] font-bold uppercase tracking-wider text-ink-subtle transition-colors hover:border-brand hover:text-brand">
                    Add to Calendar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== INFLUENCERS ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
        <div className="type-section-muted mb-4 flex items-center gap-3">
          <span>Featured Influencers</span>
          <span className="h-px flex-1 bg-brand/10" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {INFLUENCERS.map((inf) => (
            <div key={inf.name} className="min-w-[200px] shrink-0 rounded-2xl border border-brand/8 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-card">
              <div className={`mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${inf.bg} text-base font-bold text-white`}>{inf.avatar}</div>
              <p className="text-[13px] font-bold tracking-tight text-ink">{inf.name}</p>
              <p className="mt-0.5 text-[10px] text-ink-subtle">{inf.tag}</p>
              <div className="mt-2.5 flex gap-3 border-t border-brand/10 pt-2.5">
                <span className="text-[9px] text-ink-subtle"><b className="text-brand text-[11px]">{inf.sessions}</b> live sessions</span>
                <span className="text-[9px] text-ink-subtle"><b className="text-brand text-[11px]">{inf.rating}★</b> rating</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BRAND CTA ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-8">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-brand to-brand-dark p-10 text-center text-white shadow-card">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative z-[2]">
            <h2 className="mb-2.5 text-2xl font-bold tracking-tight">Are you a beauty brand?</h2>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-white/85">
              Join ShortKey&apos;s live commerce ecosystem. Connect with Asia&apos;s top beauty influencers,
              reach engaged fans, and track every result with our TINT analytics.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://shortkey.info" className="rounded-full bg-white px-7 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-brand transition-all hover:-translate-y-0.5 hover:opacity-90">Brand Portal</a>
              <a href="https://shortkey.world" className="rounded-full border border-white/40 px-7 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1C1F26] px-4 py-8 text-center sm:px-8">
        <Logo size="footer" surface="dark" />
        <p className="mt-2 text-[11px] text-ink-subtle">Asian beauty, live. Your style. Your ctrl.</p>
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-4" aria-label="Domain ecosystem">
          <a href="https://shortkey.beauty" className="type-caption transition-colors hover:text-brand-light">Beauty</a>
          <a href="https://shortkey.fashion" className="type-caption transition-colors hover:text-brand-light">Fashion</a>
          <a href="https://shortkey.store" className="type-caption transition-colors hover:text-brand-light">Store</a>
          <a href="https://shortkey.social" className="type-caption transition-colors hover:text-brand-light">Social</a>
          <a href="https://shortkey.world" className="type-caption transition-colors hover:text-brand-light">World</a>
          <a href="https://shortkey.studio" className="type-caption transition-colors hover:text-brand-light">Studio</a>
        </nav>
        <p className="mt-4 font-mono text-[9px] tracking-wider text-ink-subtle/60">© {new Date().getFullYear()} SHORTKEY · ALL RIGHTS RESERVED</p>
        <p className="mt-1 text-[10px] text-ink-subtle/50">{POWERED_BY_AI_FAMILY}</p>
      </footer>
    </div>
  );
}
