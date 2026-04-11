-- ARGO WEIGHT TRACKER - SUPABASE SCHEMA
-- Author: Antigravity AI
-- Description: Complete schema for Coaches and Athletes with RLS security policies.

-- 1. EXTENSION SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS weight_unit CASCADE;
DROP TYPE IF EXISTS photo_view_type CASCADE;
DROP TYPE IF EXISTS photo_request_status CASCADE;

CREATE TYPE user_role AS ENUM ('coach', 'client');
CREATE TYPE weight_unit AS ENUM ('kg', 'lbs');
CREATE TYPE photo_view_type AS ENUM ('front', 'side', 'back');
CREATE TYPE photo_request_status AS ENUM ('pending', 'completed', 'overdue', 'declined');

-- 3. TABLES

-- Profiles (Linked to Auth.Users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client specific settings and relations
CREATE TABLE client_settings (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES profiles(id),
  unit weight_unit DEFAULT 'kg',
  country TEXT,
  target_weekly_rate NUMERIC(5, 2) DEFAULT -0.5, -- Coach target
  milestone NUMERIC(6, 2),
  milestone_achieved BOOLEAN DEFAULT FALSE,
  timezone TEXT DEFAULT 'UTC',
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '08:00',
  show_moving_average BOOLEAN DEFAULT TRUE,
  notify_lowest BOOLEAN DEFAULT TRUE,
  notify_highest BOOLEAN DEFAULT TRUE,
  notify_rate_deviation BOOLEAN DEFAULT TRUE,
  notify_weight_modified BOOLEAN DEFAULT TRUE,
  notify_photo_request BOOLEAN DEFAULT TRUE
);

-- Nutrition Plans
CREATE TABLE nutrition_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER DEFAULT 0,
  carbs INTEGER DEFAULT 0,
  fats INTEGER DEFAULT 0,
  pdf_url TEXT, -- Link to storage
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Physique Photos
CREATE TABLE physique_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  photo_url TEXT NOT NULL,
  view_type photo_view_type NOT NULL,
  notes TEXT,
  is_example BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo Requests
CREATE TABLE photo_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_date DATE DEFAULT CURRENT_DATE,
  target_date DATE NOT NULL,
  status photo_request_status DEFAULT 'pending',
  view_type photo_view_type NOT NULL,
  photo_id UUID REFERENCES physique_photos(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ
);

-- Weight Entries (Time-series)
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight NUMERIC(6, 2) NOT NULL,
  notes TEXT,
  recorded_by user_role NOT NULL DEFAULT 'client',
  moving_average NUMERIC(6, 2), -- DEMA value
  weekly_rate NUMERIC(5, 2), -- Calculated rate
  exclude_from_calculations BOOLEAN DEFAULT FALSE,
  is_lowest BOOLEAN DEFAULT FALSE,
  is_highest BOOLEAN DEFAULT FALSE,
  active_nutrition_id UUID REFERENCES nutrition_plans(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(client_id, date) -- One entry per day per client
);

-- Alerts (Coach Dashboard)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- lowest, highest, rate_deviation, weight_modified, etc.
  message TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  entry_id UUID REFERENCES weight_entries(id) ON DELETE SET NULL,
  photo_url TEXT
);

-- Client Notifications (Daily App)
CREATE TABLE client_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB -- Contextual data
);

-- Tutorial Videos (For Photo Requests)
CREATE TABLE tutorial_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL if global by platform
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  view_type photo_view_type, -- front, side, back
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LMS: Training Modules
CREATE TABLE training_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE -- FALSE if exclusive to coach's clients
);

-- LMS: Lessons
CREATE TABLE training_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  content_markdown TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LMS: Student Progress
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES training_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_id)
);

-- 4. ROW LEVEL SECURITY (RLS) policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE physique_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Client Settings Policies
CREATE POLICY "Clients see their own settings." ON client_settings
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Coaches see their clients settings." ON client_settings
  FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Coaches update their clients settings." ON client_settings
  FOR UPDATE USING (auth.uid() = coach_id);

-- Weight Entries Policies
CREATE POLICY "Clients see and manage their own weight entries." ON weight_entries
  FOR ALL USING (auth.uid() = client_id);
CREATE POLICY "Coaches can see and manage weight entries for their clients." ON weight_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM client_settings 
      WHERE client_settings.id = weight_entries.client_id 
      AND client_settings.coach_id = auth.uid()
    )
  );

-- Physique Photos Policies
CREATE POLICY "Clients manage their own photos." ON physique_photos
  FOR ALL USING (auth.uid() = client_id);
CREATE POLICY "Coaches see their clients photos." ON physique_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_settings 
      WHERE client_settings.id = physique_photos.client_id 
      AND client_settings.coach_id = auth.uid()
    )
  );

-- Alerts Policies
CREATE POLICY "Coaches manage their alerts." ON alerts
  FOR ALL USING (auth.uid() = coach_id);

-- Client Notifications Policies
CREATE POLICY "Clients manage their notifications." ON client_notifications
  FOR ALL USING (auth.uid() = client_id);

-- Tutorial Videos Policies
CREATE POLICY "Tutorial videos are viewable by all authenticated users." ON tutorial_videos
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Coaches manage their tutorial videos." ON tutorial_videos
  FOR ALL USING (auth.uid() = coach_id);

-- Training Modules Policies
CREATE POLICY "Modules viewable by relevant users." ON training_modules
  FOR SELECT USING (
    is_public OR 
    auth.uid() = coach_id OR 
    EXISTS (
      SELECT 1 FROM client_settings 
      WHERE client_settings.id = auth.uid() 
      AND client_settings.coach_id = training_modules.coach_id
    )
  );
CREATE POLICY "Coaches manage their modules." ON training_modules
  FOR ALL USING (auth.uid() = coach_id);

-- Training Lessons Policies
CREATE POLICY "Lessons viewable by module access." ON training_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM training_modules 
      WHERE training_modules.id = training_lessons.module_id 
      AND (
        training_modules.is_public OR 
        auth.uid() = training_modules.coach_id OR 
        EXISTS (
          SELECT 1 FROM client_settings 
          WHERE client_settings.id = auth.uid() 
          AND client_settings.coach_id = training_modules.coach_id
        )
      )
    )
  );
CREATE POLICY "Coaches manage their lessons." ON training_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM training_modules 
      WHERE training_modules.id = training_lessons.module_id 
      AND training_modules.coach_id = auth.uid()
    )
  );

-- Progress Policies
CREATE POLICY "Users manage their own progress." ON user_lesson_progress
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Coaches see their students progress." ON user_lesson_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_settings 
      WHERE client_settings.id = user_lesson_progress.user_id 
      AND client_settings.coach_id = auth.uid()
    )
  );

-- 5. TRIGGER FOR NEW USER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, (new.raw_user_meta_data->>'role')::user_role);
  
  -- If client, link to initial settings
  IF (new.raw_user_meta_data->>'role') = 'client' THEN
    INSERT INTO public.client_settings (id, coach_id)
    VALUES (new.id, (new.raw_user_meta_data->>'coach_id')::UUID);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5.1 TRIGGER FOR MILESTONE MOTIVATION
-- Notifies the athlete when the coach sets or updates their weight goal.
CREATE OR REPLACE FUNCTION public.notify_milestone_update()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.milestone IS DISTINCT FROM NEW.milestone) THEN
    INSERT INTO public.client_notifications (client_id, type, message, data)
    VALUES (
      NEW.id, 
      'milestone_set', 
      '¡Tu coach ha fijado una nueva meta de ' || NEW.milestone || ' ' || NEW.unit || '! ¡Vamos con todo! 🚀',
      jsonb_build_object('milestone', NEW.milestone, 'unit', NEW.unit)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_milestone_updated
  AFTER UPDATE OF milestone ON public.client_settings
  FOR EACH ROW EXECUTE PROCEDURE public.notify_milestone_update();

-- 5.2 AUTOMATED DEMA CALCULATION (THE BRAIN)
-- Automatically calculates Moving Average and Weekly Rate using Exponential Smoothing.
CREATE OR REPLACE FUNCTION public.calculate_weight_metrics()
RETURNS TRIGGER AS $$
DECLARE
    prev_ma NUMERIC;
    alpha NUMERIC := 0.25; -- Smoothing factor for DEMA (consistent with ARGO formula)
BEGIN
    -- Only calculate if not excluded
    IF NEW.exclude_from_calculations = FALSE THEN
        -- Get previous moving average
        SELECT moving_average INTO prev_ma 
        FROM public.weight_entries 
        WHERE client_id = NEW.client_id AND date < NEW.date 
        ORDER BY date DESC LIMIT 1;

        IF prev_ma IS NULL THEN
            NEW.moving_average := NEW.weight;
        ELSE
            -- DEMA formula logic
            NEW.moving_average := ROUND((NEW.weight * alpha + prev_ma * (1 - alpha))::numeric, 2);
            -- Weekly Rate (approximation based on latest change)
            NEW.weekly_rate := ROUND((NEW.moving_average - prev_ma)::numeric, 2);
        END IF;
        
        -- Link nearest nutrition plan
        SELECT id INTO NEW.active_nutrition_id
        FROM public.nutrition_plans
        WHERE client_id = NEW.client_id AND start_date <= NEW.date
        ORDER BY start_date DESC LIMIT 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_weight_entry_insert_update
  BEFORE INSERT OR UPDATE OF weight, date, exclude_from_calculations ON public.weight_entries
  FOR EACH ROW EXECUTE PROCEDURE public.calculate_weight_metrics();

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX idx_weight_entries_client_date ON weight_entries(client_id, date DESC);
CREATE INDEX idx_physique_photos_client_date ON physique_photos(client_id, date DESC);
CREATE INDEX idx_alerts_coach_read ON alerts(coach_id, is_read);
CREATE INDEX idx_client_notifications_client_read ON client_notifications(client_id, is_read);
CREATE INDEX idx_lessons_module_order ON training_lessons(module_id, order_index ASC);
CREATE INDEX idx_progress_user_lesson ON user_lesson_progress(user_id, lesson_id);

-- 7. CLOUDFLARE R2 INTEGRATION (Recommended)
-- ARGO utilizes R2 for all multimedia assets. 
-- The database stores 'key' or 'public_url' as TEXT.
-- Presigned URLs should be generated via Workers.

-- ==========================================
-- 26. INFLUENCERS TABLE
-- ==========================================

CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ig_handle TEXT NOT NULL,
  tiktok_handle TEXT,
  email TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'nano',
  followers INTEGER DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0,
  country TEXT NOT NULL,
  ref_code TEXT UNIQUE NOT NULL,
  cpm_agreed NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'prospect',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;

-- Allow reading of influencers across the board, but only super admins can manage them.
CREATE POLICY "Public influencers reading" ON influencers
  FOR SELECT USING (true);

-- Admins can manage influencers, everyone else has no access by default.
-- For super_admin role, we allow full access. Since we use `profiles.role = super_admin`
-- we need to check the profile role:
CREATE POLICY "Super admins can manage influencers." ON influencers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
