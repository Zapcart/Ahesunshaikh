"use client";

import { useRef } from "react";
import { marquee } from "@/lib/data";

/**
 * Infinite outlined-serif marquee strip between the noir canvas (hero)
 * and the cream colour-block (about). Translucent charcoal-ink band so the
 * background canvas halftone bleeds through; crimson diamond separators.
 * CSS transform loop; content duplicated for a seamless seam.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="marquee"
      aria-hidden
      className="relative overflow-hidden border-y-2 border-[#0b0b0d] bg-[#0e0e0e]/85 py-5"
    >
      <div
        ref={trackRef}
        className="marquee-track"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {marquee.map((item) => (
              <span key={`${dup}-${item}`} className="flex items-center">
                <span className="whitespace-nowrap px-6 font-serif text-3xl font-extrabold uppercase italic tracking-tight text-transparent font-outline sm:text-4xl">
                  {item}
                </span>
                <span className="h-2 w-2 rotate-45 bg-crimson" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
