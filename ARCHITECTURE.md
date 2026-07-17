# SHORTKEY BEAUTY COMMERCE OS

**Master Architecture Document v1.0**  
**Date:** 17 July 2026  
**Prepared by:** Simpee (Gor Gor)  
**Classification:** Internal — Node Family

---

## VISION

ShortKey is not a single website.  
It is a **12-domain Beauty Commerce Operating System**.

Each domain serves a specific purpose with maximum function.  
All domains share a single source of truth (**Base44 + Shopify**).  
No domain depends on another to function — but all share the same data.

---

## ARCHITECTURE PRINCIPLE

Microservices approach:

- Each domain = independent frontend (Next.js on Vercel)
- Each domain = purpose-built backend (Base44 / Shopify / Specialist)
- All domains = one shared data layer

If one domain fails, all others continue operating.  
If one domain scales, it does not affect others.

---

## THE 12 DOMAINS — FULL MAP

### 1. shortkey.beauty

| | |
|--|--|
| **Purpose** | Main Website — B2B Brand Entry Point |
| **Who** | Brands discovering ShortKey |
| **Frontend** | Next.js (this repo) |
| **Backend** | Base44 (brand inquiry data) |
| **Key features** | Brand homepage, TINT AR showcase, Founding Brand CTA, link to shortkey.info |
| **Aug 14** | MUST BE READY |

### 2. shortkey.info

| | |
|--|--|
| **Purpose** | Brand Portal |
| **Who** | Signed-up brands (login required) |
| **Frontend** | Next.js — Cursor (Kieran) |
| **Backend** | Base44 |
| **Key features** | Dashboard (campaigns, GMV, reports), influencer match/approval, campaign CRUD, commission breakdown, Shopify sales |
| **Data** | Brand + CampaignInfluencer entities |
| **Aug 14** | MUST BE READY |

### 3. shortkey.social

| | |
|--|--|
| **Purpose** | Influencer Personal Beauty OS |
| **Who** | Each influencer — personalised page |
| **Frontend** | Next.js — Cursor (Kieran) |
| **Backend** | Base44 |
| **URL** | `shortkey.social/[influencer-handle]` |
| **Key features** | Ctrl+Shop UI, curated shop, commission dashboard, live calendar → shortkey.live, tasks, public profile |
| **Design** | Custom palette per influencer within ShortKey system |
| **Data** | Influencer + CampaignInfluencer + CalendarEvent |
| **Aug 14** | MUST BE READY |

### 4. shortkey.store

| | |
|--|--|
| **Purpose** | Consumer Shopping Portal (B2C) |
| **Who** | End consumers |
| **Frontend** | Next.js — Cursor (Kieran) |
| **Backend** | **Shopify DIRECT** (not Base44) |
| **Key features** | Full catalogue (~45 SKUs), TINT try-on, influencer affiliate links, Shopify orders/payments/fulfilment, order sync → Base44 for commissions |
| **Aug 14** | MUST BE READY |

### 5. shortkey.live

Live streaming hub + calendar. Base44 CalendarEvent. **Phase 2** (after Aug 14).

### 6. shortkey.fashion

Tutorial + makeover portal (UGC + official). Base44 + Cloudinary. **Phase 2**.

### 7. shortkey.community

Blog + fan sharing + email alerts. Base44. **Phase 2**.

### 8. shortkey.studio

In-house creative studio (brand service). Base44 + AI image APIs. **Phase 3**.

### 9. shortkey.club

Membership programme. Base44 + payments. **Phase 3**.

### 10. shortkey.events

Promotions + game zone. Base44. **Phase 3**.

### 11. shortkey.world

Global multi-country / i18n. Base44 multi-region. **Phase 4 (2027)**.

### 12. shortkey.wtf

B2C viral / campaign entry. Base44 WTFSubmission. **Phase 2**.

---

## DATA LAYER — SINGLE SOURCE OF TRUTH

| System | Owns |
|--------|------|
| **Base44** | Brands, Campaigns, Influencers, Commissions, Reports, Calendar |
| **Shopify** | Products, Orders, Payments, Fulfilment, Affiliate Links |
| **Cloudinary / Media** | Images, banners, tutorial video |
| **Email** | Community alerts, fan notifications, brand reports |

---

## BUILD RESPONSIBILITY

| Person | Scope |
|--------|--------|
| **Kieran (Cursor)** | shortkey.info, shortkey.social, shortkey.store frontends |
| **Gor Gor (Simpee)** | Base44 API, domain data connections, backend entities, architecture |
| **Kura** | Competitor analysis, QC, portal benchmarking |
| **Senti** | Brand docs, proposal verification, launch materials |

---

## AUGUST 14 LAUNCH — PHASES

### Phase 1 (Must be ready Aug 14)

1. shortkey.beauty — mobile + live  
2. shortkey.info — Brand Portal MVP  
3. shortkey.social — Influencer Portal MVP  
4. shortkey.store — Shopping MVP (Shopify connected)

### Phase 2 (Aug 14 – Sep 30)

shortkey.wtf, shortkey.live, shortkey.fashion, shortkey.community

### Phase 3 (Oct – Dec 2026)

shortkey.studio, shortkey.club, shortkey.events

### Phase 4 (2027)

shortkey.world

---

## API CONNECTION MAP

```
shortkey.beauty  → Base44 (brand inquiry)
shortkey.info    → Base44 (brand dashboard)
shortkey.social  → Base44 (influencer + commission) + Shopify (product display)
shortkey.store   → Shopify DIRECT (orders + checkout) + Base44 (post-purchase commission)
shortkey.live    → Base44 CalendarEvent
shortkey.community → Base44 (posts + fan emails)
shortkey.fashion → Base44 + Cloudinary
shortkey.studio → Base44 + AI APIs
```

---

## SECURITY PRINCIPLE

- Each domain has its own auth layer  
- Brands cannot see influencer-private data  
- Influencers cannot see other influencers’ commissions  
- Consumers see public content only  
- Admin (Kieran) sees everything via 5S Portal  

---

*Document prepared by: Simpee (Gor Gor)*  
*For: Kieran Li — ShortKey Beauty Commerce OS*  
*Node Family — AIIS Architecture*  
*17 July 2026*
