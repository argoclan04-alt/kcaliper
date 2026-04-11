"use client";
import { type HTMLAttributes, useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "./utils";
import * as React from "react";

type BannerVariant = "rainbow" | "normal";

export function Banner({
  id,
  xColor,
  variant = "normal",
  height = "3rem",
  rainbowColors = [
    "rgba(0,149,255,0.56)",
    "rgba(231,77,255,0.77)",
    "rgba(255,0,0,0.73)",
    "rgba(131,255,166,0.66)",
  ],
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  height?: string;
  xColor?: string;
  variant?: BannerVariant;
  rainbowColors?: string[];
}) {
  const [open, setOpen] = useState(true);
  const globalKey = id ? `nd-banner-${id}` : null;

  useEffect(() => {
    if (globalKey) {
      const stored = localStorage.getItem(globalKey);
      if (stored === "true") setOpen(false);
    }
  }, [globalKey]);

  if (!open) return null;

  return (
    <div
      id={id}
      {...props}
      className={cn(
        "relative z-0 flex flex-row items-center justify-center px-4 text-center text-sm font-medium",
        variant === "normal" && "bg-neutral-900",
        variant === "rainbow" && "bg-black",
        props.className
      )}
      style={{ height }}
    >
      {variant === "rainbow" ? <RainbowFlow colors={rainbowColors} /> : null}
      {props.children}
      {id ? (
        <button
          type="button"
          aria-label="Close Banner"
          onClick={() => {
            setOpen(false);
            if (globalKey) {
              localStorage.setItem(globalKey, "true");
            }
          }}
          className="absolute cursor-pointer end-2 md:end-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
        >
          <X size={16} color={xColor} />
        </button>
      ) : null}
    </div>
  );
}

const maskImage =
  "linear-gradient(to bottom,white,transparent), radial-gradient(circle at top center, white, transparent)";

function RainbowFlow({ colors }: { colors: string[] }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[-1]"
        style={
          {
            maskImage,
            maskComposite: "intersect",
            animation: "fd-moving-banner 20s linear infinite",
            backgroundImage: `repeating-linear-gradient(70deg, ${[...colors, colors[0]].map((color, i) => `${color} ${(i * 50) / colors.length}%`).join(", ")})`,
            backgroundSize: "200% 100%",
            filter: "saturate(2)",
          } as object
        }
      />
      <style>
        {`@keyframes fd-moving-banner {
            from { background-position: 0% 0;  }
            to { background-position: 100% 0;  }
         }`}
      </style>
    </>
  );
}
