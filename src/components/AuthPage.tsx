import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Sparkles, 
  UserPlus, 
  Key,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import { cn } from "./ui/utils";

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'reset';
  onboardingData?: any;
}

export function AuthPage({ initialMode = 'login', onboardingData }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'coach' | 'athlete'>('athlete');

  useEffect(() => {
    if (onboardingData?.role) setRole(onboardingData.role);
  }, [onboardingData]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              onboarding_completed: !!onboardingData
            }
          }
        });
        if (error) throw error;
        toast.success("¡Cuenta creada! Revisa tu correo para verificar.");
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido de nuevo.");
        window.location.href = "/dashboard";
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Correo de recuperación enviado.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 mb-6 shadow-lg shadow-violet-500/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">
                  {mode === 'login' ? 'Bienvenido' : mode === 'signup' ? 'Únete a kCaliper' : 'Recuperar'}
                </h1>
                <p className="text-white/40 font-medium text-sm">
                  {mode === 'login' 
                    ? 'Ingresa tus credenciales para continuar' 
                    : mode === 'signup' 
                      ? 'Crea tu cuenta operativa hoy mismo' 
                      : 'Te enviaremos un link a tu correo'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Role Badge (Only for Signup) */}
          {mode === 'signup' && onboardingData && (
             <div className="mb-6 flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-full w-fit mx-auto animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Datos de Onboarding Listos</span>
             </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-400 transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm placeholder:text-white/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm placeholder:text-white/20"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm placeholder:text-white/20"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-[10px] uppercase tracking-wider font-bold text-white/30 hover:text-violet-400 transition-colors"
                >
                  ¿Olvidaste tu clave?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl"
            >
              {loading ? 'Procesando...' : (
                <>
                  {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Comenzar Ahora' : 'Enviar Link'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          {mode !== 'reset' && (
            <div className="my-8 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">o continúa con</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>
          )}

          {/* Social Auth */}
          {mode !== 'reset' && (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={signInWithGoogle}
                className="flex items-center justify-center gap-3 h-14 bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.08] active:scale-[0.98] transition-all font-bold text-sm"
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1">
                  <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                Google
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="mt-8 text-center">
            {mode === 'reset' ? (
              <button 
                onClick={() => setMode('login')}
                className="flex items-center gap-2 mx-auto text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Volver al Login
              </button>
            ) : (
              <p className="text-xs font-medium text-white/40">
                {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="ml-2 text-violet-400 hover:text-violet-300 font-bold transition-colors"
                >
                  {mode === 'login' ? 'Crea una aquí' : 'Inicia sesión'}
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
          Platform Security by kCaliper · 2026 Edition
        </p>
      </motion.div>
    </div>
  );
}
