"use client";

import type { CSSProperties, PropsWithChildren } from "react";

export interface RotatingBorderProps extends PropsWithChildren {
  /** Duration of one full rotation in seconds */
  duration?: number;
  /** Border thickness in pixels */
  thickness?: number;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Additional className for the wrapper */
  className?: string;
  /** Additional styles for the wrapper */
  style?: CSSProperties;
}

export default function RotatingBorder({
  children,
  duration = 4,
  thickness = 2,
  borderRadius = 16,
  className = "",
  style,
}: RotatingBorderProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius,
        padding: thickness,
        ...style,
      }}
    >
      {/* Rotating gradient background (the "laser" border) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <div
          className="absolute -inset-full animate-spin"
          style={{
            background: `conic-gradient(
              from 0deg,
              #fff 0deg,
              #60a5fa 30deg,
              #3b82f6 60deg,
              #06b6d4 120deg,
              #38bdf8 180deg,
              #fff 210deg,
              #60a5fa 240deg,
              #3b82f6 270deg,
              #06b6d4 300deg,
              #38bdf8 330deg,
              #fff 360deg
            )`,
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
          }}
        />
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-50 blur-md overflow-hidden pointer-events-none"
        style={{ borderRadius }}
      >
        <div
          className="absolute -inset-full animate-spin"
          style={{
            background: `conic-gradient(
              from 0deg,
              rgba(255,255,255,0.7) 0deg,
              rgba(96,165,250,0.5) 30deg,
              rgba(59,130,246,0.5) 60deg,
              rgba(6,182,212,0.5) 120deg,
              rgba(56,189,248,0.5) 180deg,
              rgba(255,255,255,0.4) 210deg,
              rgba(96,165,250,0.4) 240deg,
              rgba(59,130,246,0.4) 270deg,
              rgba(6,182,212,0.4) 300deg,
              rgba(56,189,248,0.4) 330deg,
              rgba(255,255,255,0.3) 360deg
            )`,
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
          }}
        />
      </div>

      {/* Inner content container */}
      <div
        className="relative w-full h-full bg-[#050505]"
        style={{ borderRadius: Math.max(0, borderRadius - thickness) }}
      >
        {children}
      </div>
    </div>
  );
}
