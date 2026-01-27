"use client";

import { useRef, useState, useEffect } from "react";
import { Download, Github, Linkedin, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { GLBModelViewer } from "@/components/ui/glb-model-viewer";
import { Spotlight } from "@/components/ui/spotlight";
import RotatingBorder from "@/components/ui/rotating-border";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Blockchain Developer",
  "Creative Technologist",
  "AI Enthusiast",
] as const;

const TARGET_TEXT = "Download Resume";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

function ScrambleDownloadButton() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setText(TARGET_TEXT);
  };

  return (
    <motion.a
      href="/resume.pdf"
      download
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-cyan-700/12 border border-cyan-500/30 text-white font-medium text-sm shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 hover:border-white/80"
      style={{ minWidth: `${TARGET_TEXT.length + 6}ch` }}
    >
      <div className="relative z-10 flex items-center gap-2">
        <Download size={17} className="opacity-90" />
        <span className="font-mono whitespace-nowrap">{text}</span>
        <span className="text-cyan-100 text-xs font-normal ml-1">PDF</span>
      </div>

      {/* Hover fill: subtle border-color matched overlay (no scanner animation) */}
      <span className="absolute inset-0 z-0 rounded-md bg-cyan-600/18 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.a>
  );
}

const HeroSection = () => {
  const roleAnchorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Pause heavy animations when the hero is scrolled out of view
  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsPaused(entry.intersectionRatio < 0.01)
        })
      },
      { threshold: [0, 0.01, 0.5, 1] }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={heroRef} className={`h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden font-sans ${isPaused ? 'paused' : ''}`}>
      <Spotlight className="z-20" />
      
      {/* Fullscreen transparent particle canvas; text forms at role slot */}
      <ParticleTextEffect
        fullscreen
        words={ROLES}
        anchorRef={roleAnchorRef}
        paused={isPaused}
        wordChangeIntervalMs={3200}
        anchorPadding={16}
        fontSize={57}
        showCaption={false}
        interactive={false}
        backgroundMode="fadeToTransparent"
        fadeAlpha={0.12}
        className="absolute inset-0 pointer-events-none z-0"
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
            <div className="relative inline-block">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-2xl blur-2xl"
                style={{
                  background: "radial-gradient(circle at 50% 60%, rgba(255,255,255,0.7) 0%, rgba(59,130,246,0.35) 40%, rgba(59,130,246,0.12) 70%, transparent 100%)",
                  width: "100%",
                  height: "100%",
                  left: 0,
                  top: 0,
                }}
              />
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight" style={{ fontFamily: "var(--font-arkhip), sans-serif" }}>
                <span className="text-white">Aryan Singh</span>
              </h1>
            </div>
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
          <div className="pt-2 flex gap-4">
            <ScrambleDownloadButton />
            <a
              href="#projects"
              className="relative overflow-hidden inline-flex items-center gap-3 px-5 py-2.5 rounded-md bg-blue-600/14 border border-blue-500/40 text-white font-medium text-sm shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/30 hover:border-white/80 group"
            >
              {/* subtle hover fill */}
              <span className="pointer-events-none absolute inset-0 rounded-md bg-blue-500/20 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-out" style={{ transitionProperty: 'opacity, transform' }} />

              {/* Icon viewport */}
              <div className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
                <span className="absolute h-2 w-2 rounded-full bg-white transition-all duration-300 ease-out group-hover:translate-x-full group-hover:opacity-0" />
                <ArrowRight className="absolute h-full w-full -translate-x-full opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
              </div>

              <span className="text-sm tracking-wide">View Projects</span>
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
            <Spotlight size={350} className="from-cyan-400/40 via-cyan-500/25 to-transparent" />
            
            <div className="relative w-full h-full">
              {/* Inner container with translucent glass effect */}
              <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-gray-900/70 to-slate-950/80 rounded-xl backdrop-blur-2xl overflow-hidden shadow-2xl shadow-cyan-500/25 border border-cyan-400/25 before:absolute before:inset-0 before:bg-linear-to-br before:from-white/8 before:via-transparent before:to-cyan-500/3 before:pointer-events-none">
                
                {/* Holographic grid overlay */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(6,182,212,0.6) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(6,182,212,0.6) 1px, transparent 1px),
                      radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 60%)
                    `,
                    backgroundSize: '25px 25px, 25px 25px, 100% 100%'
                  }}
                />
                
                {/* Animated corner brackets - top left */}
                <div className="absolute top-3 left-3 pointer-events-none">
                  <div className="w-8 h-8 border-l-2 border-t-2 border-cyan-400/50 rounded-tl transition-all duration-300 group-hover:border-cyan-400/70 group-hover:w-10 group-hover:h-10" />
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-pulse" />
                </div>
                
                {/* Animated corner brackets - top right */}
                <div className="absolute top-3 right-3 pointer-events-none">
                  <div className="w-8 h-8 border-r-2 border-t-2 border-cyan-400/50 rounded-tr transition-all duration-300 group-hover:border-cyan-400/70 group-hover:w-10 group-hover:h-10" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                
                {/* Animated corner brackets - bottom left */}
                <div className="absolute bottom-3 left-3 pointer-events-none">
                  <div className="w-8 h-8 border-l-2 border-b-2 border-cyan-400/50 rounded-bl transition-all duration-300 group-hover:border-cyan-400/70 group-hover:w-10 group-hover:h-10" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Animated corner brackets - bottom right */}
                <div className="absolute bottom-3 right-3 pointer-events-none">
                  <div className="w-8 h-8 border-r-2 border-b-2 border-cyan-400/50 rounded-br transition-all duration-300 group-hover:border-cyan-400/70 group-hover:w-10 group-hover:h-10" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
                
                {/* Top-left decorative HUD element */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rotate-45 bg-cyan-400/70 animate-pulse shadow-lg shadow-cyan-500/30" />
                      <div className="w-12 h-0.5 bg-linear-to-r from-cyan-400/70 to-transparent" />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400/50 tracking-[0.25em] uppercase font-medium">Model.v1</span>
                  </div>
                  <div className="ml-8 text-[12px] font-mono text-cyan-400/35 leading-relaxed tracking-widest">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-500/20">&gt;</span>
                      <span>00101</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-500/20">&gt;</span>
                      <span>00000011</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-500/20">&gt;</span>
                      <span>11111010110</span>
                    </div>
                  </div>
                </div>
                
                {/* Vertical data stream - left side */}
                <div className="absolute top-20 bottom-20 left-1.5 w-px bg-linear-to-b from-transparent via-cyan-400/40 to-transparent" />
                <div className="absolute top-24 bottom-24 left-3 w-px bg-linear-to-b from-cyan-500/20 via-cyan-400/30 to-cyan-500/20" />
                
                {/* Vertical data stream - right side */}
                <div className="absolute top-20 bottom-20 right-1.5 w-px bg-linear-to-b from-transparent via-cyan-400/40 to-transparent" />
                <div className="absolute top-24 bottom-24 right-3 w-px bg-linear-to-b from-cyan-500/20 via-cyan-400/30 to-cyan-500/20" />
                
                {/* Top decorative bar with animated segments */}
                <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent" />
                <div className="absolute top-1 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent" />
                
                {/* Bottom decorative bar with animated segments */}
                <div className="absolute bottom-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent" />
                <div className="absolute bottom-1 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent" />
                
                {/* 3D Model Viewer */}
                <GLBModelViewer
                  modelPath="/models/aryan.glb"
                  className="w-full h-full"
                  scale={2.2}
                  position={[0, -3.4, 0]}
                  cameraPosition={[0, 0.5, 3]}
                  cameraFov={35}
                  autoRotate={false}
                  paused={isPaused}
                  enableOrbitControls={true}
                  enableMouseLight={true}
                  enableHeadTracking={true}
                  headBoneName="Neck"
                />
                
                {/* Tech data overlay - right side with more detail */}
                <div className="absolute right-6 top-16 flex flex-col gap-3 pointer-events-none">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-[10px] font-mono text-cyan-400/40 tracking-wider">SYS</span>
                      <div className="w-14 h-1 bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/10">
                        <div className="w-4/5 h-full bg-linear-to-r from-cyan-500/70 to-cyan-400/50 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-[10px] font-mono text-cyan-400/40 tracking-wider">MEM</span>
                      <div className="w-14 h-1 bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/10">
                        <div className="w-3/5 h-full bg-linear-to-r from-emerald-500/70 to-emerald-400/50" />
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400/25 text-right leading-relaxed">
                    <div>STATUS: <span className="text-emerald-400/50">ONLINE</span></div>
                    <div>RENDER: <span className="text-cyan-400/40">OK</span></div>
                  </div>
                </div>
                
                {/* Bottom-right status indicator - enhanced */}
                <div className="absolute bottom-6 right-6 flex items-center gap-3 pointer-events-none">
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-cyan-500/8 border border-cyan-400/25 backdrop-blur-md shadow-lg shadow-cyan-500/10">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50" />
                      <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400/40 animate-ping" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300/80 uppercase tracking-[0.2em] font-medium">Active</span>
                  </div>
                </div>
                
                {/* Center target reticle - subtle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="relative w-24 h-24">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-cyan-400/50" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-cyan-400/50" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-px bg-cyan-400/50" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-px bg-cyan-400/50" />
                  </div>
                </div>
                
                {/* Subtle inner glow overlay - enhanced */}
                <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_80px_rgba(6,182,212,0.08),inset_0_0_30px_rgba(6,182,212,0.05)]" />
                
                {/* Subtle vignette effect */}
                <div className="absolute inset-0 pointer-events-none rounded-xl bg-radial-[ellipse_at_center] from-transparent via-transparent to-black/30" />
              </div>
            </div>
          </div>
        </RotatingBorder>
      </div>
      {/* Scroll Down Animated Element */}
      <div className="pointer-events-none select-none absolute left-1/2 bottom-8 z-30 flex flex-col items-center" style={{transform: 'translateX(-50%)'}}>
        <div className="relative w-7 h-16 flex flex-col items-center justify-center">
          <div className="chevron-anim absolute w-7 h-2 opacity-0" />
          <div className="chevron-anim absolute w-7 h-2 opacity-0" />
          <div className="chevron-anim absolute w-7 h-2 opacity-0" />
        </div>
        <span className="scroll-text block text-xs text-white/60 tracking-widest uppercase font-medium animate-scrollpulse">Know more</span>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Example subsequent section so page can scroll and hero effects stop at viewport */}
      <section id="projects" className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Projects</h2>
          <p className="text-gray-600">Add your project sections here — hero effects stay inside the hero viewport.</p>
        </div>
      </section>
    </>
  );
}
