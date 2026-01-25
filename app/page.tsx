"use client";

import { useRef } from "react";
import { ArrowRight, Github, Linkedin, Mail, Terminal } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { GLBModelViewer } from "@/components/ui/glb-model-viewer";
import { Spotlight } from "@/components/ui/spotlight";
import RotatingBorder from "@/components/ui/rotating-border";

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

      {/* Background Accent Spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blue spot - top left */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px]" />
        
        {/* Pink spot - top right */}
        <div className="absolute -top-10 right-1/4 w-80 h-80 bg-pink-500/25 rounded-full blur-[100px]" />
        
        {/* Purple spot - center right */}
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
        
        {/* Blue spot - bottom left */}
        <div className="absolute bottom-1/4 -left-10 w-72 h-72 bg-blue-500/25 rounded-full blur-[100px]" />
        
        {/* Pink spot - bottom center */}
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-pink-600/20 rounded-full blur-[120px]" />
        
        {/* Purple spot - bottom right */}
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/25 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* LEFT SIDE: Text Content */}
        <div className="space-y-6">
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
        <RotatingBorder
          duration={5}
          thickness={2}
          borderRadius={15}
          className="h-100 w-full"
        >
          <div id="RD" className="relative h-full w-full flex items-center justify-center perspective-[1000px] group">
            <Spotlight size={300} className="from-cyan-400/30 via-cyan-500/20 to-transparent" />
            
            <div className="relative w-full h-full">
              {/* Inner container with glass effect */}
              <div className="absolute inset-0 bg-black/20 rounded-xl backdrop-blur-sm overflow-hidden shadow-2xl shadow-cyan-500/10 border border-white/10 before:absolute before:inset-0 before:bg-linear-to-br before:from-white/5 before:via-transparent before:to-transparent before:pointer-events-none">
                
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }}
                />
                
                {/* Top-left decorative corner */}
                <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                  <div className="w-2 h-2 rounded-full bg-cyan-500/60 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                  <div className="w-1 h-1 rounded-full bg-cyan-400/30" />
                </div>
                
                {/* Bottom decorative bar */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />
                
                {/* Side accent line */}
                <div className="absolute top-8 bottom-8 left-0 w-px bg-linear-to-b from-transparent via-cyan-500/20 to-transparent" />
                
                {/* 3D Model Viewer */}
                <GLBModelViewer
                  modelPath="/models/aryan.glb"
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
                
                {/* Binary accent overlay - enhanced */}
                <div className="absolute right-5 top-5 text-cyan-500/30 font-mono text-[10px] pointer-events-none text-right leading-relaxed tracking-wider">
                  <span className="text-cyan-400/40">&#47;&#47;</span> 00101
                  <br />
                  <span className="text-cyan-400/40">&#47;&#47;</span> 00000011
                  <br />
                  <span className="text-cyan-400/40">&#47;&#47;</span> 11111010110
                </div>
                
                {/* Bottom-left status indicator */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-cyan-400/60 uppercase tracking-wider">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RotatingBorder>
      </div>
    </div>
  );
};

export default function Home() {
  return <HeroSection />;
}
