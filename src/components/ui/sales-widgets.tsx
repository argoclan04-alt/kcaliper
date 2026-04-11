"use client";

import React, { useState, useEffect } from "react";
import { Banner } from "./banner";
import { Rocket, Trophy, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const purchases = [
  {
    name: "Juan P.",
    plan: "Atleta Legend",
    comment: "¡Increíble herramienta para medir progresos!",
    time: "hace 2 min",
    icon: <Trophy className="text-yellow-500 w-5 h-5" />
  },
  {
    name: "Ana M.",
    plan: "Atleta Pro",
    comment: "Ya no me preocupo por las fluctuaciones de peso.",
    time: "hace 5 min",
    icon: <Rocket className="text-indigo-500 w-5 h-5" />
  },
  {
    name: "Carlos D.",
    plan: "Coach Global",
    comment: "Excelente para gestionar mis clientes.",
    time: "hace 10 min",
    icon: <Star className="text-cyan-500 w-5 h-5" />
  },
  {
    name: "Sofía L.",
    plan: "Atleta Legend",
    comment: "El análisis de tendencia DEMA me salvó.",
    time: "hace 1 min",
    icon: <Zap className="text-rose-500 w-5 h-5" />
  },
  {
    name: "Martín R.",
    plan: "Coach Elite",
    comment: "Me ahorra horas de WhatsApp con clientes.",
    time: "hace 15 min",
    icon: <Star className="text-cyan-500 w-5 h-5" />
  }
];

export function SalesWidgets() {
  const [currentPurchase, setCurrentPurchase] = useState<typeof purchases[0] | null>(null);

  useEffect(() => {
    // Array of possible intervals
    const intervals = [8000, 15000, 20000];

    let timer: NodeJS.Timeout;

    const triggerNext = () => {
      // Pick a random purchase
      const purchase = purchases[Math.floor(Math.random() * purchases.length)];
      setCurrentPurchase(purchase);
      
      // Select the next delay
      const nextDelay = intervals[Math.floor(Math.random() * intervals.length)];
      
      // Auto-hide the banner after 5 seconds
      setTimeout(() => {
        setCurrentPurchase(null);
      }, 5000);

      timer = setTimeout(triggerNext, nextDelay);
    };

    // First trigger after 3 seconds
    timer = setTimeout(triggerNext, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {currentPurchase && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto"
          >
            <Banner
              show={true}
              variant="default"
              title={`${currentPurchase.name} se suscribió a ${currentPurchase.plan}`}
              description={`"${currentPurchase.comment}" · ${currentPurchase.time}`}
              showShade={true}
              closable={true}
              onHide={() => setCurrentPurchase(null)}
              icon={currentPurchase.icon}
              className="bg-black/80 backdrop-blur-md border-white/10 shadow-2xl max-w-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
