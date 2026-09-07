import { useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Emblem } from "../ui/Emblem";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";

/** Where the mark sits while the gate is still open: centred in the
 *  viewport, as an absolute transform from the 0,0 origin. */
function centreOf(el) {
  return {
    x: (window.innerWidth - el.offsetWidth) / 2,
    y: (window.innerHeight - el.offsetHeight) / 2,
  };
}

/**
 * The emblem lives in ONE fixed layer for the whole page. The gate
 * scales it up; this component then flies it into the header slot as
 * you scroll past.
 *
 * It measures the real header slot rather than using magic offsets,
 * so it lands correctly at any viewport and re-measures on resize.
 */
export function FlyingEmblem({ emblemRef, slotRef, gateSelector = "#gate" }) {
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  /* Anchored at the viewport's top-left, never at top/left 50%.
     A 50% base is measured against the viewport HEIGHT, and on a phone
     that height changes every time the URL bar collapses mid-scroll —
     so the docked mark slid up and down with it. From a 0,0 origin the
     base never moves, and both positions below are plain transforms. */
  useLayoutEffect(() => {
    gsap.set(wrapRef.current, { xPercent: 0, yPercent: 0, top: 0, left: 0 });
    gsap.set(wrapRef.current, centreOf(wrapRef.current));
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (reduced) {
        gsap.set(emblemRef.current, { scale: 1, opacity: 1 });
      }
    },
    { dependencies: [reduced, mobile] }
  );

  useGSAP(
    () => {
      if (reduced) return;

      /* Where the header slot is, measured live. These are ABSOLUTE
         positions from the 0,0 origin, not deltas from wherever the
         mark currently sits — a delta would be stale the moment the
         viewport height changed, and ignoreMobileResize (see
         LenisProvider) deliberately stops ScrollTrigger re-measuring
         when a URL bar opens or closes. The slot itself lives in a
         fixed header pinned to the top, so its coordinates hold no
         matter how far the page has scrolled. */
      const target = () => {
        const slot = slotRef.current?.getBoundingClientRect();
        const self = wrapRef.current;
        if (!slot || !self) return { x: 0, y: 0, scale: 0.16 };
        return {
          x: slot.left + slot.width / 2 - self.offsetWidth / 2,
          y: slot.top + slot.height / 2 - self.offsetHeight / 2,
          scale: slot.width / self.offsetWidth,
        };
      };

      // deferred a frame: TempleGate's pin (created in a sibling mounted
      // after this one, so its ref is populated in time) must exist
      // before this trigger is created — see the note in App.jsx
      const raf = requestAnimationFrame(
        contextSafe(() => {
          gsap.to(wrapRef.current, {
            ease: "none",
            scrollTrigger: {
              trigger: gateSelector,
              start: "bottom 92%",
              end: "bottom 22%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
            x: () => target().x,
            y: () => target().y,
            scale: () => target().scale,
          });
        })
      );
      return () => cancelAnimationFrame(raf);
    },
    { dependencies: [reduced, mobile] }
  );

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed h-[min(88vmin,676px)] w-[min(88vmin,676px)] origin-center"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {/* hidden at gate-open scale from first paint — no flash before GSAP attaches */}
      <Emblem ref={emblemRef} className="h-full w-full scale-[0.12] opacity-0" />
    </div>
  );
}
