import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BRAND } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * The load screen: white, the mark growing from nothing, then away.
 *
 * The whole thing runs about two seconds and it is deliberately NOT a
 * constant rate. `power4.in` starts almost still and accelerates hard
 * — for the first second the mark barely moves, then it arrives all at
 * once, which is what makes it read as fast rather than merely short.
 * A linear or `out` ease over the same two seconds feels sluggish.
 *
 * `onDone` fires as the veil STARTS to lift, not after it has gone, so
 * the page underneath begins moving while this is still fading. The
 * two overlap by a beat instead of the site sitting still and then
 * starting.
 */
export function SplashScreen({ onDone }) {
  const ref = useRef(null);
  const markRef = useRef(null);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  /* Nothing should scroll behind the veil. Restores whatever was on
     body rather than assuming it was empty. */
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone]);

  useGSAP(
    () => {
      /* No performance for anyone who asked for less motion — the veil
         is skipped outright rather than played quickly. */
      if (reduced) {
        onDone?.();
        setGone(true);
        return;
      }

      gsap
        .timeline({ onComplete: () => setGone(true) })
        .fromTo(
          markRef.current,
          { scale: 0, opacity: 1 },
          { scale: 1, duration: 1.5, ease: "power4.in" }
        )
        /* A last push past full size, so it feels thrown rather than
           parked on its mark. */
        .to(markRef.current, { scale: 1.3, duration: 0.3, ease: "power2.out" })
        .to(
          ref.current,
          { opacity: 0, duration: 0.35, ease: "power2.inOut", onStart: () => onDone?.() },
          "-=0.15"
        );
    },
    { scope: ref, dependencies: [reduced] }
  );

  if (gone) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 grid place-items-center bg-white"
      style={{ zIndex: "var(--z-loader)" }}
      role="status"
      aria-label="Loading"
    >
      <img
        ref={markRef}
        src={BRAND.logo}
        alt={EVENT_CONFIG.brandLine}
        fetchPriority="high"
        decoding="async"
        /* scale-0 from first paint: GSAP attaches in a layout effect,
           but without this the full-size mark can paint for one frame
           before it does. */
        className="w-[min(58vw,420px)] scale-0 object-contain"
      />
    </div>
  );
}
