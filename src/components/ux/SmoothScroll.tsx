"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth vertical scrolling via Lenis, synced to GSAP's ticker so
 * ScrollTrigger animations stay perfectly in lockstep with the scroll.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll-lock while the preloader is visible.
  useEffect(() => {
    const lock = () => lenisRef.current?.stop();
    const unlock = () => lenisRef.current?.start();
    window.addEventListener("preloader:start", lock);
    window.addEventListener("preloader:done", unlock);
    return () => {
      window.removeEventListener("preloader:start", lock);
      window.removeEventListener("preloader:done", unlock);
    };
  }, []);

  return <>{children}</>;
}
