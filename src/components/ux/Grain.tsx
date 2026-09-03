/**
 * Static film-grain overlay. Purely decorative, rendered as a fixed layer
 * with an SVG turbulence texture + CSS noise animation.
 */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-[-100%] z-[200] noise-overlay opacity-[0.055]"
      style={{
        animation: "grain 8s steps(10) infinite",
      }}
    />
  );
}
