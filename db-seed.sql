-- Optional reference data (no user accounts — register via the app)
INSERT INTO categories (name, slug, description, created_at)
VALUES
  ('Technology', 'technology', 'Software, gadgets, and digital innovation', NOW()),
  ('Science', 'science', 'Research and scientific discovery', NOW()),
  ('Business', 'business', 'Startups, markets, and entrepreneurship', NOW())
ON CONFLICT (slug) DO NOTHING;
