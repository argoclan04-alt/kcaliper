import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { User, Users, ChevronRight, Check } from "lucide-react";
import { CanvasRevealEffect, MiniNavbar } from "./ui/sign-in-flow-1";
import { supabase } from "../lib/supabase";

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

type SignupStep = "role" | "email" | "password" | "success";
type UserRole = "athlete" | "coach";

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [step, setStep] = useState<SignupStep>("role");
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  // Stripe Links
  const STRIPE_ATHLETE = "https://buy.stripe.com/test_5kQdR95rtgQLeDd7qO04805";
  const STRIPE_COACH = "https://buy.stripe.com/test_aFa8wP8DF0RN52D5iG04803";

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep("email");
  };

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
        options: {
          data: {
            role: role === 'coach' ? 'coach' : 'client',
            full_name: email.split('@')[0],
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        // Handle cases where email confirmation is required (session might be null)
        const isConfirmed = !!data.session;
        
        // SYNC PENDING WEIGHT FROM ONBOARDING
        const pendingWeight = localStorage.getItem('kcaliper_pending_weight');
        if (pendingWeight && isConfirmed) {
          try {
            const parsed = JSON.parse(pendingWeight);
            await supabase.from('weight_entries').insert({
              client_id: data.user.id,
              date: new Date().toISOString().split('T')[0],
              weight: parsed.weight,
              notes: 'Peso Inicial (Onboarding)',
              recorded_by: 'client'
            });
            localStorage.removeItem('kcaliper_pending_weight');
          } catch (e) {
            console.error("Error syncing weight:", e);
          }
        }

        if (!isConfirmed) {
          toast.success("Cuenta creada. Por favor, confirma tu email para continuar.");
          setLoading(false);
          // Optional: redirect to login or show notice
          return;
        }

        // Trigger canvas transition for confirmed users
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);

        toast.success("¡Cuenta creada exitosamente!");
        setStep("success");
        
        const baseUrl = role === 'coach' ? STRIPE_COACH : STRIPE_ATHLETE;
        const redirectUrl = `${baseUrl}?prefilled_email=${encodeURIComponent(email.trim())}`;
        
        setTimeout(() => { window.location.href = redirectUrl; }, 2000);
      } else {
        // Fallback for unexpected null data
        setLoading(false);
        toast.error("El servidor no devolvió una respuesta válida. Inténtalo de nuevo.");
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la cuenta.');
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (step === "email") setStep("role");
    else if (step === "password") setStep("email");
    
    setConfirmPassword("");
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative text-white selection:bg-[#00D2FF] selection:text-black font-inter">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={role === 'coach' ? [[0, 210, 255]] : [[255, 255, 255]]}
              dotSize={step === 'role' ? 4 : 6}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={role === 'coach' ? [[0, 210, 255]] : [[255, 255, 255]]}
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
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-20">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {step === "role" && (
              <motion.div
                key="role-step"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-12 text-center"
              >
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                    ¿Cómo quieres <span className="text-[#00D2FF]">comenzar</span>?
                  </h1>
                  <p className="text-white/50 font-light text-lg">Selecciona tu perfil para personalizar tu experiencia</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Athlete Card */}
                  <motion.button
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect("athlete")}
                    className="group relative flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-center"
                  >
                    <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
                      <User className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Soy Atleta</h3>
                    <p className="text-sm text-white/40 font-light">Quiero optimizar mi rendimiento y controlar mi peso con IA.</p>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </motion.button>

                  {/* Coach Card */}
                  <motion.button
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect("coach")}
                    className="group relative flex flex-col items-center p-8 rounded-3xl bg-[#00D2FF]/5 border border-[#00D2FF]/10 hover:border-[#00D2FF]/30 transition-all text-center"
                  >
                    <div className="size-16 rounded-2xl bg-[#00D2FF]/10 flex items-center justify-center mb-6 text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-black transition-all">
                      <Users className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#00D2FF]">Soy Coach</h3>
                    <p className="text-sm text-white/40 font-light">Quiero gestionar a mis atletas y escalar mis asesorías.</p>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#00D2FF]/20 to-transparent" />
                  </motion.button>
                </div>
                
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
                  kCaliper AI · Founder Edition 2026
                </p>
              </motion.div>
            )}

            {step === "email" && (
              <motion.div
                key="email-step"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 text-center max-w-sm mx-auto"
              >
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-[#00D2FF] mb-4">
                    {role === 'coach' ? 'PERFIL COACH' : 'PERFIL ATLETA'}
                  </div>
                  <h1 className="text-4xl font-black tracking-tight">Tu Cuenta</h1>
                  <p className="text-white/50 font-light">Ingresa tu email para comenzar</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                   <div className="relative group">
                     <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit(e)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-[#00D2FF]/50 transition-all text-lg"
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-[#00D2FF] text-black size-12 rounded-full flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00D2FF]/20"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleBackClick}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
                  >
                    ← Volver a elegir perfil
                  </button>
                </form>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div
                key="password-step"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 text-center max-w-sm mx-auto"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-black tracking-tight">Tu Clave</h1>
                  <p className="text-white/50 font-light">Crea una contraseña segura</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit(e)}
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
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit(e)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-[#00D2FF]/50 transition-all text-lg tracking-widest"
                    required
                    minLength={6}
                  />
                  
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleBackClick}
                      className="flex-1 bg-white/5 border border-white/10 py-4 rounded-full hover:bg-white/10 font-medium transition-colors text-sm"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] bg-[#00D2FF] text-black py-4 rounded-full font-black hover:bg-[#33DBFF] transition-all disabled:opacity-50 text-sm tracking-widest uppercase"
                    >
                      {loading ? "Creando..." : "Crear Cuenta →"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#00D2FF] blur-3xl opacity-20 rounded-full animate-pulse" />
                  <div className="size-32 rounded-full border-2 border-[#00D2FF] flex items-center justify-center mx-auto relative bg-black/50 backdrop-blur-xl">
                    <motion.div
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Check className="size-16 text-[#00D2FF]" strokeWidth={3} />
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl font-black tracking-tight italic uppercase">¡Bienvenido!</h1>
                  <p className="text-white/60 text-lg leading-relaxed max-w-xs mx-auto">
                    Tu cuenta ha sido creada. <br/>
                    <span className="text-[#00D2FF] font-semibold">Redirigiendo a la pantalla de pago...</span>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="size-2 bg-[#00D2FF] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="size-2 bg-[#00D2FF] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="size-2 bg-[#00D2FF] rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <p className="text-[10px] text-white/10 uppercase tracking-[0.5em]">kCaliper.ai Intelligence</p>
      </div>
    </div>
  );
}
