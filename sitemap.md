# Site Map — Adviserve

Generated: 2026-05-13

Production base: `https://adviserve.in`

## 1. Public site (16 top-level routes)

| # | Path                  | Component        | Source file                          | Purpose                                            |
|---|-----------------------|------------------|--------------------------------------|----------------------------------------------------|
| 1 | `/`                   | Home             | src/pages/Home.tsx                   | Landing, hero, six practices, products, FAQ, CTA   |
| 2 | `/about`              | About            | src/pages/About.tsx                  | Story, approach, mission, values                   |
| 3 | `/services`           | Services         | src/pages/Services.tsx               | Services index (6 practices)                       |
| 4 | `/products`           | Products         | src/pages/Products.tsx               | Product listing (People · Hire · Comply)           |
| 5 | `/blog`               | Blog             | src/pages/Blog.tsx                   | Insights & resources                               |
| 6 | `/case-studies`       | CaseStudies      | src/pages/CaseStudies.tsx            | Engagement results                                 |
| 7 | `/team`               | Team             | src/pages/Team.tsx                   | Founder + practice leads                           |
| 8 | `/careers`            | Careers          | src/pages/Careers.tsx                | Open roles + culture                               |
| 9 | `/contact`            | Contact          | src/pages/Contact.tsx                | Form + business hours                              |
| 10 | `/book`              | BookConsultation | src/pages/BookConsultation.tsx       | Calendar + intake form                             |
| 11 | `/faq`               | FAQ              | src/pages/FAQ.tsx                    | Full FAQ with category filter                      |
| 12 | `/testimonials`      | Testimonials     | src/pages/Testimonials.tsx           | Client quotes                                      |
| 13 | `/newsletters`       | NewsletterArchive| src/pages/NewsletterArchive.tsx      | Past editions                                      |
| 14 | `/privacy`           | LegalDocument    | src/pages/LegalDocument.tsx          | Privacy policy                                     |
| 15 | `/terms`             | LegalDocument    | src/pages/LegalDocument.tsx          | Terms of service                                   |
| 16 | `/dpdp-assessment`   | DPDPAssessment   | src/pages/DPDPAssessment.tsx         | Free DPDP self-assessment tool                     |

## 2. Dynamic public routes (slug-driven)

| Path pattern               | Component         | Source file                       |
|----------------------------|-------------------|-----------------------------------|
| `/services/:slug`          | ServiceCategory   | src/pages/ServiceCategory.tsx     |
| `/services/:category/:slug`| ServiceDetail     | src/pages/ServiceDetail.tsx       |
| `/products/:slug`          | ProductDetail     | src/pages/ProductDetail.tsx       |
| `/blog/:slug`              | BlogPost          | src/pages/BlogPost.tsx            |
| `/case-studies/:slug`      | CaseStudyDetail   | src/pages/CaseStudyDetail.tsx     |
| `/legal/:slug`             | LegalDocument     | src/pages/LegalDocument.tsx       |
| `/:slug`                   | DynamicPage       | src/pages/DynamicPage.tsx         |
| `*` (catch-all)            | NotFound          | src/pages/NotFound.tsx            |
| `/unsubscribe`             | Unsubscribe       | src/pages/Unsubscribe.tsx         |

## 3. Admin panel (`/admin/*` — auth-gated)

| Path                       | Component               | Purpose                          |
|----------------------------|-------------------------|----------------------------------|
| `/admin/login`             | Login                   | Supabase auth                    |
| `/admin` / `/admin/dashboard` | Dashboard            | KPI overview                     |
| `/admin/website`           | WebsiteManagement       | Top-level site settings          |
| `/admin/menu`              | MenuManagement          | Nav menu CRUD                    |
| `/admin/services`          | ServicesManagement      | Services CRUD                    |
| `/admin/products`          | ProductsManagement      | Products CRUD                    |
| `/admin/case-studies`      | CaseStudiesManagement   | Case studies CRUD                |
| `/admin/edit-careers`      | CareersEditor           | Careers CMS                      |
| `/admin/blog`              | BlogManagement          | Blog posts CRUD                  |
| `/admin/inquiries`         | Inquiries               | Contact form leads               |
| `/admin/email-subscribers` | EmailSubscribers        | Newsletter list                  |
| `/admin/email-lists`       | EmailLists              | List segmentation                |
| `/admin/email-templates`   | EmailTemplates          | Reusable templates               |
| `/admin/email-campaigns`   | EmailCampaigns          | Campaign send                    |
| `/admin/pages`             | PageManagement          | Dynamic pages CRUD               |
| `/admin/seo`               | SEOManagement           | Meta tags                        |
| `/admin/seo-optimization`  | SEOOptimization         | Audit + suggestions              |
| `/admin/legal`             | LegalDocuments          | Legal docs CRUD                  |
| `/admin/settings`          | SiteSettings            | Company info, env                |
| `/admin/edit-home`         | HomePageEditor          | Home content                     |
| `/admin/edit-about`        | AboutPageEditor         | About content                    |
| `/admin/edit-contact`      | ContactPageEditor       | Contact content                  |
| `/admin/edit-footer`       | FooterEditor            | Footer CMS                       |
| `/admin/edit-faq`          | FAQEditor               | FAQ items                        |
| `/admin/edit-team`         | TeamEditor              | Team members                     |
| `/admin/edit-blog`         | BlogPageEditor          | Blog page chrome                 |
| `/admin/edit-case-studies` | CaseStudiesEditor       | CS page chrome                   |
| `/admin/analytics`         | AnalyticsDashboard      | GA / events                      |
| `/admin/bookings`          | Bookings                | Calendar bookings                |
| `/admin/applications`      | Applications            | Career apps                      |
| `/admin/dpdp-assessments`  | DPDPAssessments         | DPDP submissions                 |
| `/admin/activity-log`      | ActivityLog             | Audit trail                      |
| `/admin/visibility`        | VisibilityManager       | Section visibility flags         |

## 4. Information architecture

```
/                       (Home — hero + 6 practices + products + FAQ + CTA)
├── /about              (Story, mission, values)
├── /services
│   ├── /services/recruitment
│   ├── /services/hr-services
│   ├── /services/corporate-training
│   ├── /services/business-consulting
│   ├── /services/legal-consulting
│   └── /services/it-services
├── /products
│   ├── /products/hris-portal           (Adviserve People)
│   ├── /products/ats-system            (Adviserve Hire)
│   └── /products/dpdp-compliance       (Adviserve Comply)
├── /case-studies
│   └── /case-studies/:slug
├── /blog
│   └── /blog/:slug
├── /team
├── /careers
├── /testimonials
├── /newsletters
├── /faq
├── /dpdp-assessment            (Free DPDP self-assessment tool)
├── /contact
├── /book                       (Free consultation booking)
├── /privacy                    (Legal)
├── /terms                      (Legal)
└── /legal/:slug                (Other legal docs)
```

## 5. API endpoints (Vercel serverless — under `/api/`)

| Endpoint               | Method | Purpose                          |
|------------------------|--------|----------------------------------|
| `/api/content`         | GET    | Page CMS content by slug         |
| `/api/services`        | GET    | Service list                     |
| `/api/products`        | GET    | Product list                     |
| `/api/blog`            | GET    | Blog posts                       |
| `/api/case-studies`    | GET    | Case studies                     |
| `/api/job-positions`   | GET    | Open roles                       |
| `/api/team-members`    | GET    | Team list                        |
| `/api/legal/:slug`     | GET    | Legal document                   |
| `/api/menu`            | GET    | Navigation menu                  |
| `/api/footer-settings` | GET    | Footer CMS                       |
| `/api/site-settings`   | GET    | Global settings                  |
| `/api/inquiries`       | POST   | Contact form submit              |
| `/api/bookings`        | POST   | Consultation booking             |
| `/api/applications`    | POST   | Career application               |
| `/api/dpdp-assessment` | POST   | DPDP assessment submit           |
| `/api/email-subscribe` | POST   | Newsletter signup                |
| `/api/unsubscribe`     | POST   | Email unsubscribe                |
| `/api/admin/*`         | Auth   | Admin CRUD (Supabase JWT)        |

## 6. SEO sitemap.xml (production)

`https://adviserve.in/sitemap.xml` — generated at build time from the 16 public routes above plus dynamic slugs from CMS.
