import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENT_CONFIG } from "../../data/event";

/**
 * Minimal, three-part, and part of the film.
 * The left slot is EMPTY on purpose — FlyingEmblem docks into it,
 * and `slotRef` is how that component finds where to land.
 */
export function SiteHeader({ slotRef, wordSlotRef }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: "top -80",
        onUpdate: (s) => ref.current?.classList.toggle("is-stuck", s.scroll() > 80),
      });
      gsap.from(ref.current, { opacity: 0, y: -14, duration: 1, delay: 0.6, ease: "power3.out" });
    },
    { scope: ref }
  );

  return (
    <header
      ref={ref}
      className="fixed top-0 left-0 flex w-full items-center justify-between px-5 py-4 transition-colors duration-500 sm:px-9 [&.is-stuck]:bg-gradient-to-b [&.is-stuck]:from-obsidian/95 [&.is-stuck]:to-transparent [&.is-stuck]:backdrop-blur-sm"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {/* the emblem and wordmark land here — FlyingEmblem docks the ring,
          FlyingWordmark docks the text; this span just reserves its slot */}
      <a href="#top" className="flex items-center gap-3" aria-label={`${EVENT_CONFIG.brandLine}, home`}>
        <span ref={slotRef} className="emblem-slot block" aria-hidden />
        <span ref={wordSlotRef} className="label invisible whitespace-nowrap" aria-hidden>
          DIVI GARBA
        </span>
      </a>

      <a
        href="#book"
        data-cursor="cta"
        className="label rounded-full border border-antique/40 px-5 py-2.5 text-mukut transition-colors duration-500 hover:border-mukut hover:bg-mukut hover:text-obsidian"
      >
        Book ticket
      </a>
    </header>
  );
}
