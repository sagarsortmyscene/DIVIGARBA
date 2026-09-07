import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SCENES } from "../../data/scenes";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";
import { cx } from "../../lib/utils";

/** How tall the scroll film runs. Longer = slower, more cinematic. */
const HERO_VH = 520;

const SIDE = {
  left: "left-[6vw] sm:left-[8vw] items-start text-left",
  right: "right-[6vw] sm:right-[8vw] items-end text-right",
};
const ALIGN = { start: "top-[22%]", center: "top-1/2 -translate-y-1/2", end: "bottom-[22%]" };

/**
 * THE FILM — a pinned scroll-scrubbed sequence of real event photos,
 * one per scene, crossfading as captions slide through them.
 *
 * It follows HomeHero, which is the actual opening screen. This used
 * to carry the home background itself; that moved into HomeHero when
 * the hero became its own section.
 */
export function CinematicHero() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);

      /* Each scene owns a slice of the hero: its photo crossfades in a
         touch ahead of its caption and holds a touch after, so the
         image is never left waiting on bare grade before the text. */
      SCENES.forEach((scene) => {
        const text = q(`[data-scene="${scene.id}"]`);
        const photo = q(`[data-photo="${scene.id}"]`);

        if (reduced) {
          gsap.set(text, { opacity: 1, y: 0 });
          gsap.set(photo, { opacity: 1 });
          return;
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${scene.from * 100}% top`,
              end: `${scene.to * 100}% top`,
              scrub: 1,
            },
          })
          .fromTo(text, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
          .to(text, { duration: 1.4 }) // hold
          .to(text, { opacity: 0, y: -34, duration: 1, ease: "power2.in" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${Math.max(0, scene.from - 0.05) * 100}% top`,
              end: `${Math.min(1, scene.to + 0.05) * 100}% top`,
              scrub: 1,
            },
          })
          .fromTo(photo, { opacity: 0, scale: 1.06 }, { opacity: 1, duration: 1, ease: "power2.out" })
          .to(photo, { scale: 1, duration: 3.4, ease: "none" }, 0) // slow drift, whole slice
          .to(photo, { opacity: 0, duration: 1, ease: "power2.in" });
      });

      if (reduced) return;

      /* Ending: darken to obsidian so the next section arrives without a cut */
      gsap.fromTo(
        q("[data-outro]"),
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "88% top", end: "bottom bottom", scrub: true },
        }
      );
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      id="film"
      className="relative"
      style={{ height: `${reduced ? 160 : HERO_VH}vh` }}
      aria-label="Divi Garba — the ritual"
    >
      {/* the frame stays put while the scroll drives what is inside it */}
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-obsidian">
        {SCENES.map((scene) => (
          <img
            key={scene.id}
            data-photo={scene.id}
            src={mobile ? scene.image.fileMobile : scene.image.file}
            alt={scene.image.alt}
            className="absolute inset-0 h-full w-full object-cover opacity-0"
            style={{ objectPosition: scene.image.focal, zIndex: "var(--z-background)" }}
          />
        ))}

        {/* grade: pulls the photos into the site's palette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            zIndex: "var(--z-atmosphere)",
            background:
              "linear-gradient(180deg, rgba(7,5,4,0.78) 0%, rgba(7,5,4,0.30) 34%, rgba(7,5,4,0.86) 100%), radial-gradient(70% 55% at 50% 48%, rgba(216,100,30,0.16), transparent 72%)",
          }}
        />

        {/* scenes — never over the centre, where the action is */}
        {SCENES.map((scene) => (
          <div
            key={scene.id}
            data-scene={scene.id}
            className={cx(
              "absolute flex max-w-[min(78vw,30rem)] flex-col opacity-0",
              SIDE[scene.side],
              ALIGN[scene.align]
            )}
            style={{ zIndex: "var(--z-content)" }}
          >
            <span className="text-[clamp(0.68rem,1vw,0.8rem)] tracking-[0.4em] uppercase text-antique">{scene.eyebrow}</span>
            <h2 className="display-type mt-5 text-[clamp(1.8rem,4.4vw,3.4rem)] leading-[1.05] text-ivory">
              {scene.heading}
            </h2>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-ivory/55 sm:text-base">
              {scene.body}
            </p>
          </div>
        ))}

        {/* outro veil */}
        <div
          data-outro
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            zIndex: "var(--z-foreground)",
            background: "linear-gradient(180deg, rgba(26,11,13,0.6), var(--color-obsidian) 78%)",
          }}
        />
      </div>
    </section>
  );
}
