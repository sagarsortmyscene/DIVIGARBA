import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IMAGES, GALLERY } from "../../data/images";
import { createScene } from "../../lib/animations";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";

/* Six gallery shots, scattered around the emblem like snapshots
   stuck on a wall — each its own position and tilt. The tilt is
   applied by the GSAP tween below (as `rotation`), not a Tailwind
   class: GSAP writes `transform` directly, which would otherwise
   clobber a class-based rotate on the same element. */
const SCATTER = [
  { shot: GALLERY[0], style: "top-[10%] left-[5%] sm:left-[9%]", rotate: -8 },
  { shot: GALLERY[2], style: "top-[9%] right-[5%] sm:right-[9%]", rotate: 6 },
  { shot: GALLERY[4], style: "bottom-[13%] left-[7%] sm:left-[11%]", rotate: 5 },
  { shot: GALLERY[6], style: "bottom-[9%] right-[6%] sm:right-[10%]", rotate: -7 },
  { shot: GALLERY[1], style: "top-[40%] left-[1%] sm:left-[3%]", rotate: 4 },
  { shot: GALLERY[3], style: "top-[42%] right-[1%] sm:right-[3%]", rotate: -5 },
];

/**
 * THE GATE — the whole opening of the site, on one pinned timeline.
 *
 *   doors closed  →  they part  →  the emblem grows out of the light
 *   →  full open   →  the emblem lifts away and docks in the header
 *
 * The doors are two halves of ONE photograph, each panel holding the
 * full image and shifting its background-position so it lines up
 * across the seam. They translate fully off-screen well before the
 * emblem starts its flight up to the header, so that photo is gone
 * by the time the logo starts moving.
 */
export function TempleGate({ emblemRef, onGateOpen, onGateClose }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const doorFile = mobile ? IMAGES.door.fileMobile : IMAGES.door.file;

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);

      if (reduced) {
        if (mobile) {
          gsap.set(q("[data-door-t]"), { yPercent: -100 });
          gsap.set(q("[data-door-b]"), { yPercent: 100 });
        } else {
          gsap.set(q("[data-door-l]"), { xPercent: -100 });
          gsap.set(q("[data-door-r]"), { xPercent: 100 });
        }
        gsap.set(emblemRef.current, { scale: 1, opacity: 1 });
        gsap.set(q("[data-glow]"), { opacity: 1 });
        gsap.set(q("[data-doors]"), { opacity: 0 });
        gsap.set(q("[data-scatter]"), { opacity: 0 });
        onGateOpen?.();
        return;
      }

      // doors part 0.5 → 3.7; "half open" lands at 2.1 — that's the cue
      // for the emblem and wordmark to start growing, not the door's own start
      const HALF_OPEN = 2.1;

      createScene(ref.current, "300%", {
        // fires exactly when this same pin releases — i.e. right as the
        // emblem starts flying up into the header slot — and reverses if
        // the user scrolls back up into the gate. The doors are long
        // since off-screen by now, but hide them outright too, so there
        // is no chance of that photo showing again while the logo flies —
        // only the plain shine shows from here until the hero arrives.
        onLeave: () => {
          gsap.set(q("[data-doors], [data-scatter]"), { opacity: 0 });
          onGateOpen?.();
        },
        onEnterBack: () => {
          gsap.set(q("[data-doors]"), { opacity: 1 });
          gsap.set(q("[data-scatter]"), { opacity: 1 });
          onGateClose?.();
        },
      })
        // 1. the backdrop rises behind the doors as they part
        .to(q("[data-glow]"), { opacity: 1, duration: 2.2, ease: "power2.in" }, 0)
        // 2. the doors part — sideways on desktop, top/bottom on mobile
        .to(
          q(mobile ? "[data-door-t]" : "[data-door-l]"),
          mobile
            ? { yPercent: -100, duration: 3.2, ease: "power2.inOut" }
            : { xPercent: -100, duration: 3.2, ease: "power2.inOut" },
          0.5
        )
        .to(
          q(mobile ? "[data-door-b]" : "[data-door-r]"),
          mobile
            ? { yPercent: 100, duration: 3.2, ease: "power2.inOut" }
            : { xPercent: 100, duration: 3.2, ease: "power2.inOut" },
          0.5
        )
        // 3. once the door is half open, the emblem grows out of it, small → full
        .fromTo(
          emblemRef.current,
          { scale: 0.12, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2.0, ease: "power2.out" },
          HALF_OPEN
        )
        // 4. the scattered snapshots land around it, one after another
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
    },
    { scope: ref, dependencies: [reduced, mobile] }
  );

  /* One photo, two halves. Desktop splits left/right (each panel holds
     the full image, shifted sideways, so the carving lines up across
     the seam); mobile splits top/bottom the same way, rotated 90°, so
     the top half lifts up and the bottom half drops away. */
  const Door = ({ edge }) => {
    const isTB = edge === "t" || edge === "b";
    return (
      <div
        {...{ [`data-door-${edge}`]: true }}
        className={`relative overflow-hidden will-change-transform ${isTB ? "h-1/2 w-full" : "h-full w-1/2"}`}
      >
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${doorFile})`,
            backgroundPosition: isTB
              ? edge === "t"
                ? "center top"
                : "center bottom"
              : edge === "l"
                ? "left center"
                : "right center",
            backgroundSize: isTB ? "100% 200%" : "200% 100%",
          }}
        />
      </div>
    );
  };

  return (
    <section
      ref={ref}
      id="gate"
      className="relative grid min-h-[100svh] place-items-center overflow-hidden"
      aria-label="The gate opens"
    >
      <div
        data-glow
        aria-hidden
        className="absolute inset-0 bg-white opacity-0"
        style={{ zIndex: "var(--z-atmosphere)" }}
      />

      {/* the doors themselves — side-by-side on desktop, stacked on mobile */}
      <div
        data-doors
        className={`absolute inset-0 flex ${mobile ? "flex-col" : ""}`}
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

      {/* snapshots stuck around the emblem, at their own angles */}
      {SCATTER.map(({ shot, style }) => (
        <div
          key={shot.file}
          data-scatter
          aria-hidden
          className={`absolute h-32 w-28 bg-ivory p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.35)] opacity-0 sm:h-44 sm:w-36 md:h-56 md:w-44 ${style}`}
          style={{ zIndex: "var(--z-content)" }}
        >
          <img
            src={shot.file}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: shot.focal || "center" }}
          />
        </div>
      ))}

      <p
        data-tagline
        className="display-type absolute bottom-10 px-6 text-center text-xl text-ivory/70 sm:text-2xl"
        style={{ zIndex: "var(--z-content)" }}
      >
        Nine nights. One circle.
      </p>

    </section>
  );
}