"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { journey } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Journey — cream paper colour-block. Editorial serif timeline with an
 * animated crimson progress rail, ink node markers and dark period chips
 * that keep every accent legible on the paper page.
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
    <section
      id="journey"
      ref={ref}
      className="section-transition relative overflow-hidden bg-[#f4f1ea] py-28 text-[#121212] sm:py-36"
    >
      {/* comic texture washes */}
      <div className="bg-halftone absolute inset-0 opacity-20" aria-hidden />
      <div className="bg-grid-dark absolute inset-0 opacity-30" aria-hidden />
      <p
        aria-hidden
        className="font-outline-dark pointer-events-none absolute -bottom-8 left-0 select-none font-serif text-[15vw] font-extrabold italic leading-none opacity-[0.08]"
      >
        Timeline
      </p>

      <div className="container-px relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="eyebrow mb-6 !text-[#8a8172] before:!bg-[#8a8172]/50">
            {journey.eyebrow}
          </p>
          <h2 className="font-serif text-5xl font-bold leading-[0.95] tracking-[-0.01em] text-[#121212] sm:text-7xl">
            Journey
            <span className="ml-3 font-serif text-4xl italic text-crimson sm:text-6xl">
              →
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#4a443a]">
            Shipping Gen AI voice & full-stack SaaS since 2025 — while sharpening
            the fundamentals through formal CS education.
          </p>
        </motion.div>

        {/* ---- timeline ---- */}
        <div ref={railRef} className="relative mt-16 space-y-16 sm:space-y-24">
          {/* static rail */}
          <div className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-[#141414]/15 sm:left-1/2" />
          {/* progress filler */}
          <motion.div
            className="absolute bottom-2 left-[7px] top-2 w-[2px] origin-top bg-gradient-to-b from-crimson via-crimson/70 to-crimson/20 sm:left-1/2"
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
                  leftSide ? "sm:pr-14 sm:text-right" : "sm:ml-auto sm:pl-14"
                }`}
              >
                {/* node — ink dot on paper, crimson pulse for current */}
                <span
                  className={`absolute left-0 top-2 h-[17px] w-[17px] rounded-full border-[3px] border-[#0e0e0e] bg-[#0e0e0e] sm:left-auto ${
                    leftSide ? "sm:-right-[8.5px]" : "sm:-left-[8.5px]"
                  }`}
                >
                  {item.current && (
                    <span className="pulse-dot absolute inset-0 rounded-full bg-crimson text-crimson" />
                  )}
                </span>

                {/* period — dark ink chip with accent dash */}
                <span
                  className="inline-flex w-fit items-center rounded-full border-2 border-[#0e0e0e] bg-[#17171b] px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream"
                  style={{ marginInline: leftSide ? "0 0 0 auto" : "0" }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: item.accent }}
                      aria-hidden
                    />
                    {item.period}
                  </span>
                </span>

                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[#141414] sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-crimson">
                    {item.org} — {item.location}
                  </p>
                </div>

                <ul
                  className={`space-y-2.5 text-sm leading-relaxed text-[#4a443a] ${
                    leftSide ? "sm:ml-auto" : ""
                  }`}
                  style={{ maxWidth: leftSide ? undefined : "none" }}
                >
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span
                        className="mt-[9px] inline-block h-[3px] w-3 shrink-0 rounded-full bg-crimson"
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
