import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verbose logging to help identify why Auth might fail in certain environments
if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'mock_key_to_prevent_client_crash') {
  console.error('CRITICAL: Supabase credentials missing or invalid!');
  console.warn('SI ESTÁS EN PRODUCCIÓN (VERCEL): Debes añadir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el Dashboard de Vercel.');
  console.log('Environment Debug:', {
    urlFound: !!supabaseUrl,
    keyFound: !!supabaseAnonKey,
    keyIsMock: supabaseAnonKey === 'mock_key_to_prevent_client_crash',
    mode: import.meta.env.MODE
  });
}

export const supabase = createClient(
  supabaseUrl || 'https://mockprojects.supabase.co',
  supabaseAnonKey || 'mock_key_to_prevent_client_crash',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
