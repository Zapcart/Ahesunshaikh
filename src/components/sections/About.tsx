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
 * About / manifesto — masked line reveal of the summary plus a
 * derived stats strip from live production achievements.
 */
export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  const words = summary.body.split(" ");
  const leadWords = summary.lead.split(" ");

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-ink-900 py-28 sm:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-lime/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-coral/[0.05] blur-[120px]" />

      <div className="container-px relative mx-auto max-w-[1600px]">
        <motion.p
          variants={item}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="eyebrow mb-14"
        >
          {summary.eyebrow}
        </motion.p>

        {/* lead headline */}
        <h2 className="max-w-5xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-mist sm:text-6xl lg:text-7xl">
          {leadWords.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "115%" }}
                animate={inView ? { y: "0%" } : { y: "115%" }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.04, ease: EASE }}
              >
                {w === "AI" ? <span className="text-lime">{w}</span> : w}
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
          className="mt-10 max-w-3xl text-base font-light leading-relaxed text-smoke sm:text-xl"
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

        {/* stats strip */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
        >
          {highlights.map((h) => (
            <motion.div
              key={h.label}
              variants={item}
              className="group relative bg-ink-900 p-8 transition-colors duration-500 hover:bg-ink-800"
            >
              <p className="text-[11px] uppercase tracking-mega text-smoke">
                {h.label}
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight text-lime transition-transform duration-500 group-hover:-translate-y-1 sm:text-6xl">
                {h.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-smoke/70">{h.caption}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 text-xs uppercase tracking-mega text-smoke/50"
        >
          Based in {meta.location} · Currently open to {meta.openTo.join(" · ")}
        </motion.p>
      </div>
    </section>
  );
}
