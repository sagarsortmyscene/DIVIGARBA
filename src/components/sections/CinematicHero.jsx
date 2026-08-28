import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SCENES } from "../../data/scenes";
import { useScrollVideo } from "../../hooks/useScrollVideo";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";
import { cx } from "../../lib/utils";

/* >>> DROP YOUR FILE HERE: public/assets/video/devi-garba-ritual.mp4
   No still-image fallback by design — if this fails to load, the section
   just shows the plain grade/gradient rather than any photo. Any free
   stock clip works; re-encode it scrubbable with something like:
   ffmpeg -i in.mp4 -an -vf "scale=1600:-2" -g 1 -crf 22 devi-garba-ritual.mp4 */
const VIDEO_SRC = "/assets/video/devi-garba-ritual.mp4";

/** How tall the scroll film runs. Longer = slower, more cinematic. */
const HERO_VH = 700;

const SIDE = {
  left: "left-[6vw] sm:left-[8vw] items-start text-left",
  right: "right-[6vw] sm:right-[8vw] items-end text-right",
};
const ALIGN = { start: "top-[22%]", center: "top-1/2 -translate-y-1/2", end: "bottom-[22%]" };

/**
 * HOME — the page proper, arriving right after the gate has opened and
 * the mark has docked in the header. A pinned scroll-scrubbed film with
 * captions sliding through it, replacing the old static hero.
 */
export function CinematicHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  /* Mobile scrubbing is unreliable — iOS throttles seeks hard and the
     decode cost on a mid-range Android drops frames badly. There we let
     the video loop normally and keep the text scenes scroll-driven. */
  const scrub = !reduced && !mobile;
  const { ready, failed } = useScrollVideo(videoRef, sectionRef, { enabled: scrub });

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);

      /* Each scene owns a slice of the hero. Separate scrubbed timelines
         mean reversing the scroll reverses the text for free. */
      SCENES.forEach((scene) => {
        const el = q(`[data-scene="${scene.id}"]`);
        if (reduced) {
          gsap.set(el, { opacity: 1, y: 0 });
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
          .fromTo(el, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
          .to(el, { duration: 1.4 })                                   // hold
          .to(el, { opacity: 0, y: -34, duration: 1, ease: "power2.in" });
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
        {!failed && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            loop={!scrub}
            autoPlay={!scrub}
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: "var(--z-background)" }}
          />
        )}

        {/* grade: pulls stock footage into the site's palette */}
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
            <span className="home-eyebrow text-antique">{scene.eyebrow}</span>
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

        {/* loading note only while the video is genuinely still fetching */}
        {scrub && !ready && !failed && (
          <p
            className="label absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory/30"
            style={{ zIndex: "var(--z-content)" }}
          >
            Loading the ritual…
          </p>
        )}
      </div>
    </section>
  );
}
