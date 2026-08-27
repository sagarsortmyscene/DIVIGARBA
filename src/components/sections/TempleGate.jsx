import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Media } from "../ui/Media";
import { Emblem } from "../ui/Emblem";
import { IMAGES } from "../../data/images";
import { createScene } from "../../lib/animations";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * THE GATE — the whole opening of the site, on one pinned timeline.
 *
 *   doors closed  →  they part  →  the emblem grows out of the light
 *   →  full open   →  the emblem lifts away and docks in the header
 *
 * The doors are two halves of ONE photograph of a real Rajasthani
 * carved door: each panel holds the full image and shifts its
 * background-position, so the carving lines up across the seam.
 */
export function TempleGate({ emblemRef, wordRef }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);

      if (reduced) {
        gsap.set(q("[data-door-l]"), { xPercent: -100 });
        gsap.set(q("[data-door-r]"), { xPercent: 100 });
        gsap.set(emblemRef.current, { scale: 1, opacity: 1 });
        gsap.set(wordRef.current, { scale: 1, opacity: 1 });
        return;
      }

      // doors part 0.5 → 3.7; "half open" lands at 2.1 — that's the cue
      // for the emblem and wordmark to start growing, not the door's own start
      const HALF_OPEN = 2.1;

      createScene(ref.current, "300%")
        // 1. a low warm bloom in the seam — not a spotlight
        .to(q("[data-glow]"), { opacity: 0.55, scale: 1.15, duration: 2.2, ease: "power2.in" }, 0)
        // 2. the doors part
        .to(q("[data-door-l]"), { xPercent: -100, duration: 3.2, ease: "power2.inOut" }, 0.5)
        .to(q("[data-door-r]"), { xPercent: 100, duration: 3.2, ease: "power2.inOut" }, 0.5)
        // 3. once the door is half open, the emblem grows out of it, small → full —
        // the wordmark scales up in lockstep, reciprocal, same beat
        .fromTo(
          emblemRef.current,
          { scale: 0.12, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2.0, ease: "power2.out" },
          HALF_OPEN
        )
        .fromTo(
          wordRef.current,
          { scale: 0.12, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2.0, ease: "power2.out" },
          HALF_OPEN
        )
        .to(q("[data-em-ring]"), { rotate: 90, duration: 2.4, ease: "none" }, HALF_OPEN)
        // 4. she is revealed behind
        .to(q("[data-devi]"), { opacity: 0.62, scale: 1, duration: 2.6, ease: "power2.out" }, 1.4)
        .from(q("[data-tagline]"), { opacity: 0, y: 20, duration: 1.1 }, 3.4);
    },
    { scope: ref, dependencies: [reduced] }
  );

  /** One photo, two halves — background-position keeps the carving continuous. */
  const Door = ({ side }) => (
    <div
      {...{ [`data-door-${side}`]: true }}
      className="relative h-full w-1/2 overflow-hidden will-change-transform"
    >
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${
            "https://images.unsplash.com/photo-" + IMAGES.door.file + "?auto=format&fit=crop&q=80&w=1600"
          })`,
          backgroundPosition: side === "l" ? "left center" : "right center",
          backgroundSize: "200% 100%",
        }}
      />
      {/* aged brass grade so the wood sits in the palette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(53,10,8,0.55), rgba(7,5,4,0.72)), radial-gradient(80% 60% at 50% 40%, rgba(240,193,75,0.14), transparent 70%)",
          mixBlendMode: "multiply",
        }}
      />
      {/* the inner edge catches the light from the opening */}
      <div
        aria-hidden
        className={`absolute top-0 bottom-0 w-px bg-gold/50 ${side === "l" ? "right-0" : "left-0"}`}
      />
    </div>
  );

  return (
    <section
      ref={ref}
      id="gate"
      className="relative grid min-h-[100svh] place-items-center overflow-hidden"
      aria-label="The gate opens"
    >
      {/* what waits behind: her, held far back and dim */}
      <div data-devi className="absolute inset-0 scale-110 opacity-0" style={{ zIndex: "var(--z-background)" }}>
        <Media image={IMAGES.devi} />
        <div aria-hidden className="absolute inset-0 bg-obsidian/70" />
      </div>

      <div
        data-glow
        aria-hidden
        className="absolute h-[62vmin] w-[62vmin] scale-50 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(240,193,75,0.34) 0%, rgba(216,100,30,0.18) 38%, transparent 72%)",
          zIndex: "var(--z-atmosphere)",
        }}
      />

      {/* the doors themselves */}
      <div className="absolute inset-0 flex" style={{ zIndex: "var(--z-image)" }}>
        <Door side="l" />
        <Door side="r" />
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