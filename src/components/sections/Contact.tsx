"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { contact, meta } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Contact — the closing noir block. Oversized serif headline (cream + crimson
 * gradient), a comic cream-block copy-to-clipboard CTA with hard crimson
 * shadow, panel-ink social tiles and a giant outlined "Contact" proof word.
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
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0b0b0f] py-32 sm:py-44"
    >
      {/* comic texture washes */}
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="bg-halftone-light absolute inset-0 opacity-[0.06]" aria-hidden />

      {/* crimson ambient bloom */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/[0.07] blur-[160px]" />

      {/* ghost proof word */}
      <p
        aria-hidden
        className="font-outline pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[17vw] font-extrabold italic leading-none opacity-[0.14]"
      >
        Contact
      </p>

      <div className="container-px relative mx-auto max-w-[1400px]">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-12% 0px" }}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            variants={word}
            className="eyebrow !w-auto justify-center !text-cream/60 before:!bg-cream/40"
          >
            <span className="inline-flex items-center gap-3">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-crimson text-crimson" />
              {contact.eyebrow} — {meta.availability}
            </span>
          </motion.p>

          <h2 className="mt-8 font-serif font-bold leading-[0.88] tracking-[-0.02em]">
            {contact.headline1.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  variants={word}
                  className="inline-block text-[clamp(3rem,10vw,11rem)] text-cream"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h2>
          <h2 className="font-serif font-bold leading-[0.88] tracking-[-0.02em]">
            {contact.headline2.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  variants={word}
                  className="text-gradient-crimson inline-block text-[clamp(3rem,10vw,11rem)]"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            variants={word}
            className="mt-10 max-w-xl text-base font-light leading-relaxed text-cream/60 sm:text-lg"
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
                className="group relative flex items-center gap-4 rounded-[3px] border-2 border-[#0e0e0e] bg-cream px-8 py-5 text-sm font-bold text-[#0e0e0e] shadow-[5px_5px_0_0_#c82323] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#c82323]"
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
                className="group flex items-center gap-3 rounded-[3px] border-2 border-cream/25 px-8 py-5 text-sm font-semibold text-cream transition-colors duration-300 hover:border-crimson hover:text-crimson"
                data-cursor="hover"
              >
                {copied === "phone" ? "✓ Copied!" : contact.phone}
                <span aria-hidden className="opacity-60 transition-opacity group-hover:opacity-100">
                  {copied === "phone" ? "" : "⧉"}
                </span>
              </button>
            </Magnetic>
          </motion.div>

          {/* social tiles — panel-ink cards */}
          <motion.div
            variants={word}
            className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {contact.socials.map((social, i) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative overflow-hidden rounded-[3px] border-2 border-cream/10 bg-cream/[0.03] p-6 text-left shadow-[5px_5px_0_0_rgba(200,35,35,0.16)] transition-all duration-400 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-crimson/50 hover:shadow-[7px_7px_0_0_rgba(200,35,35,0.28)]"
                data-cursor="hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold italic text-cream transition-colors duration-300 group-hover:text-crimson">
                    {social.label}
                  </span>
                  <span className="text-cream/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-crimson">
                    ↗
                  </span>
                </div>
                <p className="mt-3 truncate text-xs text-cream/45">{social.short}</p>
                <span
                  aria-hidden
                  className="absolute right-4 top-3 font-serif text-[10px] font-bold italic text-cream/25"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-crimson transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            ))}
          </motion.div>

          {/* marquee-ish big CTA line */}
          <motion.a
            variants={word}
            href={`mailto:${contact.email}`}
            className="mt-24 inline-flex items-center gap-4 text-xs uppercase tracking-mega text-cream/50 transition-colors hover:text-crimson"
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
