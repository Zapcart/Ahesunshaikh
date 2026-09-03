"use client";

import { footer, meta } from "@/lib/data";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-cream/10 bg-[#070709] pt-20"
    >
      {/* subtle ink halftone wash */}
      <div className="bg-halftone-light absolute inset-0 opacity-[0.03]" aria-hidden />

      <div className="container-px relative z-10">
        <div className="flex flex-col justify-between gap-10 pb-16 md:flex-row">
          <div>
            <p className="font-serif text-2xl font-bold italic tracking-tight text-cream">
              {footer.name}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream/50">
              {footer.tagline}
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(l.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="roll-link w-fit text-sm uppercase tracking-[0.2em] text-cream/55 hover:text-cream"
              >
                <span>{l.label}</span>
                <span aria-hidden className="text-crimson">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`mailto:${meta.email}`}
              className="text-cream/55 transition-colors hover:text-crimson"
            >
              {meta.email}
            </a>
            <a
              href="https://talkops.in"
              target="_blank"
              rel="noreferrer noopener"
              className="text-cream/55 transition-colors hover:text-crimson"
            >
              talkops.in ↗
            </a>
            <span className="text-cream/40">{meta.location}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-6 text-[11px] uppercase tracking-[0.2em] text-cream/40 sm:flex-row">
          <p>
            <span className="mr-2 inline-block h-1.5 w-1.5 rotate-45 bg-crimson" aria-hidden />
            {footer.rights.replace("2025", String(year))}
          </p>
          <button
            onClick={scrollTop}
            className="roll-link text-[11px] uppercase tracking-[0.2em] text-cream/55 hover:text-crimson"
          >
            <span>Back to top ↑</span>
            <span aria-hidden className="text-crimson">
              Back to top ↑
            </span>
          </button>
        </div>
      </div>

      {/* Giant ghost name — serif italic outline */}
      <div
        aria-hidden
        className="pointer-events-none relative select-none overflow-hidden"
      >
        <p className="font-outline translate-y-[24%] whitespace-nowrap text-center font-serif text-[19vw] font-extrabold italic leading-none tracking-[-0.02em] opacity-[0.2]">
          Ahesun
        </p>
      </div>
    </footer>
  );
}
