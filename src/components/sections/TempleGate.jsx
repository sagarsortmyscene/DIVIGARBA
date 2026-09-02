import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IMAGES } from "../../data/images";
import { createScene } from "../../lib/animations";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";

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
          gsap.set(q("[data-doors]"), { opacity: 0 });
          onGateOpen?.();
        },
        onEnterBack: () => {
          gsap.set(q("[data-doors]"), { opacity: 1 });
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
        {/* a faint warm grade so the photo sits in the palette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(53,10,8,0.12), rgba(7,5,4,0.16)), radial-gradient(80% 60% at 50% 40%, rgba(240,193,75,0.08), transparent 70%)",
            mixBlendMode: "multiply",
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
        className="absolute inset-0 opacity-0"
        style={{ zIndex: "var(--z-atmosphere)" }}
      >
        {/* a plain burnt-orange field with a diagonal sheen, rather than a photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #5c2205 0%, #8e3606 28%, #c9752c 50%, #8e3606 72%, #5c2205 100%)",
          }}
        />
        {/* warm glow on top, so it still reads as light */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, rgba(240,193,75,0.28) 0%, rgba(216,100,30,0.14) 38%, transparent 72%)",
          }}
        />
      </div>

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

      <p
        data-tagline
        className="display-type absolute bottom-10 px-6 text-center text-xl text-ivory/70 sm:text-2xl"
        style={{ zIndex: "var(--z-content)" }}
      >
        Nine nights. One circle.
      </p>

      <div className="vignette" style={{ zIndex: "var(--z-grade)" }} />
    </section>
  );
}