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
CREATE OR REPLACE FUNCTION check_pending_stripe_purchases()
RETURNS TRIGGER AS $$
DECLARE
  pending_purchase RECORD;
BEGIN
  -- Check if this new user has bought something before creating account
  SELECT * INTO pending_purchase 
  FROM stripe_purchases 
  WHERE customer_email = NEW.email AND claimed = FALSE 
  LIMIT 1;

  IF FOUND THEN
    -- Assign role and plan based on plan_type string derived from Stripe Price ID
    IF pending_purchase.plan_type ILIKE '%coach%' THEN
      NEW.role := 'coach';
    ELSE
      NEW.role := 'athlete';
    END IF;

    NEW.plan := 'pro';
    NEW.status := 'active';

    -- Mark purchase as claimed
    UPDATE stripe_purchases SET claimed = TRUE, user_id = NEW.id WHERE id = pending_purchase.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger on INSERT to PROFILES
DROP TRIGGER IF EXISTS trigger_check_stripe_purchases ON profiles;
CREATE TRIGGER trigger_check_stripe_purchases
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_pending_stripe_purchases();
