"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { meta } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINKS = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Fixed navbar — transparent until scroll; contains magnetic
 * name mark and a burger that opens a full-screen kinetic menu.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    // give menu exit a beat before scrolling
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[500] transition-colors duration-500",
          scrolled && !open ? "bg-ink-950/70 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <nav className="container-px flex items-center justify-between py-5">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-baseline gap-2"
            aria-label="Back to top"
          >
            <span className="font-display text-lg font-bold tracking-tight text-mist">
              {meta.shortName}
            </span>
            <span className="text-smoke">/</span>
            <span className="font-sans text-[10px] uppercase tracking-mega text-lime">
              dev
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="roll-link text-xs uppercase tracking-[0.2em] text-smoke hover:text-mist"
              >
                <span>{l.label}</span>
                <span aria-hidden className="text-lime">
                  {l.label}
                </span>
              </button>
            ))}
            <span className="ml-2 flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-lime">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-lime" />
              Open to work
            </span>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="group relative z-[600] flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={cn(
                "h-px w-6 bg-mist transition-all duration-300",
                open && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-mist transition-all duration-300",
                open && "-translate-y-[3px] -rotate-45"
              )}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[550] flex flex-col justify-between bg-ink-900/95 px-6 pb-8 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="bg-grid absolute inset-0 opacity-40" />
            <nav className="relative flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="group flex items-baseline gap-4 text-left"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE }}
                >
                  <span className="font-sans text-xs text-smoke">
                    0{i + 1}
                  </span>
                  <span className="font-display text-5xl font-bold tracking-tight text-mist transition-colors group-hover:text-lime">
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </nav>

            <motion.div
              className="relative flex flex-col gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href={`mailto:${meta.email}`}
                className="text-sm text-smoke"
              >
                {meta.email}
              </a>
              <p className="text-xs uppercase tracking-mega text-smoke/60">
                {meta.location} · Open to work
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
