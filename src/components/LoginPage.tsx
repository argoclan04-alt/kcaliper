import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CanvasRevealEffect, MiniNavbar } from "./ui/sign-in-flow-1";
import { cn } from "./ui/utils";
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

      if (error) throw error;

      if (data?.user) {
        // Trigger canvas transition
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);

        toast.success(`Bienvenido de nuevo.`);
        
        setStep("success");
        
        setTimeout(() => {
          // Success redirect handled by Auth state change in App.tsx or manually here
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión.');
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setPassword("");
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative text-white selection:bg-white selection:text-black">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
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
              colors={[[255, 255, 255]]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Navigation */}
      <MiniNavbar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
        <div className="w-full max-w-sm mt-32">
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">Acceso Privado</h1>
                  <p className="text-white/50 font-light">Escribe tu email de kCaliper</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                   <div className="relative group">
                     <input
                      type="email"
                      placeholder="email@kcaliper.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-white/30 transition-all text-lg"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-white text-black size-12 rounded-full flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all"
                    >
                      →
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
                    className="text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
                  >
                    Olvidé mi contraseña
                  </button>
                </form>

                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                  Solo personal autorizado · kCaliper AI v2.0
                </p>
              </motion.div>
            ) : step === "password" ? (
              <motion.div
                key="password-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">Identificación</h1>
                  <p className="text-white/50 font-light">Ingresa tu clave de acceso</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-white/30 transition-all text-2xl tracking-[0.5em]"
                    autoFocus
                    required
                  />
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBackClick}
                      className="flex-1 bg-white/5 border border-white/10 py-3 rounded-full hover:bg-white/10 font-medium transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] bg-white text-black py-3 rounded-full font-bold hover:bg-white/90 transition-all disabled:opacity-50"
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
                className="text-center space-y-6"
              >
                <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  <span className="text-black text-4xl">✓</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">Acceso Concedido</h1>
                  <p className="text-white/50 font-light">Redirigiendo al Dashboard...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
