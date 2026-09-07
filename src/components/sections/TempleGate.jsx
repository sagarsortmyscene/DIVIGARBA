import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IMAGES,
  GALLERY,
  DOOR_MOBILE_CROPS,
  DOOR_DESKTOP_CROPS,
} from "../../data/images";
import { createScene } from "../../lib/animations";
import {
  useReducedMotion,
  useIsMobile,
  useStableViewport,
} from "../../hooks/useMediaQuery";

/* Fills the letterbox wherever the door artwork is contained rather
   than covered. Sampled from the creatives' own corner pixels (desktop
   ~#33 dark brown, the mobile crops ~#4f), so the bars read as the
   canvas continuing rather than as a gap onto the white glow behind. */
const DOOR_MATTE = "#3d1704";


/** One half of the photograph. All offsets are % of the panel.
 *
 *  Declared at module scope, NOT inside TempleGate. Defined inline it
 *  was a new function identity on every render, so React remounted
 *  both panels and rebuilt their <img> elements — while the GSAP
 *  timeline went on animating the original, now-detached nodes. That
 *  is what made the gate stutter and lose its animation mid-scroll.
 *
 *  `contain` decides cover vs contain from the crop direction. When
 *  contain is in play the artwork can't fill the panel, so rather than
 *  flat bars a blurred cover-scaled copy of the same file sits behind
 *  it and fills the gap, letting the edges read as the canvas
 *  continuing. It uses the panel's exact geometry, so the two halves
 *  stay aligned across the seam; the flat matte stays under it as a
 *  base, since a blur softens its own outer edge. */
function Door({ edge, src, focal, contain }) {
  const stacked = edge === "t" || edge === "b";
  const geometry = stacked
    ? `left-0 h-[200%] w-full ${edge === "t" ? "top-0" : "top-[-100%]"}`
    : `top-0 w-[200%] h-full ${edge === "l" ? "left-0" : "left-[-100%]"}`;

  return (
    <div
      {...{ [`data-door-${edge}`]: true }}
      className={`relative overflow-hidden will-change-transform ${
        stacked ? "h-1/2 w-full" : "h-full w-1/2"
      }`}
      style={contain ? { backgroundColor: DOOR_MATTE } : undefined}
    >
      {contain && (
        <img
          src={src}
          alt=""
          aria-hidden
          decoding="async"
          draggable="false"
          className={`absolute max-w-none scale-110 object-cover blur-2xl ${geometry}`}
        />
      )}
      <img
        src={src}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        draggable="false"
        style={{ objectPosition: focal }}
        className={`absolute max-w-none ${
          contain ? "object-contain" : "object-cover"
        } ${geometry}`}
      />
    </div>
  );
}

/** Whichever crop in `crops` is shaped closest to this viewport, so the
 *  artwork covers the screen with the least cropping. `fallback` covers
 *  the moment before the viewport has been measured. */
function pickClosestCrop(crops, width, height, fallback) {
  if (!width || !height) return fallback;
  const target = width / height;
  let best = fallback;
  let bestGap = Infinity;
  for (const crop of crops) {
    const gap = Math.abs(crop.w / crop.h - target);
    if (gap < bestGap) {
      bestGap = gap;
      best = crop.file;
    }
  }
  return best;
}

/* Snapshots scattered around the emblem — all six show at every size,
   including mobile. `at` carries responsive position classes; `rotate`
   is applied by GSAP (as `rotation`) rather than a Tailwind class,
   because GSAP writes `transform` directly and would otherwise
   clobber a class-based rotate. */
const SCATTER = [
  /* The four corner cards sit above and below the emblem, so on a phone
     they can be pulled well in from the edges without touching it. */
  { shot: GALLERY[0], at: "top-[8%] left-[11%] sm:left-[6%] lg:left-[8%] xl:left-[11%]",         rotate: -8 },
  { shot: GALLERY[2], at: "top-[7%] right-[11%] sm:right-[6%] lg:right-[8%] xl:right-[11%]",     rotate: 6 },
  { shot: GALLERY[4], at: "bottom-[16%] left-[12%] sm:left-[8%] lg:left-[10%] xl:left-[13%]",    rotate: 5 },
  { shot: GALLERY[6], at: "bottom-[15%] right-[12%] sm:right-[8%] lg:right-[10%] xl:right-[13%]", rotate: -7 },
  /* These two sit at the emblem's own height, so they stay near the
     edges on a phone — pulled in any further at this size they would
     cover the logo they are meant to frame. */
  { shot: GALLERY[1], at: "top-[40%] left-[2%] lg:left-[2%] xl:left-[4%]",  rotate: 4 },
  { shot: GALLERY[3], at: "top-[42%] right-[2%] lg:right-[2%] xl:right-[4%]", rotate: -5 },
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
  const viewport = useStableViewport();
  const doorSrc = mobile
    ? pickClosestCrop(DOOR_MOBILE_CROPS, viewport.w, viewport.h, IMAGES.door.fileMobile)
    : pickClosestCrop(DOOR_DESKTOP_CROPS, viewport.w, viewport.h, IMAGES.door.file);
  const doorFocal = mobile ? IMAGES.door.focalMobile : IMAGES.door.focal;

  /* Always cover, never contain — so the gate is full-bleed on every
     device, with no letterbox bars anywhere. That is only safe because
     the pickers above hand over a crop shaped close to this viewport,
     which keeps the crop to a few percent, and because every generated
     variant carries padding at the edge it gets cropped from. So what
     cover trims is the padding, not the artwork. */
  const doorProps = { src: doorSrc, focal: doorFocal, contain: false };

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
            <Door edge="t" {...doorProps} />
            <Door edge="b" {...doorProps} />
          </>
        ) : (
          <>
            <Door edge="l" {...doorProps} />
            <Door edge="r" {...doorProps} />
          </>
        )}
      </div>

      {/* Snapshots.
          Width steps through every breakpoint; aspect-[3/4] keeps them
          undistorted instead of fixed w/h pairs.
          The max-height query is the one that matters for 1366×768 and
          1280×720: those are wide but SHORT, and at xl:w-44 the cards
          would run into the emblem. */}
      {SCATTER.map(({ shot, at }) => (
        <div
          key={shot.file}
          data-scatter
          aria-hidden
          className={[
            "absolute aspect-3/4 bg-ivory p-1 opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.35)] sm:p-1.5",
            "w-32 sm:w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64",
            /* The short-viewport step is for wide-but-short laptops
               (1366x768, 1280x720), where full-size cards would run
               into the emblem. It is scoped from sm up on purpose:
               unscoped it also caught 800px-tall PHONES and shrank
               them, which is the opposite of what a phone needs. */
            "sm:[@media(max-height:820px)]:w-28 lg:[@media(max-height:820px)]:w-36 xl:[@media(max-height:820px)]:w-40",
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
        Ten nights. One circle.
      </p>
    </section>
  );
}