-- ============================================================
-- kCaliper Admin Panel — Supabase Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- 0. Fix for existing ENUM if it exists (Run this standalone if inside a transaction it fails)
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- 1. Add 'role' column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'client';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'active';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'plan'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_login TIMESTAMPTZ DEFAULT NULL;
  END IF;
END $$;

-- 2. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  message TEXT NOT NULL,
  internal_note BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Admin Audit Log (IMMUTABLE)
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent deletions/updates on audit log
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit log entries cannot be modified or deleted';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'no_update_audit_log') THEN
    CREATE TRIGGER no_update_audit_log
      BEFORE UPDATE OR DELETE ON admin_audit_log
      FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
  END IF;
END $$;

-- 5. Influencers
CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ig_handle TEXT,
  tiktok_handle TEXT,
  email TEXT,
  tier TEXT NOT NULL DEFAULT 'nano',
  followers INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  country TEXT,
  ref_code TEXT UNIQUE NOT NULL,
  cpm_agreed DECIMAL(8,2) DEFAULT 0,
  status TEXT DEFAULT 'prospect',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Influencer Campaigns
CREATE TABLE IF NOT EXISTS influencer_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
  post_url TEXT,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  registrations INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  payment_amount DECIMAL(8,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Banned Emails
CREATE TABLE IF NOT EXISTS banned_emails (
  email TEXT PRIMARY KEY,
  reason TEXT,
  banned_at TIMESTAMPTZ DEFAULT NOW(),
  banned_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- 8. System Config (key-value store)
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Insert default config values
INSERT INTO system_config (key, value) VALUES
  ('maintenance_mode', '{"enabled": false}'::jsonb),
  ('registration_open', '{"enabled": true}'::jsonb),
  ('early_access_active', '{"enabled": true}'::jsonb),
  ('calibot_active', '{"enabled": true}'::jsonb),
  ('whatsapp_notifications', '{"enabled": false}'::jsonb),
  ('banner_config', '{"text": "", "bg_color": "#6C5CE7", "cta_text": "", "cta_url": "", "visible": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- RLS POLICIES — Super Admin Full Access
-- ============================================================

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Super admin policies
CREATE POLICY "Super admin full access" ON support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admin full access" ON ticket_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admin full access" ON admin_audit_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admin full access" ON influencers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admin full access" ON influencer_campaigns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admin full access" ON banned_emails
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admin full access" ON system_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Users can create their own tickets
CREATE POLICY "Users can create own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add messages to own tickets" ON ticket_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view own ticket messages" ON ticket_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid())
    AND internal_note = FALSE
  );
