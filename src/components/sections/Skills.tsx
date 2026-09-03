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
 * Skills — categorized matrix with staggered card reveals and
 * micro-hover on every skill badge.
 */
export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden bg-ink-950 py-28 sm:py-36">
      {/* faint grid wash */}
      <div className="absolute inset-0 bg-grid opacity-40 mask-fade-y" />
      <div className="pointer-events-none absolute right-0 top-0 h-[40vh] w-[40vh] rounded-full bg-lime/[0.04] blur-[140px]" />

      <div className="container-px relative mx-auto max-w-[1500px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="eyebrow mb-6">{skills.eyebrow}</p>
            <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-mist sm:text-7xl">
              Skills
              <span className="text-lime"> Matrix</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-smoke">
            The Gen AI & full-stack toolkit I reach for — from LLM prompt
            engineering and voice agents to typed frontends, APIs, databases
            and deployment pipelines.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {skills.groups.map((group) => (
            <motion.div
              key={group.id}
              variants={item}
              className={`group rounded-2xl border p-7 transition-colors duration-500 ${
                skills.groups.length % 2 === 0 && group.id === "db-cloud"
                  ? "md:col-span-2 xl:col-span-1"
                  : ""
              }`}
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0b0b0f" }}
              data-hover-card
            >
              {/* group header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-bold"
                    style={{ background: `${group.accent}1a`, color: group.accent }}
                  >
                    {group.index}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-mist">
                      {group.label}
                    </h3>
                    <p className="text-[11px] uppercase tracking-mega text-smoke/60">
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
                    className="chip relative overflow-hidden !py-2 !pl-3 !pr-3 transition-all duration-300 hover:!border-lime/40"
                    style={{ cursor: "default" }}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span className="font-medium text-mist">{skill.name}</span>
                      <span className="text-[10px] text-smoke/80">{skill.tag}</span>
                    </span>
                    {/* level bar sweep */}
                    <span
                      className="absolute inset-x-0 bottom-0 z-0 h-[2px] origin-left scale-x-0 bg-lime transition-transform duration-500 ease-out group-hover:scale-x-100"
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
