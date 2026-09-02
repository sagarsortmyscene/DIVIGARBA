import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/* How long the logo sits still, in seconds, before the panel lifts. */
const HOLD = 0.15;

/* Set true to show the splash only once per browser session. */
const ONCE_PER_SESSION = false;
const SEEN_KEY = "divi:splash";

export function SplashScreen({ onDone }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const [gone, setGone] = useState(
    () => ONCE_PER_SESSION && sessionStorage.getItem(SEEN_KEY) === "1"
  );
  /* The timeline waits for the logo to decode. Without this you get
     white → nothing → a logo that pops in at the last second on a
     slow connection, which looks broken rather than deliberate. */
  const [loaded, setLoaded] = useState(false);

  /* Hold the page still underneath. Scrolling during a splash leaves
     you somewhere unexpected when it lifts. */
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => { document.body.style.overflow = prev; };
  }, [gone]);

  useGSAP(
    () => {
      if (gone || !loaded) return;

      const finish = () => {
        setGone(true);
        if (ONCE_PER_SESSION) sessionStorage.setItem(SEEN_KEY, "1");
        /* the pinned sections measured themselves against a locked
           body — they need to re-measure once it is released */
        ScrollTrigger.refresh();
        onDone?.();
      };

      if (reduced) { finish(); return; }

      const q = gsap.utils.selector(ref);

      gsap.timeline({ onComplete: finish })
        .from(q("[data-logo]"), { opacity: 0, scale: 0.9, duration: 0.35, ease: "power3.out" })
        .from(q("[data-sub]"), { opacity: 0, y: 12, duration: 0.25, ease: "power2.out" }, "-=0.15")
        /* hold */
        .to({}, { duration: HOLD })
        /* the logo leaves first, then the white lifts — so you see the
           site arrive rather than the logo vanishing into it */
        .to(q("[data-logo], [data-sub]"), { opacity: 0, y: -14, duration: 0.25, ease: "power2.in" })
        .to(ref.current, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.1");
    },
    { scope: ref, dependencies: [gone, loaded, reduced] }
  );

  if (gone) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 grid place-items-center bg-white"
      style={{ zIndex: "var(--z-loader)" }}
      role="status"
      aria-label={`${EVENT_CONFIG.name} — loading`}
    >
      <div className="flex flex-col items-center px-8">
        <img
          data-logo
          src={BRAND.logo}
          alt={`${EVENT_CONFIG.name} — ${EVENT_CONFIG.nameGu}`}
          onLoad={() => setLoaded(true)}
          /* if the file 404s, do not trap the user behind a white screen */
          onError={() => setLoaded(true)}
          fetchPriority="high"
          decoding="async"
          draggable="false"
          className="h-auto w-[min(62vw,300px)] object-contain sm:w-[min(38vw,360px)]"
        />

        <p
          data-sub
          className="font-deva mt-6 text-center text-[clamp(0.85rem,3.4vw,1.15rem)] tracking-[0.18em] text-burnt"
        >
          {EVENT_CONFIG.tagline}
        </p>
      </div>
    </div>
  );
}
