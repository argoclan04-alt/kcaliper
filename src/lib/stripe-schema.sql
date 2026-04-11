-- ============================================================
-- Stripe Integration Schema
-- ============================================================

-- Table to store successful Stripe purchases, especially useful when users
-- pay via Payment Links BEFORE creating an account.
CREATE TABLE IF NOT EXISTS stripe_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  stripe_customer_id TEXT,
  amount_total INTEGER,
  currency TEXT,
  payment_status TEXT,
  plan_type TEXT, -- e.g., 'coach_pro', 'athlete_legend'
  claimed BOOLEAN DEFAULT FALSE, -- turns true when the user signs up and gets VIP
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- populated if the user existed at checkout or signs up later
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stripe_purchases ENABLE ROW LEVEL SECURITY;

-- Only Admins and the specific user can view their purchases
CREATE POLICY "Users view own purchases" ON stripe_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admin view all purchases" ON stripe_purchases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Database Trigger to Auto-Assign PRO Status on Account Creation
-- When a user registers, we check if they have unclaimed purchases matching their email
-- 1. Sync Metadata BEFORE the profile is created (sets role/plan on NEW)
CREATE OR REPLACE FUNCTION sync_stripe_profile_metadata()
RETURNS TRIGGER AS $$
DECLARE
  pending_purchase RECORD;
BEGIN
  SELECT * INTO pending_purchase 
  FROM stripe_purchases 
  WHERE customer_email = NEW.email AND claimed = FALSE 
  LIMIT 1;

  IF FOUND THEN
    IF pending_purchase.plan_type ILIKE '%coach%' THEN
      NEW.role := 'coach';
    ELSE
      NEW.role := 'athlete';
    END IF;
    -- NEW.plan := 'pro'; -- Assuming a 'plan' column exists in profiles
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Link the purchase AFTER the profile is created (ID now exists in profiles)
CREATE OR REPLACE FUNCTION link_claimed_stripe_purchase()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stripe_purchases 
  SET claimed = TRUE, 
      user_id = NEW.id,
      updated_at = NOW()
  WHERE customer_email = NEW.email AND claimed = FALSE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Triggers
DROP TRIGGER IF EXISTS trigger_sync_stripe_metadata ON profiles;
CREATE TRIGGER trigger_sync_stripe_metadata
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_stripe_profile_metadata();

DROP TRIGGER IF EXISTS trigger_link_stripe_purchase ON profiles;
CREATE TRIGGER trigger_link_stripe_purchase
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION link_claimed_stripe_purchase();
