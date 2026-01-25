"use client";

import { useRef } from "react";
import { ArrowRight, Github, Linkedin, Mail, Terminal } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Blockchain Enthusiast",
  "AI Engineer",
] as const;

const HeroSection = () => {
  const roleAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Fullscreen transparent particle canvas; text forms at role slot */}
      <ParticleTextEffect
        words={ROLES}
        fullscreen
        anchorRef={roleAnchorRef}
        anchorPadding={16}
        fontSize={57}
        showCaption={false}
        interactive={false}
        backgroundMode="fadeToTransparent"
        fadeAlpha={0.12}
        className="fixed inset-0 pointer-events-none z-0"
        canvasClassName="absolute inset-0"
        colors={[
          { r: 6, g: 182, b: 212 },   // cyan-500
          { r: 34, g: 211, b: 238 },  // cyan-400
          { r: 59, g: 130, b: 246 },  // blue-500
          { r: 96, g: 165, b: 250 },  // blue-400
        ]}
      />

      {/* Background Elements (Optional Particle vibe) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* LEFT SIDE: Text Content */}
        <div className="space-y-6">
          {/* Small badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-sm font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            Available for hire
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Hi, I&apos;m <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
              Aryan Singh
            </span>
          </h1>

          {/* Particle Role Text (replaces typewriter) */}
          <div className="space-y-2">
            <p className="text-2xl md:text-3xl font-mono text-gray-400">&gt; I am a</p>
            {/* Anchor spans from left text alignment to 3D model edge */}
            <div ref={roleAnchorRef} className="h-20 w-full" />
          </div>

          <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
            Specializing in scalable web apps, blockchain integration, and AI solutions.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all flex items-center gap-2">
              View Projects <ArrowRight size={18} />
            </button>
            <button className="px-8 py-3 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-500 rounded-lg transition-all">
              Contact Me
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 pt-8 text-gray-500">
            <div className="relative group">
              <Github className="hover:text-white cursor-pointer transition-colors" aria-label="GitHub" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                GitHub
              </span>
            </div>
            <div className="relative group">
              <Linkedin className="hover:text-white cursor-pointer transition-colors" aria-label="LinkedIn" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                LinkedIn
              </span>
            </div>
            <div className="relative group">
              <Mail className="hover:text-white cursor-pointer transition-colors" aria-label="Email" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                Email
              </span>
            </div>
            <div className="relative group">
              <Terminal className="hover:text-white cursor-pointer transition-colors" aria-label="Terminal" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                Terminal
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: 3D Model Placeholder */}
        <div className="relative h-[500px] w-full flex items-center justify-center perspective-[1000px] group">
          {/* This represents where your Spline/Three.js canvas goes */}
          <div className="relative w-full h-full transition-transform duration-200 ease-out transform group-hover:scale-105">
            {/* Simulation of the 3D Robot Image provided */}
            <div className="absolute inset-0 bg-linear-to-br from-gray-800/20 to-gray-900/20 rounded-2xl border border-gray-800 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {/* Abstract 3D shape representation */}
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-linear-to-tr from-gray-200 to-gray-500 rounded-full blur-sm opacity-20 animate-pulse" />
                {/* Replace this div with your <Spline /> component */}
                <div className="w-full h-full bg-black/50 rounded-lg flex items-center justify-center border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                  <span className="text-cyan-500 font-mono text-center px-4">
                    [ 3D Model / Spline Scene Here ]
                    <br />
                    <span className="text-xs text-gray-500">Moves with Cursor</span>
                  </span>
                </div>
              </div>

              {/* Particle accents mimicking the reference image */}
              <div className="absolute right-10 top-10 text-cyan-500 opacity-20 font-mono text-xs">
                01001000
                <br />
                01000101
                <br />
                01001100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return <HeroSection />;
}
