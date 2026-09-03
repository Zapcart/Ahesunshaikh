"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { journey } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Journey — minimalist vertical timeline with an animated scroll
 * progress filler rail and type-coloured nodes for experience/education.
 */
export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 65%"],
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <section id="journey" ref={ref} className="relative overflow-hidden bg-ink-900 py-28 sm:py-36">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-coral/[0.05] blur-[130px]" />

      <div className="container-px relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="eyebrow mb-6">{journey.eyebrow}</p>
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-mist sm:text-7xl">
            Journey
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-smoke">
            Shipping Gen AI voice & full-stack SaaS since 2025 — while sharpening
            the fundamentals through formal CS education.
          </p>
        </motion.div>

        {/* ---- timeline ---- */}
        <div ref={railRef} className="relative mt-16 space-y-16 sm:space-y-24">
          {/* static rail */}
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10 sm:left-1/2" />
          {/* progress filler */}
          <motion.div
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-lime via-lime/70 to-lime/20 sm:left-1/2"
            style={{ scaleY }}
          />

          {journey.items.map((item, i) => {
            const leftSide = i % 2 === 0;
            return (
              <motion.article
                key={`${item.type}-${item.title}`}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-18% 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className={`relative flex flex-col gap-4 pl-10 sm:w-1/2 sm:pl-0 ${
                  leftSide
                    ? "sm:pr-14 sm:text-right"
                    : "sm:ml-auto sm:pl-14"
                }`}
              >
                {/* node */}
                <span
                  className={`absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 sm:left-auto ${
                    leftSide ? "sm:-right-[7.5px]" : "sm:-left-[7.5px]"
                  }`}
                  style={{
                    background: "#0b0b0f",
                    borderColor: item.accent,
                    boxShadow: `0 0 0 5px ${item.accent}18`,
                  }}
                >
                  {item.current && (
                    <span
                      className="pulse-dot absolute inset-0 rounded-full"
                      style={{ background: item.accent, color: item.accent }}
                    />
                  )}
                </span>

                <span
                  className="inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    color: item.accent,
                    borderColor: `${item.accent}40`,
                    background: `${item.accent}12`,
                    marginInline: leftSide ? "0 0 0 auto" : "0",
                    marginLeft: leftSide ? undefined : "0",
                  }}
                >
                  <span
                    className={`flex items-center gap-2 ${leftSide ? "sm:flex-row-reverse" : ""}`}
                    style={{ width: "100%", justifyContent: leftSide ? "flex-end" : "flex-start" }}
                  >
                    {item.period}
                  </span>
                </span>

                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-mist sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium" style={{ color: item.accent }}>
                    {item.org} — {item.location}
                  </p>
                </div>

                <ul
                  className={`space-y-2.5 text-sm leading-relaxed text-smoke ${
                    leftSide ? "sm:ml-auto" : ""
                  }`}
                  style={{ maxWidth: leftSide ? undefined : "none" }}
                >
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span
                        className="mt-[9px] inline-block h-1 w-3 shrink-0 rounded-full"
                        style={{ background: item.accent }}
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
