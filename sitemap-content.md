# Adviserve — Detailed Content Sitemap

Generated from code. Source files cited per page.
Pages render copy from CMS (Supabase `website_content` table) when present, otherwise from `src/lib/defaults.ts`. The strings below are the defaults that ship in the bundle.

Site URL: `https://adviserve.in`

---

## SEO defaults (Home)
- `meta_title` — *"Adviserve · One firm. Seven disciplines. One standard."*
- `meta_description` — *"Most enterprises buy compliance from one firm, security from another, talent from a third. Adviserve does all of it, to one standard. ISO 9001:2015. ISO/IEC 20000-1. ISO/IEC 27001."*
- `canonical_url` — `https://adviserve.in/`
- `og_image` — `/adviserve-logo.png`

---

## Top navigation (`DEFAULT_MENU_ITEMS`)
1. **Services** → `/services`
2. **Products** → `/products`
3. **Industries** → `/industries`
4. **Insights** → `/insights`
5. **About** → `/about`

Right utility: "Talk to us" pill → `/consultation`. Mobile drawer adds "Book a Consultation" CTA at the bottom.

---

# `/` — HOME *(src/pages/Home.tsx)*

## Hero (Sheet 00 — COVER SHEET)
- **Badge**: `ONE TEAM · SEVEN PRACTICES` → on page rendered as `FRONT DOOR · Q2 2026`
- **H1**: *"Bring us the question"* + rotating last line
- **Rotating tagline (`hero_scramble_phrases`)**:
  - "no vendor will answer."
  - "the auditor will ask."
  - "the board keeps raising."
  - "your spreadsheet cannot solve."
- **Subhead**: *"You are coordinating four vendors and still answering the same questionnaire on a Friday night. Hire one team. One operating standard. One evidence trail across compliance, security, hiring, IT, legal, SaaS and training — so the answer is ready before the question lands."*
- **Ask input** placeholder: `Enter query ▶  e.g. DPDP audit, CISO hire…`
- **Suggestion chips**:
  - Run a DPDP gap analysis
  - Reply to a vendor questionnaire
  - Hire a CISO
  - Modernise our IT estate
- **Trust strip**: `ISO 9001:2015 · ISO/IEC 20000-1 · ISO/IEC 27001`
- **4 Detail cards (DET. A–D)** *(SCALE 1 : 4)*:
  - **A** DPDP Self-Assessment — `Free · 15 min` → `/dpdp-assessment`  · CTA *Know More*
  - **B** Vendor Security Pack — `Send to procurement` → `/services/cybersecurity` · CTA *Cybersecurity*
  - **C** Calibrated Hiring — `Defensible scoring` → `/services/hr-services` · CTA *HR & Staffing*
  - **D** Managed IT Service — `No drift after handoff` → `/services/it-services` · CTA *IT Consulting*

## Sheet 01 — TOP STORIES (paper `#F0F8FF`)
H2: **"Top Stories"** (gradient on `Stories`).
Subhead: *"Case notes and briefings from the practice. Trigger, scope, outcome — written by the people who shipped the work."*

CircularTestimonials carousel (4 items, autoplay 5s):

| Tag | Title | Slug |
|---|---|---|
| CASE NOTE | "How a six-week DPDP audit gave a fintech board its first clean evidence pack" | `/insights/dpdp-evidence-pack` |
| BRIEFING | "From two weeks to two days: rewiring the vendor-questionnaire response loop" | `/insights/vendor-questionnaire-response` |
| CASE NOTE | "CISO search + 90-day onboarding for a 400-person SaaS scale-up" | `/case-studies/saas-ciso` |
| INSIGHT | "Why your IT estate has drifted — and what a 60-day rebuild actually looks like" | `/insights/it-estate-rebuild` |

## Sheet 02 — PRODUCTS (paper `#DBEEFE`)
H2: **"Crafting Audit-Ready Software"** (gradient on `Audit-Ready`).
Subhead: *"Whether you're closing a DPDP gap, defending a hiring decision, or replacing a legacy HRMS — your evidence trail stays tight and your reports stay board-ready."*

CTA pill: *I'm Curious* → `/products`

3 product cards (from `DEFAULT_HOME_PRODUCTS`):

| Product | Slug | Status | Description |
|---|---|---|---|
| **Adviserve People** (HRMS Platform) | `/products/hris-portal` | MVP · EARLY ACCESS | Recruitment-to-retire workflows. ISO 27001-aligned, API-first, role-based access. |
| **Adviserve Hire** (Candidate Screening) | `/products/ats-system` | MVP · EARLY ACCESS | AI-assisted CV parsing. Explainable scoring. Bias-mitigation review layer. |
| **Adviserve Comply** (DPDP Compliance) | `/products/dpdp-compliance` | PILOT · OPEN | Assess, gap-map, remediate, sustain. Plain-language statutory mapping. |

## Sheet 03 — PRACTITIONERS IN ACTION (paper `#BFDDFB`)
H2: **"Practitioners in action"** (gradient on `in action`).
Subhead: *"Engagement notes from real client work. Trigger, scope, outcome — written by the practitioners who shipped the work."*

3 case-study tiles (paginated 2 pages):
- **DPDP audit + fix-list for a 1,200-person fintech** → `/case-studies/fintech-dpdp`
- **CISO search + 90-day onboarding for a SaaS scale-up** → `/case-studies/saas-ciso`
- **IT estate rebuild + managed service for a manufacturer** → `/case-studies/manufacturer-it-rebuild`

## Sheet 04 — INDUSTRIES & SERVICES (paper `#9FC8F7`)
H2: **"Industries and Services"** (gradient on `Services`).
Subhead: *"One operating standard. Many operating contexts. Pick the practice or sector closest to your trigger."*

FeatureCarousel — rotating among:
- Cybersecurity, Compliance & RegTech, HR & Staffing, IT Consulting, Legal Consulting, SaaS Products, Corporate Training.

## Sheet 05 — RESEARCH & INSIGHTS (paper `#7CB1F2`)
H2: **"Research, announcements & thought leadership"** (gradient on `thought leadership`).
Subhead: *"Practitioner-written briefings, case notes, and announcements. Short enough to read between two meetings, sharp enough to act on."*

Articles fed from CMS, with `DEFAULT_BLOG_POSTS` fallback (see Insights section below).

## Sheet 06 — CAREERS (paper `#5A99ED`)
H2: **"Build your future at Adviserve."** (gradient on `future`).
Subhead: *"Senior practitioners across cybersecurity, compliance, IT, hiring, legal, SaaS and training. You own the work, your name signs it, the board reads it. No bait-and-switch staffing."*
CTA: *Explore Careers* → `/careers`

## Sheet 07 — CONNECT (paper `#3D82E7`) — Closing band
H2 (CMS `cta_title`): *"Bring us the question you cannot answer yet."*
Last 2 words receive the gradient.
Body (CMS `cta_description`): *"A DPDP deadline. A board ask on security. A hiring gap that has stayed open four months. An IT estate that has drifted past your control. Thirty minutes. We tell you which practice owns it, what it costs and how soon we can start. No pitch deck."*
Primary CTA: *Talk to us* → `/consultation`
Secondary CTA: *Take the DPDP self-assessment* → `/dpdp-assessment`
Reassurance: *Response in under one business day.*

## LaunchIntro splash (`src/components/LaunchIntro.tsx`)
- Logo center
- Progress meter bottom-center, `INITIALIZING ········ 042%` ticks 0→100
- Footer line: `Cover Sheet · 00 / 07     REV A · 2026`
- Skip button bottom-right
- Auto-dismiss 2.6s, hard cap 3.4s

## Footer (End Sheet 07 / 07)
*(src/components/Footer.tsx)*

- Top dimension callout: `◀ ─── END SHEET · 07 / 07 · DOSSIER CLOSE ── ▶`
- Revision strip: `● 2026 — Rev A — Issue YYYY.MM.DD — Approved ✓`
- Logo wordmark band + hairline rules
- H2: **"End of dossier."** (gradient on `dossier.`)
- Subhead: *"Seven practices. One operating standard. One team behind every sheet."*
- Bottom mark: `◀ ── Folio Closes Here ── ▶`

**Nav columns**
- **01 / Practices**: Cybersecurity · Compliance & RegTech · HR Services · IT Consulting · Legal Consulting · SaaS Products · Corporate Training
- **02 / Products**: Adviserve Comply · Adviserve Hire · Adviserve People
- **03 / Company**: About · Team · Careers · Contact · Industries · Partnerships · Case Studies · Certifications
- **04 / Support**: Insights · DPDP Self-Assessment · FAQ · Trust & Security · Privacy · Terms

**Get in touch band**:
- Phone (default empty, fetched from `company_phone` setting)
- Email (default `info@adviserve.com`)
- Newsletter input + Subscribe button

**Bottom strip**:
- Location pill: `India`
- Social: LinkedIn · Twitter · YouTube · Facebook · Instagram (rendered only when URL env var set)
- © {year} Adviserve · Privacy Policy · Terms of Service
- Back-to-top blue square

**Drafting title-block** bottom-right: `SHEET 07 / 07 · DATE · SECTION · END · ADVISERVE · DOSSIER CLOSE`

---

# `/services` — SERVICES *(src/pages/Services.tsx)*

## Hero (Sheet SVC · COVER SHEET)
- Eyebrow: `What you can hire us for`
- H1: **"Pick the problem we solve first."** (gradient on `we solve first.`)
- Subhead: *"Seven practices, one team. Hire the practice that owns your immediate trigger — the others are already wired in. When your DPDP gap turns into a security gap turns into a hiring gap, nothing falls between cracks."*

## Sticky stack — all 7 practices

| # | Practice | One-line | Description | CTA | Slug |
|---|---|---|---|---|---|
| 01 | Cybersecurity | Reply to the next vendor questionnaire in hours, not weeks. | ISMS, controls, sub-processor list, breach response — answered same-day. | See the security work | `/services/cybersecurity` |
| 02 | Compliance & RegTech | Map your DPDP gaps before the regulator does. | Data inventory, consent log, breach playbook, audit pack in a quarter. | Find your DPDP gaps | `/services/compliance-regtech` |
| 03 | HR & Staffing | Hire someone defensible — who performs in 90 days. | Calibrated shortlists, role-outcome scoring, training closes screening gaps. | Hire someone who delivers | `/services/hr-services` |
| 04 | IT Consulting | Run your IT estate without the drift after handoff. | Runbooks, SLAs, audit trails from day one. | Make IT hold together | `/services/it-services` |
| 05 | Legal Consulting | Counsel who reads the architecture, not just the agreement. | Legal sits inside security, compliance and IT teams. | Talk to counsel who gets it | `/services/legal-consulting` |
| 06 | SaaS Products | Stop renting your compliance, hiring and HR stack. | Three SaaS products — encrypted, role-based, audit-logged. | See what we are building | `/services/saas-products` |
| 07 | Corporate Training | Build people who do the work better next quarter. | Designed against role outcomes, Kirkpatrick L3/L4. | Train for outcomes | `/services/corporate-training` |

## Engagement stages
H2: **"Five stages. No surprises in the invoice."** (gradient on last clause)
- **01 Diagnose** — Map systems, vendors and data flows. You sign before we build.
- **02 Design** — Architecture, RACI, milestones, SLA — documented and approved.
- **03 Build** — Phased rollout. Audit-ready evidence at every gate.
- **04 Run** — Managed service from day one. SLAs, change control, runbooks.
- **05 Transfer** — Your team owns the work and the evidence trail.

## Final CTA (blue gradient close band)
H2: *"Cannot tell which practice owns your problem? Neither could most of our clients on day one."*
Body: *"That is what the call is for. Thirty minutes. We map your trigger to a practice, give you a rough cost and timeline, and say so if you should hire someone else."*
Primary: *Map my problem in 30 minutes* → `/consultation`
Secondary: *See the five stages* → `#engagement`

## `/services/:slug` — SERVICE CATEGORY *(src/pages/ServiceCategory.tsx)*
Per-slug detail content in `DEFAULT_SERVICE_PRACTICES`. Each renders:
- Hero (engineering chrome)
- "The problem we solve" — 3 paragraphs
- "What the engagement looks like" — 4 numbered stages (Legal: 4 engagement modes)
- "What you walk away with" — 4–6 bullets
- "Why this practice, not a generalist" — single paragraph
- Related services chip row
- Final CTA

## `/services/:cat/:slug` — SERVICE DETAIL *(src/pages/ServiceDetail.tsx)*
- Hero (engineering chrome, dynamic title from CMS)
- HTML body content (sanitized)
- Phone + email inline strip
- Lead-capture form

---

# `/products` — PRODUCTS *(src/pages/Products.tsx)*

## Hero (Sheet PRD)
- Eyebrow: `Software you will actually use`
- H1 (CMS `products_hero_title`): **"Stop renting your compliance, hiring and HR stack."** (gradient on `hiring and HR stack.`)
- Subhead: *"Three products on one architecture — encrypted, role-based, audit-logged by default. So you can move on from spreadsheets without paying a consultant every time you want to pull a report."*

## Reference architecture (4-layer vertical stack)
Section eyebrow: `// WHAT YOU ARE BUYING UNDER THE HOOD`
Four layers (encryption · access · audit · integration).

## Product grid
Cards from `DEFAULT_HOME_PRODUCTS` (4 entries — 3 named products + Custom build).

## Final CTA
H2: *"See it on your own data. Not a generic demo."*
Body: *"30 minutes. Bring a sample of your DPDP register, your candidate pipeline or your HR data. We will walk you through the product on your problem — with the team that builds it."*

## `/products/:slug` — PRODUCT DETAIL *(src/pages/ProductDetail.tsx)*
For each of `hris-portal`, `ats-system`, `dpdp-compliance`:
- Hero (engineering chrome) — icon + status pill (e.g. `MVP · EARLY ACCESS`, `PILOT · OPEN`)
- Features list (CheckCircle bullets)
- Architecture / Implementation copy
- ISO alignment callout
- Primary CTA

---

# `/industries` — INDUSTRIES *(src/pages/Industries.tsx)*

## Hero
- Eyebrow: `Work in your sector, not generic`
- H1: **"We have already worked where you operate."** (gradient on `where you operate.`)
- Subhead: *"Security in banking is not security in manufacturing. DPDP in pharma is not DPDP in real estate. The disciplines transfer; the regulators, the auditors and the operating realities do not. Pick your sector below."*

## Industry grid (5 sector cards + 1 CTA card)
| Sector | Body |
|---|---|
| **Financial Services & BFSI** | You are stacked under RBI, SEBI, DPDP and sectoral norms — and your auditor wants evidence next month. Compliance, security and legal engagements move fastest in your shoes. |
| **Manufacturing & Industrial** | Your OT and IT teams answer to different bosses and use different vocabularies. We bring the security posture, IT modernisation and people-capability work into one engagement. |
| **IT, SaaS & Technology Services** | You answer a vendor questionnaire a week and you are still hiring engineers. We handle the evidence pack and the calibrated hires — so your CTO stops being a recruiter. |
| **Real Estate & Infrastructure** | You manage hundreds of contractors, a slow procurement cycle, and compliance debt that compounds quarterly. We absorb the coordination — you keep the projects moving. |
| **Pharma & Life Sciences** | Regulatory documentation, data governance, GxP-adjacent training. We sit alongside your QA team — same evidence formats, same review gates. |
| **CTA card — "Your sector is not listed?"** | Send us a one-line description. We will tell you whether the discipline transfers — and which of our practices fits your operating reality. → `/contact` |

## Final CTA (gradient band)
H2: *"Bring us a sector-specific problem. We bring the standard."*

---

# `/insights` — INSIGHTS *(src/pages/Insights.tsx)*

## Hero
- Eyebrow: `For executives between meetings`
- H1: **"The answer in three paragraphs."** (gradient on `three paragraphs.`)
- Subhead: *"Briefings on DPDP, hiring, security and IT — written so you can read one between two meetings and act on it before the third. No marketing fluff, no fifteen-page whitepapers, no asks at the bottom."*

## Filter bar
Categories: **All · DPDP Watch · Cybersecurity · Talent · Technology · Briefings**
Plus search input.

## Default articles (`DEFAULT_BLOG_POSTS`)
| Title | Slug | Category | Author |
|---|---|---|---|
| How integrated advisory beats best-of-breed vendors | `integrated-advisory-vs-vendors` | Strategy | Adviserve Editorial |
| DPDP Act 2023 — the compliance checklist most founders miss | `dpdp-compliance-checklist` | Legal | Adviserve Legal |
| Recruitment SLAs that actually move pipeline | `recruitment-slas-that-work` | Recruitment | Adviserve Talent |
| Performance management systems for 50-200 person teams | `performance-management-systems` | HR | Adviserve HR |
| The hidden cost of fragmented HR tooling | `fragmented-hr-tooling` | IT | Adviserve IT |
| Series A to Series C — how the HR function should scale | `hr-function-scaling` | Strategy | Adviserve Editorial |

## `/insights/:slug` / `/blog/:slug` — BLOG POST *(src/pages/BlogPost.tsx)*
- Hero (engineering, label `ARTICLE · {category}`)
- Meta row: Back to Blog link · published date · author · `{N} min read`
- HTML body (sanitized via DOMPurify)
- Related articles row (if available)

---

# `/trust` — TRUST *(src/pages/Trust.tsx)*

## Hero
- Eyebrow: `When procurement asks, send this`
- H1: **"Your due-diligence pack, already audited."** (gradient on `already audited.`)
- Subhead: *"Three independent auditors. ISO 9001, ISO/IEC 20000-1, ISO/IEC 27001. Sub-processor list, encryption posture, access logs — one page, current, ready to send."*

## Three certifications
| Code | Title | Body |
|---|---|---|
| **ISO 9001:2015** | Quality Management | Documented processes, decisions, review at every engagement gate. Same standard in month one and month thirty-six. |
| **ISO/IEC 20000-1** | IT Service Management | SLAs, change control, incident protocols, continuous service improvement. Why IT engagements don't end at handoff. |
| **ISO/IEC 27001** | Information Security Management | Risk-based controls, encryption at rest + in transit, role-based access, audit logs, continuous control review. |

## Data handling cards
- **Encryption** — AES-256 at rest. TLS 1.3 in transit.
- **Access** — Role-based, audit-logged.
- **Audit** — Tamper-evident logs, continuous control review.

---

# `/faq` — FAQ *(src/pages/FAQ.tsx)*

## Hero
- Eyebrow: `Before you book the call`
- H1: **"Before you book the call, read the answers first."** (gradient on `read the answers first.`)
- Subhead: *"Engagement model, pricing, certifications, DPDP timing, how we scope. The answers we give procurement teams before they ask."*

## Filter tabs
**All · About Adviserve · Engagements & pricing · Compliance, security, data**
Plus search input.

## Default FAQ items (`DEFAULT_FAQ_DATA`)

### About Adviserve
- *"Adviserve was incorporated in February 2026. How can the firm claim experience?"* — The firm is months old. The work is not. The founders ran training and advisory work across Indian enterprises for the prior decade…
- *"What does 'one operating standard' actually mean?"* — Security reads legal's drafts; compliance reads HR's notes; IT reads security's findings. Every engagement runs documented intake → diagnosis → design → evidence under three ISO certifications.
- *"Do you work outside India?"* — India is the home market. International engagements via partnerships + remote-first delivery.

### Engagements & pricing
*(continued in DEFAULT_FAQ_DATA — 5 more items covering pricing, scoping, SLAs)*

### Compliance, security, data
*(certifications, DPDP timing, data handling questions)*

## Final CTA
*"Still cannot find your answer? Send the question."* → `/contact`

---

# `/careers` — CAREERS *(src/pages/Careers.tsx)*

## Hero
- Eyebrow: `You will talk to these people — not a junior`
- Default H1 (CMS-driven): **"The people who will own your engagement."** (gradient on `own your engagement.`)
- Subhead: *"No bait-and-switch staffing. The senior practitioners you meet on the call are the ones writing your evidence pack, signing the design gate and answering the auditor. Decade of work behind the practice. New firm — same people."*

## Why Adviserve (3 cards)
- **Cross-discipline by design** — Most consulting careers narrow into one practice. Ours don't have to. The disciplines share work, evidence, and review.
- **Audited standards, not slogans** — ISO 9001, ISO 20000-1, ISO 27001 — three certifications that change how we work every day, not just what we put on a slide.
- **Founding-team window** — The firm is months old. The roles being filled now shape what the firm becomes.

## Culture (3 cards)
- **Write things down** — Documentation is delivery, not afterthought.
- **Show the working** — Outputs that can be audited. Decisions that can be traced.
- **Disagree out loud** — Better to argue at the design stage than fix at the deploy stage.

## Open positions (`DEFAULT_CAREERS_POSITIONS`)

| Title | Location | Type | Department |
|---|---|---|---|
| Senior Talent Acquisition Specialist | Remote | Full-time | Recruitment |
| HR Business Partner | Hybrid — Mumbai | Full-time | HR Services |
| Business Strategy Consultant | Remote | Full-time | Business Consulting |
| Corporate Legal Advisor | On-site — Delhi NCR | Full-time | Legal |
| IT Solutions Architect | Hybrid — Bengaluru | Full-time | IT Consulting |

Card click → opens **Application Modal** (Radix Dialog):
- Fields: Name * · Email * · Phone * · LinkedIn URL · Resume upload · Cover note
- Modal header: "Apply Now"
- Submit → POST `/api/apply` (rate-limited)

---

# `/contact` — CONTACT *(src/pages/Contact.tsx)*

## Hero
- Eyebrow: `Contact`
- H1 (CMS `contact_title`): **"Send the question. Get a straight answer in one business day."** (gradient on `one business day.`)
- Subhead: *"Tell us what is on your desk — DPDP deadline, vendor questionnaire, hiring gap, IT estate. A senior practitioner replies inside 24 hours with a straight answer: yes we fit, no we do not, here is what it would cost. Not an SDR. Not a bot."*

## Form fields
Name * · Email * · Phone · Company · Service interest (dropdown from `DEFAULT_SERVICE_OPTIONS`) · Message · Newsletter consent checkbox · Honeypot.
Submit → POST `/api/contact` (rate-limited, Origin-validated).

## Service interest dropdown options
- SaaS Products · Cybersecurity · Compliance & RegTech · HR Services & Staffing · IT Consulting · Legal Consulting · Corporate Training · Not sure yet

## Sidebar
- Direct contact info (phone, email, address from `/api/settings`)
- Business hours: Mon–Fri 9 AM – 6 PM IST · Sat 10 AM – 2 PM IST · Sun closed
- "Or book a slot" CTA → `/consultation`

## Common questions (`DEFAULT_FAQS` — 6 items, abbreviated)
- *How fast can you start?* — Most engagements kick off within 48 hours…
- *Is the initial consultation really free?* — Yes — no strings attached…
- *Can you handle multiple services simultaneously?* — Absolutely. That's our core differentiator…
- *Do you work with startups or only large enterprises?* — Both…
- *What makes Adviserve different from specialised firms?* — Six (now seven) practices under one roof…
- *Do you work only in India?* — Primary in India; supports distributed teams + cross-border compliance.

---

# `/about` — ABOUT *(src/pages/About.tsx)*

## Hero
- Eyebrow: `Why you should care who we are`
- H1: **"You should not have to read four vendor reports to answer one board question."** (gradient on `one board question.`)
- Subhead: *"Hire one team that already shares evidence, decisions, and accountability across seven practices. One operating standard. One answer."*

## 00.02 — Founding rationale (3+ paragraphs)
1. *"You are running a real operation. Your DPDP gap is a legal question, a security question and a hiring question — and right now you are asking three different vendors. Their reports do not align…"*
2. *"Adviserve was built so you stop doing that. One team owns the work across seven practices…"*
3. *(additional paragraphs — see `src/pages/About.tsx` lines 65–95)*

## 00.03 — Holding-company contrast (2 column compare)
- **If you hire four vendors** — fragmented reports, mismatched timelines, three different evidence formats, you become the switchboard.
- **If you hire Adviserve** — one operating standard, one team across seven disciplines, one document for the regulator.

## 00.04 — Operating standard card
**Proof you can hand to procurement.** ISO 9001 / 20000-1 / 27001 callout block + Link to `/trust`.

## Timeline (`DEFAULT_ABOUT_TIMELINE`)
- **2015** Practice Established
- **2020** GECL Award
- **2022** LMS Launch
- **2026** Adviserve Incorporated

## Final CTA (gradient band)
H2: *"You have a problem. We can tell you in 30 minutes whether we fit."*

---

# `/team` — TEAM *(src/pages/Team.tsx)*

## Hero
- Eyebrow: `You will talk to these people — not a junior`
- H1: **"The people who will own your engagement."** (gradient on `own your engagement.`)
- Subhead: *"No bait-and-switch staffing. The senior practitioners you meet on the call are the ones writing your evidence pack, signing the design gate and answering the auditor. Decade of work behind the practice. New firm — same people."*

## Founder card
- **Adviserve Founders** — Founders & Practice Leads
- Bio (2 paragraphs): decade of training+advisory work; firm founded 2026 to remove vendor-coordination tax.

## Practice leads (empty by spec — placeholder bios in `DEFAULT_TEAM_MEMBERS`)
| Name | Role |
|---|---|
| Adviserve Founder | Principal — Advisory |
| Head of People | Practice Lead — HR & Compliance |
| Head of Talent | Practice Lead — Recruitment |
| Head of Legal | Practice Lead — Legal & Compliance |

---

# `/case-studies` — CASE STUDIES *(src/pages/CaseStudies.tsx)*

## Hero
- Eyebrow: `The work, not the pitch`
- H1 (CMS): **"See what a problem like yours looked like — and how it closed."** (gradient on `how it closed.`)
- Subhead: *"Engagement type, trigger, what we built, what changed. No anonymous testimonials. No round numbers. If a metric is here, we will tell you how it was measured."*

## Cards (`DEFAULT_CASE_STUDY_CARDS`)

| Slug | Title | Industry | Practices |
|---|---|---|---|
| `yamaha-servicenow` | Yamaha Motors — ServiceNow rollout, in-house ITSM in under six months. | Automobile | IT Consulting, Corporate Training |
| `grapecity-aws-migration` | GrapeCity — Azure→AWS migration with role-based enablement that halved adoption time. | Software Dev | IT Consulting, Corporate Training |
| `serverguy-dual-skill` | ServerGuy — dual-skill talent model with 85%+ placement of AWS-certified hires. | Consulting | HR Services, Corporate Training |

## `/case-studies/:slug` — CASE STUDY DETAIL *(src/pages/CaseStudyDetail.tsx)*
Renders from `DEFAULT_CASE_STUDIES_DETAIL` per slug.

### Yamaha Motors (`yamaha-servicenow`)
- Eyebrow: `CASE 01 · AUTOMOBILE`
- Subtitle: ServiceNow rollout · in-house ITSM transition
- Metrics: **~150% ROI** · **25% efficiency gain** · **<6 mo time to live**
- Strip: Industry: Automobile manufacturing · Geography: India · Duration: <6 months · Practices: IT Consulting, Corporate Training, ServiceNow · Anchored by: ISO/IEC 20000-1, ISO 9001:2015
- Body: Context · Challenge · Approach · Outcomes
- Quote: *"~150% ROI on the ServiceNow rollout, 25% efficiency gain, and live in under six months. Adviserve made the in-house ITSM transition work."* — **Yamaha Motors · Service Management Lead**

### GrapeCity (`grapecity-aws-migration`)
- Eyebrow: `CASE 02 · SOFTWARE DEV`
- Subtitle: Azure → AWS migration · role-based enablement
- Metrics: **50% Faster adoption** · **4 Role-based tracks** · **High Stakeholder alignment**
- Strip: Software product development · Global · Migration + enablement parallel · IT Consulting, Corporate Training, Cloud · ISO/IEC 20000-1
- Quote: *"Migrating Azure to AWS while training the team in parallel — Adviserve's role-based tracks halved our adoption time…"* — **GrapeCity · Engineering Lead**

### ServerGuy (`serverguy-dual-skill`)
- Eyebrow: `CASE 03 · CONSULTING`
- Subtitle: Dual-skill talent model · AWS sales + technical
- Metrics: **85%+ Placement** · **↓ Recruitment cost** · **↑ Operating agility**

## Final CTA (gradient band)
H2: *"Bring us the question…"*

---

# `/dpdp-assessment` — DPDP SELF-ASSESSMENT *(src/pages/DPDPAssessment.tsx)*

## Intro screen (Sheet DPD)
- Eyebrow: `Find your DPDP exposure in 15 minutes`
- H1: **"Are you ready when the regulator calls?"** (gradient on `the regulator calls?`)
- Subhead: *"Fifteen questions, five domains, fifteen minutes. You will leave with a domain-by-domain score, a prioritised gap list, and a clear view of what to fix first. Anonymous. No sales call attached."*
- Trust badges: **Anonymous by default · Aligned with DPDP Act 2023 · Run inside ISO/IEC 27001-aligned ISMS**
- CTA: *Start the assessment*

## Quiz screen
- 15 questions across 5 domains (Data Inventory · Consent · Breach Response · Grievance · Cross-cutting)
- 4 answer options per question, scored 0–3
- Progress bar + question N of 15

## Result screen
- Domain bar scores
- Overall exposure band (Low / Medium / High)
- Email-the-report capture (optional)
- CTA: *Book a deep-dive call* → `/consultation`

---

# `/partnerships` — PARTNERSHIPS *(src/pages/Partnerships.tsx)*

## Hero
- Eyebrow: `If you build the tools, we bring the demand`
- H1: **"Partner with a firm your clients already trust."** (gradient on `your clients already trust.`)
- Subhead: *"Cloud, security, identity, ATS, LMS — if your platform sits inside one of our seven practices, we are interested. Co-engagements, referral economics, joint roadmaps. Send us your one-liner."*

## Three categories
- **Cloud & Infrastructure** — AWS, Microsoft Azure, Google Cloud. Active across migration, architecture, and capability building.
- **Enterprise Platforms** — ServiceNow, Salesforce, SAP. Implementation and training capability built through real engagements.
- **Learning & Capability** — LMS platform — to be specified.

## Disclaimer / status note
*"Working alongside leading platforms in cloud, enterprise software, and capability. Formal partnership listings to follow as agreements finalise."*

## Final CTA (blue gradient close band)
H2: *"Build with us."*
Body: *"Cloud migration, platform implementation, capability uplift — anchored by audited standards."*
- *Book a consultation* → `/consultation`
- *Talk to the team* → `/contact`

---

# `/book` & `/consultation` — BOOK CONSULTATION *(src/pages/BookConsultation.tsx)*

## Hero
- Eyebrow: `Free Consultation`
- H1: **"Book a free 30-minute consultation."** (gradient on `consultation.`)
- Subhead: *"Pick a date and time that works. We will discuss your business, your challenges, and whether Adviserve is the right fit — with zero obligation."*

## Stepper
**1 Date → 2 Time → 3 Details**

## Calendar (left)
- Month view, weekends disabled, past dates disabled
- IST timezone, default to next business day

## Time slots (left below)
30-min slots from 9:00 AM to 6:00 PM IST, grouped Morning / Afternoon / Evening.

## Your details form (right)
Name * · Email * · Phone · Company · Service Interest (dropdown — Recruitment, HR Services, Corporate Training, Business Consulting, Legal Consulting, IT & Development, Other) · Notes · Honeypot.
Submit → POST `/api/booking`.

## Success screen
- Date + time confirmation
- "We will send a confirmation email…" reassurance

---

# `/privacy` `/terms` `/legal/:slug` — LEGAL DOCUMENTS *(src/pages/LegalDocument.tsx)*

## Hero (Sheet LGL)
- Title from document (`Privacy Policy`, `Terms of Service`, etc.)
- Subtitle: Back to Home link + version + effective date + updated date

## Body
Sanitized HTML rendered into a structured prose block.

---

# `/unsubscribe` — UNSUBSCRIBE *(src/pages/Unsubscribe.tsx)*

Centered card. States:
- **Idle** — input email + Unsubscribe button
- **Loading** — Processing…
- **Success** — "You've been unsubscribed" + Return-to-homepage link
- **Not found** — "Email not found" + retry
- **Error** — "Something went wrong" + retry

---

# `/:slug` — DYNAMIC PAGE *(src/pages/DynamicPage.tsx)*

CMS-driven catch-all pages (e.g. campaign landing pages). Renders:
- Hero (engineering, label `DYNAMIC PAGE`) — title + description from CMS
- HTML body content inside a rounded card

---

# `*` — 404 *(src/pages/NotFound.tsx)*

Centered card. "Page not found" + link home. `robots: noindex, nofollow`.

---

# Site-wide chrome

| Element | File | Notes |
|---|---|---|
| Header / Top nav | `src/components/Header.tsx` + `src/components/ui/InfosysHeaderBar.tsx` | Home · Services · Products · Industries · Insights + About. Talk-to-us pill (blue solid). |
| Mobile nav drawer | `src/components/ui/mobile-nav.tsx` | Slide-in right, primary nav + Book a Consultation CTA at bottom (safe-area padded). |
| Cookie consent | `src/components/CookieConsent.tsx` | Bottom-left toast. Accept (blue solid) + Decline. Stores in localStorage. |
| SVG cursor trail | `src/components/SVGFollowerCursor.tsx` | 3 blue shades (`#0F5594 / #1e9df1 / #00D4FF`). Pointer-fine + motion-OK only. |
| WhatsApp widget | `src/components/WhatsAppWidget.tsx` | Bottom-right (blue). Renders only when `VITE_WHATSAPP_NUMBER` env var set. |
| Back-to-top | `src/components/BackToTop.tsx` | Bottom-right above WhatsApp, blue solid. |
| Footer | `src/components/Footer.tsx` | End Sheet 07/07 — see Home Footer section above. |

---

# Source files index

| Section | File |
|---|---|
| Home defaults | `src/lib/defaults.ts` (`DEFAULT_HOME_CMS`, `DEFAULT_HOME_PRODUCTS`, `DEFAULT_HOME_PRACTICES`) |
| Services list | `src/lib/defaults.ts` (`DEFAULT_SERVICES`, `DEFAULT_SERVICE_PRACTICES`) |
| Case studies | `src/lib/defaults.ts` (`DEFAULT_CASE_STUDY_CARDS`, `DEFAULT_CASE_STUDIES_DETAIL`) |
| Careers | `src/lib/defaults.ts` (`DEFAULT_CAREERS_BENEFITS`, `DEFAULT_CAREERS_CULTURE`, `DEFAULT_CAREERS_POSITIONS`) |
| Industries | `src/lib/defaults.ts` (`DEFAULT_INDUSTRIES`) — and `src/pages/Industries.tsx` hardcoded grid |
| Blog posts | `src/lib/defaults.ts` (`DEFAULT_BLOG_POSTS`) |
| Team members | `src/lib/defaults.ts` (`DEFAULT_TEAM_MEMBERS`) |
| FAQ | `src/pages/FAQ.tsx` (`DEFAULT_FAQ_DATA`) and `src/lib/defaults.ts` (`DEFAULT_FAQS`) |
| About story | `src/lib/defaults.ts` (`DEFAULT_STORY_PARAGRAPHS`, `DEFAULT_APPROACH_STEPS`, `DEFAULT_MISSION_ITEMS`, `DEFAULT_CORE_VALUES`, `DEFAULT_ABOUT_TIMELINE`) |
| Hero stats / Stats strip | `src/lib/defaults.ts` (`DEFAULT_HERO_STATS`, `DEFAULT_ABOUT_STATS`, `DEFAULT_HOME_STATS`) |
| Engineering hero (reusable) | `src/components/sections/EngineeringHero.tsx` |
| Sticky stack | `src/components/sections/StickyFeatureSection.tsx` |
| Blueprint CTA | `src/components/sections/BlueprintCTABand.tsx` |
