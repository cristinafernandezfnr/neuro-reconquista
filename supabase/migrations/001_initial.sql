CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'pt',
  user_gender TEXT,
  target_gender TEXT,
  streak INT DEFAULT 0,
  current_day INT DEFAULT 1,
  last_activity DATE,
  protocol_access BOOLEAN DEFAULT false,
  protocol_source TEXT,
  protocol_stripe_sub_id TEXT,
  pro_access BOOLEAN DEFAULT false,
  pro_stripe_sub_id TEXT,
  banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  anamnese_score INT,
  anamnese_nivel INT,
  anamnese_reconnect_day INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE anamnese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  score_total INT NOT NULL,
  nivel INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  task_type TEXT NOT NULL,
  exercise_response TEXT,
  emotion TEXT,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_number, task_type)
);

CREATE TABLE sos_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  unsent_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  source TEXT NOT NULL,
  external_id TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "anamnese_own" ON anamnese FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "completions_own" ON task_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "sos_own" ON sos_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "messages_own" ON ai_messages FOR ALL USING (auth.uid() = user_id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
