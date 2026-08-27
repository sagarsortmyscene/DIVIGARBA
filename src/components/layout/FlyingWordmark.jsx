import { useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * The "DEVI GARBA" wordmark — the text counterpart to FlyingEmblem's
 * ring, and reciprocal to it: TempleGate scales `wordRef` up from the
 * center in lockstep with the ring as the doors open. Once open, this
 * component takes over and flies it into the header's word slot as
 * you scroll past, landing at readable size.
 */
export function FlyingWordmark({ wordRef, slotRef, gateSelector = "#gate" }) {
  const wrapRef = wordRef;
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    gsap.set(wrapRef.current, { xPercent: -50, top: "63%", left: "50%" });
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (reduced) {
        gsap.set(wrapRef.current, { scale: 1, opacity: 1 });
        return;
      }

      /**
       * Where the header's word slot is, measured live. `titleRef` is a
       * CHILD of the element actually being scaled (`wrapRef`), so its
       * rendered rect already carries whatever scale was applied last
       * frame — dividing straight by that rect (as FlyingEmblem does,
       * safe there because it measures the scaled element itself) would
       * feed the transform back into its own target and diverge. Instead
       * measure against the element's un-scaled size so each frame's
       * target is independent of the last.
       */
      const target = () => {
        const slot = slotRef.current?.getBoundingClientRect();
        const self = titleRef.current?.getBoundingClientRect();
        if (!slot || !self) return { x: 0, y: 0, scale: 0.3 };
        const curScale = gsap.getProperty(wrapRef.current, "scale") || 1;
        const naturalHeight = self.height / curScale;
        return {
          x: slot.left + slot.width / 2 - (self.left + self.width / 2),
          y: slot.top + slot.height / 2 - (self.top + self.height / 2),
          scale: slot.height / naturalHeight,
        };
      };

      // deferred a frame: TempleGate's pin (created in a sibling mounted
      // after this one, so its ref is populated in time) must exist
      // before these #gate-based triggers are created — see App.jsx
      const raf = requestAnimationFrame(
        contextSafe(() => {
          // the subtitle drops away before docking — only the title survives into the header
          gsap.to(subRef.current, {
            opacity: 0,
            y: -8,
            ease: "none",
            scrollTrigger: { trigger: gateSelector, start: "bottom 92%", end: "bottom 62%", scrub: true },
          });

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
    { dependencies: [reduced] }
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed origin-center scale-[0.12] text-center opacity-0"
      style={{ zIndex: "var(--z-nav)" }}
    >
      <span
        ref={titleRef}
        className="display-type block whitespace-nowrap text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.9] tracking-[0.06em] gilt"
      >
        DEVI GARBA
      </span>
      <span ref={subRef} className="label mt-3 block text-antique/70">
        Navratri · Ahmedabad
      </span>
    </div>
  );
}
