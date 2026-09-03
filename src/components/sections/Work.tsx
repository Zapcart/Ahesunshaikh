"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";
import ProjectVisual from "@/components/sections/projects/ProjectVisual";

gsap.registerPlugin(ScrollTrigger);

type ArchStep = NonNullable<(typeof projects.items)[number]["architecture"]>[number];

/**
 * Work — GSAP ScrollTrigger pinned flagship showcase (noir act).
 * Sits on the charcoal canvas theme, so it uses a translucent ink band that
 * lets the fixed BackgroundCanvas breathe behind the pin. Chrome is comic:
 * cream paper CTA blocks, crimson hard shadows, serif-italic ghost numerals.
 * Act 1: TalkOps intro (title + live system visual).
 * Act 2: a stacked architecture deep-dive rises through the same pinned
 * viewport — AI Voice → MSG91 WhatsApp → Razorpay → SSR/SEO → Analytics.
 */
export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const project = projects.items[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !project) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panes = gsap.utils.toArray<HTMLElement>(".work-pane");

    if (reduced) {
      // No pin — fall back to a stacked, fully readable layout.
      gsap.set(section, { height: "auto", overflow: "visible" });
      panes.forEach((p) => gsap.set(p, { position: "relative", height: "auto", minHeight: "70vh" }));
      return;
    }

    const amount = Math.max(panes.length - 1, 1);
    if (amount <= 0) return;

    const ctx = gsap.context(() => {
      // Intro visual starts slightly zoomed for parallax exit.
      gsap.set(".work-pane__visual-inner", { scale: 1.16, yPercent: 4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Function-based pixel end (re-evaluated on every ScrollTrigger.refresh()
          // thanks to invalidateOnRefresh). Percentage ends are fragile: they are
          // baked at first measurement and go stale when the preloader lifts or
          // webfonts swap, which is what left the pin stuck on "System Layer 01".
          end: () =>
            "+=" +
            Math.round(amount * window.innerHeight * 1.3 + window.innerHeight * 0.6),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panes.forEach((pane, i) => {
        if (i >= panes.length - 1) return;

        // Slide the current pane up to reveal the next chapter.
        tl.to(pane, { yPercent: -100, duration: 1, ease: "power2.inOut" }, i);

        // Parallax + fade as the outgoing pane leaves.
        const visualInner = pane.querySelector<HTMLElement>(".work-pane__visual-inner");
        const info = pane.querySelector<HTMLElement>(".work-pane__info");
        if (visualInner) {
          tl.to(visualInner, { scale: 1, yPercent: -4, ease: "none", duration: 1 }, i);
        }
        if (info) {
          tl.to(info, { opacity: 0, y: -50, duration: 0.8, ease: "power2.in" }, i + 0.15);
        }
      });

      // Content of each architecture slide rises in the moment it lands.
      const archBodies = gsap.utils.toArray<HTMLElement>(".work-pane__arch-body");
      archBodies.forEach((body, i) => {
        tl.fromTo(
          body,
          { opacity: 0, y: 64 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          i + 1 + 0.12
        );
      });

      // Brief hold after the final layer before the pin releases.
      tl.to({}, { duration: 0.5 });
    }, section);

    // ---- Measurement refresh bundle -------------------------------------
    // ScrollTrigger measures positions once at creation, but the preloader
    // curtain, webfont swap (Bodoni/Inter/Space Grotesk are `display: swap`)
    // and post-paint layout all shift the document *after* that measurement.
    // Without a refresh the pinned WORK timeline holds a stale pin-spacer and
    // "sticks" on the first layer. Refresh once layout is stable, then again on
    // every late layout shift we can observe.
    const refresh = () => ScrollTrigger.refresh();

    const onWindowLoad = () => refresh();
    window.addEventListener("load", onWindowLoad);

    const onPreloaderDone = () => refresh();
    window.addEventListener("preloader:done", onPreloaderDone);

    let fontsCanceled = false;
    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(() => {
        if (!fontsCanceled) refresh();
      });
    }

    // Post-mount: wait two frames so first paint + pin-spacer are laid out,
    // plus a safety timeout for any late-arriving content.
    const rafId = requestAnimationFrame(() => requestAnimationFrame(refresh));
    const mountTimer = window.setTimeout(refresh, 350);

    return () => {
      ctx.revert();
      window.removeEventListener("load", onWindowLoad);
      window.removeEventListener("preloader:done", onPreloaderDone);
      fontsCanceled = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(mountTimer);
    };
  }, [project]);

  if (!project) return null;

  const arch = project.architecture ?? [];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#0e0e0e]/80"
    >
      {/* Giant ghost heading behind every chapter — serif-italic cream whisper */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-6 z-0 -translate-x-1/2 select-none whitespace-nowrap text-center font-serif text-[15vw] font-extrabold italic uppercase leading-none tracking-[-0.01em] text-cream/[0.04]"
      >
        Work
      </div>

      <div className="relative h-full">
        {/* ---- Act 1 · flagship intro ---- */}
        <div className="work-pane relative h-full w-full">
          <TalkOpsIntroSlide project={project} />
        </div>

        {/* ---- Act 2 · architecture deep dive ---- */}
        {arch.map((step) => (
          <div key={step.step} className="work-pane relative h-full w-full">
            <ArchitectureSlide step={step} steps={arch} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Act 1 — full-viewport flagship intro with tilt/glare system visual. */
function TalkOpsIntroSlide({ project }: { project: (typeof projects.items)[number] }) {
  const visualRef = useRef<HTMLDivElement>(null);

  // rAF-throttled tilt + glare: pointer coords are captured on move and applied
  // once per frame in a single lerped loop. No React state, no per-event layout.
  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let clientX = 0.5;
    let clientY = 0.5;
    let curX = 0.5;
    let curY = 0.5;
    let hovering = false;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const targetX = hovering && rect.width > 0 ? (clientX - rect.left) / rect.width : 0.5;
      const targetY = hovering && rect.height > 0 ? (clientY - rect.top) / rect.height : 0.5;
      curX += (targetX - curX) * 0.16;
      curY += (targetY - curY) * 0.16;

      el.style.setProperty("--mx", `${curX * 100}%`);
      el.style.setProperty("--my", `${curY * 100}%`);
      const rx = (0.5 - curY) * 8;
      const ry = (curX - 0.5) * 10;
      el.style.transform = `perspective(1200px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translateZ(0)`;

      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(apply);
      } else {
        curX = targetX;
        curY = targetY;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onPointerMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      hovering = true;
      schedule();
    };
    const onPointerLeave = () => {
      hovering = false;
      schedule();
    };

    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, []);

  return (
    <div className="container-px relative z-10 mx-auto flex h-full w-full max-w-[1700px] flex-col justify-end pb-10 pt-24 sm:flex-row sm:items-end sm:gap-10 sm:pb-14">
      {/* ---- info column ---- */}
      <div className="work-pane__info relative z-20 mb-8 w-full shrink-0 sm:mb-0 sm:w-[42%] lg:w-[38%]">
        <p className="flex items-center gap-4 text-[11px] uppercase tracking-mega text-cream/55">
          <span className="inline-block h-[2px] w-10 bg-crimson" />
          Flagship Project · Live in production
        </p>

        <h3 className="mt-6 font-serif text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.02em] text-cream">
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span className="inline-block transition-transform duration-700 ease-out hover:-translate-y-1">
              TalkOps
              <span className="text-crimson">.</span>
            </span>
          </span>
        </h3>

        <p className="mt-4 font-serif text-base font-semibold italic text-crimson">
          {project.category} — {project.year}
        </p>

        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/65">
          {project.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full border border-cream/20 bg-cream/[0.06] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-cream/75 transition-colors duration-300 hover:border-cream/45 hover:text-cream"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative inline-flex items-center gap-3 rounded-[3px] border-2 border-[#0e0e0e] bg-cream px-7 py-4 text-sm font-bold text-[#0e0e0e] shadow-[5px_5px_0_0_#c82323] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#c82323]"
          >
            <span>Visit talkops.in</span>
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-xs font-medium text-cream/60">
            {project.role}
          </span>
        </div>
      </div>

      {/* ---- visual column · comic ink panel with crimson hard shadow ---- */}
      <div
        ref={visualRef}
        className="work-pane__visual group relative h-[34vh] w-full overflow-hidden rounded-[3px] border-2 border-cream/15 bg-[#0a0a0e] shadow-[8px_8px_0_0_rgba(200,35,35,0.4)] sm:h-[46vh] lg:h-[62vh] lg:flex-1"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* glare overlay bound to CSS vars — cream sheen on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(560px circle at var(--mx,50%) var(--my,50%), rgba(244,241,234,0.12), transparent 45%)`,
          }}
        />
        <div className="work-pane__visual-inner absolute inset-0 will-change-transform">
          <ProjectVisual project={project} />
        </div>
        {/* accent edge line */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-crimson shadow-[0_0_18px_rgba(200,35,35,0.5)]" />
        {/* index watermark */}
        <span
          aria-hidden
          className="absolute right-5 top-4 z-20 font-serif text-6xl font-bold italic leading-none text-cream/[0.16]"
        >
          {project.index}
        </span>
      </div>
    </div>
  );
}

/** Act 2 — one architecture layer per pinned chapter. */
function ArchitectureSlide({
  step,
  steps,
}: {
  step: ArchStep;
  steps: ArchStep[];
}) {
  const accent = "#c82323";

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* ghost step numeral — serif-italic proof numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-serif text-[34vh] font-extrabold italic leading-none text-cream/[0.05]"
      >
        {step.step}
      </span>

      <div className="container-px relative z-10 mx-auto flex h-full w-full max-w-[1700px] flex-col justify-center gap-12 py-24 lg:flex-row lg:items-center lg:gap-20">
        {/* ---- copy ---- */}
        <div className="work-pane__arch-body relative z-20 w-full shrink-0 lg:w-[52%]">
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-mega text-cream/55">
            <span className="inline-block h-[2px] w-10 bg-crimson" />
            System layer {step.step} of {String(steps.length).padStart(2, "0")}
          </p>

          <h3 className="mt-7 font-serif text-[clamp(2.6rem,5.5vw,5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-cream">
            {step.title.split(" ").map((word, i, arr) => (
              <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span
                  className="inline-block"
                  style={{
                    color: i === arr.length - 1 ? accent : "#f4f1ea",
                    fontStyle: i === arr.length - 1 ? "italic" : "normal",
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h3>

          <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-cream/65 sm:text-lg">
            {step.desc}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {step.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-cream/20 bg-cream/[0.05] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-cream/75 transition-colors duration-300 hover:border-cream/45 hover:text-cream"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ---- layer index rail ---- */}
        <div className="hidden w-full shrink-0 lg:block lg:w-[26%]">
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => {
              const active = s.step === step.step;
              return (
                <div
                  key={s.step}
                  className="flex items-center gap-5 rounded-[3px] border-2 px-5 py-4 transition-all duration-500"
                  style={{
                    borderColor: active
                      ? "rgba(200,35,35,0.55)"
                      : "rgba(244,241,234,0.07)",
                    background: active
                      ? "rgba(200,35,35,0.09)"
                      : "rgba(244,241,234,0.02)",
                  }}
                >
                  <span
                    className="font-serif text-base font-bold italic"
                    style={{ color: active ? accent : "rgba(244,241,234,0.35)" }}
                  >
                    {s.step}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: active ? "#f4f1ea" : "rgba(244,241,234,0.45)" }}
                  >
                    {s.title}
                  </span>
                  {active && (
                    <span
                      className="ml-auto h-1.5 w-1.5 rotate-45"
                      style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
