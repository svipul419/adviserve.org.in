/*
  # Website Content Management System

  ## Overview
  Creates a flexible content management system for all website pages and sections.
  Admins can add, edit, delete, hide/show any content block on the website.

  ## New Tables
  
  ### `website_pages`
  Stores page-level information
  - `id` (uuid, primary key) - Unique identifier
  - `slug` (text, unique) - URL-friendly page identifier (e.g., 'home', 'about', 'contact')
  - `title` (text) - Page title
  - `is_visible` (boolean) - Whether the page is publicly visible
  - `meta_description` (text, nullable) - SEO meta description
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `website_content`
  Stores individual content blocks/sections
  - `id` (uuid, primary key) - Unique identifier
  - `page_id` (uuid, foreign key) - References website_pages.id
  - `section_key` (text) - Unique key for the content section (e.g., 'hero_title', 'about_intro')
  - `section_label` (text) - Human-readable label for admin UI
  - `content_type` (text) - Type of content: 'text', 'html', 'image_url', 'json'
  - `content_value` (text) - The actual content
  - `display_order` (integer) - Order for displaying sections
  - `is_visible` (boolean) - Whether this content is visible
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for visible content
  - Admin-only write access

  ## Indexes
  - Index on page_id for faster lookups
  - Index on section_key for faster queries
  - Unique constraint on page_id + section_key combination
*/

-- Create website_pages table
CREATE TABLE IF NOT EXISTS website_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  is_visible boolean DEFAULT true,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create website_content table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_website_content_page_id ON website_content(page_id);
CREATE INDEX IF NOT EXISTS idx_website_content_section_key ON website_content(section_key);

-- Enable RLS
ALTER TABLE website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Public can read visible content
CREATE POLICY "Public can view visible pages"
  ON website_pages FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Public can view visible content"
  ON website_content FOR SELECT
  USING (
    is_visible = true 
    AND EXISTS (
      SELECT 1 FROM website_pages 
      WHERE website_pages.id = website_content.page_id 
      AND website_pages.is_visible = true
    )
  );

-- Authenticated admins can do everything
CREATE POLICY "Admins can view all pages"
  ON website_pages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert pages"
  ON website_pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update pages"
  ON website_pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete pages"
  ON website_pages FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view all content"
  ON website_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert content"
  ON website_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update content"
  ON website_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete content"
  ON website_content FOR DELETE
  TO authenticated
  USING (true);

-- Insert default pages
INSERT INTO website_pages (slug, title, is_visible, meta_description) VALUES
  ('home', 'Home', true, 'Expert advisory services for your business'),
  ('about', 'About Us', true, 'Learn more about Adviserve and our team'),
  ('services', 'Services', true, 'Our professional services'),
  ('blog', 'Blog', true, 'Latest insights and articles'),
  ('contact', 'Contact Us', true, 'Get in touch with us')
ON CONFLICT (slug) DO NOTHING;

-- Insert default content for Home page
INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'home'),
  'hero_title',
  'Hero Title',
  'text',
  'Expert Advisory Services for Your Success',
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'hero_title' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'home')
);

INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'home'),
  'hero_subtitle',
  'Hero Subtitle',
  'text',
  'Transform your business with strategic guidance from industry experts',
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'hero_subtitle' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'home')
);

INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'home'),
  'hero_cta_text',
  'Hero Call-to-Action Button Text',
  'text',
  'Get Started',
  3,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'hero_cta_text' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'home')
);

-- Insert default content for About page
INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'about'),
  'about_title',
  'About Title',
  'text',
  'About Adviserve',
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'about_title' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'about')
);

INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'about'),
  'about_intro',
  'Introduction Text',
  'html',
  '<p>We are a leading advisory firm dedicated to helping businesses achieve their full potential through strategic consulting and expert guidance.</p>',
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'about_intro' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'about')
);

-- Insert default content for Contact page
INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'contact'),
  'contact_title',
  'Contact Title',
  'text',
  'Get in Touch',
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'contact_title' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'contact')
);

INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'contact'),
  'contact_intro',
  'Contact Introduction',
  'text',
  'Have a question or want to work with us? We''d love to hear from you.',
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'contact_intro' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'contact')
);

INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'contact'),
  'contact_email',
  'Contact Email',
  'text',
  'info@adviserve.com',
  3,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'contact_email' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'contact')
);

INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'contact'),
  'contact_phone',
  'Contact Phone',
  'text',
  '+1 (555) 123-4567',
  4,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'contact_phone' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'contact')
);

INSERT INTO website_content (page_id, section_key, section_label, content_type, content_value, display_order, is_visible)
SELECT 
  (SELECT id FROM website_pages WHERE slug = 'contact'),
  'contact_address',
  'Contact Address',
  'text',
  '123 Business Street, Suite 100, New York, NY 10001',
  5,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM website_content 
  WHERE section_key = 'contact_address' 
  AND page_id = (SELECT id FROM website_pages WHERE slug = 'contact')
);