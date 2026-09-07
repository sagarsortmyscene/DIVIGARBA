import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { createTextReveal } from "../../lib/animations";
import { useReducedMotion } from "../../hooks/useMediaQuery";
import { cx } from "../../lib/utils";

/**
 * Line-by-line reveal out of a clipped box.
 * `lines` is an array of strings — each gets its own mask.
 */
export function RevealText({ lines, as: Tag = "h2", className, lineClassName, delay = 0, stagger = 0.1, trigger = true }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      createTextReveal(ref.current.querySelectorAll("[data-line]"), {
        delay,
        stagger,
        trigger: trigger ? ref.current : undefined,
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span data-line className={cx("block", lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
