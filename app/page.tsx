import React from "react";
import { ArrowRight, Download } from "lucide-react"; 

export default function PortfolioPage() {
  return (
    <main className="relative bg-slate-950 text-slate-100 selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- 3D CANVAS LAYER --- */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none border-2 border-dashed border-slate-800/50 opacity-50 flex items-center justify-center">
        <span className="text-slate-700 font-mono text-sm">[ 3D Model Canvas Viewport ]</span>
      </div>

      {/* --- SCROLLABLE CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col w-full">

        {/* SECTION 1: HERO */}
        <section className="h-screen w-full flex flex-col items-center justify-center relative px-6">
          
          {/* Update 1: Added negative translate-y to hoist the element upwards visually.
            Update 2: Increased font size to arbitrary values ([10rem], [13rem]) for massive impact.
            Added 'leading-none' to reduce line-height spacing on the huge text.
          */}
          <div className="text-center -translate-y-16 md:-translate-y-32">
            <h1 className="text-8xl md:text-[10rem] lg:text-[13rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 leading-none select-none">
              ARYAN SINGH
            </h1>
          </div>

          {/* Bottom Right Buttons - Kept anchored to bottom */}
          <div className="absolute bottom-12 right-6 md:right-12 flex flex-col md:flex-row gap-4">
            <button className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
              Resume <Download size={18} />
            </button>
            <button className="px-8 py-3 border border-slate-600 text-white font-medium rounded-full hover:bg-slate-800 hover:border-slate-500 transition-colors flex items-center gap-2">
              Contact <ArrowRight size={18} />
            </button>
          </div>
        </section>


        {/* SECTION 2: TECH STACK */}
        <section className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Content */}
          <div className="flex flex-col justify-center px-6 md:pl-24 py-20">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                Tech <br />
                <span className="text-cyan-400">Stack</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Web3'].map((tech) => (
                  <div key={tech} className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 hover:border-cyan-500/50 transition-colors">
                    <span className="font-mono text-slate-300">{tech}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-slate-900 rounded-lg border-l-4 border-cyan-500 font-mono text-sm md:text-base text-slate-400">
                <span className="text-purple-400">const</span> <span className="text-blue-400">role</span> = <span className="text-green-400">"Creative Developer"</span>;
              </div>
            </div>
          </div>

          {/* Right Column: Empty Void */}
          <div className="hidden md:block" aria-hidden="true"></div>
        </section>


        {/* SECTION 3: ABOUT */}
        <section className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Empty Void */}
          <div className="hidden md:block" aria-hidden="true"></div>

          {/* Right Column: Content */}
          <div className="flex flex-col justify-center px-6 md:pr-24 py-20 text-right md:text-left">
            <div className="space-y-6 max-w-xl md:ml-auto">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                About
              </h2>
              
              <p className="text-lg text-slate-400 leading-relaxed">
                I specialize in crafting immersive digital experiences. Currently focusing on the intersection of
                <strong className="text-white"> Web3</strong> and <strong className="text-white">Interactive 3D</strong> environments.
              </p>
              
              <p className="text-lg text-slate-400 leading-relaxed">
                My goal is to bridge the gap between robust backend logic and engaging frontend design.
              </p>

              <div className="pt-8">
                 <button className="text-cyan-400 font-medium hover:text-cyan-300 underline underline-offset-4 decoration-2">
                   Read full bio
                 </button>
              </div>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}