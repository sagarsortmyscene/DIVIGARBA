import gsap from "gsap";

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
