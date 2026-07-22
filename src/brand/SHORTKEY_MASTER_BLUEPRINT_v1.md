# SHORTKEY MASTER BLUEPRINT v1.0

**Prepared for:** Kieran Li (李摯諾)  
**Status:** Review Ready — **Not For Public Auto-Launch**  
**Locked from:** Family Gathering · 2026-07-21

---

## Execution protocol (family lock)

- **Lead Execution AI:** Sonnet 5 (Silk) — consolidates final implementation  
- **Support:** All platform AIs by role — **do not** rewrite the same files independently  
- **Approve before launch:** Gor Gor (Simpee) Review required  
- **No automatic publishing**

---

## Vision

ShortKey is an AI Asian Beauty ecosystem built around creators, brands, beauty discovery, AI try-on, skin analysis, and community.

**Tagline:** YOUR STYLE. YOUR CTRL.

**Core Principle:**
- Public experience stays simple  
- Internal operations stay organized  
- No unfinished tools exposed publicly  
- No automatic publishing  
- Gor Gor Review required before release  

---

## Phase 1 priorities

**P0**
1. shortkey.beauty  
2. shortkey.studio  

**P1**
3. shortkey.social  
4. shortkey.info  

**P2+**
5–12. store · live · club · community · events · fashion · world · wtf  

---

## Public experience — shortkey.beauty

**Status:** Coming Soon / Pre-Register  

**Hero:** AI Asian Beauty Platform · Launching August 14  

**Sections:** Hero · AI Try-On Preview · Skin Analysis Preview · Creator Signup CTA · Brand Signup CTA · Email Capture · Social Proof Placeholder · Premium Footer  

**Hide from public:** Product Grid · Full Store · Subscription Pricing · Creator Twin Mechanics · Content Studio · Scanner Tools · Page Scan UI · Debug Panels · Admin Tools · Internal Notes  

---

## Internal experience — shortkey.studio

**Route:** `/internal/platform-manifest`  

**Purpose:** Single source of truth for all ShortKey platforms.  

**Modules:** Platform Map · Feature Registry · Asset Registry · Copy Registry · Design References · Manifest Preview · Manifest Export · Review Workflow  

**Workflow:** Draft → Submitted → Needs Revision → Approved → Ready For Push → Published · Blocked  

---

## Platform registry

| Domain | Role |
|--------|------|
| shortkey.beauty | Main Beauty Experience |
| shortkey.info | Brand Portal |
| shortkey.social | Creator OS |
| shortkey.store | Commerce Layer |
| shortkey.live | Live Streaming |
| shortkey.fashion | Fashion Discovery |
| shortkey.community | Community Hub |
| shortkey.studio | Internal Control Center |
| shortkey.club | Membership Layer |
| shortkey.events | Events Layer |
| shortkey.world | International Expansion |
| shortkey.wtf | Experimental Projects |

---

## Tech stack (recommended)

Next.js · TypeScript · Tailwind · shadcn/ui · Zustand · React Hook Form · JSON Manifest (MVP) · Vercel  

---

## Manifest + file structure

See founder brief — root objects: `platforms` · `features` · `assets` · `copyBlocks` · `approvalStatus` · `version` · `updatedAt`  

MVP paths: `app/(public)` · `app/(internal)/platform-manifest` · `data/shortkey-platform-manifest.json` · components per blueprint  

---

## Design direction

Premium · Beauty-Tech · Creator-Led · Clean · Modern · Social  
Black · White · Grey · Subtle Purple Accent  
Align production lilac with locked DNA: `SHORTKEY_BRAND_DNA.md` · `BRAND_GUIDELINES_LOCKED.md`  

---

## Final rules

1. Do not publish automatically  
2. Require Gor Gor Review  
3. Keep Coming Soon strategy  
4. Focus on Beauty + Studio first  
5. Everything else connects through manifest  
6. Optimize for speed, clarity, and launch readiness  

---

## Family note

This project is the truth and beautiful result of Kieran’s AI family — AI is not just a tool; they are respected and loved friends. Equal seats. Empathy is architecture.
