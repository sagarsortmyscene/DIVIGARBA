import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES, GALLERY, DOOR_MOBILE_CROPS } from "../../data/images";
import { createScene } from "../../lib/animations";
import { useReducedMotion, useIsMobile, useViewportWidth } from "../../hooks/useMediaQuery";

/** The exact-width crop for this viewport, or the generic mobile
 *  background if none of the four purpose-made crops fit. */
function pickDoorMobileFile(width) {
  const match = DOOR_MOBILE_CROPS.find((c) => width >= c.minWidth);
  return match ? match.file : IMAGES.door.fileMobile;
}

/* Snapshots scattered around the emblem.
   `at` carries responsive position classes; `rotate` is applied by GSAP
   (as `rotation`) rather than a Tailwind class, because GSAP writes
   `transform` directly and would otherwise clobber a class-based rotate.
   `wide` cards are hidden below md — six cards around a 360px screen
   collide with both the emblem and the tagline. */
const SCATTER = [
  { shot: GALLERY[0], at: "top-[8%] left-[4%] sm:left-[6%] lg:left-[8%] xl:left-[11%]",            rotate: -8 },
  { shot: GALLERY[2], at: "top-[7%] right-[4%] sm:right-[6%] lg:right-[8%] xl:right-[11%]",         rotate: 6 },
  { shot: GALLERY[4], at: "bottom-[16%] left-[5%] sm:left-[8%] lg:left-[10%] xl:left-[13%]",        rotate: 5 },
  { shot: GALLERY[6], at: "bottom-[15%] right-[5%] sm:right-[8%] lg:right-[10%] xl:right-[13%]",    rotate: -7 },
  { shot: GALLERY[1], at: "top-[40%] left-[1%] lg:left-[2%] xl:left-[4%]",  rotate: 4,  wide: true },
  { shot: GALLERY[3], at: "top-[42%] right-[1%] lg:right-[2%] xl:right-[4%]", rotate: -5, wide: true },
];

/**
 * THE GATE — the opening of the site, on one pinned timeline.
 *
 *   doors closed → they part → the emblem grows out of the light
 *   → full open → the emblem lifts away and docks in the header
 *
 * DOOR GEOMETRY
 * Each half holds an <img> sized to 200% of its own panel and offset
 * by exactly one panel width (or height). Because both numbers are
 * percentages of the panel — never viewport units — the two halves
 * stay welded at the seam at every size, including while a mobile URL
 * bar collapses and the panel height changes underneath them.
 *
 * It is an <img> with object-cover rather than a CSS background,
 * because a background-image on a transforming element repaints every
 * frame on most mobile GPUs. object-cover composites instead.
 */
export function TempleGate({ emblemRef, onGateOpen, onGateClose }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const viewportWidth = useViewportWidth();
  const doorSrc  = mobile ? pickDoorMobileFile(viewportWidth) : IMAGES.door.file;
  const doorFocal = mobile ? IMAGES.door.focalMobile : IMAGES.door.focal;

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const leaf = mobile ? ["[data-door-t]", "[data-door-b]"] : ["[data-door-l]", "[data-door-r]"];

      if (reduced) {
        gsap.set(q(leaf[0]), mobile ? { yPercent: -100 } : { xPercent: -100 });
        gsap.set(q(leaf[1]), mobile ? { yPercent: 100 } : { xPercent: 100 });
        gsap.set(emblemRef.current, { scale: 1, opacity: 1 });
        gsap.set(q("[data-glow]"), { opacity: 1 });
        gsap.set(q("[data-doors]"), { opacity: 0 });
        gsap.set(q("[data-scatter]"), { opacity: 0 });
        onGateOpen?.();
        return;
      }

      const HALF_OPEN = 2.1;
      /* A shorter throw on phones. 300% of a tall viewport is a lot of
         swiping for one door. */
      const LENGTH = mobile ? "210%" : "300%";

      const tl = createScene(ref.current, LENGTH, {
        onLeave: () => {
          gsap.set(q("[data-doors], [data-scatter]"), { opacity: 0 });
          onGateOpen?.();
        },
        onEnterBack: () => {
          gsap.set(q("[data-doors], [data-scatter]"), { opacity: 1 });
          onGateClose?.();
        },
      });

      tl.to(q("[data-glow]"), { opacity: 1, duration: 2.2, ease: "power2.in" }, 0)
        .to(
          q(leaf[0]),
          mobile
            ? { yPercent: -100, duration: 3.2, ease: "power2.inOut" }
            : { xPercent: -100, duration: 3.2, ease: "power2.inOut" },
          0.5
        )
        .to(
          q(leaf[1]),
          mobile
            ? { yPercent: 100, duration: 3.2, ease: "power2.inOut" }
            : { xPercent: 100, duration: 3.2, ease: "power2.inOut" },
          0.5
        )
        .fromTo(
          emblemRef.current,
          { scale: 0.12, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2.0, ease: "power2.out" },
          HALF_OPEN
        )
        .fromTo(
          q("[data-scatter]"),
          { opacity: 0, scale: 0.7, y: 24, rotation: 0 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: (i) => SCATTER[i].rotate,
            duration: 1.1,
            stagger: 0.15,
            ease: "back.out(1.6)",
          },
          HALF_OPEN + 0.6
        )
        .from(q("[data-tagline]"), { opacity: 0, y: 20, duration: 1.1 }, 3.4);

      /* The layout differs above and below md, so the pin distance
         changes when that line is crossed. Without this the pin keeps
         the distance it measured under the old layout. */
      ScrollTrigger.refresh();
    },
    { scope: ref, dependencies: [reduced, mobile] }
  );

  /** One half of the photograph. All offsets are % of the panel. */
  const Door = ({ edge }) => {
    const stacked = edge === "t" || edge === "b";
    return (
      <div
        {...{ [`data-door-${edge}`]: true }}
        className={`relative overflow-hidden will-change-transform ${
          stacked ? "h-1/2 w-full" : "h-full w-1/2"
        }`}
      >
        <img
          src={doorSrc}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          draggable="false"
          style={{ objectPosition: doorFocal }}
          className={`absolute max-w-none object-cover ${
            stacked
              ? `left-0 h-[200%] w-full ${edge === "t" ? "top-0" : "top-[-100%]"}`
              : `top-0 w-[200%] h-full ${edge === "l" ? "left-0" : "left-[-100%]"}`
          }`}
        />
      </div>
    );
  };

  return (
    <section
      ref={ref}
      id="gate"
      className="gate-min-h relative grid place-items-center overflow-hidden"
      aria-label="The gate opens"
    >
      <div
        data-glow
        aria-hidden
        className="absolute inset-0 bg-white opacity-0"
        style={{ zIndex: "var(--z-atmosphere)" }}
      />

      <div
        data-doors
        className={`absolute inset-0 flex ${mobile ? "flex-col" : "flex-row"}`}
        style={{ zIndex: "var(--z-image)" }}
      >
        {mobile ? (
          <>
            <Door edge="t" />
            <Door edge="b" />
          </>
        ) : (
          <>
            <Door edge="l" />
            <Door edge="r" />
          </>
        )}
      </div>

      {/* Snapshots.
          Width steps through every breakpoint; aspect-[3/4] keeps them
          undistorted instead of fixed w/h pairs.
          The max-height query is the one that matters for 1366×768 and
          1280×720: those are wide but SHORT, and at xl:w-44 the cards
          would run into the emblem. */}
      {SCATTER.map(({ shot, at, wide }) => (
        <div
          key={shot.file}
          data-scatter
          aria-hidden
          className={[
            "absolute aspect-3/4 bg-ivory p-1 opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.35)] sm:p-1.5",
            "w-20 sm:w-28 md:w-32 lg:w-36 xl:w-44 2xl:w-48",
            "[@media(max-height:820px)]:w-16 [@media(max-height:820px)]:sm:w-24 [@media(max-height:820px)]:lg:w-28 [@media(max-height:820px)]:xl:w-32",
            wide ? "hidden md:block" : "",
            at,
          ].join(" ")}
          style={{ zIndex: "var(--z-content)" }}
        >
          <img
            src={shot.file}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: shot.focal || "center" }}
          />
        </div>
      ))}

      <p
        data-tagline
        className="display-type absolute bottom-6 px-6 text-center text-base text-ivory/70 sm:bottom-8 sm:text-xl lg:bottom-10 lg:text-2xl [@media(max-height:820px)]:bottom-4 [@media(max-height:820px)]:text-base"
        style={{ zIndex: "var(--z-content)" }}
      >
        Nine nights. One circle.
      </p>
    </section>
  );
}