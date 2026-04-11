-- ============================================================
-- Ref Tracking SQL — Run in Supabase SQL Editor
-- This adds the click tracking RPC function
-- ============================================================

-- Simple RPC to increment clicks on the most recent campaign for a ref_code
CREATE OR REPLACE FUNCTION track_ref_click(ref_code TEXT)
RETURNS void AS $$
DECLARE
  inf_id UUID;
  camp_id UUID;
BEGIN
  -- Find influencer by ref_code
  SELECT id INTO inf_id FROM influencers WHERE influencers.ref_code = track_ref_click.ref_code LIMIT 1;
  IF inf_id IS NULL THEN RETURN; END IF;

  -- Find most recent campaign
  SELECT id INTO camp_id FROM influencer_campaigns 
  WHERE influencer_id = inf_id 
  ORDER BY created_at DESC LIMIT 1;

  IF camp_id IS NOT NULL THEN
    UPDATE influencer_campaigns SET clicks = COALESCE(clicks, 0) + 1 WHERE id = camp_id;
  ELSE
    -- Auto-create first campaign row
    INSERT INTO influencer_campaigns (influencer_id, clicks, conversions, registrations)
    VALUES (inf_id, 1, 0, 0);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to anon (so unauthenticated visitors can trigger it)
GRANT EXECUTE ON FUNCTION track_ref_click(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION track_ref_click(TEXT) TO authenticated;
