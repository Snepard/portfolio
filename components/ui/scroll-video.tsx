"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollVideo() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const heroVideoRef = useRef<HTMLVideoElement>(null);
    const s2VideoRef = useRef<HTMLVideoElement>(null);
    const s3VideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context || !containerRef.current) return;

        // Wait until the main page scroll sections exist
        const sections = gsap.utils.toArray<HTMLElement>(".scroll-section");
        if (sections.length < 3) return;

        // 192 frames extracted from bg2.mp4
        const frameCount = 192;
        const currentFrame = (index: number) =>
            `/frames/frame_${(index + 1).toString().padStart(4, "0")}.jpg`;

        const images: HTMLImageElement[] = [];
        const airpods = { frame: 0 }; // Object purely for GSAP to animate

        // Preload images
        let loadedImages = 0;
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);

            img.onload = () => {
                loadedImages++;
                // Draw first frame once it's loaded
                if (i === 0) {
                    drawObjectFitCover(images[0], canvas, context);
                }
            };
        }

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-draw current frame on resize
            if (images[Math.round(airpods.frame)]?.complete) {
                drawObjectFitCover(images[Math.round(airpods.frame)], canvas, context);
            }
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Render loop helper
        const render = () => {
            const img = images[Math.round(airpods.frame)];
            if (img && img.complete) {
                drawObjectFitCover(img, canvas, context);
            }
        };

        const safePlay = (video: HTMLVideoElement | null) => {
            if (video) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Ignore the AbortError caused by GSAP quickly pausing during fast scrubbing
                    });
                }
            }
        };

        // Main scroll timeline
        const ctx = gsap.context(() => {
            // Hero Video Fade Out
            if (heroVideoRef.current && sections[0]) {
                gsap.to(heroVideoRef.current, {
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sections[0],
                        start: "top top",
                        end: "top -50%", // Fade out faster
                        scrub: true
                    }
                });
            }

            // Section 2 Background Video Timeline
            if (s2VideoRef.current && sections[1]) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sections[1],
                        start: "top 75%",
                        end: "bottom 50%", // Start fading out earlier, creating an overlap with frames
                        scrub: true,
                        onEnter: () => safePlay(s2VideoRef.current),
                        onEnterBack: () => safePlay(s2VideoRef.current),
                        onLeave: () => s2VideoRef.current?.pause(),
                        onLeaveBack: () => s2VideoRef.current?.pause(),
                    }
                });

                tl.fromTo(s2VideoRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power1.inOut" })
                    .to(s2VideoRef.current, { opacity: 1, duration: 6 })
                    .to(s2VideoRef.current, { opacity: 0, duration: 2, ease: "power1.inOut" });
            }

            // Section 3 Background Video Timeline
            if (s3VideoRef.current && sections[2]) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sections[2],
                        start: "top 75%", // Delay the appearance
                        end: "bottom top",
                        scrub: true,
                        onEnter: () => safePlay(s3VideoRef.current),
                        onEnterBack: () => safePlay(s3VideoRef.current),
                        onLeave: () => s3VideoRef.current?.pause(),
                        onLeaveBack: () => s3VideoRef.current?.pause(),
                    }
                });

                tl.fromTo(s3VideoRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power1.inOut" })
                    .to(s3VideoRef.current, { opacity: 1, duration: 6 })
                    .to(s3VideoRef.current, { opacity: 0, duration: 2, ease: "power1.inOut" });
            }

            // Frames Phase 1: Hero to Section 2 (ends at 112)
            gsap.to(airpods, {
                frame: 112,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: sections[0],
                    start: "top -50%", // Start later
                    endTrigger: sections[1],
                    end: "top 25%", // Continue moving while S2 video fades in over it
                    scrub: 1,
                },
                onUpdate: render,
            });

            // Frames Phase 2: After Section 2 to Section 3 (starts at 113 to end)
            gsap.fromTo(airpods,
                { frame: 113 },
                {
                    frame: frameCount - 1,
                    snap: "frame",
                    ease: "none",
                    scrollTrigger: {
                        trigger: sections[1],
                        start: "bottom 100%", // Start moving before S2 video fully disappears
                        endTrigger: sections[2],
                        end: "top 75%", // Ends exactly where S3 video stats fading in
                        scrub: 1.5,
                    },
                    onUpdate: render,
                    immediateRender: false,
                }
            );

            // Overlay Fade In when Section 2 (About Me) appears
            if (overlayRef.current && sections[1]) {
                gsap.to(overlayRef.current, {
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sections[1],
                        start: "top 100%",
                        end: "top 50%",
                        scrub: true,
                    },
                });
            }
        });

        return () => {
            ctx.revert();
            window.removeEventListener("resize", setCanvasSize);
        };
    }, []);

    // Helper function to draw image matching CSS object-fit: cover
    function drawObjectFitCover(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const parentWidth = canvas.width;
        const parentHeight = canvas.height;
        const childWidth = img.width;
        const childHeight = img.height;

        // Calculate ratios
        const parentRatio = parentWidth / parentHeight;
        const childRatio = childWidth / childHeight;

        let drawWidth, drawHeight;
        let offsetX = 0;
        let offsetY = 0;

        // Match width
        if (parentRatio > childRatio) {
            drawWidth = parentWidth;
            drawHeight = parentWidth / childRatio;
            offsetY = (parentHeight - drawHeight) / 2;
        }
        // Match height
        else {
            drawWidth = parentHeight * childRatio;
            drawHeight = parentHeight;
            offsetX = (parentWidth - drawWidth) / 2;
        }

        ctx.clearRect(0, 0, parentWidth, parentHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <div ref={overlayRef} className="absolute inset-0 bg-slate-950/60 z-30 pointer-events-none opacity-0" />

            <video
                ref={heroVideoRef}
                src="/herobg.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
            />

            <video
                ref={s2VideoRef}
                src="/s2bg.mp4"
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none opacity-0"
            />

            <video
                ref={s3VideoRef}
                src="/s3bg.mp4"
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none opacity-0"
            />

            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover relative z-10"
            />
        </div>
    );
}
