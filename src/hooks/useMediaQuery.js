import { useCallback, useSyncExternalStore } from "react";


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


export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTouch = () => useMediaQuery("(hover: none), (pointer: coarse)");
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
