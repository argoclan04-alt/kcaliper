"use client";

import React from "react";
import { cn } from "./utils";

interface InfiniteMarqueeBannerProps {
  text: string;
  speed?: number; // duration in seconds
  className?: string;
  repeat?: number;
}

export function InfiniteMarqueeBanner({
  text,
  speed = 30,
  className,
  repeat = 10,
}: InfiniteMarqueeBannerProps) {
  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden bg-black py-3 border-y border-white/[0.05] pointer-events-none",
        className
      )}
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="mx-8 text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
              {text}
            </span>
            <div className="h-1 w-1 rounded-full bg-indigo-500/30" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}
