-- TIER 4: FRANCHISE & MONETIZATION SCHEMA

-- 1. GYMS TABLE (The parent organization)
CREATE TABLE IF NOT EXISTS gyms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BRANCHES TABLE (Specific gym locations)
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. UPDATED USER PROFILES (Link trainers to branches)
-- Assuming a profiles table already exists, we alter it
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS gym_id UUID REFERENCES gyms(id),
ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id),
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'trainer'; -- 'trainer', 'manager', 'superadmin'

-- 4. SUPPLEMENT PRODUCTS (Internal store data)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 100,
  image_url TEXT,
  category TEXT, -- 'Protein', 'Vitamin', 'Gear'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE (Monetization tracking)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  trainer_id UUID REFERENCES auth.users(id),
  member_id UUID REFERENCES members(id), -- Assuming members table exists from Tier 1/2
  items JSONB NOT NULL, -- Array of {product_id, qty, price}
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'delivered', 'cancelled'
  payment_id TEXT, -- Razorpay ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RLS POLICIES (DATA ISOLATION)
-- Trainers only see orders from their branch
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainers_view_branch_orders" ON orders
  FOR SELECT TO authenticated
  USING (branch_id IN (
    SELECT branch_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "trainers_create_orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (branch_id IN (
    SELECT branch_id FROM profiles WHERE id = auth.uid()
  ));

-- 7. PERMANENT AI SWAPS (Persistence)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS meal_overrides JSONB;

-- 8. TIER 6: GAMIFICATION & ECOSYSTEM
ALTER TABLE members ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS last_log_date DATE;

-- INITIAL DATA (BOOTSTRAP)
-- Run these only if tables are empty
-- INSERT INTO gyms (name) VALUES ('Step2 Fitness Studio');
-- INSERT INTO branches (gym_id, name, location) VALUES ((SELECT id FROM gyms LIMIT 1), 'Valasarawakkam', 'Chennai');
