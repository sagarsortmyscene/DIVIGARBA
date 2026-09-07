/** Film grain over the whole page. One instance, mounted in App.
 *
 *  The noise itself is an inline SVG data-URI, so it stays in the style
 *  object — there is no class for it. Position, layer and blend mode
 *  are ordinary utilities. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-[0.26] mix-blend-overlay"
      style={{ zIndex: "var(--z-foreground)", backgroundImage: NOISE }}
    />
  );
}
