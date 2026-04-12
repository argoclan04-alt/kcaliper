import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vsbgqnevkpremfzvphir.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYmdxbmV2a3ByZW1menZwaGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDY2ODAsImV4cCI6MjA5MTA4MjY4MH0.Rbr2h86jF-npYDQGEfaM6j8xjuzaGndoLAwe5PefuXQ';

// Verbose logging to help identify why Auth might fail in certain environments
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Nota: Usando credenciales de respaldo (Fallback). Asegúrate de que el Re-deploy de Vercel termine para usar las del Dashboard.');
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
