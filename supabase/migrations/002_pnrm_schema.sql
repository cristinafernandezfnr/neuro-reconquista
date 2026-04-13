-- ============================================================
-- PNRM – Protocolo Neuro Reconquista Masculina
-- Migration 002: Core PNRM schema
-- ============================================================

-- ── PHASES ────────────────────────────────────────────────
CREATE TABLE phases (
  id            SERIAL PRIMARY KEY,
  number        INTEGER UNIQUE NOT NULL,
  slug          TEXT    UNIQUE NOT NULL,
  title         TEXT    NOT NULL,
  description   TEXT,
  duration_days INTEGER NOT NULL DEFAULT 7,
  -- 'always' | 'phase_{n}_complete'
  unlock_condition TEXT NOT NULL DEFAULT 'always',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── PROFILES (PNRM context — extends existing users table) ──
CREATE TABLE profiles (
  id                      UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name                    TEXT,
  age                     INTEGER CHECK (age BETWEEN 18 AND 100),
  -- 'broken_up' | 'separated' | 'on_hold'
  relationship_status     TEXT,
  -- '1_week' | '1_month' | '3_months' | '6_months' | '1_year_plus'
  breakup_time            TEXT,
  -- 'none' | 'minimal' | 'moderate' | 'frequent'
  current_contact_with_ex TEXT,
  -- 'dating' | 'long_term' | 'engagement'
  relationship_duration   TEXT,
  -- who initiated the breakup
  breakup_initiator       TEXT, -- 'me' | 'her' | 'mutual'
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ── DIAGNOSIS_RESULTS ─────────────────────────────────────
CREATE TABLE diagnosis_results (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  -- 'critical' | 'unstable' | 'stable' | 'recovering'
  emotional_state       TEXT NOT NULL,
  -- 0–100
  probability_reconquest INTEGER NOT NULL CHECK (probability_reconquest BETWEEN 0 AND 100),
  -- 'anxious' | 'avoidant' | 'secure' | 'disorganized'
  attachment_style      TEXT NOT NULL,
  -- recommended starting phase based on diagnosis
  recommended_phase     INTEGER REFERENCES phases(id),
  raw_score             INTEGER NOT NULL,
  questionnaire_answers JSONB  NOT NULL,
  last_analysis_date    TIMESTAMPTZ DEFAULT NOW()
);

-- ── DAILY_TASKS (content managed by admins) ───────────────
CREATE TABLE daily_tasks (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id                INTEGER NOT NULL REFERENCES phases(id),
  day_number              INTEGER NOT NULL CHECK (day_number >= 1),
  title                   TEXT NOT NULL,
  description             TEXT NOT NULL,
  psychological_objective TEXT NOT NULL,
  -- 'reflection' | 'action' | 'exercise' | 'communication' | 'mindset'
  task_type               TEXT NOT NULL DEFAULT 'action',
  -- optional resource attached (audio, video, text)
  resource_url            TEXT,
  resource_type           TEXT, -- 'audio' | 'video' | 'article'
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(phase_id, day_number)
);

-- ── USER_TASKS (completion tracking) ──────────────────────
CREATE TABLE user_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id         UUID NOT NULL REFERENCES daily_tasks(id),
  completed       BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMPTZ,
  notes           TEXT,        -- optional user reflection notes
  emotion_after   TEXT,        -- how user felt after completing
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- ── PROGRESS_TRACKING (per user, per phase) ───────────────
CREATE TABLE progress_tracking (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase_id              INTEGER NOT NULL REFERENCES phases(id),
  completed_tasks       INTEGER DEFAULT 0,
  total_tasks           INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  is_phase_complete     BOOLEAN DEFAULT FALSE,
  last_update           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phase_id)
);

-- ── USER_PHASE_ACCESS (which phases a user can access) ────
CREATE TABLE user_phase_access (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase_id   INTEGER NOT NULL REFERENCES phases(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phase_id)
);

-- ── ADMIN_USERS ────────────────────────────────────────────
CREATE TABLE admin_users (
  id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════
-- INDEXES
-- ════════════════════════════════════════════════════════════

CREATE INDEX idx_daily_tasks_phase    ON daily_tasks(phase_id);
CREATE INDEX idx_user_tasks_user      ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_task      ON user_tasks(task_id);
CREATE INDEX idx_user_tasks_completed ON user_tasks(user_id, completed);
CREATE INDEX idx_progress_user        ON progress_tracking(user_id);
CREATE INDEX idx_progress_phase       ON progress_tracking(phase_id);
CREATE INDEX idx_diagnosis_user       ON diagnosis_results(user_id);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

ALTER TABLE phases             ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_results  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_phase_access  ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users        ENABLE ROW LEVEL SECURITY;

-- Helper: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- phases: everyone authenticated can read; only admins can write
CREATE POLICY "phases_read"   ON phases FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "phases_admin"  ON phases FOR ALL    USING (is_admin());

-- profiles: own row only
CREATE POLICY "profiles_own"  ON profiles FOR ALL  USING (auth.uid() = id);
CREATE POLICY "profiles_admin_read" ON profiles FOR SELECT USING (is_admin());

-- diagnosis_results: own row only
CREATE POLICY "diagnosis_own" ON diagnosis_results FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "diagnosis_admin" ON diagnosis_results FOR SELECT USING (is_admin());

-- daily_tasks: authenticated users read active tasks; admins full access
CREATE POLICY "tasks_read"    ON daily_tasks FOR SELECT TO authenticated USING (is_active = TRUE);
CREATE POLICY "tasks_admin"   ON daily_tasks FOR ALL    USING (is_admin());

-- user_tasks: own rows only
CREATE POLICY "user_tasks_own"   ON user_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_tasks_admin" ON user_tasks FOR SELECT USING (is_admin());

-- progress_tracking: own rows only
CREATE POLICY "progress_own"   ON progress_tracking FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "progress_admin" ON progress_tracking FOR SELECT USING (is_admin());

-- user_phase_access: own rows only
CREATE POLICY "phase_access_own"   ON user_phase_access FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "phase_access_admin" ON user_phase_access FOR SELECT USING (is_admin());

-- admin_users: only admins can read
CREATE POLICY "admin_users_read" ON admin_users FOR SELECT USING (is_admin());

-- ════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ════════════════════════════════════════════════════════════

-- Recalculate progress for a user/phase whenever user_tasks changes
CREATE OR REPLACE FUNCTION recalculate_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_phase_id  INTEGER;
  v_total     INTEGER;
  v_completed INTEGER;
  v_pct       DECIMAL(5,2);
BEGIN
  -- Get phase_id from the task
  SELECT phase_id INTO v_phase_id
  FROM daily_tasks
  WHERE id = COALESCE(NEW.task_id, OLD.task_id);

  -- Count totals
  SELECT COUNT(*)
  INTO v_total
  FROM daily_tasks
  WHERE phase_id = v_phase_id AND is_active = TRUE;

  SELECT COUNT(*)
  INTO v_completed
  FROM user_tasks ut
  JOIN daily_tasks dt ON dt.id = ut.task_id
  WHERE ut.user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND dt.phase_id = v_phase_id
    AND ut.completed = TRUE;

  v_pct := CASE WHEN v_total > 0 THEN ROUND((v_completed::DECIMAL / v_total) * 100, 2) ELSE 0 END;

  INSERT INTO progress_tracking (user_id, phase_id, completed_tasks, total_tasks, completion_percentage, is_phase_complete, last_update)
  VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    v_phase_id,
    v_completed,
    v_total,
    v_pct,
    v_pct >= 100,
    NOW()
  )
  ON CONFLICT (user_id, phase_id) DO UPDATE SET
    completed_tasks       = EXCLUDED.completed_tasks,
    total_tasks           = EXCLUDED.total_tasks,
    completion_percentage = EXCLUDED.completion_percentage,
    is_phase_complete     = EXCLUDED.is_phase_complete,
    last_update           = NOW();

  -- Auto-unlock next phase when current phase is complete
  IF v_pct >= 100 THEN
    INSERT INTO user_phase_access (user_id, phase_id)
    SELECT COALESCE(NEW.user_id, OLD.user_id), p.id
    FROM phases p
    WHERE p.number = (
      SELECT number + 1 FROM phases WHERE id = v_phase_id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recalculate_progress
AFTER INSERT OR UPDATE OR DELETE ON user_tasks
FOR EACH ROW EXECUTE FUNCTION recalculate_progress();

-- Auto-create profile when user row is inserted (extending existing trigger)
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;

  -- Unlock Phase 1 by default
  INSERT INTO user_phase_access (user_id, phase_id)
  SELECT NEW.id, p.id FROM phases p WHERE p.number = 1
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_pnrm
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION handle_new_profile();

-- updated_at auto-maintenance
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_daily_tasks_updated_at
BEFORE UPDATE ON daily_tasks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
