import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Media } from "../ui/Media";
import { Lightbox } from "../ui/Lightbox";
import { GALLERY, IMAGES } from "../../data/images";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * One row of plates, drifting left on a continuous loop — no hover,
 * no click-to-open-a-row, it just runs. The row renders its shots
 * twice back to back and the CSS animation slides it exactly one
 * set-width, so the seam where it repeats is never visible. Click a
 * plate to view it full screen.
 */
const ROW = { shots: GALLERY, direction: "marquee-left", duration: 91 };

export function Gallery() {
  const ref = useRef(null);
  const [open, setOpen] = useState(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(ref.current.querySelector("[data-row]"), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 74%" },
      });
      gsap.from(ref.current.querySelectorAll("[data-head] > *"), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      gsap.to(ref.current.querySelector("[data-ground]"), {
        opacity: 0.16,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <section
      ref={ref}
      id="gallery"
      className="relative overflow-hidden px-5 py-16 sm:px-10 sm:py-20"
      aria-label="The nights"
    >
      {/* Maa Durga, aged into the wall behind the panels */}
      {/* The grade and the mask stay inline: a sepia filter chain and a
          radial mask have no Tailwind equivalents worth the arbitrary
          syntax, and this is the only element on the site that wants
          them. Everything expressible as a class is one. */}
      <div
        data-ground
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-position-[center_26%] opacity-0"
        style={{
          backgroundImage: `url(${IMAGES.devi.file})`,
          zIndex: "var(--z-background)",
          filter: "sepia(0.55) saturate(0.75) contrast(1.05) brightness(0.62)",
          maskImage: "radial-gradient(72% 62% at 50% 42%, #000 18%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-[1600px]" style={{ zIndex: "var(--z-content)" }}>
        <div data-head className="mb-9 text-center">
          <span className="label text-antique">The nights</span>
          <h2 className="display-type mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] text-ivory">
            Ten nights, as they happen.
          </h2>
          <div className="divider-carved mt-4">
            <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
          </div>
        </div>

        <div data-row className="overflow-hidden">
          <div
            className="flex w-max gap-4 sm:gap-6"
            style={
              reduced ? undefined : { animation: `${ROW.direction} ${ROW.duration}s linear infinite` }
            }
          >
            {[...ROW.shots, ...ROW.shots].map((shot, i) => (
              <button
                key={`${shot.file}-${i}`}
                type="button"
                aria-label={`${shot.title} — ${shot.line}`}
                tabIndex={i < ROW.shots.length ? undefined : -1}
                onClick={() => setOpen(shot)}
                className="frame-ancient frame-pips group relative h-[46svh] w-[70vw] shrink-0 overflow-hidden bg-maroon text-left sm:h-[58svh] sm:w-[30vw] md:w-[24vw]"
              >
                <Media
                  image={shot}
                  className="scale-[1.08] transition-transform duration-700 ease-out group-hover:scale-100"
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(53,10,8,0.30), transparent 34%, rgba(7,5,4,0.90))",
                  }}
                />

                <span className="display-type absolute top-3 left-4 text-[clamp(1.7rem,3vw,2.6rem)] leading-none text-mukut">
                  {shot.n}
                </span>

                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="display-type text-2xl text-ivory">{shot.title}</h3>
                  <p className="mt-1.5 max-w-[34ch] text-xs leading-snug text-ivory/60">
                    {shot.line}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ivory/30">Click a night to view it full screen.</p>
      </div>

      {open && <Lightbox shot={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
