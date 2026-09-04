import { useCallback, useSyncExternalStore } from "react";

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

/** The live viewport width — for picking between a handful of
 *  exact-width creatives, where a boolean breakpoint isn't enough. */
export function useViewportWidth() {
  const subscribe = useCallback((onChange) => {
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  }, []);

  const getSnapshot = useCallback(() => window.innerWidth, []);

  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}
