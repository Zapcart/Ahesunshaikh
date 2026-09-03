"use client";

import { useEffect, useRef } from "react";

/**
 * Santioni Spirits "comic canvas" — a fixed full-viewport 2D canvas that
 * paints drifting organic ink-wave strokes and a reactive halftone dot grid.
 *
 * - Wave amplitude + phase react subtly to scroll velocity and pointer position
 *   (lerped in rAF, no per-event layout).
 * - Halftone dots bloom near the cursor.
 * - Ink colours follow <body data-theme="charcoal|cream|crimson|charcoal-deep">
 *   set by <ThemeStage />, so the drawing inverts on cream / crimson blocks.
 * - DPR capped at 2, render loop paused when the tab is hidden, single static
 *   frame under prefers-reduced-motion.
 */

type Theme = "charcoal" | "cream" | "crimson" | "charcoal-deep";

interface InkPalette {
  /** rgba triplets without alpha — [r,g,b] */
  line: [number, number, number];
  halftone: [number, number, number];
  /** line alpha multiplier per theme */
  lineAlpha: number;
  /** halftone alpha base */
  dotAlpha: number;
  /** primary dot radius */
  dotR: number;
}

const INKS: Record<Theme, InkPalette> = {
  charcoal: {
    line: [244, 241, 234],
    halftone: [200, 35, 35],
    lineAlpha: 0.22,
    dotAlpha: 0.28,
    dotR: 1.15,
  },
  "charcoal-deep": {
    line: [244, 241, 234],
    halftone: [200, 35, 35],
    lineAlpha: 0.16,
    dotAlpha: 0.2,
    dotR: 0.95,
  },
  cream: {
    line: [200, 35, 35],
    halftone: [18, 18, 18],
    lineAlpha: 0.14,
    dotAlpha: 0.2,
    dotR: 1,
  },
  crimson: {
    line: [244, 241, 234],
    halftone: [18, 18, 18],
    lineAlpha: 0.24,
    dotAlpha: 0.26,
    dotR: 1.2,
  },
};

const REDUCED = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, vy: 0 };
    const scroll = { vel: 0, target: 0 };
    let lastY = window.scrollY;
    let time = 0;
    let staticFrame = false;

    const reduceMotion = REDUCED();

    /** Current theme from <ThemeStage /> (falls back to charcoal). */
    const theme = (): Theme => {
      const t = document.body.dataset.theme as Theme | undefined;
      return t && INKS[t] ? t : "charcoal";
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };

    const onScroll = () => {
      const y = window.scrollY;
      scroll.target = Math.min(Math.abs(y - lastY), 120);
      lastY = y;
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        running = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    };

    const onThemeChange = () => {
      // data-theme flips on the body — cheap redraw trigger
      if (reduceMotion) {
        draw();
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("themechange", onThemeChange);

    const resetPointer = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.tx = -9999;
      pointer.ty = -9999;
      pointer.vy = 0;
    };
    const onLeave = () => resetPointer();
    document.addEventListener("pointerleave", onLeave);

    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

    /** Ink wave layer — a row of quadratic strokes that flow across the page. */
    const drawWaves = (pal: InkPalette, t: number, ampBoost: number) => {
      const lineCount = 5;
      const baseSpacing = h / (lineCount + 1.2);
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < lineCount; i++) {
        const baseY = baseSpacing * (i + 0.6) + Math.sin(t * 0.00018 + i * 2.1) * 18;
        const amp =
          (14 + i * 3.2 + Math.sin(t * 0.00012 + i) * 5) *
          (0.55 + ampBoost) *
          (1 + pal.lineAlpha * 0.4);
        const freq = 0.0045 + i * 0.0008;
        const speed = t * (0.000055 + i * 0.000012);

        ctx.strokeStyle = rgba(pal.line, pal.lineAlpha * (0.7 + (i % 2) * 0.5));

        ctx.beginPath();
        const step = Math.max(16, Math.floor(w / 90));
        for (let x = -step; x <= w + step; x += step) {
          // pointer bulge: localised lift around the cursor x
          const bulge =
            pointer.x > -900
              ? Math.exp(-((x - pointer.x) ** 2) / (w * 55)) * pointer.vy * 14
              : 0;
          const y =
            baseY +
            Math.sin(x * freq + speed + i) * amp +
            Math.sin(x * freq * 2.6 + speed * 1.7 + i * 3) * amp * 0.35 +
            bulge;
          if (x <= -step + 1) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    /** Halftone dot grid with a pointer bloom + slow breathing. */
    const drawHalftone = (pal: InkPalette, t: number) => {
      const cell = 34;
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * cell + ((r % 2) * cell) / 2;
          const cy = r * cell;
          // deterministic pseudo-noise from position
          const n = Math.sin(cx * 0.11 + r * 7.3) * Math.cos(cy * 0.05 + c * 3.1);
          const breathe =
            0.5 + 0.5 * Math.sin(t * 0.0004 + cx * 0.004 + cy * 0.003);

          let size = pal.dotR * (0.4 + 0.6 * n * breathe);
          let alpha = pal.dotAlpha * (0.35 + 0.65 * (0.5 + 0.5 * n));

          if (pointer.x > -900) {
            const dx = cx - pointer.x;
            const dy = cy - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const k = 1 - dist / 150;
              size += k * pal.dotR * 4.2;
              alpha = Math.min(1, alpha + k * 0.5);
            }
          }

          if (size > 0.18) {
            ctx.fillStyle = rgba(pal.halftone, Math.max(0, alpha));
            ctx.beginPath();
            ctx.arc(cx, cy, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    /** Horizontal banding cross-hatch — subtle comic "shade lines" edges. */
    const drawHatching = (pal: InkPalette, t: number) => {
      const bandH = Math.min(180, h * 0.16);
      const yTop = h * 0.5 + Math.sin(t * 0.00015) * bandH * 0.4;
      const alpha = 0.05 + 0.05 * Math.sin(t * 0.0006);
      ctx.strokeStyle = rgba(pal.halftone, alpha);
      ctx.lineWidth = 1;
      const gap = 9;
      for (let y = yTop; y < h; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y + 4);
        ctx.lineTo(w, y - 4);
        ctx.stroke();
      }
    };

    const draw = () => {
      const pal = INKS[theme()];
      // pointer spring
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      // pointer "speed" component used for the wave bulge
      pointer.vy = Math.max(0, 60 - Math.abs(pointer.y - pointer.ty));

      // decaying scroll velocity drives ripple boost
      scroll.vel += (scroll.target - scroll.vel) * 0.06;
      scroll.target *= 0.94;

      ctx.clearRect(0, 0, w, h);
      const ampBoost = Math.min(0.6, scroll.vel / 120);

      drawWaves(pal, time, ampBoost);
      drawHalftone(pal, time);
      drawHatching(pal, time);
    };

    const tick = () => {
      if (!running) return;
      time += 16.7;
      draw();
      raf = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      staticFrame = true;
      draw();
    } else {
      running = true;
      raf = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("themechange", onThemeChange);
      void staticFrame;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  );
}
