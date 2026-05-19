-- Add theme_template setting
INSERT INTO site_settings (key, value)
VALUES ('theme_template', 'dark-editorial')
ON CONFLICT (key) DO NOTHING;
