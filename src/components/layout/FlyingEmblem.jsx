import { useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Emblem } from "../ui/Emblem";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";

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

  useLayoutEffect(() => {
    // start centred, at the size the gate animation expects
    gsap.set(wrapRef.current, { xPercent: -50, yPercent: -50, top: "50%", left: "50%" });
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

      /** Where the header slot is, measured live. */
      const target = () => {
        const slot = slotRef.current?.getBoundingClientRect();
        const self = wrapRef.current?.getBoundingClientRect();
        if (!slot || !self) return { x: 0, y: 0, scale: 0.16 };
        return {
          x: slot.left + slot.width / 2 - (self.left + self.width / 2),
          y: slot.top + slot.height / 2 - (self.top + self.height / 2),
          scale: slot.width / self.width,
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
      className="pointer-events-none fixed h-[min(68vmin,520px)] w-[min(68vmin,520px)] origin-center"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {/* hidden at gate-open scale from first paint — no flash before GSAP attaches */}
      <Emblem ref={emblemRef} className="h-full w-full scale-[0.12] opacity-0" />
    </div>
  );
}
