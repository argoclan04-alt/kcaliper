import React, { useState, useEffect, useCallback } from "react";
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
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Inbox
} from "lucide-react";
import { 
  CanvasRevealEffect, 
  MiniNavbar 
} from "./ui/sign-in-flow-1";
import { cn } from "./ui/utils";
import { 
  isValidEmail, 
  getPasswordStrength, 
  getStrengthColor, 
  getStrengthLabel,
  PasswordStrength 
} from "../utils/auth-validation";

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'reset';
  onboardingData?: any;
}

type AuthMode = 'login' | 'signup' | 'reset-request' | 'reset-sent' | 'update-password';

export function AuthPage({ initialMode = 'login', onboardingData }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode === 'reset' ? 'reset-request' : initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'coach' | 'athlete'>('athlete');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>('none');
  const [resendTimer, setResendTimer] = useState(0);

  // Check for recovery session from URL
  useEffect(() => {
    // Supabase automatically detects the session in URL if detectSessionInUrl is true
    // We check if we are on the reset-password path or if the URL has access_token/type=recovery
    if (window.location.pathname === '/reset-password' || window.location.hash.includes('type=recovery')) {
      setMode('update-password');
    }
  }, []);

  useEffect(() => {
    if (onboardingData?.role) setRole(onboardingData.role);
  }, [onboardingData]);

  useEffect(() => {
    if (password) {
      setStrength(getPasswordStrength(password));
    } else {
      setStrength('none');
    }
  }, [password]);

  // Resend timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleCapsLock = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!isValidEmail(email)) {
      toast.error("Por favor ingresa un email válido.");
      return;
    }

    if ((mode === 'signup' || mode === 'update-password') && password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const emailLower = email.trim().toLowerCase();

    try {
      if (mode === 'login') {
        // --- 1. ADMIN BYPASS ---
        if ((emailLower === 'admin@kcaliper.ai' || emailLower === 'contacto@kcaliper.com') && password === 'Tenkaichi23') {
          await supabase.auth.signOut();
          localStorage.setItem('kcaliper_auth', JSON.stringify({ 
            email: emailLower, 
            role: 'coach', 
            plan: 'pro', 
            timestamp: new Date().toISOString() 
          }));
          localStorage.setItem('kcaliper_account', 'esteban');
          toast.success("Iniciando sesión en panel Administrativo...");
          setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
          return;
        }

        // --- 2. COACH DEMO (Esteban Mock) ---
        if ((emailLower === 'coach@kcaliper.ai' || emailLower === 'esteban@kcaliper.ai') && password === 'coach') {
          await supabase.auth.signOut();
          localStorage.setItem('kcaliper_auth', JSON.stringify({ 
            email: emailLower, 
            role: 'coach', 
            plan: 'pro', 
            timestamp: new Date().toISOString() 
          }));
          localStorage.setItem('kcaliper_account', 'esteban');
          toast.success("Iniciando sesión en Dashboard de Coach...");
          setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
          return;
        }

        // --- 3. ATHLETE DEMO ---
        if (emailLower === 'atleta@kcaliper.ai' && password === 'atleta') {
          await supabase.onAuthStateChange(async () => {}); // No-op to prevent race
          await supabase.auth.signOut();
          localStorage.setItem('kcaliper_auth', JSON.stringify({ 
            email: emailLower, 
            role: 'athlete', 
            plan: 'pro', 
            timestamp: new Date().toISOString() 
          }));
          localStorage.setItem('kcaliper_account', 'argo');
          toast.success("Iniciando sesión en Perfil de Atleta...");
          setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
          return;
        }

        // FALLBACK TO SUPABASE FOR PRODUCTION ACCOUNTS
        const { error } = await supabase.auth.signInWithPassword({ email: emailLower, password });
        if (error) throw error;
        toast.success("Bienvenido de nuevo.");
        window.location.href = "/dashboard";
        return;
      }

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: emailLower,
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
        setMode('reset-sent');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido de nuevo.");
        window.location.href = "/dashboard";
      } else if (mode === 'reset-request') {
        const { error } = await supabase.auth.resetPasswordForEmail(emailLower, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Correo de recuperación enviado.");
        setMode('reset-sent');
        setResendTimer(60);
      } else if (mode === 'update-password') {
        const { error } = await supabase.auth.updateUser({
          password: password
        });
        if (error) throw error;
        toast.success("Contraseña actualizada correctamente.");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
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

  const handleResendReset = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Link reenviado.");
      setResendTimer(60);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 contrast-150 mix-blend-overlay" />
      </div>

      <MiniNavbar />

      {/* Auth Card */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.06] rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-8 shadow-[0_0_40px_rgba(124,58,237,0.3)] relative group"
            >
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              {mode === 'reset-sent' ? <Inbox className="w-10 h-10 text-white" /> : <Sparkles className="w-10 h-10 text-white" />}
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-black tracking-tighter mb-3 uppercase italic leading-none">
                  {mode === 'login' ? 'Auth / Sync' : 
                   mode === 'signup' ? 'New / User' : 
                   mode === 'reset-request' ? 'Recovery' : 
                   mode === 'reset-sent' ? 'Check Inbox' :
                   'New / Clave'}
                </h1>
                <p className="text-white/40 font-medium text-sm max-w-[240px] mx-auto leading-relaxed uppercase tracking-widest text-[10px]">
                  {mode === 'login' 
                    ? 'Synchronizing secure session' 
                    : mode === 'signup' 
                      ? 'Creating core account profile' 
                      : mode === 'reset-request'
                        ? 'Initialize recovery protocol'
                        : mode === 'reset-sent'
                          ? 'Verification link dispatched'
                          : 'Update access credentials'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'reset-sent' ? (
              <motion.div
                key="reset-sent-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-8"
              >
                <div className="py-2">
                  <p className="text-white/60 text-sm leading-relaxed">
                    Hemos enviado un enlace de recuperación a: <br/>
                    <span className="text-violet-400 font-bold">{email || "tu correo"}</span>
                  </p>
                </div>
                
                <div className="space-y-4 pt-4">
                  <button
                    onClick={handleResendReset}
                    disabled={resendTimer > 0 || loading}
                    className="w-full h-14 bg-white/[0.05] border border-white/10 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/[0.1] disabled:opacity-50 transition-all"
                  >
                    {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : '¿No llegó? Reenviar'}
                  </button>
                  
                  <button
                    onClick={() => setMode('login')}
                    className="flex items-center gap-2 mx-auto text-[10px] uppercase tracking-[0.2em] font-black text-white/30 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3" /> Volver al Inicio
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key={mode}
                onSubmit={handleAuth} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                {/* Full Name Step (Signup) */}
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-500 transition-colors">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="NOMBRE COMPLETO"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-all text-xs font-bold tracking-widest uppercase placeholder:text-white/10"
                      />
                    </div>
                  </div>
                )}

                {/* Email Step (Everything except update-password) */}
                {mode !== 'update-password' && (
                  <div className="space-y-2">
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="CORREO@ELECTRONICO"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-all text-xs font-bold tracking-widest uppercase placeholder:text-white/10"
                      />
                    </div>
                  </div>
                )}

                {/* Password Step */}
                {mode !== 'reset-request' && (
                  <div className="space-y-3">
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-500 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleCapsLock}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-5 pl-14 pr-14 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-all text-lg tracking-[0.4em] placeholder:text-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Caps Lock Detection */}
                    {capsLockActive && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
                      >
                        <AlertCircle className="w-3 h-3 text-yellow-500" />
                        <span className="text-[9px] uppercase font-bold text-yellow-500/80 tracking-widest">Mayúsculas activadas</span>
                      </motion.div>
                    )}

                    {/* Password Strength Meter (Signup/Update) */}
                    {(mode === 'signup' || mode === 'update-password') && password.length > 0 && (
                      <div className="space-y-2 px-2">
                        <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest mb-1">
                          <span className="text-white/30 text-[8px]">Security / Level</span>
                          <span className={strength === 'weak' ? 'text-red-400' : strength === 'fair' ? 'text-yellow-400' : strength === 'good' ? 'text-blue-400' : 'text-emerald-400'}>
                            {getStrengthLabel(strength)}
                          </span>
                        </div>
                        <div className="flex gap-1.5 h-1">
                          {[1, 2, 3, 4].map((i) => {
                            let isActive = false;
                            if (strength === 'weak' && i === 1) isActive = true;
                            if (strength === 'fair' && i <= 2) isActive = true;
                            if (strength === 'good' && i <= 3) isActive = true;
                            if (strength === 'strong') isActive = true;
                            
                            return (
                              <div key={i} className={cn(
                                "h-full flex-1 rounded-full transition-all duration-300",
                                isActive ? getStrengthColor(strength) : "bg-white/[0.03]"
                              )} />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Forgot Password link */}
                {mode === 'login' && (
                  <div className="flex justify-end pt-1">
                    <button 
                      type="button"
                      onClick={() => setMode('reset-request')}
                      className="text-[10px] uppercase tracking-widest font-black text-white/20 hover:text-violet-400 transition-colors"
                    >
                      Recovery Protocol
                    </button>
                  </div>
                )}

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-violet-500 hover:text-white active:scale-[0.97] transition-all flex items-center justify-center gap-3 group shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                    </div>
                  ) : (
                    <>
                      {mode === 'login' ? 'Execute / Sync' : mode === 'signup' ? 'Deploy / Profile' : mode === 'reset-request' ? 'Request / Link' : 'Secure / Save'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Auth (Optional, only Login/Signup) */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-6">
              <div className="relative flex items-center gap-4 py-8">
                <div className="h-px bg-white/5 flex-1" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">External / OAuth</span>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center gap-4 h-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.07] hover:border-white/20 active:scale-[0.98] transition-all font-black text-[10px] uppercase tracking-widest text-white/60"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1.5">
                    <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#000"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000"/></svg>
                  </div>
                  Sync with Google
                </button>
              </div>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="mt-10 text-center">
            {mode === 'reset-request' || mode === 'update-password' ? (
              <button 
                onClick={() => setMode('login')}
                className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-3 h-3" /> System / Login
              </button>
            ) : (
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                {mode === 'login' ? 'New to platform?' : 'Core profile exists?'}
                <button 
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setShowPassword(false);
                    setPassword("");
                  }}
                  className="ml-3 text-violet-400 hover:text-white font-black transition-colors"
                >
                  {mode === 'login' ? 'Initialize' : 'Authorize'}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-10 flex items-center justify-center gap-4 text-white/10">
          <div className="h-px w-8 bg-current" />
          <p className="text-[9px] uppercase tracking-[0.4em] font-black">
            kCaliper.ai Core / Node 2026.04.12
          </p>
          <div className="h-px w-8 bg-current" />
        </div>
      </motion.div>
    </div>
  );
}
