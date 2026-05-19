# Tech Stack

## Adviserve Website — Technology Decisions & Architecture

**Version:** 1.0
**Last Updated:** 2026-04-01

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  React 18    │  │  React Router │  │  Supabase Auth SDK     │  │
│  │  + Vite      │  │  (SPA routing)│  │  (login/logout only)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬─────────────┘  │
│         │                 │                      │                │
│         └─────────────────┼──────────────────────┘                │
│                           │                                      │
│                    fetch('/api/*')                                │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Vercel Edge Functions (api/*.ts)             │    │
│  │                                                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐              │    │
│  │  │ _db.ts   │  │ _auth.ts │  │ CORS +    │              │    │
│  │  │ (Neon    │  │ (JWT     │  │ Rate      │              │    │
│  │  │  client) │  │  verify) │  │ Limiting) │              │    │
│  │  └────┬─────┘  └────┬─────┘  └───────────┘              │    │
│  │       │              │                                    │    │
│  └───────┼──────────────┼────────────────────────────────────┘    │
│          │              │                                        │
└──────────┼──────────────┼────────────────────────────────────────┘
           │              │
           ▼              ▼
┌─────────────────┐  ┌──────────────────┐
│  Neon PostgreSQL │  │  Supabase Auth   │
│  (21 tables)     │  │  (JWT issuer)    │
│  DATABASE_URL    │  │  VITE_SUPABASE_* │
└─────────────────┘  └──────────────────┘
```

**Key architectural decision:** Supabase is used **only for authentication** (login/logout/JWT). All database operations go through Neon PostgreSQL via the Vercel API layer. The browser never talks to Neon directly.

---

## 2. Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.x | UI framework |
| **TypeScript** | 5.9.x | Type safety |
| **Vite** | 5.4.x | Build tool + dev server |
| **React Router** | 6.30.x | Client-side routing (SPA) |
| **Tailwind CSS** | 3.4.x | Utility-first styling |
| **GSAP** | 3.14.x | Scroll animations, parallax, reveals |
| **@gsap/react** | 2.1.x | React hooks for GSAP (`useGSAP`) |
| **Lenis** | 1.3.x | Smooth scroll engine |
| **Framer Motion** | 12.x | AnimatePresence for text cycle animation |
| **Lucide React** | 0.344.x | Icon library |
| **TipTap** | 3.20.x | Rich text editor (admin blog/content) |
| **Recharts** | 3.8.x | Charts for analytics dashboard |
| **React Hot Toast** | 2.6.x | Toast notifications (admin) |
| **React Helmet Async** | 3.0.x | Dynamic `<head>` management (SEO) |
| **DOMPurify** | 3.3.x | HTML sanitization (XSS prevention) |
| **@tanstack/react-query** | 5.95.x | Data fetching + caching (admin) |

---

## 3. Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vercel Edge Functions** | — | Serverless API layer (`api/*.ts`) |
| **Neon PostgreSQL** | Serverless | Primary database (21 tables) |
| **@neondatabase/serverless** | 1.0.x | Neon HTTP driver (tagged templates + `.query()`) |
| **Supabase Auth** | 2.99.x | Authentication only (JWT issuance + verification) |

---

## 4. Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting, CDN, edge functions, auto-deploy from Git |
| **Neon** | Serverless PostgreSQL (connection via `DATABASE_URL`) |
| **Supabase** | Auth service only (free tier) |
| **GitHub** | Source control, CI/CD trigger for Vercel |

---

## 5. Database Schema (21 Tables)

```
┌─────────────────┐     ┌──────────────────────┐
│    services      │     │     blog_posts        │
│ (parent/child)   │     │ (draft/published/     │
│                  │     │  archived)             │
└─────────────────┘     └──────────────────────┘

┌─────────────────┐     ┌──────────────────────┐
│ contact_inquiries│     │     bookings          │
│ (new/in_progress │     │ (pending/confirmed/   │
│  /resolved)      │     │  completed/cancelled) │
└─────────────────┘     └──────────────────────┘

┌─────────────────┐     ┌──────────────────────┐
│ email_subscribers│◄───►│    email_lists        │
│                  │     │                      │
│ email_list_      │     │  email_templates     │
│  subscribers     │     │                      │
│ (junction)       │     │  email_campaigns     │
│                  │     │  email_campaign_     │
│                  │     │   recipients         │
└─────────────────┘     └──────────────────────┘

┌─────────────────┐     ┌──────────────────────┐
│  site_settings   │     │  navigation_menus    │
│  site_assets     │     │  menu_items          │
│  seo_settings    │     │                      │
└─────────────────┘     └──────────────────────┘

┌─────────────────┐     ┌──────────────────────┐
│  website_pages   │     │  legal_documents     │
│  website_content │     │  faq_items           │
└─────────────────┘     └──────────────────────┘

┌─────────────────┐     ┌──────────────────────┐
│  page_analytics  │     │  activity_logs       │
└─────────────────┘     └──────────────────────┘
```

All tables use UUID primary keys, `created_at` / `updated_at` timestamps, and indexed columns for common queries.

---

## 6. API Layer (19 Endpoints)

### Public (no auth)

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|------------|
| GET | `/api/blog` | List published posts | Cache 30s |
| GET | `/api/blog?slug=x` | Single post by slug | Cache 30s |
| GET | `/api/services` | List visible services | Cache 30s |
| GET | `/api/services?slug=x` | Single service with children | Cache 30s |
| GET | `/api/content?page=x` | Page content blocks | Cache 30s |
| GET | `/api/menu` | Navigation menu items | Cache 60s |
| GET | `/api/settings` | Site settings | Cache 60s |
| GET | `/api/legal?slug=x` | Legal document | Cache 60s |
| GET | `/api/logo` | Logo URL + height + brand text | Cache 30s |
| GET | `/api/search?q=x` | Site-wide search | 30/min/IP |
| GET | `/api/newsletter-archive` | Sent campaigns | — |

### Form Submissions (origin-validated, rate-limited)

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|------------|
| POST | `/api/contact` | Contact form | 3/min/IP |
| POST | `/api/subscribe` | Newsletter signup | 5/min/IP |
| POST | `/api/booking` | Consultation booking | 3/10min/IP |
| POST | `/api/analytics` | Page view tracking | 60/min/IP |
| POST | `/api/unsubscribe` | Newsletter unsubscribe | 10/min/IP |

### Admin (JWT + admin email required)

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|------------|
| POST | `/api/admin/crud` | Generic CRUD for all 21 tables | 120/min/user |
| POST | `/api/admin/log` | Activity log entry | — |
| GET | `/api/admin/check` | Verify admin status | — |

---

## 7. Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Vercel (server only) | Neon PostgreSQL connection string |
| `VITE_SUPABASE_URL` | Vercel + `.env.local` | Supabase project URL (client-side) |
| `VITE_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Supabase anonymous key (client-side) |
| `ADMIN_EMAILS` | Vercel (server only) | Comma-separated admin email allowlist |

---

## 8. Dev Tooling

| Tool | Purpose |
|------|---------|
| **ESLint** | Linting (TypeScript rules) |
| **Vitest** | Unit testing |
| **PostCSS + Autoprefixer** | CSS processing |
| **TypeScript** | Type checking (`tsc --noEmit`) |
| **Git** | Version control |
| **Vercel CLI** | Local dev + deployment |

---

## 9. Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Vite + React (not Next.js)** | Simpler SPA architecture, faster builds, no SSR complexity needed for a marketing site |
| **Neon for DB, Supabase for auth only** | Supabase free tier limits (3–4 projects); Neon provides dedicated serverless Postgres without project limits |
| **Edge Functions as API layer** | Prevents direct DB access from browser; enables CORS, rate limiting, auth verification server-side |
| **Single admin CRUD endpoint** | One generic endpoint handles all 21 tables — reduces API surface area, centralizes security |
| **adminDb QueryBuilder** | Drop-in Supabase `.from()` replacement — minimized migration effort from Supabase to Neon |
| **GSAP over CSS-only animations** | Complex scroll-linked animations (parallax, stagger, pinning) require a timeline engine |
| **Base64 file storage in DB** | No external storage dependency; admin uploads are small (logos, favicons < 2MB) |
| **In-memory rate limiting** | Acceptable for edge functions — resets on cold start, but sufficient to prevent burst abuse |
