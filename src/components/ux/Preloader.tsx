"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";
import { meta } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic curtain preloader: counts up, reveals name,
 * then splits open (clip-path) to hand over to the hero.
 * Emits window events used by SmoothScroll + Hero for choreography.
 */
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDone(true);
      setGone(true);
      window.dispatchEvent(new Event("preloader:done"));
      document.body.classList.remove("is-preloading");
      return;
    }

    document.body.classList.add("is-preloading");
    window.dispatchEvent(new Event("preloader:start"));

    const target = 100;
    let current = 0;
    const interval = window.setInterval(() => {
      current += Math.floor(Math.random() * 7) + 2;
      if (current >= target) {
        current = target;
        window.clearInterval(interval);
        setDone(true);
      }
      setCount(current);
    }, 60);

    return () => window.clearInterval(interval);
  }, [reduced]);

  useEffect(() => {
    if (!done) return;
    const t1 = window.setTimeout(() => setGone(true), 100);
    const t2 = window.setTimeout(() => {
      document.body.classList.remove("is-preloading");
      window.dispatchEvent(new Event("preloader:done"));
    }, 1400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE }}
          initial={false}
          aria-hidden
        >
          {/* subtle inner grid */}
          <div
            className="absolute inset-0 opacity-[0.25] bg-grid"
            style={{ maskImage: "radial-gradient(circle at 50% 50%, black, transparent 75%)" }}
          />

          <div className="relative flex min-h-[220px] w-full flex-col items-center justify-center px-6 py-8">
            <p
              className="font-sans text-[11px] uppercase tracking-mega text-smoke"
              style={{ opacity: done ? 0 : 1, transition: "opacity .4s ease" }}
            >
              Portfolio — {meta.shortName} Shaikh
            </p>

            <div className="relative mt-7 h-[2px] w-56 overflow-hidden bg-white/10 sm:w-72">
              <div
                className="absolute inset-y-0 left-0 bg-crimson"
                style={{ width: `${count}%`, transition: "width .3s var(--ease-out-expo)" }}
              />
            </div>

            <div
              className="mt-5 flex min-h-[120px] items-center justify-center px-2 py-4"
              style={{ opacity: done ? 0 : 1, transition: "opacity .5s ease .15s" }}
            >
              <span className="font-display text-6xl font-bold leading-[1.05] tracking-tight text-white sm:text-8xl">
                {count}
              </span>
              <span className="ml-1.5 self-end pb-3 font-display text-2xl font-bold leading-none text-cream sm:pb-5 sm:text-3xl">
                %
              </span>
            </div>
            <p className="mt-1 font-sans text-[10px] font-medium uppercase tracking-mega text-smoke">
              Loading experience · {count}%
            </p>
          </div>

          {/* Split curtains */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-crimson/[0.12]"
            initial={{ opacity: 1 }}
            animate={{ opacity: done ? 1 : 0.4 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
