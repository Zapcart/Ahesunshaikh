"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { contact, meta } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Contact — oversized kinetic headline, magnetic copy-to-clipboard
 * buttons for email & phone plus direct social / live-project links.
 */
export default function Contact() {
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

  const copy = async (kind: "email" | "phone", value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API may be unavailable in insecure contexts — fall back
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2200);
  };

  const reveal = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const word = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration: 1, ease: EASE } },
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-ink-950 py-32 sm:py-44">
      {/* ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.05] blur-[160px]" />

      <div className="container-px relative mx-auto max-w-[1400px]">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-12% 0px" }}
          className="flex flex-col items-center text-center"
        >
          <motion.p variants={word} className="eyebrow !w-auto justify-center">
            <span className="inline-flex items-center gap-3">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-lime text-lime" />
              {contact.eyebrow} — {meta.availability}
            </span>
          </motion.p>

          <h2 className="mt-8 font-display font-bold leading-[0.88] tracking-tightest">
            {contact.headline1.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  variants={word}
                  className="inline-block text-[clamp(3rem,10vw,11rem)] text-mist"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h2>
          <h2 className="font-display font-bold leading-[0.88] tracking-tightest">
            {contact.headline2.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  variants={word}
                  className="inline-block text-[clamp(3rem,10vw,11rem)] text-gradient"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            variants={word}
            className="mt-10 max-w-xl text-base font-light leading-relaxed text-smoke sm:text-lg"
          >
            {contact.sub}
          </motion.p>

          {/* copy-to-clipboard buttons */}
          <motion.div
            variants={word}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Magnetic strength={0.3}>
              <button
                onClick={() => copy("email", contact.email)}
                className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-lime px-8 py-5 text-sm font-semibold text-ink-950 transition-colors duration-300 hover:bg-mist"
                data-cursor="hover"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {copied === "email" ? "✓ Copied!" : contact.email}
                  <span aria-hidden className="opacity-60 transition-opacity group-hover:opacity-100">
                    {copied === "email" ? "" : "⧉"}
                  </span>
                </span>
              </button>
            </Magnetic>

            <Magnetic strength={0.3}>
              <button
                onClick={() => copy("phone", contact.phone.replace(/\s/g, ""))}
                className="group flex items-center gap-3 rounded-full border border-white/20 px-8 py-5 text-sm font-medium text-mist transition-colors duration-300 hover:border-lime hover:text-lime"
                data-cursor="hover"
              >
                {copied === "phone" ? "✓ Copied!" : contact.phone}
                <span aria-hidden className="opacity-60 transition-opacity group-hover:opacity-100">
                  {copied === "phone" ? "" : "⧉"}
                </span>
              </button>
            </Magnetic>
          </motion.div>

          {/* social tiles */}
          <motion.div
            variants={word}
            className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 p-6 text-left transition-colors duration-400 hover:border-lime/40"
                data-cursor="hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-mist group-hover:text-lime">
                    {social.label}
                  </span>
                  <span className="text-smoke transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </div>
                <p className="mt-3 truncate text-xs text-smoke/80">{social.short}</p>
                <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-lime transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            ))}
          </motion.div>

          {/* marquee-ish big CTA line */}
          <motion.a
            variants={word}
            href={`mailto:${contact.email}`}
            className="mt-24 inline-flex items-center gap-4 text-xs uppercase tracking-mega text-smoke transition-colors hover:text-lime"
          >
            <span className="h-px w-8 bg-current" />
            Say hello — {contact.email}
            <span className="h-px w-8 bg-current" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
