import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface WaitlistProfile {
  firstName?: string;
  lastName?: string;
  country?: string;
  source?: string;
}

export function useWaitlist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitlistId, setWaitlistId] = useState<string | null>(null);

  const submitEmail = async (email: string, role: 'athlete' | 'coach' = 'athlete') => {
    setLoading(true);
    setError(null);
    try {
      // Try insert first
      const { data, error: insertError } = await supabase
        .from('waitlist')
        .insert({ email: email.toLowerCase().trim(), role })
        .select('id')
        .single();

      if (insertError) {
        // If duplicate, fetch existing
        if (insertError.code === '23505') {
          const { data: existing } = await supabase
            .from('waitlist')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();
          if (existing) {
            setWaitlistId(existing.id);
            setLoading(false);
            return existing.id;
          }
        }
        throw insertError;
      }

      setWaitlistId(data.id);
      setLoading(false);
      return data.id;
    } catch (err: any) {
      setError(err.message || 'Error al registrar email');
      setLoading(false);
      return null;
    }
  };

  const updateProfile = async (id: string, profile: WaitlistProfile) => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          country: profile.country,
          source: profile.source,
        })
        .eq('id', id);

      if (updateError) throw updateError;
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      setLoading(false);
      return false;
    }
  };

  return { submitEmail, updateProfile, loading, error, waitlistId };
}
