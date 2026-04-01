-- ================================================================
-- STEP2 FITNESS — SUPABASE DATABASE SETUP
-- ================================================================
-- Run this ENTIRE block in:
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ================================================================

-- 1. MEMBERS table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  age INT,
  gender TEXT,
  height NUMERIC,
  weight NUMERIC,
  goal TEXT,
  activity TEXT,
  medical TEXT DEFAULT 'None',
  vegetarian TEXT DEFAULT 'No',
  allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PLANS table
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  duration TEXT,
  plan_data JSONB NOT NULL,
  metrics JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PLAN VERSIONS (audit history)
CREATE TABLE IF NOT EXISTS plan_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  version_number INT DEFAULT 1,
  snapshot JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (Each trainer sees only their own data)
-- ================================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_versions ENABLE ROW LEVEL SECURITY;

-- Members: Trainer can only CRUD their own members
CREATE POLICY "trainer_members" ON members 
  FOR ALL USING (trainer_id = auth.uid());

-- Plans: Trainer can only CRUD their own plans
CREATE POLICY "trainer_plans" ON plans 
  FOR ALL USING (trainer_id = auth.uid());

-- Versions: Trainer can only see versions they created
CREATE POLICY "trainer_versions" ON plan_versions 
  FOR ALL USING (changed_by = auth.uid());

-- ================================================================
-- INDEXES for performance
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_members_trainer ON members(trainer_id);
CREATE INDEX IF NOT EXISTS idx_plans_member ON plans(member_id);
CREATE INDEX IF NOT EXISTS idx_plans_trainer ON plans(trainer_id);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);

-- ================================================================
-- DONE! Now go to Authentication → Users and click "Invite User"
-- to create your trainer account, or use the app's Sign Up form.
-- ================================================================

-- 4. FOOD LOGS (Member meal tracking)
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  calories INT,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  meal_type TEXT, -- Breakfast, Lunch, etc.
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Trainer sees their members logs
CREATE POLICY "trainer_food_logs" ON food_logs 
 FOR ALL USING (trainer_id = auth.uid());
