/* ============================================================
   CENTRAL ANIMATION FACTORIES
   Every scroll behaviour on the site routes through one of these.
   No component writes a raw gsap.to for a reveal.
   ============================================================ */
import gsap from "gsap";

/** Shared timing so nothing drifts out of the site's rhythm. */
export const T = {
  fast: 0.6,
  base: 1.0,
  slow: 1.6,
  veil: 2.2,
  ease: "power3.out",
  easeInOut: "power2.inOut",
  scrub: 1,
};

/** Where a section starts animating, in one place. */
export const START = {
  enter: "top 82%",
  late: "top 68%",
  pin: "top top",
};

export function createReveal(target, { y = 64, delay = 0, stagger = 0, trigger, start = START.enter } = {}) {
  return gsap.from(target, {
    y,
    opacity: 0,
    duration: T.base,
    ease: T.ease,
    delay,
    stagger,
    scrollTrigger: { trigger: trigger || target, start },
  });
}

export function createTextReveal(lines, { delay = 0, stagger = 0.1, trigger, start = START.enter } = {}) {
  return gsap.from(lines, {
    yPercent: 108,
    duration: T.slow,
    ease: "power4.out",
    delay,
    stagger,
    scrollTrigger: trigger ? { trigger, start } : undefined,
  });
}

/**
 * Physical opening — an inset or circle mask, never opacity.
 * `shape` takes progress 0..1 and returns a clip-path string.
 */

/** A pinned, scrubbed timeline. The unit the whole film is built from. */
export function createScene(trigger, length = "200%", opts = {}) {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: START.pin,
      end: `+=${length}`,
      pin: true,
      scrub: T.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      ...opts,
    },
  });
}
