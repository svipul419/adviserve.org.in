-- Migration: CMS tables for Products, Case Studies, and Job Positions
-- Run this in Neon console or via psql

-- ═══════════════════════════════════════════
-- TABLE: products
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon TEXT DEFAULT 'users',
  problem_title TEXT,
  problem_body TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  differentiators JSONB DEFAULT '[]'::jsonb,
  pricing_tiers JSONB DEFAULT '[]'::jsonb,
  cta_title TEXT,
  cta_description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- TABLE: case_studies
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  timeline TEXT,
  practices JSONB DEFAULT '[]'::jsonb,
  client_name TEXT,
  client_description TEXT,
  challenge TEXT,
  work_sections JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '[]'::jsonb,
  integration_quote TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- TABLE: job_positions
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS job_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'Full-time',
  department TEXT,
  description TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- SEED: products
-- ═══════════════════════════════════════════
INSERT INTO products (title, slug, subtitle, description, icon, problem_title, problem_body, features, differentiators, pricing_tiers, cta_title, cta_description, seo_title, seo_description, sort_order)
VALUES
(
  'Adviserve People',
  'hris-portal',
  'HR management built by the consultants who actually do HR.',
  'Adviserve People is the HRIS built from 8 years of running HR operations for Indian businesses. Employee data, attendance, payroll, compliance, and performance — in one clean platform designed for how Indian companies actually work.',
  'users',
  'The HR software problem nobody talks about.',
  'Most HRIS platforms were built for American or European companies and retrofitted for India. The compliance modules are an afterthought. PF and ESI calculations break. State-wise labour law checklists don''t exist. And when you hit a real HR problem — a termination dispute, a POSH complaint, a multi-state compliance audit — the software gives you a help article and wishes you luck. Adviserve People is different because it was built by the people who handle these situations every day.',
  '[{"title":"Employee Database & Self-Service","description":"Centralised employee records with self-service access for payslips, leave, and policies."},{"title":"Attendance & Leave Management","description":"Biometric integration, geo-fencing, shift scheduling, and configurable leave policies."},{"title":"Payroll with Statutory Compliance","description":"PF, ESI, PT, TDS auto-calculated. Multi-state compliant payroll runs in one click."},{"title":"Performance Management","description":"Goal setting, OKRs, 360-degree feedback, and performance review cycles."},{"title":"Compliance Dashboard","description":"State-wise labour law checklists, renewal reminders, and audit-ready documentation."},{"title":"Onboarding & Offboarding","description":"Automated workflows for joining formalities, document collection, and exit processes."},{"title":"Document Management","description":"Offer letters, contracts, NDAs generated from templates and stored securely."},{"title":"Reports & Analytics","description":"Headcount, attrition, leave patterns, payroll costs — all in real-time dashboards."}]'::jsonb,
  '[{"title":"India-first architecture","description":"Built for Indian labour law, not adapted from a global product."},{"title":"Consultant-designed templates","description":"Every template and workflow created by Adviserve HR consultants from real engagements."},{"title":"One-click advisory escalation","description":"Connect directly with an Adviserve HR consultant when the software can''t answer your question."},{"title":"No feature bloat","description":"Clean interface, fast setup, features that match your stage."}]'::jsonb,
  '[{"name":"Starter","price":"Free","period":"forever","description":"Up to 50 employees","features":["Core HR & Database","Leave & Attendance","Employee Self-Service"],"highlighted":false},{"name":"Growth","price":"INR 49/employee/month","period":"monthly","description":"50-500 employees","features":["Everything in Starter","Payroll & Compliance","Performance Management","2 hrs/month advisory"],"highlighted":true},{"name":"Enterprise","price":"Custom","period":"annual","description":"500+ employees","features":["Everything in Growth","Custom Workflows & API","8 hrs/month advisory","Dedicated support"],"highlighted":false}]'::jsonb,
  'See it in action.',
  'Book a 20-minute demo with our product team.',
  'Adviserve People | HRIS Portal for Indian Businesses',
  'India-first HRIS with payroll, compliance, attendance, and performance management. Built by HR consultants. Free for up to 50 employees.',
  1
),
(
  'Adviserve Hire',
  'ats-system',
  'Applicant tracking built by the recruiters who placed 3,000+ professionals.',
  'Adviserve Hire is the ATS designed from real recruitment workflows — not hypothetical ones. Track candidates, schedule interviews, collaborate with hiring managers, and make offers. All in one place.',
  'target',
  'Spreadsheets don''t scale. Generic ATS tools don''t fit.',
  'You start with a spreadsheet. Then someone loses track of a candidate. Then a hiring manager forgets to give feedback. Then you realise you have no idea what your time-to-fill actually is. So you buy an ATS. But it was built for American tech companies. The job board integrations are wrong. The workflows assume you have a dedicated recruiting ops team. And the pricing assumes Silicon Valley budgets. Adviserve Hire was built for how Indian companies actually recruit.',
  '[{"title":"Multi-Board Job Posting","description":"Post to Naukri, LinkedIn, Internshala, Foundit, and your careers page from one screen."},{"title":"Candidate Pipeline","description":"Kanban and list views. Drag candidates through custom stages."},{"title":"Resume Parsing & AI Screening","description":"Automatic resume parsing with AI-powered screening scores."},{"title":"Interview Scheduling","description":"Calendar sync with Google and Outlook. Candidates self-schedule."},{"title":"Scorecards & Collaborative Evaluation","description":"Structured interview scorecards for consistent, comparable feedback."},{"title":"Offer Management","description":"Generate offer letters from templates, track approvals, send for e-signature."},{"title":"Hiring Analytics","description":"Time-to-fill, source effectiveness, pipeline conversion, interviewer throughput."},{"title":"Careers Page Builder","description":"Branded, mobile-optimised careers page that embeds on your website."},{"title":"Candidate Communication","description":"Email and WhatsApp templates for every stage with automated status updates."}]'::jsonb,
  '[{"title":"Indian job market native","description":"Naukri, Foundit, Internshala integrations built-in. WhatsApp communication."},{"title":"3,000+ placements of learning","description":"Every workflow and screening criterion comes from real recruitment experience."},{"title":"Recruiter escalation","description":"One click turns your ATS pipeline into an Adviserve recruitment engagement."},{"title":"Assessment library included","description":"Competency-based assessments for common roles included."}]'::jsonb,
  '[{"name":"Starter","price":"Free","period":"forever","description":"Up to 5 active jobs","features":["Candidate Pipeline","Resume Parsing","Interview Scheduling","Basic Analytics"],"highlighted":false},{"name":"Professional","price":"INR 2,999/month","period":"monthly","description":"Up to 25 active jobs","features":["Everything in Starter","AI Screening","Advanced Analytics","Job Board Integrations"],"highlighted":true},{"name":"Agency","price":"Custom","period":"annual","description":"Unlimited jobs","features":["Everything in Professional","Multi-Client Support","White-Label Option","Candidate Ownership Rules"],"highlighted":false}]'::jsonb,
  'See how fast hiring can be.',
  'Book a 20-minute demo.',
  'Adviserve Hire | ATS for Indian Companies & Recruitment Agencies',
  'Applicant tracking system built by recruiters. Naukri integration, AI screening, WhatsApp communication. Free for up to 5 active jobs.',
  2
),
(
  'Adviserve Comply',
  'dpdp-compliance',
  'DPDP compliance made simple. Built for Indian SMEs.',
  'The Digital Personal Data Protection Act is law. Most businesses don''t know where to start. Adviserve Comply gives you a compliance assessment, auto-generated documents, and ongoing monitoring — without hiring a lawyer or spending lakhs.',
  'shield',
  'DPDP compliance doesn''t have to cost lakhs or take months.',
  'The Digital Personal Data Protection Act 2023 is mandatory. Penalties run up to Rs. 250 crore. But here''s the reality for most Indian SMEs: lawyers want Rs. 50,000+ just for a privacy policy review. Enterprise compliance tools assume you have a legal department. Government guidance documents read like they were written to confuse you. Adviserve Comply is different — built by the legal and compliance team that advises businesses on Indian data protection every day.',
  '[{"title":"Free DPDP Assessment","description":"Interactive 50-question evaluation. Get a scored report with prioritised gaps in 10 minutes."},{"title":"Compliance Report & Roadmap","description":"Step-by-step roadmap with critical issues, 30-day timelines, and estimated effort."},{"title":"Privacy Policy Generator","description":"Answer 10 questions, get a complete DPDP-compliant privacy policy. Download as PDF or DOCX."},{"title":"Consent Form Builder","description":"DPDP-compliant consent forms that embed directly on your website."},{"title":"DPA Generator","description":"Pre-filled Data Processing Agreements for 50+ popular vendors."},{"title":"Incident Response Playbook","description":"72-hour breach notification checklist, templates, and recovery steps."},{"title":"Monthly Compliance Monitor","description":"Monthly status review, new DPDP updates, action items, and deadline tracking."},{"title":"Expert Support","description":"Email support (4-hour response), live chat, 50+ knowledge base articles."}]'::jsonb,
  '[{"title":"Advisory-backed","description":"Every template and recommendation comes from Adviserve''s legal practice."},{"title":"India-first, SME-first","description":"Designed from the ground up for Indian businesses with 10-5,000 employees."},{"title":"Plain language, not legal jargon","description":"Every report explains what to do and why in language your team can act on."},{"title":"One-click legal escalation","description":"Connect directly with an Adviserve legal advisor — no separate engagement."},{"title":"Always current","description":"As government rules evolve, the tool updates automatically."}]'::jsonb,
  '[{"name":"Free","price":"Rs. 0","period":"forever","description":"Assessment + basic report","features":["DPDP Assessment","Compliance Report","Privacy Policy Preview","Community Forum"],"highlighted":false},{"name":"Premium","price":"Rs. 8,000/month","period":"monthly","description":"Full document generation","features":["Everything in Free","Privacy Policy Generator","Consent Form Builder","DPA Generator","Incident Response Playbook","Monthly Monitoring","Email Support (4-hr)"],"highlighted":true},{"name":"Enterprise","price":"Rs. 20,000/month","period":"annual","description":"Dedicated support + audits","features":["Everything in Premium","Dedicated Account Manager","Quarterly Compliance Audits","Custom Rules","API Access","Priority Support (2-hr)"],"highlighted":false}]'::jsonb,
  'Get your DPDP compliance score in 10 minutes.',
  'No credit card. No signup required for the assessment.',
  'Adviserve Comply | DPDP Compliance Tool for Indian SMEs',
  'DPDP compliance assessment, document generation, and monitoring for Indian businesses. Free assessment. Premium from Rs. 8,000/month.',
  3
);

-- ═══════════════════════════════════════════
-- SEED: case_studies
-- ═══════════════════════════════════════════
INSERT INTO case_studies (title, slug, industry, timeline, practices, client_name, client_description, challenge, work_sections, results, integration_quote, seo_title, seo_description, sort_order)
VALUES
(
  'How a fintech startup hired 68 engineers in 90 days — with 97% still on board a year later.',
  'fintech-recruitment',
  'Fintech',
  '90 days',
  '["Recruitment", "HR Services"]'::jsonb,
  'Series B Fintech Company',
  'A Series B fintech company building a payments platform. 85 employees. Needed to triple their engineering team before a major product launch.',
  'The company had been hiring through three separate recruitment agencies for six months. Results were poor: 40% of offers were being rejected, time-to-fill averaged 52 days, and two engineers had already left within their first 90 days.',
  '[{"practice":"Recruitment","actions":["Mapped 340 passive candidates in Bengaluru fintech talent landscape","Redesigned interview process: structured 4-stage pipeline with competency scorecards","Built employer brand narrative around product mission and engineering culture","Negotiated compensation benchmarking using cross-industry placement data"]},{"practice":"HR Services","actions":["Designed 30-60-90 day onboarding programme before first hire started","Created competency framework matching hiring criteria to performance expectations","Set up HRIS for incoming team documentation, compliance, and probation reviews"]}]'::jsonb,
  '[{"metric":"Time-to-fill","before":"52 days","after":"18 days"},{"metric":"Offer acceptance rate","before":"60%","after":"91%"},{"metric":"Engineers hired","before":"12 (6 months)","after":"68 (90 days)"},{"metric":"12-month retention","before":"83%","after":"97%"}]'::jsonb,
  'Because recruitment and HR worked as one team, every hire landed into a structured onboarding experience from day one. No handoff gaps. No lost context. The result was not just speed — it was retention.',
  'Fintech Recruitment Case Study | Adviserve',
  'How Adviserve helped a fintech startup hire 68 engineers in 90 days with 97% retention through integrated recruitment and HR advisory.',
  1
),
(
  'From zero HR infrastructure to a compliant, scalable people function in 12 weeks.',
  'ecommerce-hr-transformation',
  'E-Commerce',
  '12 weeks',
  '["HR Services", "Legal Consulting", "Corporate Training"]'::jsonb,
  'D2C Beauty Brand',
  'A D2C beauty brand that had grown from 15 to 220 employees in 18 months. Revenue was scaling, but the people infrastructure had not kept up.',
  'No formal HR function. Payroll PF errors for 3 consecutive months. No POSH Internal Committee. No written policies. Employee data in spreadsheets across 4 Google accounts. Two offices in different states with different labour law requirements.',
  '[{"practice":"HR Services","actions":["Designed and documented 22 HR policies","Set up HRIS for centralised employee data, leave management, and payroll","Fixed 3 months of payroll errors and set up compliant PF, ESI, PT processing","Designed performance management cycle: quarterly OKRs with annual reviews"]},{"practice":"Legal Consulting","actions":["Constituted POSH Internal Complaints Committee","Drafted employment contracts for all 220 employees","Conducted multi-state compliance audit across Maharashtra and Delhi","Handled existing POSH complaint through proper legal process"]},{"practice":"Corporate Training","actions":["Conducted mandatory POSH awareness training for all employees","Ran management training for 14 newly promoted team leads"]}]'::jsonb,
  '[{"metric":"HR policies documented","before":"0","after":"22"},{"metric":"Payroll accuracy","before":"~85%","after":"100%"},{"metric":"POSH compliance","before":"Non-compliant","after":"Fully compliant"},{"metric":"Employee contracts signed","before":"~30%","after":"100%"},{"metric":"State-wise compliance gaps","before":"11 violations","after":"0"}]'::jsonb,
  'Having legal, HR, and training work together meant we solved the root cause, not just the symptom. The POSH complaint was handled properly while the underlying infrastructure was built simultaneously.',
  'E-Commerce HR Transformation Case Study | Adviserve',
  'How Adviserve built a compliant HR function from scratch for a 220-person D2C brand in 12 weeks across HR, legal, and training.',
  2
),
(
  'A manufacturing company with 8 factories, 14 labour law violations, and 60 days to fix all of them.',
  'manufacturing-compliance',
  'Manufacturing',
  '60 days',
  '["Legal Consulting", "HR Services"]'::jsonb,
  'Auto Parts Manufacturer',
  'A mid-size auto parts manufacturer with 8 factories across 4 Indian states. 1,800 employees including 600+ contract workers.',
  'A routine government inspection uncovered 3 labour law violations. An internal audit across all 8 facilities revealed 14 total violations including expired Factories Act registrations, missing contract labour licences, incorrect overtime calculations, and no POSH committees at 5 facilities.',
  '[{"practice":"Legal Consulting","actions":["Deployed 4-person legal team across 4 states simultaneously","Prioritised violations by penalty risk: criminal liability first","Filed overdue registrations and renewals across all states","Rectified overtime calculations and processed back-pay for affected workers","Constituted POSH Internal Committees at all 5 non-compliant facilities","Created compliance calendar with automated renewal reminders"]},{"practice":"HR Services","actions":["Audited all contract staffing arrangements for compliance","Implemented statutory register maintenance through HRIS","Set up centralised compliance dashboard for real-time status across all facilities"]}]'::jsonb,
  '[{"metric":"Labour law violations","before":"14","after":"0"},{"metric":"Facilities fully compliant","before":"3 of 8","after":"8 of 8"},{"metric":"POSH committees constituted","before":"3 of 8","after":"8 of 8"},{"metric":"Contract labour agreements compliant","before":"2 of 5","after":"5 of 5"},{"metric":"Estimated penalty exposure eliminated","before":"Rs. 28 lakh","after":"Rs. 0"}]'::jsonb,
  'A law firm would have written a memo. We fixed the factories. Having legal and HR with shared context meant we fixed the legal exposure and the operational root cause at the same time.',
  'Manufacturing Compliance Case Study | Adviserve',
  'How Adviserve resolved 14 labour law violations across 8 factories in 4 states within 60 days through integrated legal and HR advisory.',
  3
),
(
  'How a healthcare company used all six practices to prepare for Series C and a 5-city expansion.',
  'healthcare-integrated-advisory',
  'Healthcare',
  '6 months',
  '["Recruitment", "HR Services", "Legal Consulting", "Business Consulting", "Corporate Training", "IT Consulting"]'::jsonb,
  'Healthtech Company',
  'A healthtech company operating diagnostic labs and an at-home sample collection platform. 400 employees in Mumbai. Series B funded. Preparing for Series C while expanding to 4 new cities.',
  'Attempting two massive initiatives simultaneously with fragmented vendor support. One in-house HR manager, an external law firm with 3-week turnaround, a recruitment agency that could not fill healthcare roles, and an IT team of 4 already overwhelmed.',
  '[{"practice":"Business Consulting","actions":["Developed 5-city expansion financial model and investor-ready growth narrative"]},{"practice":"Recruitment","actions":["Hired 210 employees across 5 cities: phlebotomists, lab technicians, city managers, sales leads, and operations staff"]},{"practice":"HR Services","actions":["Designed multi-city HR operating model with standardised policies","Set up payroll processing in 4 new states","Implemented HRIS for centralised employee management"]},{"practice":"Legal Consulting","actions":["Registered legal entities in 4 new states","Drafted 210+ employment contracts","Ensured healthcare regulatory compliance in each city","Prepared compliance documentation for investor due diligence"]},{"practice":"Corporate Training","actions":["Trained 45 phlebotomists on standardised sample collection protocols","Ran POSH training across all 5 cities","Conducted management training for 12 new city operations managers"]},{"practice":"IT Consulting","actions":["Extended lab information management system for multi-city operations","Set up secure data synchronisation between collection points and labs","Implemented cybersecurity controls for investor due-diligence requirements"]}]'::jsonb,
  '[{"metric":"Cities operational","before":"1","after":"5 (on schedule)"},{"metric":"Employees hired","before":"400","after":"610 (210 new)"},{"metric":"Time to first patient (new city)","before":"N/A","after":"6 weeks average"},{"metric":"Compliance issues in due diligence","before":"N/A","after":"0"},{"metric":"Series C fundraise","before":"Target","after":"Closed (oversubscribed)"},{"metric":"CEO vendor coordination","before":"20 hrs/week","after":"2 hrs/week"}]'::jsonb,
  'One account lead. One weekly meeting. One Slack channel. The CEO went from spending 20 hours a week coordinating vendors to spending 2 hours reviewing our shared dashboard.',
  'Healthcare Integrated Advisory Case Study | Adviserve',
  'How Adviserve used all six practices to help a healthtech company close Series C and expand to 5 cities in 6 months.',
  4
);

-- ═══════════════════════════════════════════
-- SEED: job_positions
-- ═══════════════════════════════════════════
INSERT INTO job_positions (title, location, type, department, description, sort_order)
VALUES
('Senior Talent Acquisition Specialist', 'Remote', 'Full-time', 'Recruitment', 'Lead end-to-end recruitment for enterprise clients across technology and healthcare. Manage candidate pipelines, conduct competency assessments, and maintain our 96% retention standard.', 1),
('HR Business Partner', 'Hybrid (Mumbai)', 'Full-time', 'HR Services', 'Embed with client organisations to drive HR transformation. Conduct workforce audits, design org structures, and implement performance management systems.', 2),
('Business Strategy Consultant', 'Remote', 'Full-time', 'Business Consulting', 'Work with founders and leadership teams to define strategy, build growth roadmaps, and optimise operations. Clients range from Series A startups to established mid-market enterprises.', 3),
('Corporate Legal Advisor', 'On-site (Delhi NCR)', 'Full-time', 'Legal', 'Advise on Indian labour law compliance, employment contracts, POSH, and corporate governance across multiple states. Manage statutory registrations and represent clients in dispute resolution.', 4),
('IT Solutions Architect', 'Hybrid (Bengaluru)', 'Full-time', 'IT Consulting', 'Design cloud infrastructure, lead digital transformation projects, and architect technology solutions across AWS, Azure, and GCP for enterprise clients.', 5);
