"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";
import ProjectVisual from "@/components/sections/projects/ProjectVisual";

gsap.registerPlugin(ScrollTrigger);

type ArchStep = NonNullable<(typeof projects.items)[number]["architecture"]>[number];

/**
 * Work — GSAP ScrollTrigger pinned flagship showcase.
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
          end: "+=" + amount * 130 + "%",
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

    return () => ctx.revert();
  }, [project]);

  if (!project) return null;

  const arch = project.architecture ?? [];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-ink-900"
    >
      {/* Giant ghost heading behind every chapter */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 z-0 -translate-x-1/2 select-none whitespace-nowrap text-center font-display text-[16vw] font-bold uppercase leading-none tracking-tightest text-white/[0.03]"
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
        <p className="flex items-center gap-4 text-[11px] uppercase tracking-mega text-smoke">
          <span
            className="inline-block h-px w-10"
            style={{ background: project.theme.base }}
          />
          Flagship Project · Live in production
        </p>

        <h3 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-tightest text-mist">
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span className="inline-block transition-transform duration-700 ease-out hover:-translate-y-1">
              TalkOps
              <span className="text-lime">.</span>
            </span>
          </span>
        </h3>

        <p className="mt-4 text-sm font-medium" style={{ color: project.theme.base }}>
          {project.category} — {project.year}
        </p>

        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-smoke">
          {project.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold text-ink-950 transition-colors duration-500"
            style={{ background: project.theme.base }}
          >
            <span>Visit talkops.in</span>
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs text-mist/70">
            {project.role}
          </span>
        </div>
      </div>

      {/* ---- visual column ---- */}
      <div
        ref={visualRef}
        className="work-pane__visual relative h-[34vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50 sm:h-[46vh] lg:h-[62vh] lg:flex-1"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* glare overlay bound to CSS vars */}
        <div
          className="work-card__glare z-30"
          style={{
            background: `radial-gradient(560px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.14), transparent 45%)`,
          }}
        />
        <div className="work-pane__visual-inner absolute inset-0 will-change-transform">
          <ProjectVisual project={project} />
        </div>
        {/* accent edge line */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 h-[3px] opacity-80"
          style={{ background: project.theme.base }}
        />
        {/* index watermark */}
        <span
          aria-hidden
          className="absolute right-5 top-4 z-20 font-display text-6xl font-bold text-white/10"
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
  const accent = "#c9f24a";

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* ghost step numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[34vh] font-bold leading-none text-white/[0.04]"
      >
        {step.step}
      </span>

      <div className="container-px relative z-10 mx-auto flex h-full w-full max-w-[1700px] flex-col justify-center gap-12 py-24 lg:flex-row lg:items-center lg:gap-20">
        {/* ---- copy ---- */}
        <div className="work-pane__arch-body relative z-20 w-full shrink-0 lg:w-[52%]">
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-mega text-smoke">
            <span className="inline-block h-px w-10" style={{ background: accent }} />
            System layer {step.step} of {String(steps.length).padStart(2, "0")}
          </p>

          <h3 className="mt-7 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-bold leading-[0.95] tracking-tight text-mist">
            {step.title.split(" ").map((word, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span
                  className="inline-block"
                  style={{ color: i === step.title.split(" ").length - 1 ? accent : "#fff" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h3>

          <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-smoke sm:text-lg">
            {step.desc}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {step.tech.map((t) => (
              <span key={t} className="chip !border-white/10">
                <span className="text-mist">{t}</span>
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
                  className="flex items-center gap-5 rounded-2xl border px-5 py-4 transition-all duration-500"
                  style={{
                    borderColor: active ? `${accent}55` : "rgba(255,255,255,0.06)",
                    background: active ? `${accent}0d` : "transparent",
                  }}
                >
                  <span
                    className="font-display text-sm font-bold"
                    style={{ color: active ? accent : "rgba(233,233,236,0.35)" }}
                  >
                    {s.step}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: active ? "#e9e9ec" : "rgba(233,233,236,0.45)" }}
                  >
                    {s.title}
                  </span>
                  {active && (
                    <span
                      className="ml-auto h-1.5 w-1.5 rounded-full"
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
