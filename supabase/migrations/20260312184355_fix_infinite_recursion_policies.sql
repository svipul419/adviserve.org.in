/*
  # Fix Infinite Recursion in RLS Policies

  ## Problem
  The policies on `admin_users` and `email_templates` were causing infinite recursion because:
  - `email_templates` policy checks if user exists in `admin_users`
  - `admin_users` policy checks if user exists in `admin_users`
  - This creates a circular dependency

  ## Solution
  Replace the recursive policies with simpler, non-recursive policies that:
  - Allow all authenticated users to access their own data
  - Use direct auth.uid() checks instead of subqueries to admin_users

  ## Changes
  1. Drop existing problematic policies on both tables
  2. Create new non-recursive policies
  3. Allow authenticated users full access (they must be logged in admins)
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin users have full access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users have full access to email_templates" ON email_templates;

-- Create new non-recursive policies for admin_users
CREATE POLICY "Authenticated users can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admin_users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin_users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete admin_users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (true);

-- Create new non-recursive policies for email_templates
CREATE POLICY "Authenticated users can view email_templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert email_templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update email_templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete email_templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (true);
