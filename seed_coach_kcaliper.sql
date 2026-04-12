-- ============================================================================
-- SEED DATA: coach@kcaliper.ai — REAL BACKEND DATA
-- ============================================================================
-- Run in Supabase SQL Editor. This creates REAL rows in auth.users, profiles,
-- client_settings, weight_entries, nutrition_plans, and alerts.
-- The DB triggers (DEMA, weekly_rate) fire automatically on weight_entries INSERT.
-- ============================================================================

-- ===== STEP 0: DEFINE ALL UUIDs =====
-- We use deterministic UUIDs so the script is idempotent.
DO $$
DECLARE
  -- Coach
  v_coach_id UUID := 'c0ac0000-0000-4000-a000-000000000001';
  -- Atleta (the user's own athlete account)
  v_atleta_id UUID := 'a71e0000-0000-4000-a000-000000000001';
  -- Demo clients under this coach
  v_client_1 UUID := 'c11e0001-0000-4000-a000-000000000001'; -- Andrea López
  v_client_2 UUID := 'c11e0002-0000-4000-a000-000000000002'; -- Diego Ramírez
  v_client_3 UUID := 'c11e0003-0000-4000-a000-000000000003'; -- Valentina Torres
  v_client_4 UUID := 'c11e0004-0000-4000-a000-000000000004'; -- Marco Gutiérrez
BEGIN

  -- ===== STEP 1: CREATE AUTH USERS =====
  -- Coach account
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'coach@kcaliper.ai') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      v_coach_id,
      '00000000-0000-0000-0000-000000000000',
      'coach@kcaliper.ai',
      crypt('coach', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Coach Kcaliper', 'role', 'coach'),
      'authenticated', 'authenticated', now(), now()
    );
  ELSE
    SELECT id INTO v_coach_id FROM auth.users WHERE email = 'coach@kcaliper.ai';
  END IF;

  -- Atleta account
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'atleta@kcaliper.ai') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      v_atleta_id,
      '00000000-0000-0000-0000-000000000000',
      'atleta@kcaliper.ai',
      crypt('atleta', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Atleta Demo', 'role', 'client', 'coach_id', v_coach_id::text),
      'authenticated', 'authenticated', now(), now()
    );
  ELSE
    SELECT id INTO v_atleta_id FROM auth.users WHERE email = 'atleta@kcaliper.ai';
  END IF;

  -- Demo Client 1: Andrea López
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      v_client_1,
      '00000000-0000-0000-0000-000000000000',
      'andrea.lopez@demo.kcaliper.ai',
      crypt('demo1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Andrea López', 'role', 'client', 'coach_id', v_coach_id::text),
      'authenticated', 'authenticated', now() - interval '90 days', now()
    );
  ELSE
    SELECT id INTO v_client_1 FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai';
  END IF;

  -- Demo Client 2: Diego Ramírez
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      v_client_2,
      '00000000-0000-0000-0000-000000000000',
      'diego.ramirez@demo.kcaliper.ai',
      crypt('demo1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Diego Ramírez', 'role', 'client', 'coach_id', v_coach_id::text),
      'authenticated', 'authenticated', now() - interval '60 days', now()
    );
  ELSE
    SELECT id INTO v_client_2 FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai';
  END IF;

  -- Demo Client 3: Valentina Torres
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      v_client_3,
      '00000000-0000-0000-0000-000000000000',
      'valentina.torres@demo.kcaliper.ai',
      crypt('demo1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Valentina Torres', 'role', 'client', 'coach_id', v_coach_id::text),
      'authenticated', 'authenticated', now() - interval '45 days', now()
    );
  ELSE
    SELECT id INTO v_client_3 FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai';
  END IF;

  -- Demo Client 4: Marco Gutiérrez
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      v_client_4,
      '00000000-0000-0000-0000-000000000000',
      'marco.gutierrez@demo.kcaliper.ai',
      crypt('demo1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', 'Marco Gutiérrez', 'role', 'client', 'coach_id', v_coach_id::text),
      'authenticated', 'authenticated', now() - interval '30 days', now()
    );
  ELSE
    SELECT id INTO v_client_4 FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai';
  END IF;

END $$;

-- ===== STEP 2: ENSURE PROFILES EXIST =====
-- (The trigger on auth.users should handle this, but we do upserts to be safe)
INSERT INTO profiles (id, full_name, email, role) VALUES
  ((SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'), 'Coach Kcaliper', 'coach@kcaliper.ai', 'coach'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), 'Atleta Demo', 'atleta@kcaliper.ai', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), 'Andrea López', 'andrea.lopez@demo.kcaliper.ai', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), 'Diego Ramírez', 'diego.ramirez@demo.kcaliper.ai', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), 'Valentina Torres', 'valentina.torres@demo.kcaliper.ai', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), 'Marco Gutiérrez', 'marco.gutierrez@demo.kcaliper.ai', 'client')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- ===== STEP 3: CLIENT SETTINGS (Link athletes → coach) =====
-- Coach's OWN client_settings row (needed for RLS to let coach insert own weight_entries)
INSERT INTO client_settings (id, coach_id, unit, country, target_weekly_rate, milestone, timezone)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
  (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'), -- self-referencing
  'kg', 'Costa Rica', -0.4, 85.0, 'America/Costa_Rica'
) ON CONFLICT (id) DO UPDATE SET 
  coach_id = EXCLUDED.coach_id, unit = EXCLUDED.unit, country = EXCLUDED.country,
  target_weekly_rate = EXCLUDED.target_weekly_rate, milestone = EXCLUDED.milestone;

-- Atleta
INSERT INTO client_settings (id, coach_id, unit, country, target_weekly_rate, milestone, timezone)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'),
  (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
  'kg', 'Costa Rica', -0.5, 75.0, 'America/Costa_Rica'
) ON CONFLICT (id) DO UPDATE SET 
  coach_id = EXCLUDED.coach_id, target_weekly_rate = EXCLUDED.target_weekly_rate, milestone = EXCLUDED.milestone;

-- Andrea López
INSERT INTO client_settings (id, coach_id, unit, country, target_weekly_rate, milestone, timezone)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'),
  (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
  'kg', 'México', -0.3, 62.0, 'America/Mexico_City'
) ON CONFLICT (id) DO UPDATE SET 
  coach_id = EXCLUDED.coach_id, target_weekly_rate = EXCLUDED.target_weekly_rate, milestone = EXCLUDED.milestone;

-- Diego Ramírez
INSERT INTO client_settings (id, coach_id, unit, country, target_weekly_rate, milestone, timezone)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'),
  (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
  'kg', 'Colombia', -0.5, 80.0, 'America/Bogota'
) ON CONFLICT (id) DO UPDATE SET 
  coach_id = EXCLUDED.coach_id, target_weekly_rate = EXCLUDED.target_weekly_rate, milestone = EXCLUDED.milestone;

-- Valentina Torres
INSERT INTO client_settings (id, coach_id, unit, country, target_weekly_rate, milestone, timezone)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'),
  (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
  'kg', 'España', -0.4, 55.0, 'Europe/Madrid'
) ON CONFLICT (id) DO UPDATE SET 
  coach_id = EXCLUDED.coach_id, target_weekly_rate = EXCLUDED.target_weekly_rate, milestone = EXCLUDED.milestone;

-- Marco Gutiérrez  
INSERT INTO client_settings (id, coach_id, unit, country, target_weekly_rate, milestone, timezone)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'),
  (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
  'lbs', 'USA', 0.5, 185.0, 'America/New_York'
) ON CONFLICT (id) DO UPDATE SET 
  coach_id = EXCLUDED.coach_id, target_weekly_rate = EXCLUDED.target_weekly_rate, milestone = EXCLUDED.milestone;

-- ===== STEP 4: WEIGHT ENTRIES =====
-- NOTE: The DB trigger `calculate_weight_metrics` fires on INSERT,
-- automatically computing moving_average, weekly_rate, and active_nutrition_id.
-- We insert entries IN CHRONOLOGICAL ORDER (oldest first) so DEMA chains correctly.

-- ── Andrea López (Cutting phase: 68kg → 63.2kg over 12 weeks) ──
INSERT INTO weight_entries (client_id, date, weight, notes, recorded_by) VALUES
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 84, 68.0, 'Inicio de programa', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 77, 67.6, 'Adaptándome a la dieta nueva', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 70, 67.1, 'Buen descanso esta semana', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 63, 66.8, 'Cardio 3x esta semana', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 56, 66.2, '', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 49, 65.9, 'Refeed el sábado', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 42, 65.4, 'Mejor semana hasta ahora', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 35, 65.0, 'Estancamiento leve', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 28, 64.6, 'Ajuste de macros', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 21, 64.1, 'Rompí el plateau! 🎉', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 14, 63.7, 'Cardio en ayunas ayuda', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 7,  63.4, 'Cerca de la meta 💪', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 3,  63.2, '¡Casi en 62kg goal!', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE,      63.0, 'Nuevo mínimo personal ✨', 'client')
ON CONFLICT (client_id, date) DO NOTHING;

-- ── Diego Ramírez (Cutting: 92kg → 85.3kg over 10 weeks) ──
INSERT INTO weight_entries (client_id, date, weight, notes, recorded_by) VALUES
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 70, 92.0, 'Inicio del programa', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 63, 91.2, 'Primera semana, bajó agua', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 56, 90.5, 'Entrenamiento fuerte', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 49, 89.8, 'Cumpleaños, comí de más', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 42, 89.0, 'Recuperé bien', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 35, 88.4, '', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 28, 87.6, 'Metí HIIT 2x semana', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 21, 86.9, 'Mejor semana', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 14, 86.2, 'Ajuste proteína', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 7,  85.8, 'En camino a 80 🔥', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 2,  85.5, '', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE,      85.3, 'Sigo consistente', 'client')
ON CONFLICT (client_id, date) DO NOTHING;

-- ── Valentina Torres (Slow cut: 60kg → 56.8kg over 6 weeks) ──
INSERT INTO weight_entries (client_id, date, weight, notes, recorded_by) VALUES
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 42, 60.0, 'Empiezo el corte', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 35, 59.6, 'Primer ajuste calórico', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 28, 59.0, 'Me siento fuerte', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 21, 58.4, 'Progreso lento pero seguro', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 14, 57.8, 'Cardio ligero 4x', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 7,  57.2, 'Refeed inteligente', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 3,  56.9, '', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE,      56.8, 'Nuevo mínimo 🌟', 'client')
ON CONFLICT (client_id, date) DO NOTHING;

-- ── Marco Gutiérrez (Bulking: 170lbs → 182lbs over 8 weeks) ──
INSERT INTO weight_entries (client_id, date, weight, notes, recorded_by) VALUES
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 56, 170.0, 'Starting lean bulk', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 49, 171.5, 'Slight surplus', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 42, 173.0, 'Good strength gains', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 35, 174.8, 'PR on bench!', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 28, 176.2, 'Increased carbs', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 21, 178.0, 'Squat PR 💪', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 14, 179.5, 'Deload week', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 7,  181.0, 'Back to volume', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE,      182.0, 'Lean gains on track 🔥', 'client')
ON CONFLICT (client_id, date) DO NOTHING;

-- ── Atleta Demo (user's test athlete: 82kg → 77.5kg) ──
INSERT INTO weight_entries (client_id, date, weight, notes, recorded_by) VALUES
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 42, 82.0, 'Peso inicial', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 35, 81.3, 'Primer ajuste', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 28, 80.5, 'Seguimos bajando', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 21, 79.8, 'Buenos macros', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 14, 79.0, 'Cardio 3x', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 7,  78.2, 'Refeed domingo', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 3,  77.8, '', 'client'),
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE,      77.5, 'Rumbo a 75kg 🎯', 'client')
ON CONFLICT (client_id, date) DO NOTHING;

-- ===== STEP 5: NUTRITION PLANS =====
INSERT INTO nutrition_plans (client_id, start_date, calories, protein, carbs, fats, notes) VALUES
  -- Andrea
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 84, 1800, 140, 180, 50, 'Fase 1: Déficit moderado'),
  ((SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'), CURRENT_DATE - 42, 1650, 145, 150, 48, 'Fase 2: Ajuste agresivo'),
  -- Diego
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 70, 2200, 180, 220, 65, 'Déficit con alta proteína'),
  ((SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'), CURRENT_DATE - 28, 2000, 185, 190, 58, 'Ajuste semana 6'),
  -- Valentina
  ((SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'), CURRENT_DATE - 42, 1500, 120, 140, 45, 'Corte suave'),
  -- Marco (bulk)
  ((SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'), CURRENT_DATE - 56, 3000, 200, 350, 80, 'Lean bulk plan'),
  -- Atleta
  ((SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'), CURRENT_DATE - 42, 1900, 155, 180, 55, 'Plan inicial de definición')
ON CONFLICT DO NOTHING;

-- ===== STEP 6: ALERTS FOR COACH =====
INSERT INTO alerts (coach_id, client_id, type, message, date, is_read) VALUES
  -- Andrea alerts
  (
    (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
    (SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'),
    'lowest', 'Andrea López registró su peso más bajo: 63.0 kg ✨', now(), false
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
    (SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai'),
    'rate_deviation', 'Andrea López tiene un ritmo de -0.45 kg/sem (target: -0.3)', now() - interval '3 days', false
  ),
  -- Diego alerts
  (
    (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
    (SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai'),
    'lowest', 'Diego Ramírez registró nuevo mínimo: 85.3 kg', now(), false
  ),
  -- Valentina alerts
  (
    (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
    (SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai'),
    'lowest', 'Valentina Torres alcanzó 56.8 kg — casi en meta 🌟', now() - interval '1 day', false
  ),
  -- Marco alert
  (
    (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
    (SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai'),
    'milestone_achieved', 'Marco Gutiérrez superó los 180 lbs! 🎯', now() - interval '5 days', true
  ),
  -- Atleta alert
  (
    (SELECT id FROM auth.users WHERE email = 'coach@kcaliper.ai'),
    (SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai'),
    'lowest', 'Atleta Demo registró 77.5 kg — nuevo mínimo', now(), false
  );

-- ===== STEP 7: MARK LOWEST/HIGHEST ON WEIGHT ENTRIES =====
-- Mark the lowest entry for each client
UPDATE weight_entries SET is_lowest = true 
WHERE id = (
  SELECT id FROM weight_entries 
  WHERE client_id = (SELECT id FROM auth.users WHERE email = 'andrea.lopez@demo.kcaliper.ai')
  ORDER BY weight ASC LIMIT 1
);

UPDATE weight_entries SET is_lowest = true 
WHERE id = (
  SELECT id FROM weight_entries 
  WHERE client_id = (SELECT id FROM auth.users WHERE email = 'diego.ramirez@demo.kcaliper.ai')
  ORDER BY weight ASC LIMIT 1
);

UPDATE weight_entries SET is_lowest = true 
WHERE id = (
  SELECT id FROM weight_entries 
  WHERE client_id = (SELECT id FROM auth.users WHERE email = 'valentina.torres@demo.kcaliper.ai')
  ORDER BY weight ASC LIMIT 1
);

-- Mark highest for Marco (bulk)
UPDATE weight_entries SET is_highest = true 
WHERE id = (
  SELECT id FROM weight_entries 
  WHERE client_id = (SELECT id FROM auth.users WHERE email = 'marco.gutierrez@demo.kcaliper.ai')
  ORDER BY weight DESC LIMIT 1
);

UPDATE weight_entries SET is_lowest = true 
WHERE id = (
  SELECT id FROM weight_entries 
  WHERE client_id = (SELECT id FROM auth.users WHERE email = 'atleta@kcaliper.ai')
  ORDER BY weight ASC LIMIT 1
);

-- ===== STEP 8: ADD RLS POLICY FOR COACH SELF-TRACKING =====
-- The coach needs to INSERT weight_entries where client_id = their own ID.
-- Current RLS only covers client_id = auth.uid() (client policy) 
-- or coach_id lookup (coach-for-clients policy).
-- We need a policy that lets authenticated coaches write their OWN entries.
DO $$
BEGIN
  -- Drop if exists to be idempotent
  DROP POLICY IF EXISTS "Coaches can manage their own weight entries." ON weight_entries;
  
  CREATE POLICY "Coaches can manage their own weight entries." ON weight_entries
    FOR ALL USING (
      auth.uid() = client_id
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coach')
    );
END $$;

-- ===== DONE =====
-- Summary:
--   Coach:    coach@kcaliper.ai / coach
--   Atleta:   atleta@kcaliper.ai / atleta
--   Client 1: andrea.lopez@demo.kcaliper.ai / demo1234
--   Client 2: diego.ramirez@demo.kcaliper.ai / demo1234
--   Client 3: valentina.torres@demo.kcaliper.ai / demo1234
--   Client 4: marco.gutierrez@demo.kcaliper.ai / demo1234
--
-- All weight_entries have DEMA and weekly_rate auto-calculated by trigger.
-- Coach has a client_settings row pointing to self (for RLS + personal tracking).
