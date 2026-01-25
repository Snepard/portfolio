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
              rgba(14, 165, 233, 0.9),
              rgba(56, 189, 248, 0.9),
              rgba(6, 182, 212, 0.9),
              rgba(34, 211, 238, 0.9),
              rgba(59, 130, 246, 0.9),
              rgba(96, 165, 250, 0.9),
              rgba(14, 165, 233, 0.9)
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
              rgba(14, 165, 233, 0.8),
              rgba(56, 189, 248, 0.8),
              rgba(6, 182, 212, 0.8),
              rgba(34, 211, 238, 0.8),
              rgba(59, 130, 246, 0.8),
              rgba(96, 165, 250, 0.8),
              rgba(14, 165, 233, 0.8)
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
