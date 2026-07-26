-- PageGuard Database Schema
-- Fully idempotent — safe to run multiple times

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT,
  full_name            TEXT,
  plan                 TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  paddle_customer_id   TEXT,
  paddle_subscription_id TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist (in case table was pre-existing)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 2. MONITORS
CREATE TABLE IF NOT EXISTS monitors (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  url              TEXT NOT NULL,
  interval_minutes INT NOT NULL DEFAULT 5,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  alert_email      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CHECKS
CREATE TABLE IF NOT EXISTS checks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id       UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  status_code      INT,
  response_time_ms INT,
  is_up            BOOLEAN NOT NULL,
  error_message    TEXT,
  checked_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id       UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at      TIMESTAMPTZ,
  duration_seconds INT,
  reason           TEXT
);

-- 5. STATUS PAGES
CREATE TABLE IF NOT EXISTS status_pages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  description   TEXT,
  is_public     BOOLEAN NOT NULL DEFAULT true,
  custom_domain TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. STATUS PAGE <-> MONITOR JOIN
CREATE TABLE IF NOT EXISTS status_page_monitors (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status_page_id UUID NOT NULL REFERENCES status_pages(id) ON DELETE CASCADE,
  monitor_id     UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  UNIQUE(status_page_id, monitor_id)
);

-- INDEXES (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_monitors_user_id ON monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_checks_monitor_id ON checks(monitor_id);
CREATE INDEX IF NOT EXISTS idx_checks_checked_at ON checks(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_monitor_id ON incidents(monitor_id);
CREATE INDEX IF NOT EXISTS idx_status_pages_slug ON status_pages(slug);
CREATE INDEX IF NOT EXISTS idx_status_pages_user_id ON status_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_paddle_customer ON profiles(paddle_customer_id);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_page_monitors ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (drop & recreate to be idempotent)
DROP POLICY IF EXISTS "Own profile select" ON profiles;
DROP POLICY IF EXISTS "Own profile update" ON profiles;
DROP POLICY IF EXISTS "Users own monitors all" ON monitors;
DROP POLICY IF EXISTS "Users view own monitor checks" ON checks;
DROP POLICY IF EXISTS "Service role insert checks" ON checks;
DROP POLICY IF EXISTS "Users view own monitor incidents" ON incidents;
DROP POLICY IF EXISTS "Users own status pages all" ON status_pages;
DROP POLICY IF EXISTS "Anyone read public status pages" ON status_pages;
DROP POLICY IF EXISTS "Users own spm all" ON status_page_monitors;
DROP POLICY IF EXISTS "Anyone read public spm" ON status_page_monitors;

-- Profiles: users can view/update their own
CREATE POLICY "Own profile select"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Own profile update"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Monitors: users own their monitors
CREATE POLICY "Users own monitors all"
  ON monitors FOR ALL USING (auth.uid() = user_id);

-- Checks: users can read checks on their monitors; service role inserts via cron
CREATE POLICY "Users view own monitor checks"
  ON checks FOR SELECT USING (
    EXISTS (SELECT 1 FROM monitors WHERE id = checks.monitor_id AND user_id = auth.uid())
  );
CREATE POLICY "Service role insert checks"
  ON checks FOR INSERT WITH CHECK (true);

-- Incidents
CREATE POLICY "Users view own monitor incidents"
  ON incidents FOR SELECT USING (
    EXISTS (SELECT 1 FROM monitors WHERE id = incidents.monitor_id AND user_id = auth.uid())
  );

-- Status pages
CREATE POLICY "Users own status pages all"
  ON status_pages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone read public status pages"
  ON status_pages FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Status page monitors
CREATE POLICY "Users own spm all"
  ON status_page_monitors FOR ALL USING (
    EXISTS (SELECT 1 FROM status_pages WHERE id = status_page_monitors.status_page_id AND user_id = auth.uid())
  );
CREATE POLICY "Anyone read public spm"
  ON status_page_monitors FOR SELECT USING (
    EXISTS (SELECT 1 FROM status_pages WHERE id = status_page_monitors.status_page_id AND (is_public = true OR user_id = auth.uid()))
  );

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- UPDATE updated_at TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS monitors_updated_at ON monitors;
CREATE TRIGGER monitors_updated_at
  BEFORE UPDATE ON monitors FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- HELPER: Delete old checks (used by cron)
CREATE OR REPLACE FUNCTION delete_old_checks(p_monitor_id UUID, p_count INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM checks
  WHERE id IN (
    SELECT id FROM checks
    WHERE monitor_id = p_monitor_id
    ORDER BY checked_at ASC
    LIMIT p_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
