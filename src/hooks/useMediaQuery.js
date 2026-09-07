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
