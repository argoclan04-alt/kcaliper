import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface UseAdminAuthReturn {
  user: User | null;
  profile: AdminProfile | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminRole = async (userId: string) => {
    try {
      console.log('[AdminAuth] Verificando rol de admin para:', userId);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, avatar_url')
        .eq('id', userId)
        .single();
  
      if (fetchError || !data) {
        console.error('[AdminAuth] Error al obtener perfil o perfil no encontrado:', fetchError);
        setIsAdmin(false);
        setProfile(null);
        return false;
      }
  
      setProfile(data as AdminProfile);
      const admin = data.role === 'super_admin';
      setIsAdmin(admin);
      console.log('[AdminAuth] Resultado verificación:', admin ? 'Es Admin ✅' : 'No es Admin ❌');
      return admin;
    } catch (err) {
      console.error('[AdminAuth] Fallo crítico en checkAdminRole:', err);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setLoading(true);
        console.log('[AdminAuth] Iniciando verificación de sesión...');
        const { data: { session: s } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (s?.user) {
          console.log('[AdminAuth] Sesión activa encontrada para:', s.user.email);
          setSession(s);
          setUser(s.user);
          await checkAdminRole(s.user.id);
        } else {
          console.log('[AdminAuth] No hay sesión activa');
        }
      } catch (err) {
        console.error('[AdminAuth] Error en inicialización admin:', err);
        setError('Error de conexión con el servidor.');
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('[AdminAuth] Proceso de carga finalizado.');
        }
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);

        if (s?.user) {
          await checkAdminRole(s.user.id);
        } else {
          setIsAdmin(false);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return false;
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      const admin = await checkAdminRole(data.user.id);

      if (!admin) {
        setError('No tienes permisos de administrador.');
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setLoading(false);
        return false;
      }
    }

    setLoading(false);
    return true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return { user, profile, session, isAdmin, loading, error, signIn, signOut };
}
