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
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-950 pt-20">
      <div className="container-px relative z-10">
        <div className="flex flex-col justify-between gap-10 pb-16 md:flex-row">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight text-mist">
              {footer.name}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-smoke">
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
                className="roll-link w-fit text-sm uppercase tracking-[0.2em] text-smoke hover:text-mist"
              >
                <span>{l.label}</span>
                <span aria-hidden className="text-lime">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`mailto:${meta.email}`}
              className="text-mist/70 transition-colors hover:text-lime"
            >
              {meta.email}
            </a>
            <a
              href="https://talkops.in"
              target="_blank"
              rel="noreferrer noopener"
              className="text-mist/70 transition-colors hover:text-lime"
            >
              talkops.in ↗
            </a>
            <span className="text-smoke/70">{meta.location}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-[11px] uppercase tracking-[0.2em] text-smoke/70 sm:flex-row">
          <p>{footer.rights.replace("2025", String(year))}</p>
          <button
            onClick={scrollTop}
            className="roll-link text-[11px] uppercase tracking-[0.2em] text-smoke hover:text-lime"
          >
            <span>Back to top ↑</span>
            <span aria-hidden>Back to top ↑</span>
          </button>
        </div>
      </div>

      {/* Giant ghost name */}
      <div
        aria-hidden
        className="pointer-events-none relative select-none overflow-hidden"
      >
        <p className="translate-y-[24%] whitespace-nowrap text-center font-display text-[19vw] font-bold leading-none tracking-tightest text-white/[0.03]">
          Ahesun
        </p>
      </div>
    </footer>
  );
}
