/* ============================================================
   SCROLL REVEAL FACTORIES
   The two reveals every section shares, so their timing stays in one
   place. ScrollReveal and RevealText are the only callers.
   ============================================================ */
import gsap from "gsap";

/* Trimmed to what is actually used. This module used to also export a
   `T` timing scale (fast/slow/veil/easeInOut/scrub) and a `START` map
   with `late` and `pin` entries — leftovers from the temple gate,
   which was the only thing that pinned anything. */
const DURATION = { base: 1.0, slow: 1.6 };
const ENTER = "top 82%";

export function createReveal(target, { y = 64, delay = 0, stagger = 0, trigger, start = ENTER } = {}) {
  return gsap.from(target, {
    y,
    opacity: 0,
    duration: DURATION.base,
    ease: "power3.out",
    delay,
    stagger,
    scrollTrigger: { trigger: trigger || target, start },
  });
}

export function createTextReveal(lines, { delay = 0, stagger = 0.1, trigger, start = ENTER } = {}) {
  return gsap.from(lines, {
    yPercent: 108,
    duration: DURATION.slow,
    ease: "power4.out",
    delay,
    stagger,
    scrollTrigger: trigger ? { trigger, start } : undefined,
  });
}
