import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Media } from "../ui/Media";
import { Lightbox } from "../ui/Lightbox";
import { GALLERY, IMAGES, SIZES, unsplash } from "../../data/images";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";
import { cx } from "../../lib/utils";

/**
 * An accordion of panels: hover (or focus) one and it opens while the
 * rest give way. Slow and weighted — 1.05s on a long-tail ease, so it
 * feels like a heavy door rather than a UI toggle.
 *
 * The open/close is a CSS transition on flex-grow, not GSAP. Accordion
 * motion is a LAYOUT animation, and the browser's own transition path
 * handles that far better than a JS ticker writing flex values to six
 * elements every frame. GSAP is kept for the entrance, which animates
 * transform/opacity and belongs on the compositor.
 *
 * Column on mobile — flex-grow drives height there instead of width,
 * so the same accordion works with no second implementation.
 */
export function Gallery() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(ref.current.querySelectorAll("[data-panel]"), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.09,
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
      <div
        data-ground
        aria-hidden
        className="devi-ground opacity-0"
        style={{
          backgroundImage: `url(${unsplash(IMAGES.devi.file, { w: 1600, q: 62 })})`,
          zIndex: "var(--z-background)",
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

        <div
          className="flex h-[74svh] flex-col gap-2 md:h-[68svh] md:flex-row md:gap-3"
          onMouseLeave={() => !mobile && setActive(0)}
        >
          {GALLERY.map((shot, i) => {
            const isOpen = active === i;

            return (
              <button
                key={shot.file}
                data-panel
                type="button"
                aria-expanded={isOpen}
                aria-label={`${shot.title} — ${shot.line}`}
                onMouseEnter={() => !mobile && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => (mobile && !isOpen ? setActive(i) : setOpen(shot))}
                style={{ flexGrow: isOpen ? (mobile ? 4.2 : 4.6) : 1 }}
                className={cx(
                  "frame-ancient frame-pips group relative min-h-0 basis-0 overflow-hidden",
                  "bg-maroon text-left will-change-[flex-grow]",
                  "transition-[flex-grow] duration-[1050ms] ease-[cubic-bezier(.22,1,.36,1)]",
                  "focus-visible:outline-2 focus-visible:outline-mukut"
                )}
              >
                {/* the crop pans as the panel opens, so a collapsed strip
                    still shows something worth looking at */}
                <div
                  className={cx(
                    "absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]",
                    isOpen ? "scale-100" : "scale-[1.35]"
                  )}
                >
                  <Media image={shot} sizes={SIZES.card} />
                </div>

                <div
                  aria-hidden
                  className={cx(
                    "pointer-events-none absolute inset-0 transition-opacity duration-1000",
                    isOpen ? "opacity-70" : "opacity-100"
                  )}
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(53,10,8,0.30), transparent 34%, rgba(7,5,4,0.90))",
                  }}
                />

                <span className="display-type absolute top-3 left-4 text-[clamp(1.7rem,3vw,2.6rem)] leading-none text-mukut">
                  {shot.n}
                </span>

                {/* Collapsed: the title runs up the panel. Opened: it
                    lies down and the line joins it. */}
                <div className="absolute inset-x-4 bottom-4">
                  <h3
                    className={cx(
                      "display-type whitespace-nowrap text-ivory transition-all duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]",
                      isOpen
                        ? "text-2xl [writing-mode:horizontal-tb] md:rotate-0"
                        : "text-lg md:rotate-180 md:[writing-mode:vertical-rl]"
                    )}
                  >
                    {shot.title}
                  </h3>

                  <p
                    className={cx(
                      "max-w-[34ch] text-xs leading-snug text-ivory/60 transition-all duration-700",
                      isOpen ? "mt-1.5 opacity-100" : "pointer-events-none h-0 opacity-0"
                    )}
                  >
                    {shot.line}
                  </p>

                  <span
                    className={cx(
                      "label mt-3 inline-block text-mukut/80 transition-opacity duration-700",
                      isOpen ? "opacity-100 delay-200" : "opacity-0"
                    )}
                  >
                    View →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-ivory/30">
          {mobile ? "Tap to open a night, tap again to view it full screen." : "Hover to open a night. Click to view it full screen."}
        </p>
      </div>

      {open && <Lightbox shot={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
