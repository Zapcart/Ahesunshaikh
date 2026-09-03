import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/hooks";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Magnetic wrapper — element is gently pulled toward the pointer and springs
 * back to rest on leave. A single shared rAF loop lerps both axes and writes
 * one combined translate3d, so x/y never fight over `transform` (no jitter).
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className,
  style,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    const apply = () => {
      raf = 0;
      curX += (targetX - curX) * 0.16;
      curY += (targetY - curY) * 0.16;
      el.style.transform = `translate3d(${curX.toFixed(3)}px, ${curY.toFixed(3)}px, 0)`;

      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        raf = requestAnimationFrame(apply);
      } else {
        curX = targetX;
        curY = targetY;
        el.style.transform = `translate3d(${targetX.toFixed(3)}px, ${targetY.toFixed(3)}px, 0)`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
      targetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
      schedule();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [strength, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "inline-block", willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
