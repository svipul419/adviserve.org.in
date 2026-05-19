-- ==========================================
-- SEO / AEO / GEO / LOCAL SEO TABLES
-- Run this in Supabase SQL Editor
-- ==========================================

-- SEO Settings (category + key-value store)
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  key text NOT NULL,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, key)
);

-- Per-page SEO overrides
CREATE TABLE IF NOT EXISTS page_seo_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL,
  page_ref_id uuid NOT NULL,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'website',
  twitter_card text DEFAULT 'summary_large_image',
  robots_directive text DEFAULT 'index, follow',
  structured_data_json text,
  focus_keyword text,
  secondary_keywords text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_type, page_ref_id)
);

-- FAQ items (for AEO)
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text,
  page_ref_id uuid,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SEO audit log (monitoring)
CREATE TABLE IF NOT EXISTS seo_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_type text NOT NULL,
  page_type text,
  page_ref_id uuid,
  severity text DEFAULT 'warning',
  message text NOT NULL,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view seo settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Auth can manage seo settings" ON seo_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view page seo" ON page_seo_overrides FOR SELECT USING (true);
CREATE POLICY "Auth can manage page seo" ON page_seo_overrides FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view faqs" ON faq_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Auth can manage faqs" ON faq_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth can manage audit log" ON seo_audit_log FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default SEO settings
INSERT INTO seo_settings (category, key, value) VALUES
-- Global SEO
('seo_global', 'site_title', 'Adviserve - HR & Corporate Services'),
('seo_global', 'site_description', 'India''s trusted partner for end-to-end recruitment, HR services, business consulting, legal compliance, and IT solutions.'),
('seo_global', 'default_og_image', '/Copy_of_adviserve_logo_(300_x_300_px).png'),
('seo_global', 'google_analytics_id', ''),
('seo_global', 'google_search_console', ''),
('seo_global', 'bing_verification', ''),
('seo_global', 'robots_txt', 'User-agent: *\nAllow: /\nSitemap: https://adviserve-website.vercel.app/sitemap.xml'),
-- AEO
('aeo', 'faq_schema_enabled', 'true'),
('aeo', 'howto_schema_enabled', 'false'),
('aeo', 'speakable_enabled', 'false'),
('aeo', 'entity_summary', 'Adviserve is a full-service advisory firm providing recruitment, HR, business consulting, legal, and IT services to Indian businesses.'),
-- GEO
('geo', 'ai_optimized', 'true'),
('geo', 'entity_description', 'Adviserve provides end-to-end recruitment, HR services, business consulting, legal consulting, and IT services across India. Founded to help mid-market companies scale operations, stay compliant, and outperform.'),
('geo', 'key_facts', '{"founded":"India","services":5,"professionals_placed":"3000+","industries":"25+","retention_rate":"96%"}'),
('geo', 'authoritative_sources', '[]'),
-- Local SEO
('local_seo', 'business_name', 'Adviserve'),
('local_seo', 'business_type', 'ProfessionalService'),
('local_seo', 'address_street', ''),
('local_seo', 'address_city', ''),
('local_seo', 'address_state', ''),
('local_seo', 'address_postal', ''),
('local_seo', 'address_country', 'IN'),
('local_seo', 'latitude', ''),
('local_seo', 'longitude', ''),
('local_seo', 'phone', ''),
('local_seo', 'email', ''),
('local_seo', 'website', 'https://adviserve-website.vercel.app'),
('local_seo', 'google_business_url', ''),
('local_seo', 'opening_hours', '[{"day":"Monday","open":"09:00","close":"18:00"},{"day":"Tuesday","open":"09:00","close":"18:00"},{"day":"Wednesday","open":"09:00","close":"18:00"},{"day":"Thursday","open":"09:00","close":"18:00"},{"day":"Friday","open":"09:00","close":"18:00"}]'),
('local_seo', 'service_areas', '[]')
ON CONFLICT (category, key) DO NOTHING;

-- Seed global FAQ items
INSERT INTO faq_items (page_type, page_ref_id, question, answer, sort_order) VALUES
(NULL, NULL, 'What services does Adviserve provide?', 'Adviserve provides five core service verticals: End-to-End Recruitment, HR Services, Business Consulting, Legal Consulting, and IT Services & Consulting. Each vertical includes 7-8 specialised sub-services.', 1),
(NULL, NULL, 'Which industries does Adviserve serve?', 'We serve 25+ industries including technology, manufacturing, healthcare, FMCG, financial services, retail, education, and more.', 2),
(NULL, NULL, 'What is Adviserve''s candidate retention rate?', 'We maintain a 96% 12-month retention rate across all placements, backed by our rigorous pre-vetting and behavioural assessment process.', 3),
(NULL, NULL, 'Does Adviserve operate across India?', 'Yes, Adviserve provides pan-India services with expertise in navigating state-specific regulations and compliance requirements.', 4),
(NULL, NULL, 'How can I get started with Adviserve?', 'You can book a free 30-minute consultation through our Contact page. We''ll discuss your specific needs and recommend the right service package.', 5);
