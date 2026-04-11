"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Users } from "lucide-react";
import mascotImg from "@/assets/calibot-mascot.png";
import { cn } from "./utils";

export function BentoFeatures() {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Conoce a <span className="text-indigo-400">CaliBot</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            La inteligencia artificial que elimina la adivinanza de tu progreso físico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-[18rem]">
          {/* 1. 100% Objetivo */}
          <BentoCard className="md:col-span-1 border-white/[0.05]">
            <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
              <div className="relative w-28 h-28 border-4 border-white/10 rounded-full flex items-center justify-center">
                 <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin-slow" />
                 <span className="text-2xl font-black text-white">100%</span>
              </div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white mb-2">Objetivo</h3>
              <p className="text-white/40 text-sm">Ciencia, no adivinanzas. Análisis basado en datos reales.</p>
            </div>
          </BentoCard>

          {/* 2. Inteligencia Real (Mascot) */}
          <BentoCard className="md:col-span-1 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 overflow-hidden">
            <div className="absolute top-4 right-4 text-indigo-400 z-20">
               <Zap size={20} fill="currentColor" />
            </div>
            <div className="absolute right-2 bottom-2 w-32 h-32 z-[1] opacity-90 pointer-events-none">
                <img src={mascotImg} alt="CaliBot" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white mb-2">Inteligencia Real</h3>
              <p className="text-white/40 text-sm max-w-[70%]">
                CaliBot analiza estrés, sueño y nutrición para guiar tu proceso.
              </p>
            </div>
          </BentoCard>

          {/* 3. Análisis DEMA */}
          <BentoCard className="md:col-span-1 overflow-hidden border-white/[0.05]">
            <div className="absolute top-0 inset-x-0 h-28 opacity-15 pointer-events-none">
                <svg viewBox="0 0 400 100" className="w-full h-full stroke-indigo-400 stroke-2 fill-none">
                    <path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50" className="animate-pulse" />
                    <path d="M0,60 Q70,30 140,60 T280,60 T420,60" className="opacity-50" />
                </svg>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white mb-2">Análisis DEMA</h3>
              <p className="text-white/40 text-sm">
                Algoritmos de vanguardia para filtrar la retención de agua y mostrarte la tendencia real.
              </p>
            </div>
          </BentoCard>

          {/* 4. Privacidad Elite (Wide) */}
          <BentoCard className="md:col-span-2 border-white/[0.05]">
            <div className="absolute top-6 left-6 text-white/10 group-hover:text-indigo-500/20 transition-colors">
                <Shield size={56} />
            </div>
            <div className="absolute right-6 top-6 bottom-6 w-[45%] bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 font-mono text-[10px] text-white/15 overflow-hidden hidden sm:block">
                <div className="space-y-1">
                    <p className="text-indigo-400/60">{" > "} Analyzing trend...</p>
                    <p>{" > "} Water retention: 1.2kg</p>
                    <p className="text-red-400/60">{" > "} Real loss: -0.4kg</p>
                    <p className="text-green-400/60">{" > "} DEMA Status: OK</p>
                    <p className="mt-4 opacity-50">01001101 01100001</p>
                    <p className="opacity-50">01111000 00100000</p>
                </div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center sm:justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Privacidad Elite</h3>
              <p className="text-white/40 text-sm max-w-xs">
                Tus datos y fotos de progreso están protegidos con cifrado AES-256.
              </p>
            </div>
          </BentoCard>

          {/* 5. Red de Coaches */}
          <BentoCard className="md:col-span-1 border-white/[0.05]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center gap-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500" />
                    <div className="w-7 h-7 rounded-full bg-cyan-500" />
                </div>
                <Users size={40} className="text-white" />
                <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/20" />
                    <div className="w-7 h-7 rounded-full bg-white/10" />
                </div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white mb-2">Red de Coaches</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Conecta con los mejores profesionales del sector en tiempo real.
              </p>
            </div>
          </BentoCard>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}

function BentoCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
