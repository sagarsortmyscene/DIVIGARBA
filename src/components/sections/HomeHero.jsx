import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mandala } from "../ui/Mandala";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * HOME — the page proper, arriving right after the gate has opened
 * and the mark has docked in the header. No photograph here — just
 * the same warm gradient ground the rest of the site rests on, a
 * field of mathematically-drawn mandalas turning behind the copy,
 * and the line rising into place.
 */
export function HomeHero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);

      if (reduced) {
        gsap.set(q("[data-fade]"), { opacity: 1, y: 0 });
        gsap.set(q("[data-line] > span"), { yPercent: 0 });
        return;
      }

      /* --- on arrival --- */
      gsap
        .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: ref.current, start: "top 70%" } })
        .from(q("[data-eyebrow]"), { opacity: 0, y: 18, duration: 1 })
        .from(q("[data-line] > span"), { yPercent: 108, duration: 1.35, stagger: 0.11, ease: "power4.out" }, "-=0.75")
        .from(q("[data-lede]"), { opacity: 0, y: 20, duration: 1 }, "-=0.8")
        .from(q("[data-cta]"), { opacity: 0, y: 20, duration: 1 }, "-=0.75");

      /* --- scroll: the mandala field turns slowly under the copy --- */
      gsap.to(q("[data-mandala]"), {
        rotate: 26,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1.4 },
      });

      /* --- scroll: the copy simply lifts and fades as you leave --- */
      gsap.to(q("[data-copy]"), {
        y: -70,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "18% top", end: "bottom top", scrub: true },
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
      {/* no photograph here — the same warm ground the rest of the site sits on */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          zIndex: "var(--z-background)",
          background:
            "radial-gradient(120% 70% at 50% 0%, rgba(240,193,75,0.14), transparent 60%), radial-gradient(90% 60% at 15% 100%, rgba(143,23,18,0.20), transparent 62%), radial-gradient(90% 60% at 85% 100%, rgba(168,121,44,0.16), transparent 62%), linear-gradient(180deg, #120a04 0%, #0b0706 50%, #070504 100%)",
        }}
      />

      {/* One mandala, dead centre behind the copy, at a visible strength. */}
      <div
        aria-hidden
        data-mandala
        className="pointer-events-none absolute inset-0 overflow-hidden text-gold"
        style={{ zIndex: "var(--z-atmosphere)" }}
      >
        <Mandala className="absolute top-1/2 left-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.32]" />
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
            <span className="gilt block italic">divine</span>
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
