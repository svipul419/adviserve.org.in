-- ==========================================
-- FIX SCHEMA MISMATCHES
-- Run this in Supabase SQL Editor
-- ==========================================

-- Add missing columns to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description text;

-- Migrate existing is_published data to status column
UPDATE blog_posts SET status = 'published' WHERE is_published = true AND (status IS NULL OR status = 'draft');

-- Add missing columns to email_subscribers
ALTER TABLE email_subscribers ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE email_subscribers ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE email_subscribers ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE email_subscribers ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual';
ALTER TABLE email_subscribers ADD COLUMN IF NOT EXISTS subscribed_at timestamptz DEFAULT now();

-- Backfill subscribed_at from created_at
UPDATE email_subscribers SET subscribed_at = created_at WHERE subscribed_at IS NULL;

-- Add missing columns to services (match TypeScript types)
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_description text;

-- Add meta_title to website_pages
ALTER TABLE website_pages ADD COLUMN IF NOT EXISTS meta_title text;
