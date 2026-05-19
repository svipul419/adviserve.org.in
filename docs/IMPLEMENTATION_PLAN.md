# Implementation Plan

## Adviserve Website — What's Done, What's Next

**Version:** 1.0
**Last Updated:** 2026-04-01

---

## 1. Completed Work (v1.0)

### Phase 1: Core Website (Complete)

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | React + Vite + TypeScript project setup | Done |
| 2 | Tailwind CSS configuration with custom design tokens | Done |
| 3 | React Router SPA with all public routes | Done |
| 4 | Homepage with GSAP scroll animations | Done |
| 5 | Services listing + category + detail pages | Done |
| 6 | Blog listing + post detail with rich content | Done |
| 7 | Contact page with form + inline FAQ | Done |
| 8 | About page with story, approach, mission, values | Done |
| 9 | Legal pages (Privacy Policy, Terms & Conditions) | Done |
| 10 | Responsive header with mobile menu | Done |
| 11 | Footer with CMS-configurable content | Done |
| 12 | SEO: meta tags, structured data, canonical URLs | Done |
| 13 | Cookie consent banner with analytics opt-in | Done |

### Phase 2: CMS Admin Panel (Complete)

| # | Deliverable | Status |
|---|-------------|--------|
| 14 | Admin auth (Supabase JWT + server-side email allowlist) | Done |
| 15 | Dashboard with stats + quick actions | Done |
| 16 | Blog CRUD with TipTap rich text editor | Done |
| 17 | Services CRUD with parent/child hierarchy | Done |
| 18 | Contact inquiries management | Done |
| 19 | Navigation menu editor | Done |
| 20 | Page content editors (Home, About, Contact, Footer) | Done |
| 21 | Site settings (logo, favicon, social links, theme) | Done |
| 22 | Email subscriber management | Done |
| 23 | Email lists, templates, campaigns | Done |
| 24 | Legal document editor | Done |
| 25 | SEO management + optimization checker | Done |

### Phase 3: Database Migration (Complete)

| # | Deliverable | Status |
|---|-------------|--------|
| 26 | Migrated from Supabase DB to Neon PostgreSQL | Done |
| 27 | Built secure API layer (19 endpoints) | Done |
| 28 | Created adminDb QueryBuilder (Supabase drop-in replacement) | Done |
| 29 | All admin pages work through API (no direct DB access) | Done |

### Phase 4: Features & Security (Complete)

| # | Deliverable | Status |
|---|-------------|--------|
| 30 | Book a Consultation page (calendar + time picker) | Done |
| 31 | Site-wide search (blog, services, FAQs) | Done |
| 32 | WhatsApp floating widget | Done |
| 33 | Team / Leadership page | Done |
| 34 | FAQ standalone page | Done |
| 35 | Newsletter archive page | Done |
| 36 | Analytics dashboard | Done |
| 37 | Activity log (audit trail) | Done |
| 38 | Booking navigation CTAs across all pages | Done |
| 39 | Admin bookings management page | Done |
| 40 | Comprehensive security audit (3 rounds) | Done |
| 41 | Rate limiting on all endpoints | Done |
| 42 | API versioning (v1 prefix + version header) | Done |
| 43 | XSS/SQLi protection verified with attack testing | Done |
| 44 | CORS, CSRF, CSP, HSTS headers | Done |
| 45 | File upload validation (size, type) | Done |
| 46 | Dependency audit + fixes | Done |

---

## 2. Pending Work (v1.1)

### Priority 1: Immediate Action Required

| # | Task | Owner | Notes |
|---|------|-------|-------|
| P1 | Update WhatsApp number from `919999999999` | Ritu | Edit `src/components/WhatsAppWidget.tsx:3` |
| P2 | Update Team page with real names, titles, photos | Ritu | Via admin or direct edit of `src/pages/Team.tsx` |
| P3 | Upload transparent horizontal logo | Ritu | Via `/admin/settings` — current 300x300 has dark bg |
| P4 | Update `SITE_URL` when custom domain is set | Dev | Edit `src/lib/constants.ts` + all canonical URLs |
| P5 | Add "Book a Call" to header nav | Ritu | Via `/admin/menu` — add menu item with URL `/book` |

### Priority 2: Email Integration

| # | Task | Effort | Requires |
|---|------|--------|----------|
| E1 | Choose email provider (Resend, SendGrid, or Office 365 SMTP) | Decision | Provider credentials |
| E2 | Create `/api/send-email` endpoint | 2 hours | SMTP host, port, from address |
| E3 | Add email notification on new contact inquiry | 1 hour | E2 complete |
| E4 | Add email notification on new booking | 1 hour | E2 complete |
| E5 | Add booking confirmation email to user | 1 hour | E2 complete |
| E6 | Enable newsletter campaign sending | 3 hours | E2 complete |

### Priority 3: Monitoring

| # | Task | Effort | Requires |
|---|------|--------|----------|
| M1 | Setup Sentry error monitoring | 1 hour | Sentry DSN |
| M2 | Add ErrorBoundary Sentry reporting | 30 min | M1 complete |
| M3 | Add API error reporting to Sentry | 30 min | M1 complete |

---

## 3. Future Roadmap (v2.0)

### Content & Engagement

| Feature | Effort | Value |
|---------|--------|-------|
| Blog comments (moderated) | 3 days | Engagement, SEO |
| Resource library (whitepapers, guides) | 2 days | Lead generation |
| Case study detail pages (not just listing) | 2 days | Trust building |
| Client testimonials with photos/logos | 1 day | Social proof |
| Multi-author blog support | 1 day | Content scaling |

### Technical Improvements

| Feature | Effort | Value |
|---------|--------|-------|
| Image CDN (Cloudinary or Vercel Blob) | 2 days | Performance, storage |
| Content revision history | 3 days | Audit trail, rollback |
| Drag-and-drop reorder (services, menu) | 2 days | UX improvement |
| PWA / offline support | 2 days | Mobile experience |
| Image optimization pipeline | 1 day | Core Web Vitals |
| Forgot password flow | 1 day | Admin UX |

### Advanced Features

| Feature | Effort | Value |
|---------|--------|-------|
| Client portal (login, documents, invoices) | 2 weeks | Client retention |
| Calendly/Cal.com integration (replace custom calendar) | 1 day | Better scheduling |
| Multi-language support (Hindi + English) | 1 week | Market reach |
| A/B testing framework | 3 days | Conversion optimization |
| Chatbot / AI assistant | 1 week | 24/7 support |

---

## 4. Development Workflow

### Local Development

```bash
# 1. Clone and install
git clone https://github.com/stratlabsin-byte/Adviserve-Website.git
cd Adviserve-Website
npm install

# 2. Create .env.local with required vars
cp .env.example .env.local
# Edit: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# 3. Start dev server
npm run dev          # Vite dev server on localhost:5173
```

### Build & Deploy

```bash
# Type check
npx tsc --noEmit

# Build
npm run build        # Outputs to dist/

# Deploy (auto via Git push)
git push origin main  # Vercel auto-deploys
```

### Database Changes

```bash
# 1. Write migration file
echo "CREATE TABLE..." > db/migration-v3.sql

# 2. Run against Neon
psql $DATABASE_URL -f db/migration-v3.sql

# 3. Add table to ALLOWED_TABLES in api/admin/crud.ts

# 4. Add TypeScript interface to src/lib/types.ts
```

### Adding a New Public Page

1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx` → `PublicLayout` routes
3. Add `<SEOHead>` with title, description, canonical
4. Add navigation link in footer/menu (via admin or code)

### Adding a New Admin Page

1. Create `src/pages/admin/NewAdminPage.tsx`
2. Add lazy import in `src/App.tsx`
3. Add `<Route>` in admin routes section
4. Add nav item in `src/components/AdminLayout.tsx` → `navSections`

---

## 5. Testing Strategy

### Current

| Type | Tool | Status |
|------|------|--------|
| Type checking | `tsc --noEmit` | Active (0 errors) |
| Build verification | `vite build` | Active |
| Manual security testing | `curl` scripts | Done (SQLi, XSS, auth bypass) |
| Manual stress testing | Concurrent `curl` | Done (20 concurrent requests) |

### Recommended Additions

| Type | Tool | Priority |
|------|------|----------|
| Unit tests (utilities) | Vitest | P2 |
| Component tests (admin forms) | Vitest + Testing Library | P2 |
| E2E tests (booking flow, contact form) | Playwright | P3 |
| API integration tests | Vitest | P2 |
| Visual regression | Playwright screenshots | P3 |
| Lighthouse CI | GitHub Actions | P2 |

---

## 6. Deployment Checklist

Before each production deploy:

- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `npm run build` completes successfully
- [ ] No `.env` or credential files staged
- [ ] New API endpoints have rate limiting
- [ ] New admin endpoints have `verifyAdmin()` check
- [ ] New tables added to `ALLOWED_TABLES` in crud.ts
- [ ] `dangerouslySetInnerHTML` uses `sanitizeHTML()` (never raw)
- [ ] New forms have honeypot fields
- [ ] Responsive tested at 375px and 1440px
- [ ] All links tested (no broken routes)

---

## 7. Key Contacts

| Role | Person | Responsibility |
|------|--------|----------------|
| Founder / Product Owner | Ritu Raj | Feature decisions, content, priorities |
| Development | (AI-assisted) | Implementation, security, deployment |
| Domain / Hosting | Vercel | Auto-deploy, edge functions, CDN |
| Database | Neon | PostgreSQL hosting |
| Auth | Supabase | User authentication |
