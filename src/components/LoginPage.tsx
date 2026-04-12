import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronRight, Key, Mail, ShieldAlert } from "lucide-react";
import { CanvasRevealEffect, MiniNavbar } from "./ui/sign-in-flow-1";
import { supabase } from "../lib/supabase";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password" | "success">("email");
  const [loading, setLoading] = useState(false);
  
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  // Check for missing credentials on mount
  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key || key.includes('mock')) {
       toast.error("Error de Configuración Detectado", {
         description: "Faltan las variables de entorno en el Dashboard de Vercel (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).",
         duration: 10000,
         action: {
           label: "Más info",
           onClick: () => window.open('https://vercel.com/docs/projects/environment-variables', '_blank')
         }
       });
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Por favor ingresa un email válido.");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
         // Specialized error handling for common issues
         if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email o contraseña incorrectos. Verifica tus datos.');
         }
         throw error;
      };

      if (data?.user) {
        // Trigger canvas transition
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);

        toast.success(`Acceso concedido. Bienvenido de nuevo.`);
        setStep("success");
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión.');
      console.error('Login Error details:', error);
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setPassword("");
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative text-white selection:bg-[#00D2FF] selection:text-black font-inter">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={2}
              containerClassName="bg-black"
              colors={[[255, 255, 255]]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[[0, 210, 255]]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[#000000]/80 backdrop-blur-[1px]" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
      </div>

      <MiniNavbar onNavigate={onNavigate} />

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email-step"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10 text-center"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50 mb-2">
                    <ShieldAlert className="size-3" />
                    Acceso Restringido
                  </div>
                  <h1 className="text-4xl font-black tracking-tight uppercase italic">E-mail</h1>
                  <p className="text-white/40 font-light text-sm">Ingresa tu cuenta corporativa de kCaliper</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                   <div className="relative group">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-white/20 group-focus-within:text-[#00D2FF] transition-colors" />
                     <input
                      type="email"
                      placeholder="email@kcaliper.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit(e)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-14 pr-6 text-left focus:outline-none focus:border-[#00D2FF]/30 focus:bg-white/10 transition-all text-lg"
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-white text-black size-12 rounded-full flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        toast.error("Ingresa tu email primero.");
                        return;
                      }
                      const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`,
                      });
                      if (error) toast.error(error.message);
                      else toast.success("Correo de recuperación enviado.");
                    }}
                    className="text-[10px] text-white/20 hover:text-white/60 transition-colors uppercase tracking-[0.2em]"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </form>

                <p className="text-[9px] text-white/10 uppercase tracking-[0.5em] pt-4">
                  Powered by kCaliper Intelligence
                </p>
              </motion.div>
            ) : step === "password" ? (
              <motion.div
                key="password-step"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10 text-center"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/5 border border-[#00D2FF]/10 text-[10px] uppercase tracking-widest text-[#00D2FF] mb-2">
                    <Key className="size-3" />
                    Verificación
                  </div>
                  <h1 className="text-4xl font-black tracking-tight uppercase italic text-[#00D2FF]">Clave</h1>
                  <p className="text-white/40 font-light text-sm">Autentícate para acceder al dashboard</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit(e)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-6 text-center focus:outline-none focus:border-[#00D2FF]/30 focus:bg-[#00D2FF]/5 transition-all text-2xl tracking-[0.6em]"
                    autoFocus
                    required
                  />
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBackClick}
                      className="flex-1 bg-white/5 border border-white/10 py-4 rounded-full hover:bg-white/10 font-medium transition-colors text-xs uppercase tracking-widest"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] bg-white text-black py-4 rounded-full font-black hover:bg-[#00D2FF] hover:text-black transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                      {loading ? "Verificando..." : "Entrar →"}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#00D2FF] blur-3xl opacity-20 rounded-full animate-pulse" />
                  <div className="size-32 rounded-full border-2 border-[#00D2FF] flex items-center justify-center mx-auto relative bg-black/50 backdrop-blur-xl">
                     <span className="text-[#00D2FF] text-5xl">✓</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tight uppercase italic text-[#00D2FF]">Concedido</h1>
                  <p className="text-white/40 font-light">Sincronizando datos del servidor...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
