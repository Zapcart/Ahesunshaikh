/**
 * Shared primitives and helpers for the portfolio.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
