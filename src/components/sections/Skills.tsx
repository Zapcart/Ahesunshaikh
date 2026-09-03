"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/**
 * Skills — crimson power colour-block. Cream "paper" cards carry hard
 * ink frames and coloured comic index chips; the headline lockup mixes
 * serif cream type with a rotated paper sticker.
 */
export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="skills"
      ref={ref}
      className="section-transition relative overflow-hidden bg-crimson py-28 text-cream sm:py-36"
    >
      {/* cream halftone wash */}
      <div className="bg-halftone-light absolute inset-0 opacity-20" aria-hidden />
      <div className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-[#0e0e0e]/20 blur-[110px]" />

      <div className="container-px relative mx-auto max-w-[1500px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="eyebrow mb-6 !text-cream before:!bg-cream/60">
              {skills.eyebrow}
            </p>
            <h2 className="font-serif text-5xl font-bold leading-[0.95] tracking-[-0.01em] text-cream sm:text-7xl">
              Skills
              <span className="ml-5 inline-block -rotate-2 rounded-[3px] border-2 border-[#0e0e0e] bg-cream px-5 py-1 align-middle font-serif text-3xl italic text-crimson shadow-[5px_5px_0_0_rgba(14,14,14,0.9)] sm:text-5xl">
                Matrix
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream/80">
            The Gen AI & full-stack toolkit I reach for — from LLM prompt
            engineering and voice agents to typed frontends, APIs, databases
            and deployment pipelines.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3"
        >
          {skills.groups.map((group) => (
            <motion.div
              key={group.id}
              variants={item}
              className={`panel-paper group rounded-[3px] p-7 transition-transform duration-300 hover:-translate-y-1.5 ${
                skills.groups.length % 2 === 0 && group.id === "db-cloud"
                  ? "md:col-span-2 xl:col-span-1"
                  : ""
              }`}
              data-hover-card
            >
              {/* group header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-[3px] border-2 border-[#0e0e0e] font-display text-base font-bold text-[#0e0e0e]"
                    style={{ background: group.accent }}
                  >
                    {group.index}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-[#141414]">
                      {group.label}
                    </h3>
                    <p className="text-[11px] uppercase tracking-mega text-[#8a8172]">
                      {group.items.length} technologies
                    </p>
                  </div>
                </div>
              </div>

              {/* skill badges */}
              <div className="mt-7 flex flex-wrap gap-2.5">
                {group.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="relative overflow-hidden rounded-full border-2 border-[#141414]/20 px-3.5 py-1.5 text-[11px] transition-colors duration-300 hover:border-crimson"
                    style={{ cursor: "default" }}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span className="font-medium text-[#262626]">{skill.name}</span>
                      <span className="text-[10px] text-[#8a8172]">{skill.tag}</span>
                    </span>
                    {/* level bar sweep */}
                    <span
                      className="absolute inset-x-0 bottom-0 z-0 h-[3px] origin-left scale-x-0 bg-crimson transition-transform duration-500 ease-out group-hover:scale-x-100"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
