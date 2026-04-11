import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { CanvasRevealEffect, MiniNavbar } from "./ui/sign-in-flow-1";

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      toast.error(`Error: ${error.message}`);
      setLoading(false);
    } else {
      toast.success("Contraseña actualizada correctamente.");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative text-white selection:bg-white selection:text-black">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[[255, 255, 255]]}
            dotSize={6}
            reverse={success}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_transparent_100%)]" />
      </div>

      <MiniNavbar />

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
        <div className="w-full max-w-sm mt-32">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">Nueva Clave</h1>
                  <p className="text-white/50 font-light">Ingresa tu nueva contraseña para kCaliper</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-white/30 transition-all text-lg"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-center focus:outline-none focus:border-white/30 transition-all text-lg"
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-white/90 transition-all disabled:opacity-50 mt-4"
                  >
                    {loading ? "Actualizando..." : "Actualizar Contraseña →"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  <span className="text-black text-4xl">✓</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">¡Listo!</h1>
                  <p className="text-white/50 font-light">Tu contraseña ha sido actualizada. Redirigiendo...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
