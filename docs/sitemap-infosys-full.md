# Sitemap — Infosys.com (full website)

End-to-end reference of every top-level route + the typical subsections under each.
Based on public infosys.com IA. Order = nav order + crawl order.

```
/  (Homepage — see sitemap-infosys-home.md)
```

## 1. Navigate your next  →  `/navigate-your-next`

- Hero (kinetic banner)
- Operating context (3-paragraph essay)
- Building blocks
  - Infosys Topaz (link →)
  - Infosys Cobalt (link →)
  - Infosys Aster (link →)
- Live by Design
- Featured stories / industry plays
- Final CTA

## 2. Services  →  `/services`

### 2.1 Service categories
- Application Services
- Artificial Intelligence Services
- Blockchain
- Business Process Management (BPM)
- Cloud (Infosys Cobalt)
- Cyber Security
- Data Analytics
- Digital Marketing
- Digital Process Automation
- Engineering Services
- Enterprise Agile DevOps
- Experience Transformation
- Generative AI
- IoT / Edge
- Microsoft Business Application Services
- Oracle Services
- SAP
- Salesforce
- ServiceNow
- Sustainability
- Talent Solutions
- Workplace Transformation

Each `/services/<slug>` has:
- Hero (challenge framed)
- Capability tiles
- Featured client outcomes
- Related insights
- CTA

## 3. Industries  →  `/industries`

- Aerospace & Defense
- Agriculture
- Airlines
- Automotive
- Banking
- Capital Markets
- Communication, Telecom OEMs
- Consumer Packaged Goods
- Education
- Energy — Oil & Gas
- Engineering Procurement Construction
- Healthcare
- High Technology
- Hi-tech & Engineering
- Insurance
- Life Sciences
- Logistics & Distribution
- Manufacturing
- Media, Entertainment & Publishing
- Mining
- Public Services
- Retail
- Travel & Hospitality
- Utilities

Each `/industries/<slug>` has the same template (hero · sector context · solutions · stories · CTA).

## 4. Products & Platforms  →  `/services/digital-platforms`

- Infosys Topaz (AI)  →  `/services/artificial-intelligence/topaz`
- Infosys Cobalt (Cloud)  →  `/services/cloud-cobalt`
- Infosys Aster (Marketing) →  `/services/aster`
- Infosys Equinox
- Finacle (banking suite)
- Infosys Helix (insurance)
- Infosys Wingspan (learning)
- Infosys McCamish (life insurance)
- EdgeVerve products

## 5. Insights  →  `/insights`

- Featured editorial (long-form)
- Filter by industry / service / topic / type (`Article`, `Whitepaper`, `Case Study`, `Report`)
- Infosys Knowledge Institute → `/iki`
  - Research areas
  - Latest reports
  - Newsletter signup
  - Knowledge Institute leadership
- Podcasts
- Webinars / events
- Bank Tech Index (quarterly index)
- AI Radar / sector indices

## 6. Client Stories  →  `/client-stories`  (`/case-studies`)

- Filterable grid by industry / service
- Each story: client name · challenge · approach · outcome · metrics · quote

## 7. About Us  →  `/about`

- 7.1 `Company Overview`  →  `/about/company-overview`
- 7.2 `Vision & Mission`
- 7.3 `Leadership`  →  `/about/leadership`
  - Board of Directors
  - Executive leadership team
- 7.4 `Corporate Governance`  →  `/investors/corporate-governance`
- 7.5 `Awards & Recognition`  →  `/about/awards-and-recognition`
- 7.6 `History`  →  `/about/history`
- 7.7 `Subsidiaries`
- 7.8 `Locations / Offices`  →  `/about/locations`
- 7.9 `Sustainability` (ESG)  →  `/sustainability`
  - Environment
  - Social
  - Governance
  - Reports (annual ESG)
- 7.10 `Diversity, Equity & Inclusion`
- 7.11 `Infosys Foundation`
- 7.12 `Springboard` (digital literacy)
- 7.13 `Newsroom` / `Press Releases`  →  `/newsroom`
- 7.14 `Brand Guidelines`

## 8. Investors  →  `/investors`

- Filings (annual reports, quarterly results)
- Financial highlights
- Stock information
- Investor calendar / events
- Analyst coverage
- Investor presentations
- Corporate governance docs
- Shareholder services
- Contact IR

## 9. Careers  →  `/careers`

- Why Infosys
- Life at Infosys
- Locations & roles search → `/careers/jobs`
- Campus hiring
- Returnship / experienced hire
- Diversity & inclusion in hiring
- Apply / login

## 10. Infosys Knowledge Institute  →  `/iki`  (top-nav item)

- Themes (AI, Cloud, Cybersecurity, ESG, Talent, Tech Navigator)
- Reports & Research
- Multimedia (Knowledge Capsules, podcasts)
- Authors / Researchers
- Subscribe

## 11. Ask AI  →  modal / `/ask-ai`

- Conversational search interface
- Suggestion chips
- Conversation history
- Citation panel

## 12. Contact Us  →  `/contact-us`

- Form (inquiry type, region, message)
- Direct emails for IR, PR, vendor, partner, legal
- Office locator map

## 13. Legal & policy  (footer)

- Privacy Statement  →  `/privacy-policy`
- Cookie Policy  →  `/cookie-policy`
- Terms of Use
- Disclaimer
- Anti-bribery
- Quality Policy
- ISMS / Security Policy
- Modern Slavery Statement
- Accessibility Statement
- Sitemap (the actual XML/HTML sitemap)
- Investors disclosures

## 14. Persistent footer (every page)

Columns:

1. **Services** — Top-level service links (10–12 items)
2. **Industries** — Top-level industry links (10–12 items)
3. **Products** — Topaz, Cobalt, Aster, Finacle, Equinox, EdgeVerve
4. **About** — Company, Sustainability, Newsroom, Investors, Careers
5. **Insights** — Latest article, IKI homepage, Bank Tech Index, Podcasts
6. **Contact / Social** — Contact, location list, LinkedIn, X, YouTube, Facebook, Instagram

Below columns:
- Country selector
- Legal links row (Privacy / Cookies / Terms / Disclaimer / Sitemap)
- Copyright `© Infosys Limited`

---

## Implementation notes if mapping Adviserve onto this

| Infosys | Adviserve equivalent |
|---|---|
| Topaz, Cobalt, Aster | Adviserve Comply, Adviserve Hire, Adviserve People |
| 23 Service categories | 7 practices (Cybersecurity, Compliance & RegTech, HR & Staffing, IT Consulting, Legal Consulting, SaaS Products, Corporate Training) |
| 24 Industries | 5 industries listed (BFSI, Manufacturing, IT/SaaS, Real Estate, Pharma) |
| Investors section | N/A (private) — drop or replace with `Trust & Certifications` |
| Knowledge Institute | Insights + DPDP Self-Assessment + briefings |
| Ask AI | Hero ask-anything input → `/consultation` |
| Newsroom | Blog / Press (could fold into Insights) |
| Springboard / Foundation | N/A — Adviserve doesn't have CSR programs yet |
| Bank Tech Index | DPDP Watch (recurring briefing) — equivalent recurring research |
