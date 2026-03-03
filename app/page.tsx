"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollScene } from "@/components/ui/scroll-scene";
import { ScrollVideo } from "@/components/ui/scroll-video";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function PortfolioPage() {
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".scroll-section");
    if (sections.length < 3) return;

    const ctx = gsap.context(() => {

      // Hide Video after Section 3
      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          yPercent: -100, // Scroll up with the page
          ease: "none",
          scrollTrigger: {
            trigger: sections[2], // Start fading/moving out when leaving Section 3
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }

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
              start: "top 100%", // Starts appearing right as video starts fading in
              end: "top 50%",   // Finishes appearing as video is fully in
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
              start: "top 100%",
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

      // Section 4 UI Entry (Fade in perfectly over Section 3)
      if (section4Ref.current) {
        gsap.to(section4Ref.current, {
          opacity: 1,
          pointerEvents: "auto",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sections[2], // Use Section 3
            start: "top 0%",      // Start when Section 3 hits the top
            end: "bottom 100%",   // End when Section 3 hits the bottom (100vh later)
            scrub: true,
            snap: {
              snapTo: 1,
              duration: { min: 0.5, max: 1.5 },
              delay: 0.1,
              ease: "power1.inOut"
            }
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Auto-Scrolling Logic - Only 3 static locations
  useEffect(() => {
    let isAnimating = false;
    let currentStop = 0;
    let stops: number[] = [];

    const calculateStops = () => {
      const vh = window.innerHeight;
      stops = [
        0,         // 0: Top of Hero
        vh * 1.7,  // 1: Section 2 (About Me) perfectly centered
        vh * 2.7,  // 2: Section 3 (Tech Stack) perfectly at top
        vh * 3.7   // 3: Section 4 (Contact / Final View)
      ];
    };

    calculateStops();
    window.addEventListener("resize", calculateStops);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;

      if (Math.abs(e.deltaY) < 15) return; // Ignore micro scrolling from trackpads/magic mice

      const direction = e.deltaY > 0 ? 1 : -1;
      goToStop(currentStop + direction);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isAnimating) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 40) { // Threshold for a deliberate swipe
        const direction = deltaY > 0 ? 1 : -1;
        goToStop(currentStop + direction);
      }
    };

    const goToStop = (nextStop: number) => {
      if (nextStop >= 0 && nextStop < stops.length) {
        isAnimating = true;
        currentStop = nextStop;

        gsap.to(window, {
          scrollTo: stops[currentStop],
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Delay unlocking slightly to let trackpad momentum fully die
            setTimeout(() => { isAnimating = false; }, 400);
          }
        });
      }
    };

    // Add { passive: false } to allow e.preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Ensure we start at 0 and avoid browser restoring scroll mid-way
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("resize", calculateStops);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.history.scrollRestoration = "auto";
    };
  }, []);

  return (
    <main className="relative bg-slate-950 text-slate-100 selection:bg-cyan-500/30 overflow-x-hidden">

      {/* Background Video Layer (Fixed, behind everything) */}
      <div ref={videoContainerRef} className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
        <ScrollVideo />
      </div>

      {/* Background Text Layer (Fixed, behind the 3D character) */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h1
          ref={heroTextRef}
          className="text-8xl md:text-[10rem] lg:text-[13rem] font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500 leading-none select-none -translate-y-16"
          style={{ transformOrigin: "center center" }}
        >
          ARYAN SINGH
        </h1>
      </div>

      {/* 3D Global Canvas Layer (Fixed, in front of the background text) */}
      <div className="fixed inset-0 z-20 pointer-events-none w-full h-full">
        <ScrollScene
          modelPath="/models/Aryan.glb"
          animationsPath="/models/Animations.glb"
          className="w-full h-full"
        />
      </div>

      {/* HTML Overlay Layer (Scrollable, passes pointers through to 3D where empty) */}
      <div className="relative z-30 flex flex-col w-full pointer-events-none">

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

        {/* SPACER TO SHOW MORE FRAMES */}
        <div className="h-[20vh] w-full pointer-events-none" />

        {/* SECTION 2: ABOUT ME - Content Left */}
        <section className="scroll-section min-h-screen w-full flex pointer-events-auto">
          <div ref={section2Ref} className="w-full md:w-[60%] flex flex-col justify-center px-6 md:pl-24 py-20 opacity-0">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                About <br />
                <span className="text-cyan-400">Me</span>
              </h2>

              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                I am a passionate software engineer focused on building product-grade interfaces, immersive web experiences, and full-stack systems. I prioritize performance, motion, and visual storytelling in all my projects.
              </p>

              <div className="mt-8 p-4 bg-slate-900 rounded-lg border-l-4 border-cyan-500 font-mono text-sm md:text-base text-slate-400 max-w-md">
                <span className="text-purple-400">const</span> <span className="text-blue-400">role</span> = <span className="text-green-400">&quot;Creative Developer&quot;</span>;
              </div>
            </div>
          </div>
        </section>

        {/* SPACER TO SHOW MORE FRAMES */}
        <div className="w-full pointer-events-none" />

        {/* SECTION 3: TECH STACK - Content Right */}
        <section className="scroll-section h-[200vh] w-full relative pointer-events-auto">
          <div className="sticky top-0 h-screen w-full flex justify-end">
            <div ref={section3Ref} className="w-full md:w-[60%] flex flex-col justify-center px-6 md:pr-24 py-20 text-right md:text-left opacity-0 z-10">
              <div className="space-y-6 max-w-xl md:ml-auto">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                  Tech <br className="hidden md:block" />
                  <span className="text-cyan-400">Stack</span>
                </h2>

                <div className="grid grid-cols-2 gap-4 max-w-md ml-auto md:ml-0">
                  {['React', 'Next.js', 'Three.js', 'GSAP', 'Node.js', 'Tailwind'].map((tech) => (
                    <div key={tech} className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 hover:border-cyan-500/50 transition-colors text-center md:text-left">
                      <span className="font-mono text-slate-300">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FINAL OVERLAY (Fixed, fades in nicely over everything) */}
        <div ref={section4Ref} className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center pointer-events-none opacity-0">
          <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-5xl font-bold text-white tracking-tight">
              Ready to <span className="text-cyan-400">Collaborate?</span>
            </h3>
            <p className="text-xl text-slate-400">
              I'm currently available for freelance work and open to new opportunities. Let's build something amazing together.
            </p>
            <button className="px-10 py-4 bg-cyan-500 text-slate-950 font-bold rounded-full hover:bg-cyan-400 transition-colors text-lg inline-flex items-center gap-2">
              Get In Touch <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}