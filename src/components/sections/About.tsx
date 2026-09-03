"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { summary, highlights, meta } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/**
 * About — cream paper colour-block. Editorial serif manifesto over
 * comic texture washes, with ink-frame stat cards carrying the crimson
 * headline accent. The fixed background canvas's crimson waves re-ink
 * behind this opaque "page" via the ThemeDirector.
 */
export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  const words = summary.body.split(" ");
  const leadWords = summary.lead.split(" ");

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-[#f4f1ea] py-28 text-[#121212] sm:py-36"
    >
      {/* comic texture washes */}
      <div className="bg-halftone absolute inset-0 opacity-25" aria-hidden />
      <div className="bg-grid-dark absolute inset-0 opacity-40" aria-hidden />
      {/* giant ghost outline */}
      <p
        aria-hidden
        className="font-outline-dark pointer-events-none absolute -bottom-8 right-0 select-none font-serif text-[15vw] font-extrabold italic leading-none opacity-[0.1]"
      >
        Dossier
      </p>

      <div className="container-px relative mx-auto max-w-[1600px]">
        <motion.p
          variants={item}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="eyebrow mb-7 !text-[#8a8172] before:!bg-[#8a8172]/50"
        >
          {summary.eyebrow}
        </motion.p>

        {/* lead headline */}
        <h2 className="max-w-6xl font-serif text-5xl font-bold leading-[1.04] tracking-[-0.01em] text-[#121212] sm:text-7xl lg:text-8xl">
          {leadWords.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "115%" }}
                animate={inView ? { y: "0%" } : { y: "115%" }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.04, ease: EASE }}
              >
                {w === "AI" ? <span className="italic text-crimson">{w}</span> : w}
              </motion.span>
              {i < leadWords.length - 1 ? "\u00A0" : null}
            </span>
          ))}
        </h2>

        {/* body paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
          className="mt-10 max-w-3xl text-base font-light leading-relaxed text-[#4a443a] sm:text-xl"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0.12 }}
              animate={inView ? { opacity: 1 } : { opacity: 0.12 }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.015 }}
            >
              {w}
              {i < words.length - 1 ? "\u00A0" : null}
            </motion.span>
          ))}
        </motion.p>

        {/* stats strip — ink frame panels */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              variants={item}
              className="panel-ink group rounded-[3px] p-8 transition-transform duration-300 hover:-translate-y-1.5"
            >
              <p className="flex items-center justify-between text-[11px] uppercase tracking-mega text-cream/50">
                {h.label}
                <span className="font-serif text-xs italic text-crimson">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </p>
              <p className="mt-5 font-serif text-5xl font-bold italic tracking-tight text-cream sm:text-6xl">
                {h.value}
              </p>
              <span aria-hidden className="mt-6 block h-1 w-10 bg-crimson" />
              <p className="mt-3 text-sm leading-relaxed text-cream/60">{h.caption}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-9 text-xs uppercase tracking-mega text-[#8a8172]"
        >
          <span aria-hidden className="mr-2 inline-block h-2 w-2 rotate-45 bg-crimson" />
          Based in {meta.location} · Currently open to {meta.openTo.join(" · ")}
        </motion.p>
      </div>
    </section>
  );
}
