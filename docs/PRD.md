# Product Requirements Document (PRD)

## Adviserve — Full-Service Advisory Firm Website

**Version:** 1.0
**Last Updated:** 2026-04-01
**Owner:** Ritu Raj, Founder

---

## 1. Product Overview

Adviserve is a B2B full-service advisory firm providing HR, recruitment, legal, business strategy, IT, and software development services. The website serves as the primary digital presence — generating leads, establishing credibility, and providing a CMS-powered admin panel for content management.

### Vision

A premium, editorial-quality website that positions Adviserve as a trusted, modern advisory partner. Every element — from scroll animations to content structure — communicates competence, reliability, and professionalism.

### Target Audience

| Segment | Description |
|---------|-------------|
| **Primary** | Founders, CXOs, and HR leaders at startups and mid-market companies (10–500 employees) seeking outsourced advisory services |
| **Secondary** | Enterprise procurement teams evaluating consulting partnerships |
| **Tertiary** | Job seekers exploring Adviserve's career opportunities |

---

## 2. Business Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Generate qualified consultation bookings | Bookings per month via `/book` |
| G2 | Capture inbound leads via contact form | Contact form submissions per month |
| G3 | Build email subscriber base for nurture campaigns | Subscriber growth rate |
| G4 | Establish thought leadership via blog content | Blog page views, time-on-page |
| G5 | Enable non-technical content management | Admin panel adoption (content updates/week) |

---

## 3. User Personas

### Persona 1: "Decision Maker" (Primary)

- **Role:** CEO/CHRO at a 50-person startup
- **Need:** Needs to outsource HR and legal compliance quickly
- **Behavior:** Visits 2–3 advisory firm websites, reads service pages, checks case studies, books a call within one session
- **Pain point:** Doesn't want to fill out a form and wait 48 hours — wants to pick a time slot

### Persona 2: "Researcher" (Secondary)

- **Role:** Operations Manager tasked with vendor evaluation
- **Behavior:** Reads blog posts, downloads nothing, bookmarks the site, returns via email newsletter
- **Pain point:** Needs detailed service breakdowns and proof of expertise

### Persona 3: "Admin" (Internal)

- **Role:** Adviserve marketing/ops team member
- **Behavior:** Logs into CMS weekly to update blog posts, manage inquiries, adjust site content
- **Pain point:** Needs a simple admin panel — no coding required

---

## 4. Feature Requirements

### 4.1 Public Website

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F1 | Homepage with hero, services overview, stats, testimonials, CTA | P0 | Done |
| F2 | Services listing page with category/sub-service hierarchy | P0 | Done |
| F3 | Individual service detail pages with rich content | P0 | Done |
| F4 | Blog listing with category filter, search, featured posts | P0 | Done |
| F5 | Blog post detail with structured data, related posts | P0 | Done |
| F6 | Contact page with form, FAQ, business hours, map placeholder | P0 | Done |
| F7 | Book a Consultation page with calendar date/time picker | P0 | Done |
| F8 | About page with story, approach, mission, values, stats | P0 | Done |
| F9 | Team / Leadership page | P1 | Done |
| F10 | Careers page | P1 | Done |
| F11 | Case Studies page | P1 | Done |
| F12 | FAQ standalone page with category tabs | P1 | Done |
| F13 | Newsletter Archive page | P2 | Done |
| F14 | Legal documents (Privacy Policy, Terms & Conditions) | P0 | Done |
| F15 | Site-wide search (blog, services, FAQs) | P1 | Done |
| F16 | WhatsApp floating widget | P1 | Done |
| F17 | Cookie consent banner with analytics opt-in | P0 | Done |
| F18 | Unsubscribe page for newsletter | P1 | Done |
| F19 | Custom 404 page | P2 | Done |

### 4.2 Design & UX

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| D1 | Dark editorial theme (default) with serif headings, mono accents | P0 | Done |
| D2 | Light clean theme (alternate) with rounded pill nav | P0 | Done |
| D3 | Theme switching via admin panel | P1 | Done |
| D4 | GSAP scroll animations (hero entrance, parallax, stagger reveals) | P1 | Done |
| D5 | Lenis smooth scroll integration | P1 | Done |
| D6 | Custom cursor with interactive hover states | P2 | Done |
| D7 | Animated text cycle in hero ("We RECRUIT / CONSULT / TRAIN") | P1 | Done |
| D8 | Responsive design (mobile-first, lg breakpoint for desktop) | P0 | Done |
| D9 | Skeleton/shimmer loading states on all pages | P1 | Done |

### 4.3 Admin CMS Panel

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| A1 | Dashboard with stats cards, quick actions, recent inquiries | P0 | Done |
| A2 | Blog management (CRUD, rich text editor, publish/draft/archive) | P0 | Done |
| A3 | Services management (CRUD, parent/child hierarchy, icons) | P0 | Done |
| A4 | Contact inquiries management (status workflow, delete) | P0 | Done |
| A5 | Bookings management (status, filter, pagination) | P0 | Done |
| A6 | Navigation menu management (drag-reorder, visibility toggle) | P1 | Done |
| A7 | Page content editor (Home, About, Contact, Footer) | P1 | Done |
| A8 | Site settings (logo, favicon, brand text, social links) | P0 | Done |
| A9 | Email subscriber management (list, export, bulk delete) | P1 | Done |
| A10 | Email lists, templates, campaigns management | P2 | Done |
| A11 | Legal documents editor | P1 | Done |
| A12 | SEO management (meta tags, structured data) | P1 | Done |
| A13 | SEO optimization checker | P2 | Done |
| A14 | Analytics dashboard (page views, sessions, referrers) | P1 | Done |
| A15 | Activity log (audit trail of admin actions) | P1 | Done |
| A16 | Page manager (custom pages) | P2 | Done |
| A17 | Content blocks / website management | P2 | Done |

### 4.4 Security & Infrastructure

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| S1 | JWT-based admin authentication via Supabase Auth | P0 | Done |
| S2 | Server-side admin email allowlist (ADMIN_EMAILS env var) | P0 | Done |
| S3 | CORS domain allowlist (not wildcard) | P0 | Done |
| S4 | CSRF origin validation on all POST endpoints | P0 | Done |
| S5 | Rate limiting on all API endpoints | P0 | Done |
| S6 | SQL injection prevention (parameterized queries + identifier sanitization) | P0 | Done |
| S7 | XSS prevention (DOMPurify with strict tag/attribute whitelist) | P0 | Done |
| S8 | Security headers (HSTS, X-Frame-Options, CSP, Referrer-Policy) | P0 | Done |
| S9 | Honeypot fields on public forms | P1 | Done |
| S10 | API versioning (v1 prefix + X-API-Version header) | P1 | Done |
| S11 | File upload validation (2MB limit, type whitelist, base64 storage) | P0 | Done |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Largest Contentful Paint < 2.5s, Time to Interactive < 3.5s |
| **Accessibility** | All interactive elements min 44x44px touch target, keyboard navigable, ARIA labels |
| **SEO** | Structured data (Organization, Service, BlogPost, FAQ, Breadcrumb schemas) |
| **Browser Support** | Chrome, Firefox, Safari, Edge (last 2 versions) |
| **Mobile** | Fully responsive, tested at 320px–1440px+ |
| **Uptime** | 99.9% via Vercel edge network |
| **GDPR** | Cookie consent banner, newsletter unsubscribe, no third-party tracking without consent |

---

## 6. Out of Scope (v1)

| Feature | Reason |
|---------|--------|
| Multi-language / i18n | Single market (India) for now |
| Payment processing | Advisory engagements are offline contracts |
| User accounts / client portal | Not needed for v1; future consideration |
| Real-time chat | WhatsApp widget serves this purpose |
| Email sending (SMTP/SendGrid) | Planned for v2 — requires SMTP credentials |
| Error monitoring (Sentry) | Planned for v2 — requires Sentry DSN |
| Image CDN / optimization | Images stored as base64 or external URLs for now |

---

## 7. Success Metrics

| Metric | Target (Month 1) | Target (Month 6) |
|--------|-------------------|-------------------|
| Consultation bookings | 5/month | 25/month |
| Contact form submissions | 10/month | 50/month |
| Email subscribers | 50 | 500 |
| Blog posts published | 4 | 24 |
| Admin panel weekly logins | 3 | 5 |
| Organic search traffic | Baseline | 3x baseline |
