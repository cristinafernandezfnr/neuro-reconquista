-- ================================================================
-- PNRM Migration 003 — Full Schema Refactor
-- Drops previous PNRM tables (002) and rebuilds from scratch
-- with the real protocol engine structure.
-- ================================================================

-- ── Drop previous PNRM tables (002) ─────────────────────────────
DROP TABLE IF EXISTS user_phase_access    CASCADE;
DROP TABLE IF EXISTS progress_tracking    CASCADE;
DROP TABLE IF EXISTS user_tasks           CASCADE;
DROP TABLE IF EXISTS daily_tasks          CASCADE;
DROP TABLE IF EXISTS diagnosis_results    CASCADE;
DROP TABLE IF EXISTS profiles             CASCADE;
DROP TABLE IF EXISTS admin_users          CASCADE;
DROP TABLE IF EXISTS phases               CASCADE;
DROP FUNCTION IF EXISTS recalculate_progress()      CASCADE;
DROP FUNCTION IF EXISTS handle_new_profile()        CASCADE;
DROP FUNCTION IF EXISTS set_updated_at()            CASCADE;
DROP FUNCTION IF EXISTS is_admin()                  CASCADE;

-- ================================================================
-- CORE TABLES
-- ================================================================

-- ── PHASES ───────────────────────────────────────────────────────
CREATE TABLE phases (
  id                  SERIAL        PRIMARY KEY,
  number              INTEGER       UNIQUE NOT NULL,
  slug                TEXT          UNIQUE NOT NULL,
  title               TEXT          NOT NULL,
  description         TEXT          NOT NULL,
  duration_days       INTEGER       NOT NULL DEFAULT 7,
  psychological_goal  TEXT          NOT NULL,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── TASKS ────────────────────────────────────────────────────────
CREATE TABLE tasks (
  id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id                INTEGER       NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  title                   TEXT          NOT NULL,
  description             TEXT          NOT NULL,
  psychological_purpose   TEXT          NOT NULL,
  -- category: 'emotional_control' | 'attraction_rebuilding' |
  --           'silence_discipline' | 'self_reconstruction' | 're_approach_strategy'
  category                TEXT          NOT NULL DEFAULT 'emotional_control',
  day_number              INTEGER       NOT NULL CHECK (day_number >= 1),
  is_required             BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ   DEFAULT NOW(),
  updated_at              TIMESTAMPTZ   DEFAULT NOW(),
  UNIQUE(phase_id, day_number)
);

-- ── USER_TASKS ───────────────────────────────────────────────────
CREATE TABLE user_tasks (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id       UUID          NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed     BOOLEAN       NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  notes         TEXT,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- ── USER_PHASE_PROGRESS ──────────────────────────────────────────
CREATE TABLE user_phase_progress (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase_id              INTEGER       NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  completion_percentage DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  unlocked              BOOLEAN       NOT NULL DEFAULT FALSE,
  unlocked_at           TIMESTAMPTZ,
  completed             BOOLEAN       NOT NULL DEFAULT FALSE,
  completed_at          TIMESTAMPTZ,
  UNIQUE(user_id, phase_id)
);

-- ── DIAGNOSIS_SESSIONS ───────────────────────────────────────────
CREATE TABLE diagnosis_sessions (
  id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers_json            JSONB         NOT NULL,
  -- 'critical' | 'unstable' | 'stable' | 'recovering'
  emotional_state         TEXT          NOT NULL,
  -- 'anxious' | 'avoidant' | 'secure' | 'disorganized'
  attachment_profile      TEXT          NOT NULL,
  -- 0–100
  reconquest_probability  INTEGER       NOT NULL CHECK (reconquest_probability BETWEEN 0 AND 100),
  -- derived numeric score used for evolution tracking
  raw_score               INTEGER       NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ   DEFAULT NOW()
);

-- ── PROTOCOL_PROGRESS ────────────────────────────────────────────
-- One row per user. Updated by the progress engine on every trigger event.
CREATE TABLE protocol_progress (
  id                        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID          UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_progress_percentage DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  current_phase             INTEGER       REFERENCES phases(id),
  -- component scores (0–100 each, stored for debugging/analytics)
  task_score                DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  emotional_score           DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  consistency_score         DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  diagnosis_score           DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  last_update               TIMESTAMPTZ   DEFAULT NOW()
);

-- ── ADMIN_USERS ──────────────────────────────────────────────────
CREATE TABLE admin_users (
  id         UUID  PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================

CREATE INDEX idx_tasks_phase           ON tasks(phase_id);
CREATE INDEX idx_user_tasks_user       ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_completed  ON user_tasks(user_id, completed);
CREATE INDEX idx_user_tasks_date       ON user_tasks(user_id, completed_at);
CREATE INDEX idx_phase_progress_user   ON user_phase_progress(user_id);
CREATE INDEX idx_diagnosis_user_date   ON diagnosis_sessions(user_id, created_at DESC);
CREATE INDEX idx_protocol_progress     ON protocol_progress(user_id);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE phases               ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_phase_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users          ENABLE ROW LEVEL SECURITY;

-- Admin helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
$$;

-- phases: authenticated read, admin write
CREATE POLICY "phases_read"   ON phases FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "phases_admin"  ON phases FOR ALL USING (is_admin());

-- tasks: authenticated read, admin write
CREATE POLICY "tasks_read"    ON tasks FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "tasks_admin"   ON tasks FOR ALL USING (is_admin());

-- user_tasks: own rows
CREATE POLICY "user_tasks_own"    ON user_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_tasks_admin"  ON user_tasks FOR SELECT USING (is_admin());

-- user_phase_progress: own rows
CREATE POLICY "phase_progress_own"   ON user_phase_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "phase_progress_admin" ON user_phase_progress FOR SELECT USING (is_admin());

-- diagnosis_sessions: own rows
CREATE POLICY "diagnosis_own"   ON diagnosis_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "diagnosis_admin" ON diagnosis_sessions FOR SELECT USING (is_admin());

-- protocol_progress: own rows
CREATE POLICY "protocol_progress_own"   ON protocol_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "protocol_progress_admin" ON protocol_progress FOR SELECT USING (is_admin());

-- admin_users: admin only
CREATE POLICY "admin_users_self" ON admin_users FOR SELECT USING (is_admin());

-- ================================================================
-- PROGRESS ENGINE (PostgreSQL)
-- ================================================================

-- ── Phase progress recalculation ─────────────────────────────────
CREATE OR REPLACE FUNCTION fn_recalculate_phase_progress(
  p_user_id  UUID,
  p_phase_id INTEGER
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_total     INTEGER;
  v_completed INTEGER;
  v_pct       DECIMAL(5,2);
  v_next_phase_id INTEGER;
BEGIN
  -- Count required tasks in phase
  SELECT COUNT(*) INTO v_total
  FROM tasks
  WHERE phase_id = p_phase_id AND is_required = TRUE;

  -- Count completed required tasks by user in this phase
  SELECT COUNT(*) INTO v_completed
  FROM user_tasks ut
  JOIN tasks t ON t.id = ut.task_id
  WHERE ut.user_id  = p_user_id
    AND t.phase_id  = p_phase_id
    AND t.is_required = TRUE
    AND ut.completed  = TRUE;

  v_pct := CASE
    WHEN v_total > 0 THEN ROUND((v_completed::DECIMAL / v_total) * 100, 2)
    ELSE 0
  END;

  -- Upsert phase progress
  INSERT INTO user_phase_progress
    (user_id, phase_id, completion_percentage, completed, completed_at)
  VALUES (
    p_user_id, p_phase_id, v_pct,
    v_pct >= 100,
    CASE WHEN v_pct >= 100 THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id, phase_id) DO UPDATE SET
    completion_percentage = EXCLUDED.completion_percentage,
    completed             = EXCLUDED.completed,
    completed_at          = CASE
                              WHEN EXCLUDED.completed AND user_phase_progress.completed_at IS NULL
                              THEN NOW()
                              ELSE user_phase_progress.completed_at
                            END;

  -- Auto-unlock next phase when this one reaches 100%
  IF v_pct >= 100 THEN
    SELECT ph.id INTO v_next_phase_id
    FROM phases ph
    WHERE ph.number = (SELECT number + 1 FROM phases WHERE id = p_phase_id);

    IF v_next_phase_id IS NOT NULL THEN
      INSERT INTO user_phase_progress
        (user_id, phase_id, unlocked, unlocked_at, completion_percentage, completed)
      VALUES (p_user_id, v_next_phase_id, TRUE, NOW(), 0, FALSE)
      ON CONFLICT (user_id, phase_id) DO UPDATE SET
        unlocked    = TRUE,
        unlocked_at = COALESCE(user_phase_progress.unlocked_at, NOW());
    END IF;
  END IF;
END;
$$;

-- ── Full protocol progress recalculation ──────────────────────────
-- Formula:
--   total = task_score×0.40 + emotional_score×0.25 + consistency_score×0.20 + diagnosis_score×0.15
CREATE OR REPLACE FUNCTION fn_recalculate_protocol_progress(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_task_score        DECIMAL(5,2) := 0;
  v_emotional_score   DECIMAL(5,2) := 0;
  v_consistency_score DECIMAL(5,2) := 0;
  v_diagnosis_score   DECIMAL(5,2) := 0;
  v_total             DECIMAL(5,2) := 0;
  v_current_phase_id  INTEGER;
  v_active_days       INTEGER := 0;
  v_latest_diag       RECORD;
  v_first_diag_prob   INTEGER := 0;
BEGIN
  -- ── 1. TASK SCORE (40%) ─────────────────────────────────────
  -- Only count required tasks across all phases
  SELECT
    CASE WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND(
      (SUM(CASE WHEN ut.completed THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100,
    2) END
  INTO v_task_score
  FROM tasks t
  LEFT JOIN user_tasks ut ON ut.task_id = t.id AND ut.user_id = p_user_id
  WHERE t.is_required = TRUE;

  -- ── 2. EMOTIONAL SCORE (25%) ────────────────────────────────
  -- Derived from latest diagnosis emotional_state
  SELECT emotional_state, reconquest_probability, raw_score
  INTO v_latest_diag
  FROM diagnosis_sessions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    v_emotional_score := CASE v_latest_diag.emotional_state
      WHEN 'recovering' THEN 90
      WHEN 'stable'     THEN 70
      WHEN 'unstable'   THEN 40
      WHEN 'critical'   THEN 20
      ELSE 0
    END;
  END IF;

  -- ── 3. CONSISTENCY SCORE (20%) ──────────────────────────────
  -- Active days (days with ≥1 completed task) in last 14 days
  SELECT COUNT(DISTINCT DATE(completed_at))
  INTO v_active_days
  FROM user_tasks
  WHERE user_id    = p_user_id
    AND completed  = TRUE
    AND completed_at >= NOW() - INTERVAL '14 days';

  v_consistency_score := LEAST(100, ROUND((v_active_days::DECIMAL / 14) * 100, 2));

  -- ── 4. DIAGNOSIS EVOLUTION SCORE (15%) ─────────────────────
  -- Measures how much the user has improved since first diagnosis
  SELECT reconquest_probability INTO v_first_diag_prob
  FROM diagnosis_sessions
  WHERE user_id = p_user_id
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_latest_diag IS NOT NULL AND v_first_diag_prob IS NOT NULL THEN
    -- If they've improved: score reflects the improvement curve
    -- If only one session: score = the reconquest probability itself
    v_diagnosis_score := CASE
      WHEN v_latest_diag.reconquest_probability > v_first_diag_prob
      THEN LEAST(100, ROUND(
        ((v_latest_diag.reconquest_probability - v_first_diag_prob)::DECIMAL
         / GREATEST(v_first_diag_prob, 1)) * 100, 2
      ))
      ELSE ROUND(v_latest_diag.reconquest_probability::DECIMAL, 2)
    END;
  END IF;

  -- ── WEIGHTED TOTAL ────────────────────────────────────────
  v_total := ROUND(
    (v_task_score        * 0.40) +
    (v_emotional_score   * 0.25) +
    (v_consistency_score * 0.20) +
    (v_diagnosis_score   * 0.15),
  2);

  -- Current phase: highest unlocked phase that is not yet completed
  SELECT phase_id INTO v_current_phase_id
  FROM user_phase_progress
  WHERE user_id = p_user_id AND unlocked = TRUE
  ORDER BY phase_id DESC
  LIMIT 1;

  -- Upsert protocol_progress
  INSERT INTO protocol_progress
    (user_id, total_progress_percentage, current_phase,
     task_score, emotional_score, consistency_score, diagnosis_score, last_update)
  VALUES (
    p_user_id, v_total, v_current_phase_id,
    v_task_score, v_emotional_score, v_consistency_score, v_diagnosis_score,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_progress_percentage = EXCLUDED.total_progress_percentage,
    current_phase             = EXCLUDED.current_phase,
    task_score                = EXCLUDED.task_score,
    emotional_score           = EXCLUDED.emotional_score,
    consistency_score         = EXCLUDED.consistency_score,
    diagnosis_score           = EXCLUDED.diagnosis_score,
    last_update               = NOW();
END;
$$;

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Trigger: recalculate on task completion change
CREATE OR REPLACE FUNCTION trg_fn_user_task_changed()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_phase_id INTEGER;
BEGIN
  SELECT phase_id INTO v_phase_id
  FROM tasks WHERE id = COALESCE(NEW.task_id, OLD.task_id);

  IF v_phase_id IS NOT NULL THEN
    PERFORM fn_recalculate_phase_progress(
      COALESCE(NEW.user_id, OLD.user_id), v_phase_id
    );
  END IF;

  PERFORM fn_recalculate_protocol_progress(
    COALESCE(NEW.user_id, OLD.user_id)
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_user_task_changed
AFTER INSERT OR UPDATE OR DELETE ON user_tasks
FOR EACH ROW EXECUTE FUNCTION trg_fn_user_task_changed();

-- Trigger: recalculate when a new diagnosis is submitted
CREATE OR REPLACE FUNCTION trg_fn_diagnosis_submitted()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM fn_recalculate_protocol_progress(NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_diagnosis_submitted
AFTER INSERT ON diagnosis_sessions
FOR EACH ROW EXECUTE FUNCTION trg_fn_diagnosis_submitted();

-- Trigger: initialize phase 1 for new users
CREATE OR REPLACE FUNCTION trg_fn_new_user_init()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_phase1_id INTEGER;
BEGIN
  SELECT id INTO v_phase1_id FROM phases WHERE number = 1;

  IF v_phase1_id IS NOT NULL THEN
    INSERT INTO user_phase_progress (user_id, phase_id, unlocked, unlocked_at, completion_percentage, completed)
    VALUES (NEW.id, v_phase1_id, TRUE, NOW(), 0, FALSE)
    ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO protocol_progress (user_id) VALUES (NEW.id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_new_user_init
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION trg_fn_new_user_init();

-- updated_at maintenance
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
