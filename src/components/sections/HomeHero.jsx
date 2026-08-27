import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { unsplash, unsplashSrcSet, IMAGES, GALLERY } from "../../data/images";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/* The garba floor at rest; the Devi behind the circle. */
const HERO_IMAGE = GALLERY[0]; // dancer twirling
const DIVINE_IMAGE = IMAGES.devi;

/**
 * HOME — the page proper, arriving right after the gate has opened
 * and the mark has docked in the header. A second reveal, quieter
 * than the gate's: the word "divine" is a window the Devi opens
 * through as you scroll.
 */
export function HomeHero() {
  const ref = useRef(null);
  const wordRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);

      /* The circle opens FROM the word "divine", so it has to know where
         that word actually is. Measured live, re-measured on refresh —
         a hardcoded percentage drifts at every viewport width. */
      const origin = () => {
        const w = wordRef.current?.getBoundingClientRect();
        const s = ref.current?.getBoundingClientRect();
        if (!w || !s) return { x: 50, y: 62 };
        return {
          x: ((w.left + w.width / 2 - s.left) / s.width) * 100,
          y: ((w.top + w.height / 2 - s.top) / s.height) * 100,
        };
      };

      const setCircle = (r) => {
        const { x, y } = origin();
        gsap.set(q("[data-divine-layer]"), { clipPath: `circle(${r}% at ${x}% ${y}%)` });
      };

      if (reduced) {
        gsap.set(q("[data-fade]"), { opacity: 1, y: 0 });
        gsap.set(q("[data-line] > span"), { yPercent: 0 });
        setCircle(0);
        return;
      }

      /* --- on arrival --- */
      gsap
        .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: ref.current, start: "top 70%" } })
        .fromTo(
          q("[data-hero-img]"),
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" }
        )
        .from(q("[data-eyebrow]"), { opacity: 0, y: 18, duration: 1 }, "-=1.1")
        .from(q("[data-line] > span"), { yPercent: 108, duration: 1.35, stagger: 0.11, ease: "power4.out" }, "-=0.75")
        .from(q("[data-lede]"), { opacity: 0, y: 20, duration: 1 }, "-=0.8")
        .from(q("[data-cta]"), { opacity: 0, y: 20, duration: 1 }, "-=0.75");

      /* --- scroll: image pushes in, copy lifts, the circle opens --- */
      gsap.to(q("[data-hero-img]"), {
        scale: 1.1,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(q("[data-copy]"), {
        y: -70,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "18% top", end: "bottom top", scrub: true },
      });

      const state = { r: 0 };
      setCircle(0);
      gsap.to(state, {
        r: 150,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: () => setCircle(state.r),
        },
        onUpdate: () => setCircle(state.r),
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <section
      ref={ref}
      className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-obsidian px-5 sm:px-10"
      aria-label="Where garba meets the divine"
    >
      {/* the garba floor */}
      <img
        data-hero-img
        src={unsplash(HERO_IMAGE.file, { w: 2000 })}
        srcSet={unsplashSrcSet(HERO_IMAGE.file)}
        sizes="100vw"
        alt={HERO_IMAGE.alt}
        className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
        style={{ zIndex: "var(--z-background)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          zIndex: "var(--z-atmosphere)",
          background:
            "linear-gradient(180deg, rgba(7,5,4,0.72) 0%, rgba(7,5,4,0.38) 34%, rgba(7,5,4,0.88) 100%)",
        }}
      />

      {/* THE SIGNATURE — the divine, revealed through the circle */}
      <div
        data-divine-layer
        aria-hidden
        className="absolute inset-0"
        style={{ zIndex: "var(--z-geometry)", clipPath: "circle(0% at 50% 62%)" }}
      >
        <img
          src={unsplash(DIVINE_IMAGE.file, { w: 2000 })}
          alt=""
          className="h-full w-full object-cover object-[center_28%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 45%, rgba(216,100,30,0.28), transparent 70%), linear-gradient(180deg, rgba(7,5,4,0.55), rgba(7,5,4,0.85))",
          }}
        />
      </div>

      {/* copy */}
      <div
        data-copy
        className="relative flex flex-col items-center text-center"
        style={{ zIndex: "var(--z-content)" }}
      >
        <p data-eyebrow className="home-eyebrow text-antique">
          Garba · Navratri · Divinity
        </p>

        <h1 className="home-title mt-8 text-ivory">
          {["Where garba", "meets the"].map((line) => (
            <span key={line} data-line className="block overflow-hidden">
              <span className="block">{line}</span>
            </span>
          ))}
          <span data-line className="block overflow-hidden">
            <span ref={wordRef} className="gilt block italic">
              divine
            </span>
          </span>
        </h1>

        <p data-lede className="home-body mt-10 max-w-[34ch] text-ivory/65">
          A celebration of rhythm, devotion and togetherness.
        </p>

        <a data-cta href="#waitlist" className="group mt-12 flex flex-col items-center gap-3">
          <span className="home-eyebrow text-ivory transition-colors duration-500 group-hover:text-gold">
            Enter the circle
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-antique/45 transition-colors duration-500 group-hover:border-gold group-hover:bg-gold/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M12 5v14M6 13l6 6 6-6"
                stroke="var(--color-gold)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
