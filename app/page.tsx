"use client";

import { useRef } from "react";
import { ArrowRight, Github, Linkedin, Mail, Terminal } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { GLBModelViewer } from "@/components/ui/glb-model-viewer";
import { Spotlight } from "@/components/ui/spotlight";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Blockchain Enthusiast",
  "Creative Technologist",
  "AI Enthusiast",
] as const;

const HeroSection = () => {
  const roleAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden font-sans">
      <Spotlight className="z-20" />
      
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

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Hi, I&apos;m <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
              Aryan Singh
            </span>
          </h1>

          {/* Particle Role Text (replaces typewriter) */}
          <div className="space-y-2">
            <p className="text-xl md:text-2xl font-mono text-gray-400">&gt; I am a</p>
            {/* Anchor spans from left text alignment to 3D model edge */}
            <div ref={roleAnchorRef} className="h-20 w-full" />
          </div>

          <p className="text-gray-400 max-w-lg text-base leading-relaxed">
            Specializing in scalable web apps, blockchain integration, and AI solutions.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-7 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-all flex items-center gap-2 text-sm md:text-base">
              View Projects <ArrowRight size={18} />
            </button>
            <button className="px-7 py-2.5 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-500 rounded-lg transition-all text-sm md:text-base">
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

        {/* RIGHT SIDE: 3D Model */}
        <div className="relative h-100 w-full flex items-center justify-center perspective-[1000px] group">
          <Spotlight size={300} className="from-cyan-400/30 via-cyan-500/20 to-transparent" />
          
          <div className="relative w-full h-full">
            {/* Gradient border container */}
            <div className="absolute inset-0 bg-linear-to-br from-gray-800/20 to-gray-900/20 rounded-2xl border border-gray-800 backdrop-blur-sm overflow-hidden">
              {/* 3D Model Viewer */}
              <GLBModelViewer
                modelPath="/models/aryan.glb"
                animationsPath="/models/animations.glb"
                className="w-full h-full"
                scale={2.2}
                position={[0, -3.4, 0]}
                cameraPosition={[0, 0.5, 3]}
                cameraFov={35}
                autoRotate={false}
                enableOrbitControls={true}
                enableMouseLight={true}
                enableHeadTracking={true}
                headBoneName="Neck"
              />
              
              {/* Binary accent overlay */}
              <div className="absolute right-6 top-6 text-cyan-500 opacity-20 font-mono text-xs pointer-events-none">
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
