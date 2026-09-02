import { useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Emblem } from "../ui/Emblem";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * The emblem lives in ONE fixed layer for the whole page. It sits
 * large and centred (behind the splash) until `ready` flips true —
 * the moment the splash finishes — then flies up into the header
 * slot once. After that it just stays docked, re-snapping on resize.
 *
 * It measures the real header slot rather than using magic offsets,
 * so it lands correctly at any viewport.
 */
export function FlyingEmblem({ emblemRef, slotRef, ready }) {
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    gsap.set(wrapRef.current, { xPercent: -50, yPercent: -50, top: "50%", left: "50%" });
  }, []);

  useGSAP(() => {
    gsap.set(emblemRef.current, { scale: 1, opacity: 1 });
  }, []);

  useGSAP(
    () => {
      if (!ready) return;

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

      const dock = () => gsap.set(wrapRef.current, target());

      if (reduced) {
        dock();
      } else {
        gsap.to(wrapRef.current, { ...target(), duration: 1.3, ease: "power3.inOut" });
      }

      // stay aligned with the header slot if the viewport resizes afterward
      window.addEventListener("resize", dock);
      return () => window.removeEventListener("resize", dock);
    },
    { dependencies: [ready, reduced] }
  );

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed h-[min(68vmin,520px)] w-[min(68vmin,520px)] origin-center"
      style={{ zIndex: "var(--z-nav)" }}
    >
      <Emblem ref={emblemRef} className="h-full w-full opacity-0" />
    </div>
  );
}
