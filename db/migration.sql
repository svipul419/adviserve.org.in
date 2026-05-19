-- ============================================================================
-- Adviserve Website — Complete Database Migration for Neon PostgreSQL
-- Generated from codebase reverse-engineering
-- Run this against a fresh Neon database to create all tables and seed data.
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL,
  description   TEXT,
  content       TEXT,
  icon          TEXT,
  image_url     TEXT,
  is_featured   BOOLEAN DEFAULT false,
  is_visible    BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  parent_id     UUID REFERENCES services(id) ON DELETE SET NULL,
  meta_title    TEXT,
  meta_description TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_is_visible ON services(is_visible);

-- ============================================================================
-- 2. BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL,
  content          TEXT,
  excerpt          TEXT,
  image_url        TEXT,
  category         TEXT,
  author           TEXT,
  tags             TEXT[],
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'published', 'archived')),
  is_featured      BOOLEAN DEFAULT false,
  published_at     TIMESTAMPTZ,
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- ============================================================================
-- 3. CONTACT INQUIRIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  company          TEXT,
  service_interest TEXT,
  message          TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);

-- ============================================================================
-- 4. EMAIL SUBSCRIBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_subscribers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL,
  first_name     TEXT,
  last_name      TEXT,
  company        TEXT,
  status         TEXT NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained', 'pending')),
  source         TEXT,
  subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);

-- ============================================================================
-- 5. EMAIL LISTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_lists (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  description      TEXT,
  type             TEXT NOT NULL DEFAULT 'general'
                   CHECK (type IN ('general', 'newsletter', 'marketing', 'customers')),
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_lists_is_active ON email_lists(is_active);

-- ============================================================================
-- 6. EMAIL LIST SUBSCRIBERS (junction table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_list_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id       UUID NOT NULL REFERENCES email_lists(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES email_subscribers(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(list_id, subscriber_id)
);

CREATE INDEX IF NOT EXISTS idx_email_list_subscribers_list ON email_list_subscribers(list_id);
CREATE INDEX IF NOT EXISTS idx_email_list_subscribers_subscriber ON email_list_subscribers(subscriber_id);

-- ============================================================================
-- 7. EMAIL TEMPLATES
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  subject       TEXT NOT NULL,
  preview_text  TEXT,
  html_content  TEXT NOT NULL,
  category      TEXT DEFAULT 'marketing'
                CHECK (category IN ('marketing', 'newsletter', 'transactional', 'notification')),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_is_active ON email_templates(is_active);

-- ============================================================================
-- 8. EMAIL CAMPAIGNS
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_campaigns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  template_id     UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  list_id         UUID REFERENCES email_lists(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at    TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count      INTEGER NOT NULL DEFAULT 0,
  failed_count    INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at DESC);

-- ============================================================================
-- 9. EMAIL CAMPAIGN RECIPIENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_campaign_recipients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign ON email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_status ON email_campaign_recipients(status);

-- ============================================================================
-- 10. LEGAL DOCUMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS legal_documents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type    TEXT NOT NULL,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL,
  content          TEXT NOT NULL,
  version          TEXT NOT NULL DEFAULT '1.0',
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'published', 'archived')),
  effective_date   DATE,
  is_current       BOOLEAN NOT NULL DEFAULT false,
  meta_description TEXT,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_legal_documents_slug ON legal_documents(slug);
CREATE INDEX IF NOT EXISTS idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_documents_status ON legal_documents(status);
CREATE INDEX IF NOT EXISTS idx_legal_documents_is_current ON legal_documents(is_current);

-- ============================================================================
-- 11. SITE SETTINGS (key-value store)
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL,
  value      TEXT NOT NULL DEFAULT '',
  category   TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);

-- ============================================================================
-- 12. SEO SETTINGS (key-value store with category grouping)
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category   TEXT NOT NULL,
  key        TEXT NOT NULL,
  value      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_settings_category_key ON seo_settings(category, key);
CREATE INDEX IF NOT EXISTS idx_seo_settings_category ON seo_settings(category);

-- ============================================================================
-- 13. FAQ ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS faq_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type    TEXT NOT NULL DEFAULT 'global',
  page_ref_id  UUID,
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faq_items_page_type ON faq_items(page_type);
CREATE INDEX IF NOT EXISTS idx_faq_items_sort_order ON faq_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_items_is_visible ON faq_items(is_visible);

-- ============================================================================
-- 14. NAVIGATION MENUS
-- ============================================================================
CREATE TABLE IF NOT EXISTS navigation_menus (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  location   TEXT NOT NULL DEFAULT 'header',
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_navigation_menus_name ON navigation_menus(name);

-- ============================================================================
-- 15. MENU ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id    UUID NOT NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  url        TEXT NOT NULL,
  icon       TEXT,
  target     TEXT NOT NULL DEFAULT '_self',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON menu_items(sort_order);

-- ============================================================================
-- 16. WEBSITE PAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS website_pages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT NOT NULL,
  title            TEXT NOT NULL,
  is_visible       BOOLEAN NOT NULL DEFAULT true,
  meta_description TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_website_pages_slug ON website_pages(slug);

-- ============================================================================
-- 17. WEBSITE CONTENT (CMS content blocks tied to pages)
-- ============================================================================
CREATE TABLE IF NOT EXISTS website_content (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id        UUID NOT NULL REFERENCES website_pages(id) ON DELETE CASCADE,
  section_key    TEXT NOT NULL,
  section_label  TEXT NOT NULL DEFAULT '',
  content_type   TEXT NOT NULL DEFAULT 'text',
  content_value  TEXT NOT NULL DEFAULT '',
  display_order  INTEGER NOT NULL DEFAULT 0,
  is_visible     BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_website_content_page_id ON website_content(page_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_website_content_page_section ON website_content(page_id, section_key);
CREATE INDEX IF NOT EXISTS idx_website_content_display_order ON website_content(display_order);

-- ============================================================================
-- 18. SITE ASSETS (logo, favicon, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_assets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url    TEXT,
  favicon_url TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 19. PAGE ANALYTICS
-- ============================================================================
CREATE TABLE IF NOT EXISTS page_analytics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path    TEXT NOT NULL,
  page_title   TEXT NOT NULL DEFAULT '',
  referrer     TEXT,
  user_agent   TEXT NOT NULL DEFAULT '',
  screen_width INTEGER NOT NULL DEFAULT 0,
  session_id   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_session_id ON page_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON page_analytics(page_path);


-- ============================================================================
-- SEED DATA
-- ============================================================================

-- ── Default website pages ──
INSERT INTO website_pages (slug, title, is_visible) VALUES
  ('home',      'Home',      true),
  ('about',     'About',     true),
  ('contact',   'Contact',   true),
  ('services',  'Services',  true),
  ('blog',      'Blog',      true),
  ('careers',   'Careers',   true),
  ('case-studies', 'Case Studies', true)
ON CONFLICT (slug) DO NOTHING;

-- ── Default navigation menu ──
INSERT INTO navigation_menus (name, location, is_active)
VALUES ('main_navigation', 'header', true)
ON CONFLICT (name) DO NOTHING;

-- ── Default menu items (linked to main_navigation) ──
DO $$
DECLARE
  v_menu_id UUID;
BEGIN
  SELECT id INTO v_menu_id FROM navigation_menus WHERE name = 'main_navigation' LIMIT 1;
  IF v_menu_id IS NOT NULL THEN
    -- Only insert if no items exist for this menu
    IF NOT EXISTS (SELECT 1 FROM menu_items WHERE menu_id = v_menu_id LIMIT 1) THEN
      INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible) VALUES
        (v_menu_id, 'Home',         '/',              1, true),
        (v_menu_id, 'Services',     '/services',      2, true),
        (v_menu_id, 'About',        '/about',         3, true),
        (v_menu_id, 'Case Studies', '/case-studies',   4, true),
        (v_menu_id, 'Careers',      '/careers',        5, true),
        (v_menu_id, 'Blog',         '/blog',           6, true),
        (v_menu_id, 'Contact',      '/contact',        7, true);
    END IF;
  END IF;
END $$;

-- ── Default site settings ──
INSERT INTO site_settings (key, value, category) VALUES
  ('company_name',     'Adviserve Talent & Consulting',   'general'),
  ('company_tagline',  'End-to-End Business Solutions',    'general'),
  ('company_email',    'info@adviserve.org.in',            'contact'),
  ('company_phone',    '',                                 'contact'),
  ('company_address',  '',                                 'contact'),
  ('facebook_url',     '',                                 'social'),
  ('twitter_url',      '',                                 'social'),
  ('linkedin_url',     '',                                 'social'),
  ('instagram_url',    '',                                 'social'),
  ('youtube_url',      '',                                 'social'),
  ('website_url',      '',                                 'social'),
  ('logo_height',      '52',                               'general'),
  ('show_brand_text',  'true',                             'general')
ON CONFLICT (key) DO NOTHING;

-- ── Default SEO settings ──
INSERT INTO seo_settings (category, key, value) VALUES
  ('seo_global', 'site_title',                   'Adviserve Talent & Consulting'),
  ('seo_global', 'site_description',             'End-to-end business solutions — Recruitment, HR, Training, Legal, Business Consulting, and IT Services.'),
  ('seo_global', 'og_image_url',                 ''),
  ('seo_global', 'google_analytics_id',          ''),
  ('seo_global', 'search_console_verification',  ''),
  ('seo_global', 'bing_verification',            ''),
  ('seo_global', 'robots_txt',                   E'User-agent: *\nAllow: /'),
  ('aeo',        'faq_schema_enabled',           'false'),
  ('aeo',        'howto_schema_enabled',          'false'),
  ('aeo',        'speakable_enabled',             'false'),
  ('aeo',        'entity_summary',                ''),
  ('geo',        'entity_description',            ''),
  ('geo',        'key_facts_json',                '[]'),
  ('geo',        'authoritative_sources',         '[]'),
  ('geo',        'ai_optimization_enabled',       'false')
ON CONFLICT (category, key) DO NOTHING;

-- ── Default services ──
INSERT INTO services (title, slug, description, icon, is_visible, is_featured, sort_order, content) VALUES
  ('End-to-End Recruitment', 'recruitment',
   'From executive search to campus hiring — we build talent pipelines that deliver the right people, at the right level, in the right timeframe.',
   '🎯', true, true, 1,
   '<h2>What We Do</h2><p>We handle the entire recruitment lifecycle.</p>'),
  ('HR Services', 'hr-services',
   'Complete HR lifecycle management — from policy design, payroll processing, and compliance audits to performance management systems.',
   '👥', true, true, 2,
   '<h2>What We Do</h2><p>We provide end-to-end human resource services.</p>'),
  ('Corporate Training', 'corporate-training',
   'Customised training programs that build real capability — leadership development, soft skills, technical upskilling, and compliance training.',
   '🎓', true, true, 3,
   '<h2>What We Do</h2><p>We design and deliver training programs that actually change behaviour.</p>'),
  ('Business Consulting', 'business-consulting',
   'Strategic and operational consulting for companies at every stage — from market entry and growth strategy to operational efficiency.',
   '📊', true, true, 4,
   '<h2>What We Do</h2><p>We work with founders, CEOs, and leadership teams to solve problems.</p>'),
  ('Legal Consulting', 'legal-consulting',
   'Indian corporate and employment law advisory — labour law compliance, POSH, contract drafting, regulatory filings, and dispute resolution.',
   '⚖️', true, true, 5,
   '<h2>What We Do</h2><p>We provide practical, business-friendly legal advisory.</p>'),
  ('IT Services & Software Development', 'it-services',
   'Technology consulting, cloud infrastructure, cybersecurity, digital transformation, and custom software development.',
   '💻', true, true, 6,
   '<h2>What We Do</h2><p>We help businesses make smart technology decisions and execute on them.</p>')
ON CONFLICT (slug) DO NOTHING;

-- ── Initial site_assets row ──
INSERT INTO site_assets (logo_url, favicon_url) VALUES ('', '')
ON CONFLICT DO NOTHING;


-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically sets updated_at on row update for any table that has it.
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables that have an updated_at column
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I; CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();',
      tbl, tbl
    );
  END LOOP;
END $$;


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — Enable but allow all for anon/authenticated
-- Adjust these policies for your Supabase/auth setup as needed.
-- ============================================================================
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    -- Public read access
    EXECUTE format(
      'DROP POLICY IF EXISTS "Allow public read" ON %I; CREATE POLICY "Allow public read" ON %I FOR SELECT USING (true);',
      tbl, tbl
    );
    -- Authenticated full access
    EXECUTE format(
      'DROP POLICY IF EXISTS "Allow authenticated full access" ON %I; CREATE POLICY "Allow authenticated full access" ON %I FOR ALL USING (true) WITH CHECK (true);',
      tbl, tbl
    );
  END LOOP;
END $$;


-- ============================================================================
-- DONE
-- ============================================================================
-- All 19 tables created:
--   1.  services
--   2.  blog_posts
--   3.  contact_inquiries
--   4.  email_subscribers
--   5.  email_lists
--   6.  email_list_subscribers
--   7.  email_templates
--   8.  email_campaigns
--   9.  email_campaign_recipients
--   10. legal_documents
--   11. site_settings
--   12. seo_settings
--   13. faq_items
--   14. navigation_menus
--   15. menu_items
--   16. website_pages
--   17. website_content
--   18. site_assets
--   19. page_analytics
-- ============================================================================
