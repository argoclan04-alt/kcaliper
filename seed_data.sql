-- FULL SEED DATA FOR ARGO WEIGHT TRACKER
-- Run this in the Supabase SQL Editor AFTER running supabase_schema.sql

DO $$
DECLARE
    coach_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. COACH (Carlos)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = coach_id) THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES (coach_id, '00000000-0000-0000-0000-000000000000', 'carlos@argotrainer.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Carlos Rodriguez","role":"coach"}', 'authenticated', 'authenticated');
    END IF;

    -- 2. CLIENTS (8 Athletes)
    -- Maria
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'maria@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'maria@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'María González', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
    -- John
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'john@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'john@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'John Smith', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
    -- Alex
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alex@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'alex@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'Alex Thompson', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
    -- Sofia
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sofia@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'sofia@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'Sofia Martinez', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
    -- Emma
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'emma@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'emma@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'Emma Johnson', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
    -- Lucas
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lucas@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'lucas@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'Lucas Silva', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
    -- Isabella
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'isabella@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'isabella@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'Isabella Rossi', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
    -- Michael
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'michael@example.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES ('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'michael@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', 'Michael Chen', 'role', 'client', 'coach_id', coach_id), 'authenticated', 'authenticated');
    END IF;
END $$;

-- 3. UPDATE CLIENT SETTINGS (Custom values from mock-data)
UPDATE public.client_settings SET unit = 'kg', target_weekly_rate = -0.3, milestone = 78.0, country = 'Spain', timezone = 'Europe/Madrid' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE public.client_settings SET unit = 'lbs', target_weekly_rate = 0.5, country = 'USA', timezone = 'America/New_York' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE public.client_settings SET unit = 'kg', target_weekly_rate = -0.5, country = 'Canada', timezone = 'America/Toronto' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE public.client_settings SET unit = 'kg', target_weekly_rate = -0.4, milestone = 70.0, country = 'Mexico', timezone = 'America/Mexico_City' WHERE id = '44444444-4444-4444-4444-444444444444';
UPDATE public.client_settings SET unit = 'lbs', target_weekly_rate = -1.0, country = 'USA', timezone = 'America/Los_Angeles' WHERE id = '55555555-5555-5555-5555-555555555555';
UPDATE public.client_settings SET unit = 'kg', target_weekly_rate = -0.5, country = 'Brazil', timezone = 'America/Sao_Paulo' WHERE id = '66666666-6666-6666-6666-666666666666';
UPDATE public.client_settings SET unit = 'kg', target_weekly_rate = -0.3, country = 'Italy', timezone = 'Europe/Rome' WHERE id = '77777777-7777-7777-7777-777777777777';
UPDATE public.client_settings SET unit = 'lbs', target_weekly_rate = 1.5, country = 'USA', timezone = 'America/Chicago' WHERE id = '88888888-8888-8888-8888-888888888888';

-- 4. INSERT WEIGHT ENTRIES (Sample representative history for each)
-- Maria González (History sample)
INSERT INTO public.weight_entries (client_id, date, weight, notes) VALUES 
('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 79.5, '¡Nuevo record personal! Me siento increíble.'),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '3 days', 80.2, 'Día de mucha energía'),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '7 days', 81.0, 'Finalización de fase'),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '14 days', 81.5, ''),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '21 days', 82.1, 'Dormí muy bien'),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '28 days', 82.8, ''),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '35 days', 83.4, ''),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '42 days', 84.1, 'Cumplí mis macros perfectamente'),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '365 days', 88.0, 'Inicio oficial') ON CONFLICT DO NOTHING;

-- John Smith (History)
INSERT INTO public.weight_entries (client_id, date, weight, notes) VALUES 
('22222222-2222-2222-2222-222222222222', '2025-10-08', 166.4, ''),
('22222222-2222-2222-2222-222222222222', '2025-10-07', 165.8, ''),
('22222222-2222-2222-2222-222222222222', '2025-10-06', 166.9, ''),
('22222222-2222-2222-2222-222222222222', '2025-09-25', 165.8, '') ON CONFLICT DO NOTHING;

-- Alex Thompson (History sample)
INSERT INTO public.weight_entries (client_id, date, weight, notes) VALUES 
('33333333-3333-3333-3333-333333333333', '2025-11-02', 90.0, ''),
('33333333-3333-3333-3333-333333333333', '2025-10-20', 90.8, 'aumenté la proteína'),
('33333333-3333-3333-3333-333333333333', '2025-09-15', 92.5, ''),
('33333333-3333-3333-3333-333333333333', '2024-07-01', 98.0, 'Peso inicial') ON CONFLICT DO NOTHING;

-- Sofia Martinez (History sample)
INSERT INTO public.weight_entries (client_id, date, weight, notes) VALUES 
('44444444-4444-4444-4444-444444444444', '2025-11-02', 72.0, ''),
('44444444-4444-4444-4444-444444444444', '2025-10-15', 73.1, 'excelente día de entrenamiento'),
('44444444-4444-4444-4444-444444444444', '2024-07-01', 79.0, 'Meta: 70kg') ON CONFLICT DO NOTHING;

-- Rest of clients (representative data)
INSERT INTO public.weight_entries (client_id, date, weight, notes) VALUES 
('55555555-5555-5555-5555-555555555555', '2025-10-08', 185.6, ''),
('66666666-6666-6666-6666-666666666666', '2025-10-03', 68.5, ''),
('77777777-7777-7777-7777-777777777777', '2025-10-08', 95.3, ''),
('88888888-8888-8888-8888-888888888888', '2025-10-08', 200.4, '') ON CONFLICT DO NOTHING;

-- 5. NUTRITION DATA
INSERT INTO public.nutrition_plans (client_id, start_date, calories, protein, carbs, fats, notes)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '2024-07-01', 2100, 160, 200, 60, 'Fase inicial déficit'),
  ('11111111-1111-1111-1111-111111111111', '2025-01-01', 1900, 160, 180, 55, 'Ajuste estancamiento');

-- 6. PHYSICO PHOTOS (Examples)
INSERT INTO public.physique_photos (client_id, date, photo_url, view_type, notes, is_example)
VALUES 
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?fit=crop&w=800&q=80', 'front', 'Check-in final semana 16', false);
