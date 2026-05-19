/*
  # Create Legal Documents Management System

  ## Purpose
  Manage legal documents like Privacy Policy, Terms of Service, Data Policy, Cookie Policy, etc.
  with version history and publishing workflow.

  ## New Tables

  ### `legal_documents`
  - `id` (uuid, primary key) - Unique identifier
  - `document_type` (text) - Type of document (privacy_policy, terms_of_service, data_policy, cookie_policy, refund_policy, etc.)
  - `title` (text) - Document title
  - `slug` (text) - URL-friendly identifier
  - `content` (text) - Full document content (supports HTML/rich text)
  - `version` (text) - Version number (e.g., "1.0", "2.1")
  - `status` (text) - draft, published, archived
  - `effective_date` (date) - When this version becomes effective
  - `is_current` (boolean) - Whether this is the current active version
  - `meta_description` (text, nullable) - SEO meta description
  - `created_by` (uuid, nullable) - References admin_users
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `published_at` (timestamptz, nullable) - When published

  ## Indexes
  - Index on `document_type` for fast lookups
  - Index on `slug` for URL routing
  - Index on `is_current` and `status` for active document queries

  ## Security
  - Enable RLS on all tables
  - Authenticated users can view, create, update, and delete documents
  - Public users can view published documents
*/

-- Create legal_documents table
CREATE TABLE IF NOT EXISTS legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type text NOT NULL CHECK (document_type IN (
    'privacy_policy',
    'terms_of_service',
    'data_policy',
    'cookie_policy',
    'refund_policy',
    'disclaimer',
    'acceptable_use',
    'other'
  )),
  title text NOT NULL,
  slug text NOT NULL,
  content text NOT NULL,
  version text DEFAULT '1.0',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  effective_date date,
  is_current boolean DEFAULT false,
  meta_description text,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Enable RLS
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can view all documents"
  ON legal_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create documents"
  ON legal_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON legal_documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents"
  ON legal_documents FOR DELETE
  TO authenticated
  USING (true);

-- Policies for public access (view published documents only)
CREATE POLICY "Public can view published documents"
  ON legal_documents FOR SELECT
  TO anon
  USING (status = 'published' AND is_current = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_documents_slug ON legal_documents(slug);
CREATE INDEX IF NOT EXISTS idx_legal_documents_current ON legal_documents(is_current, status);
CREATE INDEX IF NOT EXISTS idx_legal_documents_status ON legal_documents(status);

-- Create unique constraint for current published documents per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_legal_documents_current_per_type 
  ON legal_documents(document_type) 
  WHERE is_current = true AND status = 'published';

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_legal_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_legal_documents_timestamp'
  ) THEN
    CREATE TRIGGER update_legal_documents_timestamp
      BEFORE UPDATE ON legal_documents
      FOR EACH ROW
      EXECUTE FUNCTION update_legal_documents_updated_at();
  END IF;
END $$;
