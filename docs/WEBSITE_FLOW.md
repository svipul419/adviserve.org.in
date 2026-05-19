# Website Flow

## Adviserve — User Journeys & Page Map

**Version:** 1.0
**Last Updated:** 2026-04-01

---

## 1. Site Map

```
adviserve.com/
├── / ............................ Homepage
├── /services ................... Services listing
│   ├── /services/:slug ......... Service category (parent)
│   └── /services/:cat/:slug .... Service detail (child)
├── /about ...................... About Us
├── /team ....................... Team / Leadership
├── /blog ....................... Blog listing
│   └── /blog/:slug ............. Blog post detail
├── /case-studies ............... Case Studies
├── /careers .................... Careers
├── /contact .................... Contact form + FAQ
├── /book ....................... Book a Consultation (calendar picker)
├── /faq ........................ FAQ standalone page
├── /newsletters ................ Newsletter archive
├── /privacy .................... Privacy Policy
├── /terms ...................... Terms & Conditions
├── /unsubscribe ................ Newsletter unsubscribe
├── /admin/login ................ Admin login
├── /admin ...................... Admin dashboard
│   ├── /admin/bookings ......... Manage bookings
│   ├── /admin/inquiries ........ Manage contact inquiries
│   ├── /admin/analytics ........ Analytics dashboard
│   ├── /admin/blog ............. Blog CRUD
│   ├── /admin/services ......... Services CRUD
│   ├── /admin/menu ............. Navigation menu editor
│   ├── /admin/settings ......... Site settings (logo, social, theme)
│   ├── /admin/seo .............. SEO status
│   ├── /admin/seo-optimization . SEO checker
│   ├── /admin/legal ............ Legal document editor
│   ├── /admin/email-subscribers  Subscriber management
│   ├── /admin/email-lists ...... Email list management
│   ├── /admin/email-templates .. Email template editor
│   ├── /admin/email-campaigns .. Campaign management
│   ├── /admin/edit-home ........ Home page content editor
│   ├── /admin/edit-about ....... About page content editor
│   ├── /admin/edit-contact ..... Contact page content editor
│   ├── /admin/edit-footer ...... Footer content editor
│   ├── /admin/pages ............ Custom page manager
│   ├── /admin/website .......... Content blocks
│   └── /admin/activity-log ..... Audit trail
└── /* .......................... 404 Not Found
```

---

## 2. Primary User Journeys

### Journey 1: "I Need Help" (Lead → Booking)

The primary conversion path for a B2B decision maker.

```
Landing (Homepage)
    │
    ├─ Hero CTA "Talk to Us" ──────────────────► /contact
    │                                               │
    │                                               ├─ Fills contact form
    │                                               │   → Stored in DB
    │                                               │   → Visible in /admin/inquiries
    │                                               │
    │                                               └─ Sees sidebar "Schedule Directly"
    │                                                   → /book
    │
    ├─ "See What We Do" ──► /services
    │   │
    │   └─ Clicks a service ──► /services/:slug
    │       │
    │       ├─ Reads content
    │       │
    │       ├─ Sidebar: "Book a Consultation" ──► /book
    │       │
    │       └─ Bottom: Inline inquiry form
    │           → Stored with service_interest pre-filled
    │
    └─ Bottom CTA "Book a Free Call" ──► /book
        │
        ├─ Selects date on calendar (weekdays only)
        ├─ Selects 30-min time slot (9AM–6PM IST)
        ├─ Fills name, email, phone, company, notes
        └─ Submits → Stored in DB
            → Visible in /admin/bookings
```

### Journey 2: "Research & Return" (Nurture Path)

For researchers who aren't ready to book yet.

```
Landing (Blog, Services, or organic search)
    │
    ├─ Reads blog post ──► /blog/:slug
    │   └─ No aggressive CTA (informational content)
    │
    ├─ Browses services ──► /services
    │   └─ Drills into category ──► /services/:slug
    │       └─ Reads sub-services ──► /services/:cat/:slug
    │
    ├─ Visits About page ──► /about
    │   └─ Bottom CTA: "Book a Free Call" ──► /book
    │
    ├─ Reads FAQ ──► /faq
    │   └─ Bottom: "Contact Us" + "Or book a free call"
    │
    └─ Newsletter subscribe (footer)
        → Email stored in email_subscribers
        → Manageable via /admin/email-subscribers
```

### Journey 3: Admin Content Management

```
Admin login ──► /admin/login
    │
    ├─ Supabase Auth (email + password)
    ├─ JWT token verification
    ├─ Admin email allowlist check (server-side)
    │
    └─ Dashboard ──► /admin
        │
        ├─ Quick stats: services, blog posts, inquiries, subscribers
        ├─ Recent inquiries list
        │
        ├── Content Management ────────────────────────────
        │   ├─ Blog: Create/edit/publish posts (TipTap rich text)
        │   ├─ Services: Manage hierarchy (parent → children)
        │   ├─ Pages: Edit Home, About, Contact, Footer content
        │   └─ Legal: Edit Privacy Policy, Terms & Conditions
        │
        ├── Lead Management ───────────────────────────────
        │   ├─ Inquiries: View, change status, reply externally
        │   ├─ Bookings: View, confirm/cancel, filter by status
        │   └─ Subscribers: View, export, bulk delete
        │
        └── Settings ─────────────────────────────────────
            ├─ Site Settings: Logo, favicon, social links, theme
            ├─ SEO: Meta tags, structured data, sitemap
            ├─ Navigation: Manage header menu items
            └─ Activity Log: Audit trail of all admin actions
```

---

## 3. Navigation Structure

### Header (Desktop)

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] ADVISERVE     Home  Services  About  Blog  Careers     │
│                                          [Search] [Contact]    │
└────────────────────────────────────────────────────────────────┘
```

- Logo + brand text (CMS-configurable)
- Nav items fetched from database (`/api/menu`)
- Search opens full-screen SearchModal
- "Contact" / "Get in touch" button → `/contact`
- Scrolled state: white background with blur

### Header (Mobile)

```
┌──────────────────────────────┐
│ [Logo]              [Burger] │
└──────────────────────────────┘
         ↓ (opens overlay)
┌──────────────────────────────┐
│ Home                    [→]  │
│ Services                [→]  │
│ About                   [→]  │
│ Blog                    [→]  │
│ Careers                 [→]  │
│ ┌──────────────────────────┐ │
│ │      Get in touch        │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

### Footer

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] ADVISERVE                                            │
│ Tagline text (CMS-configurable)                             │
│                                                             │
│ Quick Links       Our Services       Contact Us             │
│ ─────────────     ────────────       ──────────             │
│ Home              HR Advisory        email@adviserve.com    │
│ Services          Recruitment        +91 xxx xxx xxxx       │
│ About             Legal Advisory     Address line 1         │
│ Case Studies      IT Consulting      Address line 2         │
│ Blog              Strategy                                  │
│ Careers           Software Dev       [Newsletter signup]    │
│ Book a Consult                                              │
│ Contact                                                     │
│                                                             │
│ [Facebook] [Twitter] [LinkedIn] [Instagram] [YouTube]       │
│                                                             │
│ © 2026 Adviserve. All rights reserved.                      │
│ Privacy Policy  |  Terms & Conditions                       │
└─────────────────────────────────────────────────────────────┘
```

### Floating Elements

- **WhatsApp Widget** — bottom-right, green circle with pulse animation
- **Cookie Consent** — bottom banner, appears 1.5s after load (if no consent stored)
- **Custom Cursor** — dot + ring, expands on interactive elements (desktop only)

---

## 4. Booking Flow Detail

```
/book (BookConsultation page)
│
├─ Step 1: Select Date
│   ├─ Calendar grid (current + next month)
│   ├─ Weekends disabled (greyed out)
│   ├─ Past dates disabled
│   └─ Selected date highlighted in teal
│
├─ Step 2: Select Time
│   ├─ 30-minute slots: 9:00 AM – 5:30 PM IST
│   ├─ Displayed as grid of buttons
│   └─ Selected slot highlighted
│
├─ Step 3: Fill Details
│   ├─ Name* (required)
│   ├─ Email* (required)
│   ├─ Phone
│   ├─ Company
│   ├─ Service Interest (dropdown)
│   ├─ Notes (textarea)
│   └─ Honeypot field (hidden, anti-spam)
│
└─ Submit
    ├─ POST /api/booking
    ├─ Rate limited: 3 per IP per 10 minutes
    ├─ Stored in `bookings` table
    └─ Success confirmation shown
```

---

## 5. Search Flow

```
User clicks search icon (header) or presses Ctrl+K
│
└─ SearchModal opens (full-screen overlay)
    │
    ├─ Type query (debounced 300ms)
    │   └─ GET /api/search?q={query}
    │       └─ Searches: blog_posts, services, faq_items
    │           using ILIKE (case-insensitive)
    │
    ├─ Results grouped by type:
    │   ├─ Blog Posts → links to /blog/:slug
    │   ├─ Services → links to /services/:slug
    │   └─ FAQs → links to /contact
    │
    ├─ Keyboard navigation:
    │   ├─ ArrowUp/Down to move selection
    │   ├─ Enter to navigate
    │   └─ Escape to close
    │
    └─ No results → "No results found for "{query}""
```

---

## 6. Auth Flow

```
/admin/login
│
├─ Enter email + password
├─ Supabase signInWithPassword()
│   └─ Returns JWT session
│
├─ AuthContext updates:
│   ├─ 1. Check app_metadata.role === 'admin' (fast, local)
│   ├─ 2. If not, call GET /api/admin/check
│   │       └─ Server verifies JWT → checks ADMIN_EMAILS env var
│   └─ Sets isAdmin = true/false
│
├─ AdminAuthGate component:
│   ├─ Loading → spinner
│   ├─ No user → redirect to /admin/login
│   ├─ User but not admin → "Access Denied" + sign out
│   └─ Admin → render admin layout + routes
│
└─ All admin API calls:
    ├─ Include Authorization: Bearer {jwt}
    ├─ Server verifies via Supabase getUser()
    ├─ Checks email against ADMIN_EMAILS
    └─ Returns 401 if invalid
```
