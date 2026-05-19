-- ==========================================
-- FRESH SUPABASE SETUP FOR ADVISERVE WEBSITE
-- Run this in SQL Editor on a new Supabase project
-- ==========================================

-- 1. CORE TABLES
-- ==========================================

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  icon text,
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  parent_id uuid REFERENCES services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_services_parent_id ON services(parent_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- Contact inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service_interest text,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  author text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Navigation menus
CREATE TABLE IF NOT EXISTS navigation_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES navigation_menus(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  parent_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  target text DEFAULT '_self',
  created_at timestamptz DEFAULT now()
);

-- Site settings (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site assets (logo, favicon)
CREATE TABLE IF NOT EXISTS site_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Website pages
CREATE TABLE IF NOT EXISTS website_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  is_visible boolean DEFAULT true,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Website content blocks
CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES website_pages(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  section_label text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  content_value text,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_id, section_key)
);

-- Email subscribers
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Email lists
CREATE TABLE IF NOT EXISTS email_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  list_id uuid REFERENCES email_lists(id) ON DELETE SET NULL,
  status text DEFAULT 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Legal documents
CREATE TABLE IF NOT EXISTS legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  content text NOT NULL,
  version text DEFAULT '1.0',
  status text DEFAULT 'draft',
  effective_date date,
  is_current boolean DEFAULT false,
  meta_description text,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Page analytics
CREATE TABLE IF NOT EXISTS page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  page_title text,
  referrer text,
  user_agent text,
  screen_width integer,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- 2. ENABLE RLS ON ALL TABLES
-- ==========================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES (public read, authenticated write)
-- ==========================================

-- Services: public read
CREATE POLICY "Public can view services" ON services FOR SELECT USING (is_visible = true);
CREATE POLICY "Auth can manage services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contact inquiries: public insert, auth read
CREATE POLICY "Anyone can submit inquiry" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth can view inquiries" ON contact_inquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can manage inquiries" ON contact_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Blog: public read published, auth manage
CREATE POLICY "Public can view published posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Auth can manage posts" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Navigation: public read
CREATE POLICY "Public can view menus" ON navigation_menus FOR SELECT USING (is_active = true);
CREATE POLICY "Auth can manage menus" ON navigation_menus FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view menu items" ON menu_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Auth can manage menu items" ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site settings: public read
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Auth can manage settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site assets: public read
CREATE POLICY "Public can view assets" ON site_assets FOR SELECT USING (true);
CREATE POLICY "Auth can manage assets" ON site_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Website pages: public read visible
CREATE POLICY "Public can view pages" ON website_pages FOR SELECT USING (is_visible = true);
CREATE POLICY "Auth can manage pages" ON website_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Website content: public read visible
CREATE POLICY "Public can view content" ON website_content FOR SELECT USING (is_visible = true);
CREATE POLICY "Auth can manage content" ON website_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Email subscribers
CREATE POLICY "Anyone can subscribe" ON email_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth can manage subscribers" ON email_subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Email lists, templates, campaigns: auth only
CREATE POLICY "Auth can manage lists" ON email_lists FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage templates" ON email_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage campaigns" ON email_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin users
CREATE POLICY "Auth can view admins" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can manage admins" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Legal documents
CREATE POLICY "Public can view published docs" ON legal_documents FOR SELECT USING (status = 'published' AND is_current = true);
CREATE POLICY "Auth can manage docs" ON legal_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Analytics
CREATE POLICY "Anyone can insert analytics" ON page_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth can read analytics" ON page_analytics FOR SELECT TO authenticated USING (true);

-- 4. SEED DATA
-- ==========================================

-- Site assets
INSERT INTO site_assets (logo_url, favicon_url)
VALUES ('/Copy_of_adviserve_logo_(300_x_300_px).png', '/Copy_of_adviserve_logo_(300_x_300_px).png');

-- Navigation menu
INSERT INTO navigation_menus (id, name, location, is_active)
VALUES ('b0000001-0000-0000-0000-000000000001', 'main_navigation', 'header', true);

INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible) VALUES
('b0000001-0000-0000-0000-000000000001', 'Home', '/', 1, true),
('b0000001-0000-0000-0000-000000000001', 'Services', '/services', 2, true),
('b0000001-0000-0000-0000-000000000001', 'About', '/about', 3, true),
('b0000001-0000-0000-0000-000000000001', 'Case Studies', '/case-studies', 4, true),
('b0000001-0000-0000-0000-000000000001', 'Careers', '/careers', 5, true),
('b0000001-0000-0000-0000-000000000001', 'Blog', '/blog', 6, true),
('b0000001-0000-0000-0000-000000000001', 'Contact', '/contact', 7, true);

-- Website pages
INSERT INTO website_pages (slug, title, is_visible) VALUES
('home', 'Home', true),
('about', 'About Us', true),
('services', 'Services', true),
('blog', 'Blog', true),
('contact', 'Contact Us', true);

-- 5. SEED ALL 44 SERVICES
-- ==========================================

-- Parent services
INSERT INTO services (id, title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('a0000001-0000-0000-0000-000000000001', 'End-to-End Recruitment', 'recruitment',
 'From sourcing to onboarding — permanent, contract, and RPO recruitment across all levels and industries. Pre-vetted talent pipelines, behavioural assessments, and a 96% retention guarantee.',
 '🎯',
 '<p>India''s talent market moves fast. Open roles cost you revenue every day they stay unfilled — and a bad hire costs 3x their annual salary.</p><p>Adviserve''s recruitment practice combines pre-vetted talent pipelines, behavioural science-backed assessments, and embedded delivery teams to fill roles faster, with candidates who stay. We''ve placed 3,000+ professionals across 25+ industries with a 96% 12-month retention rate.</p><h3>Our Recruitment Services Include:</h3><ul><li>Executive Search & CXO Hiring</li><li>Bulk & Volume Recruitment</li><li>Contract & Temporary Staffing</li><li>Recruitment Process Outsourcing (RPO)</li><li>Campus Hiring & Graduate Programs</li><li>Employer Branding & EVP Development</li><li>Pre-employment Assessments & Background Verification</li></ul>',
 true, 1, NULL),

('a0000002-0000-0000-0000-000000000002', 'End-to-End HR Services', 'hr-services',
 'Complete HR lifecycle management — from policy design and payroll to performance management and employee engagement. Fractional CHRO services for companies that need senior HR leadership without a full-time hire.',
 '👥',
 '<p>Most growing companies hit an HR wall between 50 and 500 employees. Policies are ad-hoc, compliance is patchy, payroll is a monthly nightmare, and there''s no formal performance framework.</p><p>Adviserve''s HR practice gives you enterprise-grade people operations — either as a fully outsourced function or as specialist support alongside your existing team.</p><h3>Our HR Services Include:</h3><ul><li>HR Policy Design & Employee Handbook</li><li>Payroll Management & Statutory Compliance</li><li>Performance Management System Design</li><li>Employee Engagement & Retention Programs</li><li>Learning & Development Programs</li><li>HR Technology & HRIS Implementation</li><li>Fractional CHRO / HR-as-a-Service</li><li>Organisation Design & Restructuring</li></ul>',
 true, 2, NULL),

('a0000003-0000-0000-0000-000000000003', 'Business Consulting', 'business-consulting',
 'Strategic and operational consulting to help businesses scale profitably. Market entry strategy, process optimisation, financial restructuring, and change management — backed by data and delivered by practitioners.',
 '📊',
 '<p>Strategy without execution is a deck gathering dust. We don''t just advise — we embed with your team to implement.</p><p>Our business consultants have operating experience across manufacturing, technology, healthcare, FMCG, and financial services.</p><h3>Our Business Consulting Services Include:</h3><ul><li>Business Strategy & Growth Planning</li><li>Market Research & Competitive Analysis</li><li>Process Optimisation & Operational Efficiency</li><li>Financial Restructuring & Cost Optimisation</li><li>Change Management & Transformation</li><li>M&A Advisory & Due Diligence Support</li><li>New Market Entry Strategy</li><li>Performance Dashboarding & KPI Frameworks</li></ul>',
 true, 3, NULL),

('a0000004-0000-0000-0000-000000000004', 'Legal Consulting', 'legal-consulting',
 'Indian corporate and employment law advisory — labour law compliance, contract drafting, regulatory filings, POSH compliance, and dispute resolution. Certified corporate lawyers with pan-India practice.',
 '⚖️',
 '<p>Indian labour and corporate law is notoriously complex — 29 central labour laws (now consolidating into 4 codes), state-specific variations, and constantly evolving compliance requirements.</p><p>Our legal practice provides practical, business-friendly legal counsel that keeps you compliant without slowing you down.</p><h3>Our Legal Services Include:</h3><ul><li>Labour Law Compliance</li><li>Employment Contract Drafting & Review</li><li>POSH Compliance & ICC Setup</li><li>Statutory Registrations & Regulatory Filings</li><li>Vendor & Service Agreement Drafting</li><li>Intellectual Property Advisory</li><li>Corporate Governance & Board Advisory</li><li>Dispute Resolution & Litigation Support</li></ul>',
 true, 4, NULL),

('a0000005-0000-0000-0000-000000000005', 'IT Services & Consulting', 'it-services',
 'Technology consulting, digital transformation, and IT infrastructure services. Cloud migration, cybersecurity, custom software development, and IT staffing — for businesses that need technology to work harder.',
 '💻',
 '<p>Technology should accelerate your business — not hold it back. Yet most Indian mid-market companies are running on outdated infrastructure, vulnerable to cyber threats, and drowning in manual processes.</p><p>Our IT practice brings enterprise-grade technology solutions to companies of all sizes — without enterprise-grade complexity or cost.</p><h3>Our IT Services Include:</h3><ul><li>IT Strategy & Digital Transformation</li><li>Cloud Infrastructure (AWS, Azure, GCP)</li><li>Cybersecurity Assessment & Implementation</li><li>Custom Software & Application Development</li><li>IT Staffing & Team Augmentation</li><li>ERP & CRM Implementation</li><li>Data Analytics & Business Intelligence</li><li>IT Infrastructure Management & Support</li></ul>',
 true, 5, NULL);

-- Recruitment child services
INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('Executive Search & CXO Hiring', 'executive-search', 'Confidential, research-driven search for C-suite, VP, and director-level leaders.', '👔', '<h2>Overview</h2><p>Our executive search practice identifies and secures senior leaders through discreet, research-led methodology.</p><h2>What We Deliver</h2><ul><li>Dedicated search consultant with sector expertise</li><li>Market mapping and talent landscape reports</li><li>Psychometric and leadership assessments</li><li>Compensation benchmarking and offer negotiation</li><li>6-month replacement guarantee</li></ul>', true, 1, 'a0000001-0000-0000-0000-000000000001'),
('Bulk & Volume Recruitment', 'bulk-recruitment', 'Hire 50 to 500+ people in compressed timelines without sacrificing quality.', '📋', '<h2>Overview</h2><p>Our bulk recruitment engine handles high-volume drives across manufacturing, retail, BPO, and technology.</p><h2>What We Deliver</h2><ul><li>Dedicated sourcing cell (3–10 recruiters)</li><li>Multi-channel sourcing</li><li>Assessment centre design</li><li>Real-time hiring dashboards</li><li>90% minimum probation pass rate</li></ul>', true, 2, 'a0000001-0000-0000-0000-000000000001'),
('Contract & Temporary Staffing', 'contract-staffing', 'Flexible workforce solutions — skilled professionals on contract, fully compliant.', '📄', '<h2>Overview</h2><p>Pre-vetted professionals for project-based work, maternity cover, or trial-before-hire. We handle payroll and compliance.</p><h2>What We Deliver</h2><ul><li>Contract-to-hire and pure contract models</li><li>Full statutory compliance (PF, ESI, PT)</li><li>Replacement guarantee within 7 days</li><li>Monthly performance reports</li></ul>', true, 3, 'a0000001-0000-0000-0000-000000000001'),
('Recruitment Process Outsourcing (RPO)', 'rpo', 'We become your recruitment department — sourcing to onboarding at predictable cost.', '🏢', '<h2>Overview</h2><p>Our RPO model embeds dedicated recruiters into your organisation as your internal talent acquisition team.</p><h2>What We Deliver</h2><ul><li>Dedicated recruitment pod (2–8 recruiters)</li><li>ATS implementation</li><li>Employer branding</li><li>Monthly business reviews with SLA tracking</li></ul>', true, 4, 'a0000001-0000-0000-0000-000000000001'),
('Campus Hiring & Graduate Programs', 'campus-hiring', 'Build your future talent pipeline through structured campus engagement.', '🎓', '<h2>Overview</h2><p>We help you identify, engage, and secure top graduates from Tier 1, 2, and 3 institutions across India.</p><h2>What We Deliver</h2><ul><li>Campus strategy and institution shortlisting</li><li>Assessment centre design</li><li>Pre-joining engagement programs</li><li>Graduate onboarding design</li></ul>', true, 5, 'a0000001-0000-0000-0000-000000000001'),
('Employer Branding & EVP Development', 'employer-branding', 'Attract top talent through a compelling employer brand and Employee Value Proposition.', '⭐', '<h2>Overview</h2><p>We help you define, articulate, and amplify what makes your company a great place to work.</p><h2>What We Deliver</h2><ul><li>Employer brand audit</li><li>EVP framework development</li><li>Glassdoor and LinkedIn optimisation</li><li>Candidate experience redesign</li></ul>', true, 6, 'a0000001-0000-0000-0000-000000000001'),
('Pre-employment Assessments & Background Verification', 'pre-employment-assessments', 'Data-driven hiring decisions with validated assessments and background checks.', '🔍', '<h2>Overview</h2><p>Structured assessments combined with rigorous background verification to reduce mis-hires by up to 60%.</p><h2>What We Deliver</h2><ul><li>Psychometric assessments</li><li>Technical skill assessments</li><li>Background verification (education, employment, criminal)</li><li>Assessment analytics dashboard</li></ul>', true, 7, 'a0000001-0000-0000-0000-000000000001');

-- HR Services child services
INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('HR Policy Design & Employee Handbook', 'policy-design', 'Clear, compliant HR policies tailored to your industry, size, and culture.', '📝', '<h2>Overview</h2><p>Comprehensive policy frameworks that balance legal compliance with your company culture.</p><h2>What We Deliver</h2><ul><li>Full policy audit</li><li>Employee handbook (20–40 policies)</li><li>Leave policy design (state-specific)</li><li>POSH policy</li><li>Remote work policy</li></ul>', true, 1, 'a0000002-0000-0000-0000-000000000002'),
('Payroll Management & Statutory Compliance', 'payroll-compliance', 'Error-free payroll and 100% statutory compliance across PF, ESI, PT, Gratuity.', '💰', '<h2>Overview</h2><p>End-to-end salary processing and statutory filings for 10 to 10,000 employees.</p><h2>What We Deliver</h2><ul><li>Monthly payroll processing</li><li>PF, ESI, PT computation and filing</li><li>TDS and Form 16</li><li>Multi-state payroll management</li></ul>', true, 2, 'a0000002-0000-0000-0000-000000000002'),
('Performance Management System Design', 'performance-management', 'Move beyond annual appraisals with a modern performance framework.', '📊', '<h2>Overview</h2><p>Continuous performance management with clear goals, regular check-ins, and data-driven reviews.</p><h2>What We Deliver</h2><ul><li>Goal-setting framework (OKRs/KPIs)</li><li>Review cycle design</li><li>Manager training</li><li>PMS technology selection</li></ul>', true, 3, 'a0000002-0000-0000-0000-000000000002'),
('Employee Engagement & Retention Programs', 'employee-engagement', 'Reduce attrition through data-backed engagement, not pizza parties.', '❤️', '<h2>Overview</h2><p>Pulse surveys, focus groups, and exit data analysis to identify why people stay and leave.</p><h2>What We Deliver</h2><ul><li>Engagement survey design</li><li>Exit interview analysis</li><li>Stay interview framework</li><li>Recognition program design</li></ul>', true, 4, 'a0000002-0000-0000-0000-000000000002'),
('Learning & Development Programs', 'learning-development', 'Targeted training — leadership development, technical upskilling, soft skills.', '📚', '<h2>Overview</h2><p>We diagnose skill gaps, design custom curriculum, and measure impact at 30, 60, and 90 days.</p><h2>What We Deliver</h2><ul><li>Training Needs Analysis</li><li>Leadership development</li><li>Technical upskilling</li><li>Post-training impact measurement</li></ul>', true, 5, 'a0000002-0000-0000-0000-000000000002'),
('HR Technology & HRIS Implementation', 'hris-implementation', 'Select, implement, and optimise the right HR technology stack.', '⚙️', '<h2>Overview</h2><p>Unbiased vendor evaluation, implementation, and training for your HR technology needs.</p><h2>What We Deliver</h2><ul><li>Technology assessment</li><li>Vendor evaluation and selection</li><li>Implementation management</li><li>Data migration and training</li></ul>', true, 6, 'a0000002-0000-0000-0000-000000000002'),
('Fractional CHRO / HR-as-a-Service', 'fractional-chro', 'Senior HR leadership without the ₹50L+ salary — part-time CHRO on your team.', '👤', '<h2>Overview</h2><p>A seasoned HR leader (15–20 years experience) working 2–3 days per week with your leadership team.</p><h2>What We Deliver</h2><ul><li>Dedicated Fractional CHRO</li><li>People strategy</li><li>Board-level HR reporting</li><li>HR team mentoring</li></ul>', true, 7, 'a0000002-0000-0000-0000-000000000002'),
('Organisation Design & Restructuring', 'organisation-design', 'Design an org structure that supports your strategy, not one built by accident.', '🏗️', '<h2>Overview</h2><p>We redesign organisations based on strategy, not history — enabling speed, clarity, and scalability.</p><h2>What We Deliver</h2><ul><li>Current-state org assessment</li><li>Future-state design</li><li>Role definition and job architecture</li><li>Transition roadmap</li></ul>', true, 8, 'a0000002-0000-0000-0000-000000000002');

-- Business Consulting child services
INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('Business Strategy & Growth Planning', 'strategy-growth', 'Growth roadmap grounded in market reality, not assumptions.', '🚀', '<h2>Overview</h2><p>We work with founders to define strategic direction — positioning, revenue model, and growth priorities.</p><h2>What We Deliver</h2><ul><li>Strategic vision workshops</li><li>Market sizing and TAM analysis</li><li>Growth roadmap with OKRs</li><li>Board-ready strategic plans</li></ul>', true, 1, 'a0000003-0000-0000-0000-000000000003'),
('Market Research & Competitive Analysis', 'market-research', 'Decisions backed by data — primary and secondary research for your market.', '🔬', '<h2>Overview</h2><p>Desk research, interviews, surveys, and competitive intelligence combined into actionable insights.</p><h2>What We Deliver</h2><ul><li>Industry landscape reports</li><li>Competitive benchmarking</li><li>Customer research</li><li>Market entry feasibility</li></ul>', true, 2, 'a0000003-0000-0000-0000-000000000003'),
('Process Optimisation & Operational Efficiency', 'process-optimisation', 'Eliminate waste and increase throughput through systematic improvement.', '⚡', '<h2>Overview</h2><p>Lean, Six Sigma, and business process reengineering adapted for Indian business contexts.</p><h2>What We Deliver</h2><ul><li>Process mapping and analysis</li><li>Bottleneck identification</li><li>Process redesign</li><li>SOP development</li></ul>', true, 3, 'a0000003-0000-0000-0000-000000000003'),
('Financial Restructuring & Cost Optimisation', 'financial-restructuring', 'Improve margins and optimise working capital strategically.', '💹', '<h2>Overview</h2><p>We identify cost reduction opportunities and build financial models for better decision-making.</p><h2>What We Deliver</h2><ul><li>Cost structure analysis</li><li>Working capital optimisation</li><li>Vendor renegotiation</li><li>Financial modelling</li></ul>', true, 4, 'a0000003-0000-0000-0000-000000000003'),
('Change Management & Transformation', 'change-management', 'Make change stick through stakeholder alignment and human-centred planning.', '🔄', '<h2>Overview</h2><p>70% of transformations fail because the people side is ignored. We make adoption happen.</p><h2>What We Deliver</h2><ul><li>Change impact assessment</li><li>Stakeholder mapping</li><li>Communication plan</li><li>Adoption tracking</li></ul>', true, 5, 'a0000003-0000-0000-0000-000000000003'),
('M&A Advisory & Due Diligence Support', 'ma-advisory', 'End-to-end M&A support — due diligence to post-merger integration.', '🤝', '<h2>Overview</h2><p>We support the entire M&A lifecycle with strength in HR due diligence and people integration.</p><h2>What We Deliver</h2><ul><li>Due diligence (commercial, HR, operational)</li><li>Valuation support</li><li>Integration planning</li><li>Cultural integration</li></ul>', true, 6, 'a0000003-0000-0000-0000-000000000003'),
('New Market Entry Strategy', 'market-entry', 'Enter or expand in India with a clear regulatory and commercial playbook.', '🌏', '<h2>Overview</h2><p>India is 28 states with different regulations and norms. We build your market entry playbook.</p><h2>What We Deliver</h2><ul><li>Market assessment</li><li>Regulatory mapping</li><li>Entity structure advisory</li><li>Go-to-market launch plan</li></ul>', true, 7, 'a0000003-0000-0000-0000-000000000003'),
('Performance Dashboarding & KPI Frameworks', 'kpi-frameworks', 'Custom KPI frameworks and real-time dashboards that drive decisions.', '📈', '<h2>Overview</h2><p>We define the metrics that matter and build dashboards that make them actionable.</p><h2>What We Deliver</h2><ul><li>KPI framework design</li><li>OKR implementation</li><li>Dashboard design (Power BI, Tableau)</li><li>Review cadence design</li></ul>', true, 8, 'a0000003-0000-0000-0000-000000000003');

-- Legal Consulting child services
INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('Labour Law Compliance', 'labour-law', 'Navigate India''s complex labour laws — Factories Act, new Labour Codes, state regulations.', '📜', '<h2>Overview</h2><p>We ensure you''re compliant with today''s laws and ready for the 4 new Labour Codes.</p><h2>What We Deliver</h2><ul><li>Labour law compliance audit</li><li>New Labour Codes readiness</li><li>Factories Act compliance</li><li>Compliance calendar with alerts</li></ul>', true, 1, 'a0000004-0000-0000-0000-000000000004'),
('Employment Contract Drafting & Review', 'employment-contracts', 'Legally sound employment contracts that protect your business.', '✍️', '<h2>Overview</h2><p>Contracts that are legally airtight, practically enforceable, and tailored to your roles.</p><h2>What We Deliver</h2><ul><li>Employment contract templates</li><li>NDA and IP clauses</li><li>Non-compete clauses</li><li>ESOP agreements</li></ul>', true, 2, 'a0000004-0000-0000-0000-000000000004'),
('POSH Compliance & ICC Setup', 'posh-compliance', 'Full POSH compliance — ICC setup, policy, training, and annual filings.', '🛡️', '<h2>Overview</h2><p>Every company with 10+ employees must comply. We guarantee full compliance within 30 days.</p><h2>What We Deliver</h2><ul><li>ICC constitution and training</li><li>POSH policy drafting</li><li>Employee awareness training</li><li>Annual compliance filing</li></ul>', true, 3, 'a0000004-0000-0000-0000-000000000004'),
('Statutory Registrations & Regulatory Filings', 'statutory-registrations', 'All mandatory registrations and filings — PF, ESI, PT, CLRA — on time.', '📋', '<h2>Overview</h2><p>We manage all statutory registrations and filings across central and state requirements.</p><h2>What We Deliver</h2><ul><li>PF and ESI registration</li><li>Professional Tax registration</li><li>Shops & Establishments</li><li>Annual return filing</li></ul>', true, 4, 'a0000004-0000-0000-0000-000000000004'),
('Vendor & Service Agreement Drafting', 'vendor-agreements', 'Well-crafted vendor, service, and partnership agreements.', '📑', '<h2>Overview</h2><p>Commercial agreements that define obligations, protect interests, and provide clear remedies.</p><h2>What We Deliver</h2><ul><li>Vendor agreements</li><li>SLAs and MSAs</li><li>Partnership agreements</li><li>Franchise agreements</li></ul>', true, 5, 'a0000004-0000-0000-0000-000000000004'),
('Intellectual Property Advisory', 'ip-advisory', 'Trademark, patent, copyright protection, and IP strategy.', '💡', '<h2>Overview</h2><p>We help you identify, register, protect, and enforce your intellectual property rights across India.</p><h2>What We Deliver</h2><ul><li>Trademark filing and registration</li><li>Patent drafting</li><li>Copyright registration</li><li>IP portfolio strategy</li></ul>', true, 6, 'a0000004-0000-0000-0000-000000000004'),
('Corporate Governance & Board Advisory', 'corporate-governance', 'Board composition, compliance calendars, and investor-ready governance.', '🏛️', '<h2>Overview</h2><p>We build the governance structures that investors, regulators, and partners expect.</p><h2>What We Deliver</h2><ul><li>Board advisory</li><li>ROC filings</li><li>Corporate policies</li><li>Investor-readiness assessment</li></ul>', true, 7, 'a0000004-0000-0000-0000-000000000004'),
('Dispute Resolution & Litigation Support', 'dispute-resolution', 'Mediation, arbitration, and litigation management for business disputes.', '⚖️', '<h2>Overview</h2><p>We resolve 70% of disputes without going to court through negotiation and mediation.</p><h2>What We Deliver</h2><ul><li>Pre-litigation negotiation</li><li>Mediation and conciliation</li><li>Labour court representation</li><li>Commercial dispute management</li></ul>', true, 8, 'a0000004-0000-0000-0000-000000000004');

-- IT Services child services
INSERT INTO services (title, slug, description, icon, content, is_visible, sort_order, parent_id) VALUES
('IT Strategy & Digital Transformation', 'digital-transformation', 'Technology roadmap aligned with your business strategy for measurable ROI.', '🗺️', '<h2>Overview</h2><p>We start with your business objectives and work backwards to define high-impact technology investments.</p><h2>What We Deliver</h2><ul><li>Technology assessment</li><li>Digital transformation roadmap</li><li>ROI modelling</li><li>Technology governance</li></ul>', true, 1, 'a0000005-0000-0000-0000-000000000005'),
('Cloud Infrastructure Setup & Migration', 'cloud-infrastructure', 'AWS, Azure, or GCP — reliable, secure, and cost-optimised cloud infrastructure.', '☁️', '<h2>Overview</h2><p>We design, migrate, and manage cloud infrastructure that scales with your business.</p><h2>What We Deliver</h2><ul><li>Cloud readiness assessment</li><li>Architecture design</li><li>Migration execution</li><li>Disaster recovery setup</li></ul>', true, 2, 'a0000005-0000-0000-0000-000000000005'),
('Cybersecurity Assessment & Implementation', 'cybersecurity', 'Identify vulnerabilities and build a security posture that protects your business.', '🔒', '<h2>Overview</h2><p>End-to-end cybersecurity — from VAPT to implementation to ongoing monitoring.</p><h2>What We Deliver</h2><ul><li>Vulnerability assessment (VAPT)</li><li>Security implementation</li><li>IAM setup</li><li>Compliance (ISO 27001, SOC 2)</li></ul>', true, 3, 'a0000005-0000-0000-0000-000000000005'),
('Custom Software & Application Development', 'software-development', 'Web apps, mobile apps, APIs designed for your specific workflows.', '💻', '<h2>Overview</h2><p>Custom software that adapts to your business using modern, maintainable technology stacks.</p><h2>What We Deliver</h2><ul><li>Solution architecture</li><li>Full-stack development</li><li>Mobile apps (React Native, Flutter)</li><li>API integrations</li></ul>', true, 4, 'a0000005-0000-0000-0000-000000000005'),
('IT Staffing & Team Augmentation', 'it-staffing', 'Pre-vetted developers, architects, and DevOps engineers ready in days.', '👨‍💻', '<h2>Overview</h2><p>Technology professionals who plug into your team within days, not months.</p><h2>What We Deliver</h2><ul><li>Staff augmentation</li><li>Dedicated dev pods</li><li>Technical screening</li><li>7-day replacement guarantee</li></ul>', true, 5, 'a0000005-0000-0000-0000-000000000005'),
('ERP & CRM Implementation', 'erp-crm', 'Unify operations with properly implemented ERP and CRM systems.', '🔧', '<h2>Overview</h2><p>Full lifecycle from vendor selection through go-live, ensuring adoption across your team.</p><h2>What We Deliver</h2><ul><li>Vendor evaluation (Zoho, Salesforce, SAP, Odoo)</li><li>Configuration and customisation</li><li>Data migration</li><li>User training</li></ul>', true, 6, 'a0000005-0000-0000-0000-000000000005'),
('Data Analytics & Business Intelligence', 'data-analytics', 'Turn data into decisions — dashboards, warehouses, and predictive analytics.', '📊', '<h2>Overview</h2><p>We help you collect, clean, structure, and visualise your business data for better decisions.</p><h2>What We Deliver</h2><ul><li>Data warehouse setup</li><li>Dashboard development (Power BI, Tableau)</li><li>Predictive analytics</li><li>Customer analytics</li></ul>', true, 7, 'a0000005-0000-0000-0000-000000000005'),
('IT Infrastructure Management & Support', 'it-infrastructure', 'Reliable IT operations — helpdesk, network, hardware, and monitoring.', '🖥️', '<h2>Overview</h2><p>Proactive monitoring and support — preventing issues before they impact your team.</p><h2>What We Deliver</h2><ul><li>IT helpdesk (L1, L2, L3)</li><li>Network management</li><li>Hardware lifecycle management</li><li>Proactive monitoring</li></ul>', true, 8, 'a0000005-0000-0000-0000-000000000005');
