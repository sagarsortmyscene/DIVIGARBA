import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { EVENT_CONFIG } from "../../data/event";

/**
 * Minimal, three-part, and part of the film.
 * The left slot is EMPTY on purpose — FlyingEmblem docks into it,
 * and `slotRef` is how that component finds where to land.
 */
export function SiteHeader({ slotRef }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, y: -14, duration: 1, delay: 0.6, ease: "power3.out" });
    },
    { scope: ref }
  );

  return (
    /* pointer-events-none on the bar, auto on the two things you can
       actually click. The header is a full-width strip as tall as the
       docked logo and has no background, so as a click target it was an
       invisible sheet across the top of every page — it is what was
       eating clicks meant for whatever sat underneath it. */
    <header
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 flex w-full items-center justify-between px-5 py-4 transition-colors duration-500 sm:px-9"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {/* the emblem lands here — FlyingEmblem docks it; this span just
          reserves its slot */}
      <a
        href="#top"
        className="pointer-events-auto flex items-center gap-3"
        aria-label={`${EVENT_CONFIG.brandLine}, home`}
      >
        <span ref={slotRef} className="emblem-slot block" aria-hidden />
      </a>

      {/* A real <button>, and #buy-btn is the selector the SortMyScene
          embed in index.html binds to (data-trigger="#buy-btn"). It
          attaches its own click handler, so this deliberately has none
          of ours — adding one would open the widget twice. */}
      <button
        type="button"
        id="buy-btn"
        data-cursor="cta"
        className="label pointer-events-auto cursor-pointer rounded-full border border-mukut bg-mukut px-5 py-2.5 text-obsidian transition-colors duration-500 hover:border-gold hover:bg-gold"
      >
        Book ticket
      </button>
    </header>
  );
}
