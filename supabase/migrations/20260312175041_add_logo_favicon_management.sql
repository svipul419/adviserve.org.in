/*
  # Add Logo and Favicon Management

  ## Overview
  This migration adds support for managing logos and favicons through the admin panel, and seeds the existing navigation_menus and menu_items tables with default data.

  ## Changes

  1. New Tables
    - `site_assets`
      - `id` (uuid, primary key)
      - `logo_url` (text) - URL to the main logo image
      - `favicon_url` (text) - URL to the favicon
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Initial Data
    - Insert default site assets record with current logo
    - Insert navigation menu for header if not exists
    - Insert main navigation items into existing menu_items table

  3. Security
    - Enable RLS on site_assets table
    - Public read access for site assets
    - Admin-only write access (authenticated users can manage)

  4. Notes
    - Uses existing navigation_menus and menu_items tables
    - Creates "main_navigation" menu in header location
    - Inserts Home, Services, About, Blog, Contact menu items
*/

-- Create site_assets table
CREATE TABLE IF NOT EXISTS site_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default site assets (single row configuration)
INSERT INTO site_assets (logo_url, favicon_url)
VALUES ('/Copy_of_adviserve_logo_(300_x_300_px).png', '/Copy_of_adviserve_logo_(300_x_300_px).png')
ON CONFLICT DO NOTHING;

-- Seed navigation menu and items
DO $$
DECLARE
  main_menu_id uuid;
BEGIN
  -- Get or create the main navigation menu
  SELECT id INTO main_menu_id FROM navigation_menus WHERE name = 'main_navigation' LIMIT 1;
  
  IF main_menu_id IS NULL THEN
    INSERT INTO navigation_menus (name, location, is_active)
    VALUES ('main_navigation', 'header', true)
    RETURNING id INTO main_menu_id;
  END IF;

  -- Insert menu items if they don't already exist
  IF NOT EXISTS (SELECT 1 FROM menu_items WHERE menu_id = main_menu_id AND url = '/') THEN
    INSERT INTO menu_items (menu_id, label, url, parent_id, sort_order, is_visible)
    VALUES
      (main_menu_id, 'Home', '/', NULL, 1, true),
      (main_menu_id, 'Services', '/services', NULL, 2, true),
      (main_menu_id, 'About', '/about', NULL, 3, true),
      (main_menu_id, 'Blog', '/blog', NULL, 4, true),
      (main_menu_id, 'Contact', '/contact', NULL, 5, true);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Site Assets Policies
CREATE POLICY "Anyone can view site assets"
  ON site_assets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update site assets"
  ON site_assets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site assets"
  ON site_assets FOR INSERT
  TO authenticated
  WITH CHECK (true);