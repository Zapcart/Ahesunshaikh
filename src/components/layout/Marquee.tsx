"use client";

import { useRef } from "react";
import { marquee } from "@/lib/data";

/**
 * Infinite outlined-tech marquee strip between hero and about.
 * CSS transform loop; content duplicated for a seamless seam.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section aria-hidden className="relative overflow-hidden border-y border-white/10 py-6">
      <div
        ref={trackRef}
        className="marquee-track"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {marquee.map((item) => (
              <span key={`${dup}-${item}`} className="flex items-center">
                <span className="whitespace-nowrap px-6 font-display text-3xl font-bold uppercase tracking-tight text-transparent sm:text-4xl font-outline">
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-lime/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
