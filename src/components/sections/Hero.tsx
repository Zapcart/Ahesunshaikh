"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { meta } from "@/lib/data";
import Magnetic from "@/components/ui/Magnetic";
import WordReveal from "@/components/ui/WordReveal";

const AuroraField = dynamic(() => import("@/components/three/AuroraField"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

/**
 * Hero — "noir canvas" opener. Transparent charcoal stage so the fixed
 * BackgroundCanvas ink waves / halftone read through, with a soft WebGL
 * cream dust field, editorial Bodoni serif display type and comic-block CTAs.
 * Choreography begins once the preloader curtain lifts.
 */
export default function Hero() {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onDone = () => setReady(true);
    window.addEventListener("preloader:done", onDone);
    // Safety fallback if the event fired before hydration listeners
    const t = window.setTimeout(() => setReady(true), 3200);
    return () => {
      window.removeEventListener("preloader:done", onDone);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-32"
    >
      {/* soft cream dust field (background canvas waves sit behind at z-1) */}
      <div className="absolute inset-0 opacity-70">
        <AuroraField />
      </div>

      {/* legibility gradients over the ink canvas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(12,12,12,0.55)_100%)]" />

      <div className="container-px relative z-10 mx-auto w-full max-w-[1600px]">
        {/* availability row */}
        <AnimatePresence>
          {ready && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-crimson text-crimson" />
                {meta.availability}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/10 bg-cream/[0.03] px-4 py-1.5 text-[11px] font-medium tracking-[0.14em] text-cream/60 backdrop-blur">
                {meta.location}
              </span>
              <span className="hidden items-center gap-2 rounded-full border border-cream/10 bg-cream/[0.03] px-4 py-1.5 text-[11px] font-medium tracking-[0.14em] text-cream/60 backdrop-blur sm:inline-flex">
                Open to {meta.openTo.join(" · ")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* kinetic editorial headline */}
        <h1 className="font-serif font-bold leading-[0.92] tracking-[-0.02em]">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-[clamp(3rem,10vw,10rem)] text-cream"
              initial={{ y: "115%", skewY: 5 }}
              animate={ready ? { y: "0%", skewY: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
            >
              {meta.firstName}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-[clamp(3rem,10vw,10rem)] italic text-transparent"
              style={{ WebkitTextStroke: "1px rgba(244,241,234,0.4)" }}
              initial={{ y: "115%", skewY: 5 }}
              animate={ready ? { y: "0%", skewY: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: 0.22 }}
            >
              {meta.middleName}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block text-[clamp(3rem,10vw,10rem)] text-cream"
              initial={{ y: "115%", skewY: 5 }}
              animate={ready ? { y: "0%", skewY: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: 0.34 }}
            >
              Shaikh
              <motion.span
                className="ml-3 inline-block text-crimson"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                _
              </motion.span>
            </motion.span>
          </span>
        </h1>

        {/* subtitle + CTAs */}
        <AnimatePresence>
          {ready && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.09, delayChildren: 0.55 } },
              }}
              className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            >
              <motion.div variants={fadeUp} className="max-w-xl">
                <WordReveal
                  text={`${meta.role} — ${meta.roleLine2}`}
                  className="text-lg font-light leading-snug text-cream/80 sm:text-xl"
                  delay={0}
                />
                <p className="mt-4 text-sm leading-relaxed text-cream/50">
                  From AI voice agents and LLM workflows to payments, WhatsApp
                  automation and SSR/SEO — I design, ship and scale production
                  software end-to-end.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5">
                <Magnetic>
                  <a
                    href="#work"
                    data-cursor="hover"
                    className="group relative inline-flex items-center gap-3 rounded-[3px] border-2 border-[#0e0e0e] bg-cream px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-[#0e0e0e] shadow-[5px_5px_0_0_#c82323] transition-all duration-300 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_0_#c82323]"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("work")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                      Explore my work
                    </span>
                    <span aria-hidden>↓</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#contact"
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 rounded-[3px] border-2 border-cream/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:border-crimson hover:text-crimson"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Contact
                  </a>
                </Magnetic>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* scroll cue */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="absolute bottom-6 right-6 hidden flex-col items-center gap-2 sm:flex"
          >
            <span className="text-[10px] uppercase tracking-mega text-cream/50 [writing-mode:vertical-rl]">
              Scroll
            </span>
            <motion.span
              className="h-8 w-px bg-gradient-to-b from-crimson to-transparent"
              animate={{ scaleY: [0.2, 1, 0.2], transformOrigin: "top" }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
