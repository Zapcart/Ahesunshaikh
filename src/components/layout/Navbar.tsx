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
          scrolled && !open
            ? "border-b border-cream/10 bg-[#0d0d0f]/80 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <nav className="container-px flex items-center justify-between py-5">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-baseline gap-2"
            aria-label="Back to top"
          >
            <span className="font-serif text-xl font-bold italic tracking-tight text-cream">
              {meta.shortName}
            </span>
            <span className="text-cream/30">/</span>
            <span className="font-serif text-[11px] font-semibold uppercase italic tracking-mega text-crimson">
              dev
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="roll-link text-xs uppercase tracking-[0.2em] text-cream/70 hover:text-cream"
              >
                <span>{l.label}</span>
                <span aria-hidden className="text-crimson">
                  {l.label}
                </span>
              </button>
            ))}
            <span className="ml-2 flex items-center gap-2 rounded-full border-2 border-crimson/40 bg-crimson/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-cream backdrop-blur-sm">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-crimson text-crimson" />
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
                "h-px w-6 bg-cream transition-all duration-300",
                open && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-cream transition-all duration-300",
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
            className="fixed inset-0 z-[550] flex flex-col justify-between bg-[#0b0b0d]/95 px-6 pb-8 pt-28 backdrop-blur-2xl md:hidden"
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
                  <span className="font-sans text-xs text-cream/40">
                    0{i + 1}
                  </span>
                  <span className="font-serif text-5xl font-bold italic tracking-tight text-cream transition-colors group-hover:text-crimson">
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
                className="text-sm text-cream/80 transition-colors hover:text-crimson"
              >
                {meta.email}
              </a>
              <p className="text-xs uppercase tracking-mega text-cream/40">
                {meta.location} · Open to work
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
