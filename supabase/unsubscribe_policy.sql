-- Allow anonymous users to update subscriber status (for unsubscribe)
CREATE POLICY "Anyone can unsubscribe" ON email_subscribers
  FOR UPDATE USING (true)
  WITH CHECK (status = 'unsubscribed');
