-- Add parent_id column to services table for hierarchical services
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE services ADD COLUMN parent_id uuid REFERENCES services(id) ON DELETE SET NULL;
    CREATE INDEX idx_services_parent_id ON services(parent_id);
  END IF;
END $$;

-- Clear existing services and insert fresh data
DELETE FROM services;

-- ==========================================
-- PARENT SERVICES (5 verticals)
-- ==========================================

INSERT INTO services (id, title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
-- 1. End-to-End Recruitment
('a0000001-0000-0000-0000-000000000001', 'End-to-End Recruitment', 'recruitment',
 'From sourcing to onboarding — permanent, contract, and RPO recruitment across all levels and industries. Pre-vetted talent pipelines, behavioural assessments, and a 96% retention guarantee.',
 '🎯',
 '<p>India''s talent market moves fast. Open roles cost you revenue every day they stay unfilled — and a bad hire costs 3x their annual salary.</p><p>Adviserve''s recruitment practice combines pre-vetted talent pipelines, behavioural science-backed assessments, and embedded delivery teams to fill roles faster, with candidates who stay. We''ve placed 3,000+ professionals across 25+ industries with a 96% 12-month retention rate.</p><h3>Our Recruitment Services Include:</h3><ul><li>Executive Search & CXO Hiring</li><li>Bulk & Volume Recruitment</li><li>Contract & Temporary Staffing</li><li>Recruitment Process Outsourcing (RPO)</li><li>Campus Hiring & Graduate Programs</li><li>Employer Branding & EVP Development</li><li>Pre-employment Assessments & Background Verification</li></ul>',
 true, 1, NULL),

-- 2. End-to-End HR Services
('a0000002-0000-0000-0000-000000000002', 'End-to-End HR Services', 'hr-services',
 'Complete HR lifecycle management — from policy design and payroll to performance management and employee engagement. Fractional CHRO services for companies that need senior HR leadership without a full-time hire.',
 '👥',
 '<p>Most growing companies hit an HR wall between 50 and 500 employees. Policies are ad-hoc, compliance is patchy, payroll is a monthly nightmare, and there''s no formal performance framework.</p><p>Adviserve''s HR practice gives you enterprise-grade people operations — either as a fully outsourced function or as specialist support alongside your existing team. We''ve set up HR functions from scratch for startups and redesigned them for 5,000-person enterprises.</p><h3>Our HR Services Include:</h3><ul><li>HR Policy Design & Employee Handbook</li><li>Payroll Management & Statutory Compliance</li><li>Performance Management System Design</li><li>Employee Engagement & Retention Programs</li><li>Learning & Development Programs</li><li>HR Technology & HRIS Implementation</li><li>Fractional CHRO / HR-as-a-Service</li><li>Organisation Design & Restructuring</li></ul>',
 true, 2, NULL),

-- 3. Business Consulting
('a0000003-0000-0000-0000-000000000003', 'Business Consulting', 'business-consulting',
 'Strategic and operational consulting to help businesses scale profitably. Market entry strategy, process optimisation, financial restructuring, and change management — backed by data and delivered by practitioners.',
 '📊',
 '<p>Strategy without execution is a deck gathering dust. We don''t just advise — we embed with your team to implement.</p><p>Our business consultants have operating experience across manufacturing, technology, healthcare, FMCG, and financial services. We help you find growth, fix operations, and build the systems that let you scale without breaking.</p><h3>Our Business Consulting Services Include:</h3><ul><li>Business Strategy & Growth Planning</li><li>Market Research & Competitive Analysis</li><li>Process Optimisation & Operational Efficiency</li><li>Financial Restructuring & Cost Optimisation</li><li>Change Management & Transformation</li><li>M&A Advisory & Due Diligence Support</li><li>New Market Entry Strategy</li><li>Performance Dashboarding & KPI Frameworks</li></ul>',
 true, 3, NULL),

-- 4. Legal Consulting
('a0000004-0000-0000-0000-000000000004', 'Legal Consulting', 'legal-consulting',
 'Indian corporate and employment law advisory — labour law compliance, contract drafting, regulatory filings, POSH compliance, and dispute resolution. Certified corporate lawyers with pan-India practice.',
 '⚖️',
 '<p>Indian labour and corporate law is notoriously complex — 29 central labour laws (now consolidating into 4 codes), state-specific variations, and constantly evolving compliance requirements.</p><p>A single oversight can result in penalties, litigation, or reputational damage. Our legal practice provides practical, business-friendly legal counsel that keeps you compliant without slowing you down.</p><h3>Our Legal Services Include:</h3><ul><li>Labour Law Compliance</li><li>Employment Contract Drafting & Review</li><li>POSH Compliance & ICC Setup</li><li>Statutory Registrations & Regulatory Filings</li><li>Vendor & Service Agreement Drafting</li><li>Intellectual Property Advisory</li><li>Corporate Governance & Board Advisory</li><li>Dispute Resolution & Litigation Support</li></ul>',
 true, 4, NULL),

-- 5. IT Services & Consulting
('a0000005-0000-0000-0000-000000000005', 'IT Services & Consulting', 'it-services',
 'Technology consulting, digital transformation, and IT infrastructure services. Cloud migration, cybersecurity, custom software development, and IT staffing — for businesses that need technology to work harder.',
 '💻',
 '<p>Technology should accelerate your business — not hold it back. Yet most Indian mid-market companies are running on outdated infrastructure, vulnerable to cyber threats, and drowning in manual processes.</p><p>Our IT practice brings enterprise-grade technology solutions to companies of all sizes — without enterprise-grade complexity or cost. We advise, implement, and manage — so you get results, not just recommendations.</p><h3>Our IT Services Include:</h3><ul><li>IT Strategy & Digital Transformation</li><li>Cloud Infrastructure (AWS, Azure, GCP)</li><li>Cybersecurity Assessment & Implementation</li><li>Custom Software & Application Development</li><li>IT Staffing & Team Augmentation</li><li>ERP & CRM Implementation</li><li>Data Analytics & Business Intelligence</li><li>IT Infrastructure Management & Support</li></ul>',
 true, 5, NULL);

-- ==========================================
-- CHILD SERVICES - RECRUITMENT (7)
-- ==========================================

INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('Executive Search & CXO Hiring', 'executive-search',
 'Confidential, research-driven search for C-suite, VP, and director-level leaders who transform organisations.',
 '👔',
 '<h2>Overview</h2><p>Finding a CXO isn''t a job posting exercise — it''s a research assignment. Our executive search practice identifies, evaluates, and secures senior leaders through discreet, research-led methodology. We map the leadership landscape in your industry, approach passive candidates through trusted relationships, and assess cultural fit alongside competence.</p><h2>What We Deliver</h2><ul><li>Dedicated search consultant with sector expertise</li><li>Market mapping and talent landscape reports</li><li>Psychometric and leadership style assessments</li><li>Confidential approach to passive candidates</li><li>Compensation benchmarking and offer negotiation</li><li>6-month replacement guarantee on all placements</li></ul><h2>Who It''s For</h2><p>Companies hiring CEOs, CFOs, CTOs, CHROs, VPs, General Managers, and Board-level appointments. Average timeline: 6–10 weeks from mandate to accepted offer.</p>',
 true, 1, 'a0000001-0000-0000-0000-000000000001'),

('Bulk & Volume Recruitment', 'bulk-recruitment',
 'Hire 50 to 500+ people in compressed timelines without sacrificing quality or candidate experience.',
 '📋',
 '<h2>Overview</h2><p>Scaling fast means hiring fast — but volume should never compromise quality. Our bulk recruitment engine handles high-volume drives across manufacturing, retail, BPO, logistics, and technology.</p><h2>What We Deliver</h2><ul><li>Dedicated sourcing cell (3–10 recruiters depending on volume)</li><li>Multi-channel sourcing: job boards, social, referrals, walk-in drives</li><li>Assessment centre design and execution</li><li>Offer management and onboarding coordination</li><li>Real-time hiring dashboards with funnel metrics</li><li>Quality controls: minimum 90% probation pass rate</li></ul><h2>Who It''s For</h2><p>Companies opening new facilities, entering new markets, seasonal scaling, or backfilling high-attrition roles. Average throughput: 50–100 hires per month.</p>',
 true, 2, 'a0000001-0000-0000-0000-000000000001'),

('Contract & Temporary Staffing', 'contract-staffing',
 'Flexible workforce solutions — skilled professionals on contract, on your timeline, fully compliant.',
 '📄',
 '<h2>Overview</h2><p>Not every role needs a permanent hire. Our contract staffing model gives you access to pre-vetted professionals for project-based work, maternity cover, seasonal peaks, or trial-before-hire scenarios. We handle payroll, compliance, and all statutory obligations.</p><h2>What We Deliver</h2><ul><li>Contract-to-hire and pure contract models</li><li>Payroll management including PF, ESI, PT, and gratuity</li><li>Full statutory compliance across Indian states</li><li>Replacement guarantee within 7 working days</li><li>Monthly performance reports and feedback loops</li></ul><h2>Who It''s For</h2><p>IT companies, startups needing flexible scaling, companies covering maternity/long leave, or project-based resource needs. Typical duration: 3–12 months.</p>',
 true, 3, 'a0000001-0000-0000-0000-000000000001'),

('Recruitment Process Outsourcing (RPO)', 'rpo',
 'We become your recruitment department — managing everything from sourcing to onboarding at a predictable cost.',
 '🏢',
 '<h2>Overview</h2><p>RPO isn''t just outsourcing — it''s upgrading your entire recruitment capability. Our RPO model embeds dedicated Adviserve recruiters into your organisation who operate as your internal talent acquisition team.</p><h2>What We Deliver</h2><ul><li>Dedicated recruitment pod (2–8 recruiters) embedded in your team</li><li>ATS implementation and workflow optimisation</li><li>Employer branding and candidate experience design</li><li>Hiring manager training and calibration sessions</li><li>Monthly business reviews with SLA tracking</li><li>Scalable model: ramp up or down based on hiring volume</li></ul><h2>Who It''s For</h2><p>Companies hiring 50+ people per year who want to reduce cost-per-hire, improve quality, and build a predictable talent pipeline. Typical engagement: 12 months with quarterly reviews.</p>',
 true, 4, 'a0000001-0000-0000-0000-000000000001'),

('Campus Hiring & Graduate Programs', 'campus-hiring',
 'Build your future talent pipeline through structured campus engagement, assessments, and graduate onboarding programs.',
 '🎓',
 '<h2>Overview</h2><p>The best talent gets snapped up on campus before they ever hit a job board. Our campus hiring practice helps you identify, engage, and secure top graduates from Tier 1, 2, and 3 institutions across India.</p><h2>What We Deliver</h2><ul><li>Campus strategy and institution shortlisting</li><li>Employer branding for campus audiences</li><li>Online and in-person assessment centre design</li><li>Pre-joining engagement programs to reduce drop-offs</li><li>Graduate onboarding and induction program design</li></ul><h2>Who It''s For</h2><p>Companies building management trainee pipelines, engineering hiring from campuses, or establishing employer brand at institutions. Typical cycle: 3–6 months.</p>',
 true, 5, 'a0000001-0000-0000-0000-000000000001'),

('Employer Branding & EVP Development', 'employer-branding',
 'Attract top talent before they even see a job posting — through a compelling employer brand and Employee Value Proposition.',
 '⭐',
 '<h2>Overview</h2><p>In a market where top candidates choose employers (not the other way around), your employer brand is your most powerful recruitment tool. We help you define, articulate, and amplify what makes your company a great place to work.</p><h2>What We Deliver</h2><ul><li>Employer brand audit (internal perception vs. external reality)</li><li>Employee Value Proposition (EVP) framework</li><li>Glassdoor, LinkedIn, and careers page optimisation</li><li>Employee testimonial and content strategy</li><li>Candidate experience audit and redesign</li></ul><h2>Who It''s For</h2><p>Companies struggling to attract quality applicants, losing offers to competitors, or seeing high early-stage attrition. Typical engagement: 8–12 weeks.</p>',
 true, 6, 'a0000001-0000-0000-0000-000000000001'),

('Pre-employment Assessments & Background Verification', 'pre-employment-assessments',
 'Make data-driven hiring decisions with validated assessments and thorough background checks — reducing mis-hires by up to 60%.',
 '🔍',
 '<h2>Overview</h2><p>Resumes lie. Interviews are biased. The only way to truly predict job performance is through structured, validated assessments combined with rigorous background verification.</p><h2>What We Deliver</h2><ul><li>Psychometric assessments (personality, motivation, work style)</li><li>Cognitive ability and aptitude testing</li><li>Technical skill assessments (coding, domain-specific)</li><li>Behavioural interview guides and scorecards</li><li>Background verification: education, employment, criminal, address</li><li>Assessment analytics and hiring insights dashboard</li></ul><h2>Who It''s For</h2><p>Any company wanting to reduce mis-hires or meet compliance requirements for background checks. Turnaround: assessments within 24 hours, BGV within 5–7 working days.</p>',
 true, 7, 'a0000001-0000-0000-0000-000000000001');

-- ==========================================
-- CHILD SERVICES - HR SERVICES (8)
-- ==========================================

INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('HR Policy Design & Employee Handbook', 'policy-design',
 'Clear, compliant, and practical HR policies that employees actually read — tailored to your industry, size, and culture.',
 '📝', '<h2>Overview</h2><p>Policies aren''t paperwork — they''re the operating system of your company. We design comprehensive policy frameworks that balance legal compliance with your company culture.</p><h2>What We Deliver</h2><ul><li>Full policy audit for gaps and compliance</li><li>Employee handbook (20–40 policies)</li><li>Leave policy design (state-specific compliance)</li><li>Anti-harassment and POSH policy</li><li>Remote work and hybrid work policy</li><li>Policy rollout plan and acknowledgement process</li></ul><h2>Who It''s For</h2><p>Startups with no formal policies, companies expanding to new states, or organisations updating outdated handbooks. Timeline: 4–6 weeks.</p>',
 true, 1, 'a0000002-0000-0000-0000-000000000002'),

('Payroll Management & Statutory Compliance', 'payroll-compliance',
 'Error-free payroll processing and 100% statutory compliance across PF, ESI, PT, Gratuity, and state-specific labour laws.',
 '💰', '<h2>Overview</h2><p>Payroll errors and compliance gaps don''t just cost money — they destroy employee trust and invite government scrutiny. Our payroll practice handles end-to-end salary processing for 10 to 10,000 employees.</p><h2>What We Deliver</h2><ul><li>Monthly payroll processing</li><li>PF, ESI, PT, LWF, and Gratuity computation and filing</li><li>TDS calculation and Form 16 generation</li><li>Full & Final settlement processing</li><li>Multi-state payroll management</li><li>Statutory compliance audit</li></ul><h2>Who It''s For</h2><p>Companies without dedicated payroll staff or multi-state operations. SLA: Payroll processed by 25th of every month.</p>',
 true, 2, 'a0000002-0000-0000-0000-000000000002'),

('Performance Management System Design', 'performance-management',
 'Move beyond annual appraisals — design a performance framework that drives accountability, growth, and fair compensation.',
 '📊', '<h2>Overview</h2><p>Annual appraisals are dead. High-performing organisations use continuous performance management with clear goals, regular check-ins, and data-driven reviews.</p><h2>What We Deliver</h2><ul><li>Goal-setting framework (OKRs, KPIs, or balanced scorecard)</li><li>Review cycle design</li><li>Manager training on feedback and calibration</li><li>Compensation linkage framework</li><li>PMS technology selection and implementation</li><li>Promotion and succession planning integration</li></ul><h2>Who It''s For</h2><p>Companies with no formal PMS or switching from annual to continuous reviews. Timeline: 6–8 weeks.</p>',
 true, 3, 'a0000002-0000-0000-0000-000000000002'),

('Employee Engagement & Retention Programs', 'employee-engagement',
 'Reduce attrition and build a workplace people don''t want to leave — through data-backed engagement, not pizza parties.',
 '❤️', '<h2>Overview</h2><p>Engagement isn''t about perks — it''s about meaning, growth, and trust. We use pulse surveys, focus groups, and exit data analysis to identify exactly why people stay and leave.</p><h2>What We Deliver</h2><ul><li>Employee engagement survey design and execution</li><li>Exit interview analysis and attrition root cause mapping</li><li>Stay interview framework and manager training</li><li>Recognition and rewards program design</li><li>Engagement action plan with quarterly tracking</li></ul><h2>Who It''s For</h2><p>Companies with attrition above 20% or low engagement scores. Typical impact: 15–30% attrition reduction within 6 months.</p>',
 true, 4, 'a0000002-0000-0000-0000-000000000002'),

('Learning & Development Programs', 'learning-development',
 'Build organisational capability through targeted training — leadership development, technical upskilling, and soft skills programs.',
 '📚', '<h2>Overview</h2><p>Training only works when it''s tied to business outcomes. We diagnose skill gaps, design custom curriculum, and measure impact at 30, 60, and 90 days.</p><h2>What We Deliver</h2><ul><li>Training Needs Analysis across all levels</li><li>Leadership development programs</li><li>Technical and functional upskilling</li><li>Soft skills training</li><li>Train-the-trainer programs</li><li>Post-training impact measurement (Kirkpatrick model)</li></ul><h2>Who It''s For</h2><p>Companies promoting people into management without training or with skill gaps impacting performance.</p>',
 true, 5, 'a0000002-0000-0000-0000-000000000002'),

('HR Technology & HRIS Implementation', 'hris-implementation',
 'Select, implement, and optimise the right HR technology stack — from HRIS and ATS to payroll and engagement platforms.',
 '⚙️', '<h2>Overview</h2><p>The right HRIS can save your HR team 15+ hours per week. The wrong one wastes money and adds complexity. We help you evaluate, select, and implement based on your needs — not vendor sales pitches.</p><h2>What We Deliver</h2><ul><li>HR technology landscape assessment</li><li>Requirements gathering and RFP creation</li><li>Vendor evaluation and selection (unbiased)</li><li>Implementation project management</li><li>Data migration and user training</li></ul><h2>Who It''s For</h2><p>Companies still running HR on spreadsheets or outgrowing their current HRIS. Timeline: 8–16 weeks. Platforms: Darwinbox, Keka, greytHR, Zoho People, BambooHR, and more.</p>',
 true, 6, 'a0000002-0000-0000-0000-000000000002'),

('Fractional CHRO / HR-as-a-Service', 'fractional-chro',
 'Senior HR leadership and strategic guidance without the ₹50L+ salary — a seasoned CHRO on your team, part-time.',
 '👤', '<h2>Overview</h2><p>You need senior HR leadership but can''t justify a full-time CHRO. Our Fractional CHRO service gives you a seasoned HR leader (15–20 years experience) working 2–3 days per week.</p><h2>What We Deliver</h2><ul><li>Dedicated Fractional CHRO (2–3 days/week)</li><li>People strategy aligned to business goals</li><li>Board-level HR reporting</li><li>HR team mentoring and capability building</li><li>Compensation and benefits strategy</li><li>Crisis management and employee relations</li></ul><h2>Who It''s For</h2><p>Startups (Series A–C), SMEs scaling from 50 to 500 employees, or companies between CHROs. Typical engagement: 6–12 months.</p>',
 true, 7, 'a0000002-0000-0000-0000-000000000002'),

('Organisation Design & Restructuring', 'organisation-design',
 'Design an organisational structure that supports your strategy — not one that got built by accident as you grew.',
 '🏗️', '<h2>Overview</h2><p>Most companies don''t design their org structure — it just happens. We redesign organisations based on strategy, not history — creating structures that enable speed, clarity, and scalability.</p><h2>What We Deliver</h2><ul><li>Current-state org assessment</li><li>Future-state org design aligned to strategy</li><li>Role definition and job architecture</li><li>Competency framework development</li><li>Manpower planning and headcount optimisation</li><li>Transition roadmap with 30/60/90-day milestones</li></ul><h2>Who It''s For</h2><p>Companies post-M&A, rapidly scaled organisations, or businesses restructuring for profitability. Timeline: 6–10 weeks.</p>',
 true, 8, 'a0000002-0000-0000-0000-000000000002');

-- ==========================================
-- CHILD SERVICES - BUSINESS CONSULTING (8)
-- ==========================================

INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('Business Strategy & Growth Planning', 'strategy-growth',
 'Define where to play, how to win, and what to build — with a growth roadmap grounded in market reality.',
 '🚀', '<h2>Overview</h2><p>Growth without strategy is chaos. We work with founders and leadership teams to define clear strategic direction — market positioning, revenue model, competitive moats, and growth priorities.</p><h2>What We Deliver</h2><ul><li>Strategic vision alignment workshops</li><li>Market sizing and TAM analysis</li><li>Competitive landscape mapping</li><li>Revenue model design and pricing strategy</li><li>Growth roadmap with quarterly OKRs</li><li>Board-ready strategic plans</li></ul><h2>Who It''s For</h2><p>Founders planning their next growth phase, companies entering new markets, or leadership teams misaligned on strategy. Engagement: 4–8 weeks.</p>',
 true, 1, 'a0000003-0000-0000-0000-000000000003'),

('Market Research & Competitive Analysis', 'market-research',
 'Make decisions backed by data, not gut feel — primary and secondary research tailored to your specific market questions.',
 '🔬', '<h2>Overview</h2><p>The most expensive business decisions are the ones made without data. We combine desk research, primary interviews, customer surveys, and competitive intelligence into actionable insights.</p><h2>What We Deliver</h2><ul><li>Industry landscape and trend reports</li><li>Competitive benchmarking</li><li>Customer research (surveys, interviews, focus groups)</li><li>Market entry feasibility studies</li><li>Pricing research and willingness-to-pay analysis</li></ul><h2>Who It''s For</h2><p>Companies launching new products, entering new geographies, or making significant investment decisions. Engagement: 3–6 weeks.</p>',
 true, 2, 'a0000003-0000-0000-0000-000000000003'),

('Process Optimisation & Operational Efficiency', 'process-optimisation',
 'Eliminate waste, reduce costs, and increase throughput — through systematic process improvement.',
 '⚡', '<h2>Overview</h2><p>You don''t need to work harder — you need to work smarter. We identify bottlenecks and redesign processes using Lean, Six Sigma, and business process reengineering methodologies.</p><h2>What We Deliver</h2><ul><li>End-to-end process mapping and analysis</li><li>Bottleneck identification and root cause analysis</li><li>Process redesign using Lean/Six Sigma</li><li>SOP development</li><li>Automation opportunity identification</li><li>Implementation support and change management</li></ul><h2>Who It''s For</h2><p>Manufacturing companies, service businesses, or any organisation where processes are slowing growth. Impact: 15–30% improvement within 6 months.</p>',
 true, 3, 'a0000003-0000-0000-0000-000000000003'),

('Financial Restructuring & Cost Optimisation', 'financial-restructuring',
 'Improve margins, optimise working capital, and restructure costs — without cutting the muscle along with the fat.',
 '💹', '<h2>Overview</h2><p>Profitability isn''t just about revenue. We work with your CFO to identify cost reduction opportunities, optimise working capital, and build financial models for better decision-making.</p><h2>What We Deliver</h2><ul><li>Cost structure analysis and benchmarking</li><li>Working capital optimisation</li><li>Vendor renegotiation and procurement optimisation</li><li>Financial modelling and scenario planning</li><li>Debt restructuring advisory</li></ul><h2>Who It''s For</h2><p>Companies with declining margins, businesses preparing for fundraising, or post-M&A integration. Impact: 10–25% cost reduction in first quarter.</p>',
 true, 4, 'a0000003-0000-0000-0000-000000000003'),

('Change Management & Transformation', 'change-management',
 'Make change stick — through structured communication, stakeholder alignment, and human-centred transition planning.',
 '🔄', '<h2>Overview</h2><p>70% of transformation initiatives fail because the people side is ignored. Whether you''re implementing new technology, restructuring, or merging cultures — change only works when people adopt it.</p><h2>What We Deliver</h2><ul><li>Change impact assessment and readiness evaluation</li><li>Stakeholder mapping and influence strategy</li><li>Communication plan</li><li>Training for new ways of working</li><li>Adoption tracking and course correction</li></ul><h2>Who It''s For</h2><p>Companies implementing ERP/technology changes, post-M&A organisations, or any major initiative requiring people adoption. Engagement: 3–12 months.</p>',
 true, 5, 'a0000003-0000-0000-0000-000000000003'),

('M&A Advisory & Due Diligence Support', 'ma-advisory',
 'End-to-end M&A support — target identification, due diligence, valuation, integration planning, and post-merger execution.',
 '🤝', '<h2>Overview</h2><p>60–80% of M&A deals fail to achieve projected synergies. We support the entire M&A lifecycle with particular strength in HR due diligence and people integration.</p><h2>What We Deliver</h2><ul><li>Target identification and strategic fit assessment</li><li>Commercial and operational due diligence</li><li>HR and people due diligence</li><li>Valuation support and deal structuring</li><li>Integration planning (Day 1 readiness, 100-day plan)</li><li>Cultural integration and change management</li></ul><h2>Who It''s For</h2><p>Companies acquiring or merging, PE/VC portfolio companies, or businesses being prepared for sale. Engagement: 4–8 weeks for DD, 6–12 months for integration.</p>',
 true, 6, 'a0000003-0000-0000-0000-000000000003'),

('New Market Entry Strategy', 'market-entry',
 'Enter the Indian market or expand to new Indian states and cities with a clear playbook — regulatory, operational, and commercial.',
 '🌏', '<h2>Overview</h2><p>India isn''t one market — it''s 28 states with different regulations, languages, and business norms. We build the market entry playbook covering regulatory setup, talent strategy, and go-to-market execution.</p><h2>What We Deliver</h2><ul><li>Market assessment and opportunity sizing</li><li>Regulatory and compliance mapping</li><li>Entity structure advisory</li><li>Location strategy and site selection</li><li>Talent availability and compensation benchmarking</li><li>Go-to-market launch plan with 90-day milestones</li></ul><h2>Who It''s For</h2><p>International companies entering India, Indian companies expanding to new states, or businesses launching new verticals. Engagement: 6–10 weeks.</p>',
 true, 7, 'a0000003-0000-0000-0000-000000000003'),

('Performance Dashboarding & KPI Frameworks', 'kpi-frameworks',
 'Stop measuring everything and start measuring what matters — custom KPI frameworks and real-time dashboards.',
 '📈', '<h2>Overview</h2><p>Measuring everything is just as dangerous as measuring nothing. We help define the 15–20 metrics that actually drive outcomes, then build dashboards that make them actionable.</p><h2>What We Deliver</h2><ul><li>KPI framework aligned to strategic objectives</li><li>Balanced Scorecard or OKR implementation</li><li>Dashboard design (Power BI, Tableau, Google Data Studio)</li><li>Leadership review cadence design</li><li>Team-level scorecards cascaded from company KPIs</li></ul><h2>Who It''s For</h2><p>Companies making decisions on intuition, leadership teams drowning in reports, or businesses implementing OKRs. Timeline: 4–6 weeks.</p>',
 true, 8, 'a0000003-0000-0000-0000-000000000003');

-- ==========================================
-- CHILD SERVICES - LEGAL CONSULTING (8)
-- ==========================================

INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('Labour Law Compliance', 'labour-law',
 'Navigate India''s complex labour law landscape — Factories Act, Shops & Establishments, new Labour Codes, and state-specific regulations.',
 '📜', '<h2>Overview</h2><p>India''s labour laws are undergoing the biggest overhaul in decades with the 4 new Labour Codes. Our team ensures you''re compliant with today''s laws and ready for tomorrow''s.</p><h2>What We Deliver</h2><ul><li>Comprehensive labour law compliance audit</li><li>New Labour Codes readiness assessment</li><li>Factories Act compliance</li><li>Shops & Establishments registration</li><li>Minimum Wages Act compliance across states</li><li>Compliance calendar with automated alerts</li></ul><h2>Who It''s For</h2><p>Companies operating across multiple Indian states, manufacturing units, or any employer seeking a clean compliance record. Coverage: all 28 states and 8 UTs.</p>',
 true, 1, 'a0000004-0000-0000-0000-000000000004'),

('Employment Contract Drafting & Review', 'employment-contracts',
 'Legally sound, clearly worded employment contracts that protect your business while remaining fair and enforceable.',
 '✍️', '<h2>Overview</h2><p>A poorly drafted employment contract is a ticking time bomb. We draft contracts that are legally airtight, practically enforceable, and tailored to your specific role types.</p><h2>What We Deliver</h2><ul><li>Standard employment contract templates</li><li>NDA and confidentiality clauses</li><li>Non-compete and non-solicitation clauses</li><li>IP assignment clauses</li><li>ESOP and bonus agreement clauses</li><li>Offer letter and appointment letter templates</li></ul><h2>Who It''s For</h2><p>Companies using generic templates, organisations with no IP protection in contracts, or businesses hiring across different role types. Turnaround: 5–7 working days.</p>',
 true, 2, 'a0000004-0000-0000-0000-000000000004'),

('POSH Compliance & ICC Setup', 'posh-compliance',
 'Full Prevention of Sexual Harassment compliance — ICC setup, policy drafting, awareness training, and annual filings.',
 '🛡️', '<h2>Overview</h2><p>Every organisation with 10+ employees must comply with the POSH Act. Non-compliance carries penalties of up to ₹50,000 and potential licence cancellation.</p><h2>What We Deliver</h2><ul><li>Internal Complaints Committee constitution and training</li><li>POSH policy drafting</li><li>Mandatory awareness training for all employees</li><li>Complaint handling procedure and documentation</li><li>Annual compliance report filing</li><li>External Member services</li></ul><h2>Who It''s For</h2><p>Every Indian company with 10+ employees. Compliance guarantee: full POSH compliance within 30 days.</p>',
 true, 3, 'a0000004-0000-0000-0000-000000000004'),

('Statutory Registrations & Regulatory Filings', 'statutory-registrations',
 'All mandatory registrations and periodic filings — PF, ESI, PT, Shops & Establishments, CLRA — handled accurately and on time.',
 '📋', '<h2>Overview</h2><p>Missing a registration or filing deadline can result in penalties or inability to operate. We manage all statutory registrations and filings across central and state requirements.</p><h2>What We Deliver</h2><ul><li>PF registration and monthly ECR filing</li><li>ESI registration and contribution filing</li><li>Professional Tax registration (state-wise)</li><li>Shops & Establishments registration</li><li>Contract Labour licence</li><li>Annual return filing under all applicable laws</li></ul><h2>Who It''s For</h2><p>Companies opening new offices, expanding to new states, or struggling with compliance deadlines. SLA: filings completed 5 days before deadline.</p>',
 true, 4, 'a0000004-0000-0000-0000-000000000004'),

('Vendor & Service Agreement Drafting', 'vendor-agreements',
 'Protect your business interests with well-crafted vendor, service, and partnership agreements.',
 '📑', '<h2>Overview</h2><p>Every business relationship should be documented clearly. We draft commercial agreements that define obligations, protect interests, and provide clear remedies.</p><h2>What We Deliver</h2><ul><li>Vendor/supplier agreements</li><li>Service Level Agreements (SLAs)</li><li>Master Service Agreements (MSAs)</li><li>Partnership and joint venture agreements</li><li>Franchise and distribution agreements</li></ul><h2>Who It''s For</h2><p>Companies engaging new vendors, entering partnerships, or standardising agreement templates. Turnaround: 7–10 working days.</p>',
 true, 5, 'a0000004-0000-0000-0000-000000000004'),

('Intellectual Property Advisory', 'ip-advisory',
 'Protect your brand, inventions, and creative works — trademark, patent, copyright protection, and IP strategy.',
 '💡', '<h2>Overview</h2><p>Your IP is often your most valuable asset — yet most Indian companies don''t protect it until it''s too late. We help you identify, register, protect, and enforce your IP rights.</p><h2>What We Deliver</h2><ul><li>Trademark search, filing, and registration</li><li>Patent drafting and filing</li><li>Copyright registration</li><li>Trade secret protection frameworks</li><li>IP portfolio audit and strategy</li><li>IP infringement monitoring</li></ul><h2>Who It''s For</h2><p>Startups with unprotected brands, tech companies with unpatented innovations, or businesses being copied. Timeline: trademark filing within 7 days.</p>',
 true, 6, 'a0000004-0000-0000-0000-000000000004'),

('Corporate Governance & Board Advisory', 'corporate-governance',
 'Strengthen your governance framework — board composition, compliance calendars, and investor-ready structures.',
 '🏛️', '<h2>Overview</h2><p>Good governance separates companies that attract investment from those that don''t. We build the structures, processes, and documentation that investors and regulators expect.</p><h2>What We Deliver</h2><ul><li>Board composition and independent director advisory</li><li>Board meeting management</li><li>Annual compliance calendar and ROC filings</li><li>Corporate policies (CSR, RPT, Whistleblower)</li><li>Investor-readiness governance assessment</li><li>Company Secretary services (outsourced)</li></ul><h2>Who It''s For</h2><p>Startups preparing for funding, companies scaling beyond founder-led governance. Pre-fundraise setup: 4–6 weeks.</p>',
 true, 7, 'a0000004-0000-0000-0000-000000000004'),

('Dispute Resolution & Litigation Support', 'dispute-resolution',
 'Resolve business and employment disputes efficiently — mediation, arbitration, and litigation management.',
 '⚖️', '<h2>Overview</h2><p>Business disputes are inevitable — but litigation doesn''t have to be. We focus on resolving conflicts quickly through negotiation and mediation first.</p><h2>What We Deliver</h2><ul><li>Pre-litigation negotiation and settlement</li><li>Mediation and conciliation</li><li>Labour court and tribunal representation</li><li>Employment dispute resolution</li><li>Commercial dispute management</li><li>Arbitration proceedings</li></ul><h2>Who It''s For</h2><p>Companies facing employee disputes, vendor conflicts, or contractual disagreements. 70% of our disputes are resolved without going to court.</p>',
 true, 8, 'a0000004-0000-0000-0000-000000000004');

-- ==========================================
-- CHILD SERVICES - IT SERVICES (8)
-- ==========================================

INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('IT Strategy & Digital Transformation', 'digital-transformation',
 'Build a technology roadmap that aligns with your business strategy — prioritised, budgeted, and designed for measurable ROI.',
 '🗺️', '<h2>Overview</h2><p>Digital transformation isn''t about technology — it''s about using technology to solve business problems. We start with your objectives and work backwards to define the highest-impact technology investments.</p><h2>What We Deliver</h2><ul><li>Current-state technology assessment</li><li>Digital transformation roadmap (12–36 months)</li><li>Technology investment prioritisation and ROI modelling</li><li>Build vs. buy vs. partner analysis</li><li>Digital process redesign</li><li>Technology governance framework</li></ul><h2>Who It''s For</h2><p>Companies on legacy systems, businesses with disconnected tools, or leadership wanting a clear tech investment plan. Engagement: 4–6 weeks for strategy.</p>',
 true, 1, 'a0000005-0000-0000-0000-000000000005'),

('Cloud Infrastructure Setup & Migration', 'cloud-infrastructure',
 'Migrate to the cloud or optimise your existing setup — AWS, Azure, or GCP — for reliability, security, and cost efficiency.',
 '☁️', '<h2>Overview</h2><p>On-premise servers are expensive, fragile, and don''t scale. Our cloud team designs, migrates, and manages infrastructure that''s reliable, secure, and cost-optimised.</p><h2>What We Deliver</h2><ul><li>Cloud readiness assessment and migration planning</li><li>Architecture design (multi-tier, microservices, serverless)</li><li>Migration execution</li><li>Cost optimisation and reserved instance planning</li><li>Auto-scaling and high availability</li><li>Disaster recovery and backup setup</li></ul><h2>Who It''s For</h2><p>Companies on legacy servers, businesses with unpredictable cloud bills, or organisations needing DR. Platforms: AWS, Azure, GCP. Timeline: 8–16 weeks.</p>',
 true, 2, 'a0000005-0000-0000-0000-000000000005'),

('Cybersecurity Assessment & Implementation', 'cybersecurity',
 'Identify vulnerabilities, implement protection, and build a security posture that keeps your business safe.',
 '🔒', '<h2>Overview</h2><p>Indian businesses lost over ₹20,000 crore to cybercrime in 2024. We provide end-to-end cybersecurity — from assessment to implementation to ongoing monitoring.</p><h2>What We Deliver</h2><ul><li>Vulnerability Assessment and Penetration Testing (VAPT)</li><li>Security posture assessment</li><li>Firewall, endpoint, and email security</li><li>Identity and access management (IAM)</li><li>Incident response plan development</li><li>Compliance alignment (ISO 27001, SOC 2, DPDP Act)</li></ul><h2>Who It''s For</h2><p>Companies handling sensitive data, regulated industries, or any organisation without a recent security assessment. Engagement: 2–4 weeks assessment, 8–12 weeks implementation.</p>',
 true, 3, 'a0000005-0000-0000-0000-000000000005'),

('Custom Software & Application Development', 'software-development',
 'Build the software your business needs — web apps, mobile apps, APIs, and integrations designed for your workflows.',
 '💻', '<h2>Overview</h2><p>Off-the-shelf software forces you to adapt. Custom software adapts to you. We build web applications, mobile apps, and integrations using modern, maintainable stacks.</p><h2>What We Deliver</h2><ul><li>Requirements gathering and solution architecture</li><li>UI/UX design and prototyping</li><li>Full-stack web application development</li><li>Mobile app development (React Native, Flutter)</li><li>API development and third-party integrations</li><li>Quality assurance and automated testing</li></ul><h2>Who It''s For</h2><p>Companies with unique process needs, businesses needing custom integrations, or modernising legacy apps. Tech stack: React, Next.js, Node.js, Python, PostgreSQL.</p>',
 true, 4, 'a0000005-0000-0000-0000-000000000005'),

('IT Staffing & Team Augmentation', 'it-staffing',
 'Scale your tech team on demand — pre-vetted developers, architects, DevOps engineers, and QA professionals.',
 '👨‍💻', '<h2>Overview</h2><p>Hiring full-time developers takes months. Our IT staffing gives you pre-vetted technology professionals who can plug in within days.</p><h2>What We Deliver</h2><ul><li>Staff augmentation (individual contributors)</li><li>Dedicated development pods (3–10 person squads)</li><li>Contract-to-hire technology talent</li><li>Technical screening and assessment</li><li>Replacement guarantee within 7 working days</li></ul><h2>Who It''s For</h2><p>Companies with immediate project deadlines, pre-funding startups, or enterprises needing specialised skills. Ramp-up: first profiles within 3–5 days.</p>',
 true, 5, 'a0000005-0000-0000-0000-000000000005'),

('ERP & CRM Implementation', 'erp-crm',
 'Select, implement, and customise ERP and CRM systems that unify your operations.',
 '🔧', '<h2>Overview</h2><p>Running on disconnected spreadsheets is a recipe for errors. ERP and CRM unify your operations — but only when implemented correctly with proper adoption.</p><h2>What We Deliver</h2><ul><li>Business process analysis and requirements</li><li>Vendor evaluation (Zoho, Salesforce, SAP, ERPNext, Odoo)</li><li>System configuration and customisation</li><li>Data migration from legacy systems</li><li>User training and change management</li><li>Post-implementation optimisation</li></ul><h2>Who It''s For</h2><p>Companies running on spreadsheets or with disconnected systems. Timeline: 10–20 weeks for ERP, 4–8 weeks for CRM.</p>',
 true, 6, 'a0000005-0000-0000-0000-000000000005'),

('Data Analytics & Business Intelligence', 'data-analytics',
 'Turn your data into decisions — from data warehouse setup to interactive dashboards and predictive analytics.',
 '📊', '<h2>Overview</h2><p>You''re sitting on a goldmine of data — but without the right tools it''s just noise. We help you collect, clean, structure, and visualise your business data.</p><h2>What We Deliver</h2><ul><li>Data audit and quality assessment</li><li>Data warehouse / data lake setup</li><li>ETL pipeline development</li><li>Dashboard development (Power BI, Tableau, Metabase)</li><li>Predictive analytics and forecasting</li><li>Customer analytics (segmentation, churn, LTV)</li></ul><h2>Who It''s For</h2><p>Companies drowning in data but lacking insights, or businesses wanting in-house analytics capability. Engagement: 4–8 weeks for initial setup.</p>',
 true, 7, 'a0000005-0000-0000-0000-000000000005'),

('IT Infrastructure Management & Support', 'it-infrastructure',
 'Reliable IT operations — network management, helpdesk, hardware, and monitoring — so your team focuses on work.',
 '🖥️', '<h2>Overview</h2><p>IT downtime costs ₹8,000 per employee per hour on average. We provide proactive monitoring, maintenance, and support — preventing issues before they impact your team.</p><h2>What We Deliver</h2><ul><li>IT helpdesk and support (L1, L2, L3)</li><li>Network design, setup, and management</li><li>Hardware procurement and lifecycle management</li><li>Proactive monitoring and alerting</li><li>Backup and disaster recovery</li><li>Vendor and license management</li></ul><h2>Who It''s For</h2><p>Companies without a dedicated IT team or with unreliable infrastructure. SLA options: 8x5, 12x6, or 24x7.</p>',
 true, 8, 'a0000005-0000-0000-0000-000000000005');
