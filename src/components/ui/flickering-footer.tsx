"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { ClassValue, clsx } from "clsx";
import * as Color from "color-bits";
import { motion } from "framer-motion"; // Changed to framer-motion as it's the package name
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Activity } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert any CSS color to rgba
export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback: string = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    // Handle CSS variables
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }

    return Color.formatRGBA(Color.parse(cssColor));
  } catch (e) {
    console.error("Color parsing failed:", e);
    return fallback;
  }
};

interface GridLine {
  id: number;
  type: "v" | "h";
  pos: string;
}

interface FlickerPoint {
  id: number;
  x: number;
  y: number;
}

export function FlickeringFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flickers, setFlickers] = useState<FlickerPoint[]>([]);

  // Simple grid lines
  const gridLines: GridLine[] = useMemo(() => [
    { id: 1, type: "v", pos: "10%" },
    { id: 2, type: "v", pos: "30%" },
    { id: 3, type: "v", pos: "50%" },
    { id: 4, type: "v", pos: "70%" },
    { id: 5, type: "v", pos: "90%" },
    { id: 6, type: "h", pos: "20%" },
    { id: 7, type: "h", pos: "50%" },
    { id: 8, type: "h", pos: "80%" },
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFlicker = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setFlickers((prev) => [...prev.slice(-5), newFlicker]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer 
      ref={containerRef}
      className="relative bg-black text-white py-24 overflow-hidden border-t border-white/5"
    >
      {/* Grid Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {gridLines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "absolute bg-white/10",
              line.type === "v" ? "w-px h-full" : "h-px w-full"
            )}
            style={{ [line.type === "v" ? "left" : "top"]: line.pos }}
          />
        ))}
        {flickers.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 1 }}
            className="absolute size-1 bg-cyan-400 blur-sm rounded-full"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Activity className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">kCaliper<span className="text-indigo-600">.ai</span></span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              La infraestructura definitiva para el seguimiento físico basado en datos y IA.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white/80">Plataforma</h4>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'CaliBot AI', 'DEMA Algorithm'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1 group">
                    {item} <ChevronRightIcon className="size-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white/80">Empresa</h4>
            <ul className="space-y-4">
              {['Sobre Nosotros', 'Contacto', 'Privacidad', 'Términos'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white/80">Social</h4>
            <ul className="space-y-4">
              {['Instagram', 'Twitter', 'LinkedIn', 'YouTube'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">© 2026 kCaliper AI · Todos los derechos reservados</p>
          <div className="flex gap-6">
             <div className="size-2 rounded-full bg-green-500 animate-pulse" title="System Operational" />
             <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Systems Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
