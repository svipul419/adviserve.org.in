-- Page analytics tracking table
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  screen_width INTEGER,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for efficient querying
CREATE INDEX idx_page_analytics_created_at ON page_analytics(created_at DESC);
CREATE INDEX idx_page_analytics_page_path ON page_analytics(page_path);
CREATE INDEX idx_page_analytics_session ON page_analytics(session_id);

-- Allow anonymous inserts (for tracking) but restrict reads to authenticated users
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
  ON page_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read analytics"
  ON page_analytics FOR SELECT
  USING (auth.role() = 'authenticated');
