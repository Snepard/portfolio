"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollScene } from "@/components/ui/scroll-scene";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioPage() {
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".scroll-section");
    if (sections.length < 3) return;

    const ctx = gsap.context(() => {
      // Phase 2: First Scroll (Hero to Section 2)
      // Animate text scale/opacity
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          scale: 3, // zooming towards user
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sections[0],
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      // Section 2 UI Entry: Fades in on left as scrub continues
      if (section2Ref.current) {
        gsap.fromTo(section2Ref.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1, x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sections[1],
              start: "top 60%",
              end: "top 20%",
              scrub: true,
              snap: {
                snapTo: 1, // snap to the end of this scrub timeline (which corresponds to section center if setup correctly)
                duration: { min: 0.5, max: 1.5 },
                delay: 0.1,
                ease: "power1.inOut"
              }
            }
          }
        );
      }

      // Section 3 UI Entry: Fades in on right
      if (section3Ref.current) {
        gsap.fromTo(section3Ref.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1, x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sections[2],
              start: "top 60%",
              end: "top 20%",
              scrub: true,
              snap: {
                snapTo: 1,
                duration: { min: 0.5, max: 1.5 },
                delay: 0.1,
                ease: "power1.inOut"
              }
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative bg-slate-950 text-slate-100 selection:bg-cyan-500/30 overflow-x-hidden">

      {/* Background Text Layer (Fixed, behind the 3D character) */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <h1
          ref={heroTextRef}
          className="text-8xl md:text-[10rem] lg:text-[13rem] font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500 leading-none select-none -translate-y-16"
          style={{ transformOrigin: "center center" }}
        >
          ARYAN SINGH
        </h1>
      </div>

      {/* 3D Global Canvas Layer (Fixed, in front of the background text) */}
      <div className="fixed inset-0 z-10 pointer-events-none w-full h-full">
        <ScrollScene
          modelPath="/models/Aryan.glb"
          animationsPath="/models/Animations.glb"
          className="w-full h-full"
        />
      </div>

      {/* HTML Overlay Layer (Scrollable, passes pointers through to 3D where empty) */}
      <div className="relative z-20 flex flex-col w-full pointer-events-none">

        {/* SECTION 1: HERO */}
        {/* We make it 150vh so user can scroll to scrub the timeline before the next section arrives fully */}
        <section className="scroll-section h-[150vh] w-full relative pointer-events-auto">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6">

            {/* The actual text is now fixed in the background (z-0), so we just leave visual empty space here */}

            {/* Bottom Right Buttons */}
            <div className="absolute bottom-12 right-6 md:right-12 flex flex-col md:flex-row gap-4">
              <button className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
                Resume <Download size={18} />
              </button>
              <button className="px-8 py-3 border border-slate-600 text-white font-medium rounded-full hover:bg-slate-800 hover:border-slate-500 transition-colors flex items-center gap-2">
                Contact <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: TECH STACK - Content Left */}
        <section className="scroll-section min-h-screen w-full flex pointer-events-auto">
          <div ref={section2Ref} className="w-full md:w-[60%] flex flex-col justify-center px-6 md:pl-24 py-20 opacity-0">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                Tech <br />
                <span className="text-cyan-400">Stack</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 max-w-md">
                {['React', 'Next.js', 'Three.js', 'GSAP', 'Node.js', 'Tailwind'].map((tech) => (
                  <div key={tech} className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 hover:border-cyan-500/50 transition-colors">
                    <span className="font-mono text-slate-300">{tech}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-slate-900 rounded-lg border-l-4 border-cyan-500 font-mono text-sm md:text-base text-slate-400 max-w-md">
                <span className="text-purple-400">const</span> <span className="text-blue-400">role</span> = <span className="text-green-400">&quot;Creative Developer&quot;</span>;
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROJECTS - Content Right */}
        <section className="scroll-section min-h-screen w-full flex justify-end pointer-events-auto relative">
          <div ref={section3Ref} className="w-full md:w-[60%] flex flex-col justify-center px-6 md:pr-24 py-20 text-right md:text-left opacity-0 z-10">
            <div className="space-y-6 max-w-xl md:ml-auto">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                Projects
              </h2>

              <p className="text-lg text-slate-400 leading-relaxed">
                Product-grade interfaces, immersive web experiences, and full-stack systems with a strong focus on
                performance, motion, and visual storytelling.
              </p>

              <div className="pt-8 flex justify-end md:justify-start">
                <button className="text-cyan-400 font-medium hover:text-cyan-300 underline underline-offset-4 decoration-2">
                  Explore case studies
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: NORMAL SCROLLING */}
        <section className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-12 text-center border-t border-slate-900 pointer-events-auto">
          <h3 className="text-3xl font-bold mb-4">Normal HTML Content</h3>
          <p className="text-slate-400 max-w-2xl">
            By this point, the 3D model scroll timeline has completed.
            The character remains in its final state on the left.
            Further scrolling simply moves the page normally.
          </p>
        </section>

      </div>
    </main>
  );
}