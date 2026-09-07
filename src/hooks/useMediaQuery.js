import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without setState-in-effect cascades.
 * useSyncExternalStore is exactly the right primitive here: matchMedia
 * IS an external store.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/* Breakpoints live here, not as window.innerWidth checks scattered around. */
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTouch = () => useMediaQuery("(hover: none), (pointer: coarse)");
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/**
 * Viewport size for picking between exact-size creatives, where a
 * boolean breakpoint isn't enough.
 *
 * Deliberately NOT live on height. A phone fires `resize` every time
 * its URL bar collapses or expands mid-scroll, and height is the only
 * thing that changes. Re-rendering on each of those is what made the
 * gate stutter while scrolling, so a height-only change is ignored
 * here and the size updates only when the WIDTH moves — a real window
 * resize or an orientation change, both of which are rare and
 * genuinely need remeasuring.
 */
export function useStableViewport() {
  const [size, setSize] = useState(() =>
    typeof window === "undefined"
      ? { w: 0, h: 0 }
      : { w: window.innerWidth, h: window.innerHeight }
  );

  useEffect(() => {
    const onResize = () => {
      setSize((prev) => (prev.w === window.innerWidth ? prev : {
        w: window.innerWidth,
        h: window.innerHeight,
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}
