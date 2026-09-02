import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { EVENT_CONFIG } from "../../data/event";

/**
 * Minimal, three-part, and part of the film.
 * The left slot is EMPTY on purpose — FlyingEmblem docks into it,
 * and `slotRef` is how that component finds where to land.
 */
export function SiteHeader({ slotRef, ctaVisible }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, y: -14, duration: 1, delay: 0.6, ease: "power3.out" });
    },
    { scope: ref }
  );

  return (
    <header
      ref={ref}
      className="fixed top-0 left-0 flex w-full items-center justify-between px-5 py-4 transition-colors duration-500 sm:px-9"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {/* the emblem lands here — FlyingEmblem docks it; this span just
          reserves its slot */}
      <a href="#top" className="flex items-center gap-3" aria-label={`${EVENT_CONFIG.brandLine}, home`}>
        <span ref={slotRef} className="emblem-slot block" aria-hidden />
      </a>

      <a
        href="#book"
        data-cursor={ctaVisible ? "cta" : undefined}
        aria-hidden={!ctaVisible}
        tabIndex={ctaVisible ? undefined : -1}
        className={`label rounded-full border border-antique/40 bg-obsidian/45 px-5 py-2.5 text-mukut transition-[opacity,transform,color,background-color,border-color] duration-500 hover:border-mukut hover:bg-mukut hover:text-obsidian ${
          ctaVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        Book ticket
      </a>
    </header>
  );
}
