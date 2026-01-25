"use client";

import { useRef } from "react";
import { Download, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { GLBModelViewer } from "@/components/ui/glb-model-viewer";
import { Spotlight } from "@/components/ui/spotlight";
import RotatingBorder from "@/components/ui/rotating-border";
import GradientText from "@/components/GradientText";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Blockchain Developer",
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
        <div className="space-y-8">
          <div className="space-y-0">
            <p className="text-2xl text-gray-300 font-light">Hey, I&apos;m</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight" style={{ fontFamily: "var(--font-arkhip), sans-serif" }}>
              <GradientText
                colors={["#BFDBFE",  "#93C5FD", "#60A5FA", "#4F8EF7", "#3B82F6", "#4F8EF7", "#60A5FA", "#93C5FD"]}
                animationSpeed={3}
                showBorder={false}
                className=""
              >
                Aryan Singh
              </GradientText>
            </h1>
          </div>

          {/* Particle Role Text */}
          <div className="space-y-3">
            <p className="text-lg md:text-xl font-mono text-gray-500">
              <span className="text-cyan-500">const</span> role <span className="text-pink-400">=</span>
            </p>
            <div ref={roleAnchorRef} className="h-16 w-full" />
          </div>

          <p className="text-gray-400 max-w-md text-lg leading-relaxed font-light">
            Crafting scalable solutions at the intersection of 
            <span className="text-cyan-400"> innovation</span> and 
            <span className="text-purple-400"> technology</span>.
          </p>

          {/* Download Resume Button */}
          <div className="pt-2">
            <a 
              href="/resume.pdf" 
              download
              className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Download size={18} className="relative z-10" />
              <span className="relative z-10">Download Resume</span>
              <span className="relative z-10 text-cyan-200 text-xs font-normal">PDF</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-6">
            <span className="text-xs text-gray-600 uppercase tracking-widest">Connect</span>
            <div className="h-px w-8 bg-gray-700" />
            <div className="flex gap-3">
              <a href="#" className="group p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300">
                <Github size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </a>
              <a href="#" className="group p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300">
                <Linkedin size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </a>
              <a href="#" className="group p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300">
                <Mail size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </a>
              <a href="#" className="group p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300">
                <ExternalLink size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </a>
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
              {/* Inner container with translucent glass effect */}
              <div className="absolute inset-0 bg-gray-900/60 rounded-xl backdrop-blur-md overflow-hidden shadow-2xl shadow-cyan-500/10 border border-white/10 before:absolute before:inset-0 before:bg-linear-to-br before:from-white/5 before:via-transparent before:to-transparent before:pointer-events-none">
                
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
