/*
  # Create Email Campaign System

  ## New Tables
  
  ### `email_campaigns`
  - `id` (uuid, primary key)
  - `name` (text) - Campaign name
  - `template_id` (uuid) - References email_templates
  - `list_id` (uuid, nullable) - References email_lists for bulk sends
  - `status` (text) - draft, scheduled, sending, sent, failed
  - `scheduled_at` (timestamptz, nullable) - When to send
  - `sent_at` (timestamptz, nullable) - When it was sent
  - `recipient_count` (integer) - Total recipients
  - `sent_count` (integer) - Successfully sent
  - `failed_count` (integer) - Failed sends
  - `created_by` (uuid, nullable) - References admin_users
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `email_campaign_recipients`
  - `id` (uuid, primary key)
  - `campaign_id` (uuid) - References email_campaigns
  - `subscriber_id` (uuid, nullable) - References email_subscribers
  - `email` (text) - Recipient email
  - `status` (text) - pending, sent, failed, bounced
  - `sent_at` (timestamptz, nullable)
  - `error_message` (text, nullable)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users
*/

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  list_id uuid REFERENCES email_lists(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email_campaign_recipients table
CREATE TABLE IF NOT EXISTS email_campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE NOT NULL,
  subscriber_id uuid REFERENCES email_subscribers(id) ON DELETE SET NULL,
  email text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Policies for email_campaigns
CREATE POLICY "Authenticated users can view campaigns"
  ON email_campaigns FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create campaigns"
  ON email_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update campaigns"
  ON email_campaigns FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete campaigns"
  ON email_campaigns FOR DELETE
  TO authenticated
  USING (true);

-- Policies for email_campaign_recipients
CREATE POLICY "Authenticated users can view recipients"
  ON email_campaign_recipients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create recipients"
  ON email_campaign_recipients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipients"
  ON email_campaign_recipients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete recipients"
  ON email_campaign_recipients FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled ON email_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON email_campaign_recipients(status);
