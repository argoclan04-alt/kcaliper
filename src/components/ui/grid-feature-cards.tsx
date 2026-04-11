"use client";

import { cn } from "./utils";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type FeatureType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

interface FeatureCardProps extends React.ComponentProps<"div"> {
  feature: FeatureType;
}

export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  const squares = React.useMemo(() => genRandomPattern(), []);

  return (
    <div className={cn("relative overflow-hidden p-8 border-dashed border-white/5", className)} {...props}>
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
          <GridPattern
            width={24}
            height={24}
            x="-12"
            y="4"
            squares={squares}
            className="fill-white/[0.03] stroke-white/[0.05] absolute inset-0 h-full w-full mix-blend-overlay"
          />
        </div>
      </div>
      <div className="relative z-10">
        <div className="mb-6 flex space-x-1">
            <feature.icon className="text-white/60 size-5" strokeWidth={1} aria-hidden />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">{feature.title}</h3>
        <p className="mt-3 text-xs font-light leading-relaxed text-white/40">{feature.description}</p>
      </div>
    </div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<"svg"> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={x * width} y={y * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length = 6): number[][] {
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 6,
    Math.floor(Math.random() * 8) + 1,
  ]);
}

interface AnimatedContainerProps {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}

export function AnimatedContainer({ className, delay = 0.1, children }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", y: -10, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
