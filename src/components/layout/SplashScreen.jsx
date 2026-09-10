import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BRAND } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";
import { useReducedMotion } from "../../hooks/useMediaQuery";

export function SplashScreen({ onDone }) {
  const ref = useRef(null);
  const markRef = useRef(null);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

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

        className="w-[min(58vw,420px)] scale-0 object-contain"
      />
    </div>
  );
}
