"use client";

import { useEffect, useRef } from "react";

/**
 * Santioni Spirits "ThemeDirector".
 *
 * The page is composed of solid editorial colour-blocks (charcoal → cream →
 * charcoal → crimson → cream → charcoal-deep). This component watches which
 * block dominates the viewport and flips <body data-theme> so that:
 *   - <BackgroundCanvas /> re-inks its wave/halftone layer for the block
 *   - cursor / accent chrome can recolor via CSS attribute hooks
 *
 * Implemented with a single IntersectionObserver (no layout reads per frame)
 * and dispatches a "themechange" CustomEvent so canvases can repaint.
 */

type Theme = "charcoal" | "cream" | "crimson" | "charcoal-deep";

interface Block {
  id: string;
  theme: Theme;
}

const BLOCKS: Block[] = [
  { id: "hero", theme: "charcoal" },
  { id: "marquee", theme: "charcoal" },
  { id: "about", theme: "cream" },
  { id: "work", theme: "charcoal" },
  { id: "skills", theme: "crimson" },
  { id: "journey", theme: "cream" },
  { id: "contact", theme: "charcoal-deep" },
  { id: "footer", theme: "charcoal-deep" },
];

const START_THEME: Theme = "charcoal";

export default function ThemeStage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;

    let current: Theme = START_THEME;
    document.body.dataset.theme = current;

    const apply = (theme: Theme) => {
      if (theme === current) return;
      current = theme;
      document.body.dataset.theme = theme;
      document.dispatchEvent(new Event("themechange"));
    };

    // sections render with the same hydration commit as this component
    const els: { el: Element; theme: Theme }[] = [];
    BLOCKS.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) els.push({ el, theme: b.theme });
    });
    if (els.length === 0) return;

    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target, entry.intersectionRatio);
          } else {
            visible.delete(entry.target);
          }
        });

        // the block with the largest visible share wins the palette
        let best: Element | null = null;
        let bestRatio = 0;
        visible.forEach((ratio, el) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = el;
          }
        });
        if (best) {
          const hit = els.find((e) => e.el === best);
          if (hit) apply(hit.theme);
        }
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75, 0.95] }
    );

    els.forEach(({ el }) => io.observe(el));
    apply(START_THEME);

    return () => {
      io.disconnect();
    };
  }, []);

  // invisible mount — purely drives body data-theme
  return <div ref={ref} aria-hidden className="hidden" />;
}
