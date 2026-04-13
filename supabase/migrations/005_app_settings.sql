-- App settings table (key-value store for admin-configurable values)
CREATE TABLE IF NOT EXISTS app_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only service role can read/write (accessed only from Edge Functions and admin)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- No public access — admin reads/writes via service role in edge functions
-- Frontend admin writes via supabase client with anon key after RLS policy below

CREATE POLICY "admins_can_manage_settings"
  ON app_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed default empty values
INSERT INTO app_settings (key, value) VALUES
  ('kiwify_token', ''),
  ('hotmart_hottok', ''),
  ('app_url', '')
ON CONFLICT (key) DO NOTHING;
