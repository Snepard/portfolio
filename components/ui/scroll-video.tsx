"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollVideo() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

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

        // Main scroll timeline
        const ctx = gsap.context(() => {
            gsap.to(airpods, {
                frame: frameCount - 1,
                snap: "frame", // Optional: snaps to integers so it doesn't try rendering fractional frames, though rounding handles it
                ease: "none",
                scrollTrigger: {
                    trigger: sections[0], // Start at Hero
                    start: "top top",
                    endTrigger: sections[2], // End at Tech Stack
                    end: "bottom bottom",
                    scrub: 1, // Smooth scrolling (tweak between 0.5 - 1.5 if needed)
                },
                onUpdate: render,
            });

            // Overlay Fade In when Section 2 (About Me) appears
            if (overlayRef.current && sections[1]) {
                gsap.to(overlayRef.current, {
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sections[1],
                        start: "top 80%",
                        end: "top 30%",
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
            <div ref={overlayRef} className="absolute inset-0 bg-slate-950/60 z-10 pointer-events-none opacity-0" />
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover relative z-0"
            />
        </div>
    );
}
