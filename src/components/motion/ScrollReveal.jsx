import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { createReveal } from "../../lib/animations";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/** Fade + rise on enter. The default reveal for any block of content. */
export function ScrollReveal({ children, y = 64, delay = 0, stagger = 0, start, as: Tag = "div", className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const targets = stagger ? ref.current.children : ref.current;
      createReveal(targets, { y, delay, stagger, trigger: ref.current, start });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
