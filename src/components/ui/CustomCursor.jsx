import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsTouch, useReducedMotion } from "../../hooks/useMediaQuery";

/** Desktop only. Reads data-cursor on whatever is under the pointer. */
const STATES = {
  default: { scale: 1, opacity: 0.9, borderWidth: 1 },
  link: { scale: 1.9, opacity: 0.8, borderWidth: 1 },
  image: { scale: 3.2, opacity: 0.5, borderWidth: 1 },
  portal: { scale: 5.4, opacity: 0.35, borderWidth: 1 },
  cta: { scale: 3.6, opacity: 0.6, borderWidth: 1 },
};

export function CustomCursor() {
  const ref = useRef(null);
  const touch = useIsTouch();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (touch || reduced) return;
    const el = ref.current;
    const set = { x: gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" }) };
    // only the position needs to update every single move — the size/
    // opacity tween is expensive to recreate, so it only reruns when the
    // hovered element's cursor state actually changes (was firing on
    // every pointermove regardless, which is most of them on a 120Hz mouse)
    let lastKey = null;

    const onMove = (e) => {
      set.x(e.clientX);
      set.y(e.clientY);
      const hit = e.target.closest("[data-cursor], a, button");
      const key = hit?.dataset?.cursor || (hit ? "link" : "default");
      if (key === lastKey) return;
      lastKey = key;
      gsap.to(el, { ...(STATES[key] || STATES.default), duration: 0.4, ease: "power3.out" });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [touch, reduced]);

  if (touch || reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 -ml-[7px] -mt-[7px] h-3.5 w-3.5 rounded-full border border-gold mix-blend-difference"
      style={{ zIndex: "var(--z-cursor)" }}
    />
  );
}
