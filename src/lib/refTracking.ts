import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const COOKIE_NAME = 'kcal_ref';
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Call this on every page load to capture ?ref=CODE from the URL and
 * persist it in a 30-day cookie.
 */
export function captureRefCode() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref && ref.trim()) {
    setCookie(COOKIE_NAME, ref.trim().toLowerCase(), COOKIE_DAYS);
    // Track click in Supabase (fire-and-forget)
    supabase
      .from('influencer_campaigns')
      .select('id, influencer_id, clicks')
      .eq('influencer_id', 
        supabase.from('influencers').select('id').eq('ref_code', ref.trim().toLowerCase())
      )
      .then(() => {}); // best-effort

    // Simple click increment via RPC-style update
    supabase.rpc('track_ref_click', { ref_code: ref.trim().toLowerCase() }).then(() => {});
  }
}

/**
 * Returns the stored referral code (if any) from the cookie.
 */
export function getStoredRefCode(): string | null {
  return getCookie(COOKIE_NAME);
}

/**
 * Call this after a successful purchase/subscription to attribute
 * the conversion to the influencer.
 */
export async function trackConversion(userId?: string) {
  const ref = getStoredRefCode();
  if (!ref) return;

  // Find influencer by ref_code
  const { data: influencer } = await supabase
    .from('influencers')
    .select('id')
    .eq('ref_code', ref)
    .single();

  if (!influencer) return;

  // Find or create a campaign for this influencer
  const { data: campaign } = await supabase
    .from('influencer_campaigns')
    .select('id, conversions')
    .eq('influencer_id', influencer.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (campaign) {
    await supabase
      .from('influencer_campaigns')
      .update({ conversions: (campaign.conversions || 0) + 1 })
      .eq('id', campaign.id);
  } else {
    // Create a new campaign record
    await supabase.from('influencer_campaigns').insert({
      influencer_id: influencer.id,
      conversions: 1,
      clicks: 1,
      registrations: 1,
    });
  }

  // Also store in waitlist/profile that this came from ref
  if (userId) {
    await supabase
      .from('profiles')
      .update({ plan: supabase.rpc('get_plan', {}) as any }) // placeholder
      .eq('id', userId);
  }
}

/**
 * Hook to read and track the ref code from URL on mount.
 */
export function useRefTracking() {
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    captureRefCode();
    setRefCode(getStoredRefCode());
  }, []);

  return { refCode };
}
