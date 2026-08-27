import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Media } from "../ui/Media";
import { GALLERY, SIZES } from "../../data/images";
import { createScene } from "../../lib/animations";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";

/**
 * Six plates dealt like a hand of cards — the stacked-card scroll from
 * the reference, rebuilt in the site's own material: brass edges,
 * mukut-gold numerals, aged plates.
 *
 * Desktop: the stack fans out under a pinned scrub.
 * Mobile: a plain vertical stack — a fan is unreadable at 380px.
 */
export function Gallery() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(ref.current.querySelectorAll("[data-card]"));

      if (reduced || mobile) {
        gsap.set(cards, { x: 0, y: 0, rotate: 0, opacity: 1 });
        if (!reduced) {
          gsap.from(cards, {
            y: 46, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 76%" },
          });
        }
        return;
      }

      const tl = createScene(ref.current, "320%");

      cards.forEach((card, i) => {
        const spread = (i - (cards.length - 1) / 2);
        tl.fromTo(
          card,
          { x: spread * 26, y: spread * 10, rotate: spread * 1.4, scale: 0.94 },
          {
            x: spread * 190,
            y: spread * 34,
            rotate: spread * 0.6,
            scale: 1,
            ease: "power2.out",
            duration: 3,
          },
          0
        );
        // each plate settles out of its own zoom as it separates
        tl.fromTo(card.querySelector("img"), { scale: 1.24 }, { scale: 1, ease: "none", duration: 3 }, 0);
        tl.from(card.querySelector("[data-caption]"), { opacity: 0, y: 14, duration: 1 }, 1.4 + i * 0.12);
      });

      tl.from("[data-gallery-head]", { opacity: 0, y: 30, duration: 1.2 }, 0);
    },
    { scope: ref, dependencies: [reduced, mobile] }
  );

  return (
    <section
      ref={ref}
      id="gallery"
      className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-24 sm:px-10"
      aria-label="The nights"
    >
      <h2
        data-gallery-head
        className="display-type absolute top-24 left-1/2 -translate-x-1/2 text-center text-subheading text-ivory/70"
        style={{ zIndex: "var(--z-content)" }}
      >
        Ten nights, as they happen.
      </h2>

      <div
        className="relative grid w-full max-w-[1500px] place-items-center max-md:flex max-md:flex-col max-md:gap-10"
        style={{ zIndex: "var(--z-image)" }}
      >
        {GALLERY.map((shot) => (
          <figure
            key={shot.file}
            data-card
            className="w-[min(76vw,320px)] shrink-0 will-change-transform max-md:w-full md:absolute"
          >
            <div className="relative aspect-3/4 overflow-hidden border border-antique/30 bg-maroon shadow-[0_30px_80px_rgba(7,5,4,0.75)]">
              <Media image={shot} sizes={SIZES.card} />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(53,10,8,0.30), transparent 38%, rgba(7,5,4,0.80))",
                }}
              />
              <span className="display-type absolute top-4 left-5 text-[clamp(2.4rem,4vw,3.6rem)] leading-none text-mukut">
                {shot.n}
              </span>
              <figcaption data-caption className="absolute right-5 bottom-5 left-5">
                <h3 className="display-type text-2xl text-ivory">{shot.title}</h3>
                <p className="mt-1 text-sm leading-snug text-ivory/60">{shot.line}</p>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
