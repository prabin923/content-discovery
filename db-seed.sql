-- Demo account for local development
-- Email: admin@demo.com
-- Password: password

INSERT INTO users (email, username, password_hash, first_name, last_name, interests)
VALUES (
  'admin@demo.com',
  'admin',
  '$2b$10$I/0nqPkgOlS/YPfTvGEbd.uMF7i7YD6XB3ptTW/qMdex1bi3/AIga',
  'Demo',
  'Admin',
  ARRAY['technology', 'ai', 'research']
)
ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  interests = EXCLUDED.interests,
  updated_at = NOW();
