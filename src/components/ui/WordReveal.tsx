"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/cn";

type WordRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  once?: boolean;
};

/**
 * Kinetic masked-word headline reveal, driven by Framer Motion.
 * Each word slides up out of an overflow hidden mask with a soft skew settle.
 */
export default function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  once = true,
}: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("overflow-hidden", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
        >
          <motion.span
            className={cn("inline-block will-change-transform", wordClassName)}
            initial={{ y: "115%", skewY: 6 }}
            animate={inView ? { y: "0%", skewY: 0 } : { y: "115%", skewY: 6 }}
            transition={{
              duration: 1,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </p>
  );
}

export { WordReveal };
