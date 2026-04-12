import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CanvasRevealEffect, MiniNavbar } from "./ui/sign-in-flow-1";
import { supabase } from "../lib/supabase";

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        // Trigger canvas transition
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);

        toast.success("¡Cuenta creada exitosamente!");
        
        setStep("success");
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la cuenta.');
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setPassword("");
    setConfirmPassword("");
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
              colors={[[0, 210, 255]]}
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
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Navigation */}
      <MiniNavbar onNavigate={onNavigate} />

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
                  <h1 className="text-4xl font-bold tracking-tight">Crear Cuenta</h1>
                  <p className="text-white/50 font-light">Ingresa tu email para comenzar</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                   <div className="relative group">
                     <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-[#00D2FF]/50 transition-all text-lg"
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-[#00D2FF] text-black size-12 rounded-full flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all"
                    >
                      →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      window.history.pushState({}, '', '/login');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
                  >
                    Ya tengo cuenta · Iniciar Sesión
                  </button>
                </form>

                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                  Únete a la revolución · kCaliper AI v2.0
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
                  <h1 className="text-4xl font-bold tracking-tight">Tu Clave</h1>
                  <p className="text-white/50 font-light">Crea una contraseña segura</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-[#00D2FF]/50 transition-all text-lg tracking-widest"
                    autoFocus
                    required
                    minLength={6}
                  />
                  <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-[#00D2FF]/50 transition-all text-lg tracking-widest"
                    required
                    minLength={6}
                  />
                  
                  <div className="flex gap-4 pt-2">
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
                      className="flex-[2] bg-[#00D2FF] text-black py-3 rounded-full font-bold hover:bg-[#33DBFF] transition-all disabled:opacity-50"
                    >
                      {loading ? "Creando..." : "Crear Cuenta →"}
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
                <div className="size-24 rounded-full bg-[#00D2FF] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(0,210,255,0.4)]">
                  <span className="text-black text-4xl">✓</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">¡Bienvenido!</h1>
                  <p className="text-white/50 font-light">Preparando tu Dashboard...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
