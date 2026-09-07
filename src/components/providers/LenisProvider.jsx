import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

/* On a real phone, scrolling collapses/expands the browser's address
   bar, which fires a native `resize` — Chrome DevTools' mobile
   emulator never triggers this, which is why pinned scenes (the gate)
   can look fine there but jump straight to a later state on an actual
   device. This tells ScrollTrigger to ignore resizes caused by just
   the address bar, instead of re-measuring every pin mid-scroll. */
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * The single smooth-scroll instance for the whole app.
 * GSAP's ticker is the only RAF loop — Lenis is driven from it rather
 * than running its own, so there is exactly one frame loop on the page.
 */
export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,        // heavy, but the input still feels direct
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    const raf = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  /* Renders children as-is. It used to publish the Lenis instance on a
     context, but nothing ever read it — the smooth scroll is wired
     straight into GSAP's ticker above. Put a context back if something
     genuinely needs programmatic scrollTo. */
  return children;
}
