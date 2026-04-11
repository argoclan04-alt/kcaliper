-- ============================================================
-- Fix RLS for Influencers Table (Allow public applications)
-- ============================================================

-- Allow anyone (even non-logged in users) to submit an application
CREATE POLICY "Anon can insert influencers" ON influencers 
  FOR INSERT WITH CHECK (true);
