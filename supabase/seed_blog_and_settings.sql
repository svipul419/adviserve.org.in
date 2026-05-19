-- =============================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Fixes bugs #5, #6, #13 from test report
-- =============================================

-- Fix #2: Fix broken logo path
UPDATE site_assets SET logo_url = '/Copy_of_adviserve_logo_(300_x_300_px).png'
WHERE logo_url LIKE '%C:\\%' OR logo_url LIKE '%C:/%' OR logo_url LIKE '%Users%';

-- Fix #5: Add social media links
INSERT INTO site_settings (key, value) VALUES
('linkedin_url', 'https://linkedin.com/company/adviserve')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Fix #6: Add contact info
INSERT INTO site_settings (key, value) VALUES
('company_email', 'info@adviserve.org.in'),
('company_name', 'Adviserve'),
('company_tagline', 'Your end-to-end business services partner')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Fix #13: Add second blog post
INSERT INTO blog_posts (title, slug, excerpt, content, author, status, is_published, published_at, category)
VALUES (
  'How Integrated Business Services Can Save You Time and Money',
  'integrated-business-services-save-time-money',
  'Most growing companies manage HR, legal, and IT through separate vendors. Here is why an integrated approach works better.',
  '<p>Growing businesses often find themselves juggling multiple vendors for essential services. One firm handles HR, another manages legal compliance, a third takes care of IT infrastructure, and a fourth does recruitment. The result? Fragmented communication, duplicated costs, and nobody taking ownership of the bigger picture.</p><h2>The Hidden Cost of Vendor Fragmentation</h2><p>When your HR consultant does not talk to your legal advisor, compliance gaps appear. When your IT vendor does not understand your business strategy, technology decisions get made in isolation. Every handoff between vendors creates a risk of miscommunication, delay, and additional cost.</p><h2>The Integrated Alternative</h2><p>An integrated services firm like Adviserve brings all these functions under one roof. Your HR team knows what legal is working on. Your recruitment strategy aligns with your business growth plan. Your IT infrastructure supports how your teams actually work. One point of contact, one team, zero handoff headaches.</p><h2>Real-World Impact</h2><p>Companies that consolidate their business services typically see 20-30% reduction in vendor management overhead, faster decision-making across departments, and better alignment between business strategy and operational execution.</p><p>If you are spending more time coordinating vendors than running your business, it might be time to consider a different approach.</p>',
  'Adviserve Team',
  'published',
  true,
  now(),
  'Business Strategy'
)
ON CONFLICT (slug) DO NOTHING;

-- Add a third blog post
INSERT INTO blog_posts (title, slug, excerpt, content, author, status, is_published, published_at, category)
VALUES (
  'The Complete Guide to HR Compliance for Indian Startups',
  'hr-compliance-guide-indian-startups',
  'Labour law compliance in India is complex. Here is what every startup founder needs to know about PF, ESI, POSH, and more.',
  '<p>If you are running a startup in India, HR compliance is probably not the first thing on your mind. But it should be somewhere near the top — because getting it wrong can be expensive, disruptive, and in some cases, criminal.</p><h2>The Basics Every Startup Needs</h2><p>Once you cross 10 employees, several compliance requirements kick in automatically: Provident Fund (PF) registration and monthly deposits, Employee State Insurance (ESI) for employees earning below the threshold, Professional Tax registration in applicable states, and POSH (Prevention of Sexual Harassment) compliance including ICC formation.</p><h2>Common Mistakes We See</h2><p>The most common mistake is ignoring compliance until a government notice arrives. By that point, you are dealing with penalties, back-payments, and legal proceedings — all of which are more expensive than getting it right from the start.</p><h2>A Practical Approach</h2><p>Start with a compliance audit. Know where you stand. Then build a calendar of recurring filings and deadlines. Automate what you can. And get expert help for the complex stuff — employment contracts, termination procedures, and the new Labour Codes that are about to change everything.</p><p>If you need help setting up your HR compliance from scratch, that is exactly what we do. Talk to our HR team.</p>',
  'Adviserve Team',
  'published',
  true,
  now() - interval '3 days',
  'HR & Compliance'
)
ON CONFLICT (slug) DO NOTHING;
