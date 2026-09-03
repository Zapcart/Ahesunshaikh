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
 * Hero — WebGL particle field behind kinetic staggered typography,
 * glowing availability badge, quick CTA cluster and scroll cue.
 * Hero choreography begins once the preloader curtain lifts.
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
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950 pb-14 pt-32"
    >
      {/* WebGL aurora */}
      <div className="absolute inset-0 bg-grid opacity-60 mask-fade-y" />
      <div className="absolute inset-0">
        <AuroraField />
      </div>
      {/* legibility gradients */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,9,0.7)_100%)]" />

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
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-lime backdrop-blur">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-lime" />
                {meta.availability}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium tracking-[0.14em] text-mist/70 backdrop-blur">
                {meta.location}
              </span>
              <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium tracking-[0.14em] text-mist/70 backdrop-blur sm:inline-flex">
                Open to {meta.openTo.join(" · ")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* kinetic headline */}
        <h1 className="font-display font-bold leading-[0.9] tracking-tightest">
          <span className="block overflow-hidden">
            <motion.span
              className="block text-[clamp(2.8rem,10.5vw,10.5rem)] text-mist"
              initial={{ y: "115%", skewY: 5 }}
              animate={ready ? { y: "0%", skewY: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
            >
              {meta.firstName}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-[clamp(2.8rem,10.5vw,10.5rem)] text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(233,233,236,0.55)" }}
              initial={{ y: "115%", skewY: 5 }}
              animate={ready ? { y: "0%", skewY: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: 0.22 }}
            >
              {meta.middleName}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-[clamp(2.8rem,10.5vw,10.5rem)] text-mist"
              initial={{ y: "115%", skewY: 5 }}
              animate={ready ? { y: "0%", skewY: 0 } : {}}
              transition={{ duration: 1.2, ease: EASE, delay: 0.34 }}
            >
              Shaikh
              <motion.span
                className="ml-3 inline-block text-lime"
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
                  className="text-lg font-light leading-snug text-smoke sm:text-xl"
                  delay={0}
                />
                <p className="mt-4 text-sm leading-relaxed text-smoke/60">
                  From AI voice agents and LLM workflows to payments, WhatsApp
                  automation and SSR/SEO — I design, ship and scale production
                  software end-to-end.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <a
                    href="#work"
                    data-cursor="hover"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-lime px-7 py-4 text-sm font-semibold text-ink-950"
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
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-medium text-mist transition-colors duration-300 hover:border-lime hover:text-lime"
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
            <span className="text-[10px] uppercase tracking-mega text-smoke/60 [writing-mode:vertical-rl]">
              Scroll
            </span>
            <motion.span
              className="h-8 w-px bg-gradient-to-b from-lime to-transparent"
              animate={{ scaleY: [0.2, 1, 0.2], transformOrigin: "top" }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
