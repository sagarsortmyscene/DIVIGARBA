import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Calendar, MapPin, Music } from "lucide-react";
import { IMAGES } from "../../data/images";
import { GalleryFlip } from "./GalleryFlip";
import { EVENT_CONFIG } from "../../data/event";
import { useMediaQuery, useReducedMotion } from "../../hooks/useMediaQuery";

const FACTS = [
  { Icon: Calendar, head: "11 — 20 Oct 2026", sub: "Ten nights" },
  { Icon: MapPin,   head: EVENT_CONFIG.venueName, sub: "Vaishnodevi Circle" },
  {
    Icon: Music,
    head: "Shehnai · dhol",
    sub: `From ${EVENT_CONFIG.gateEntry} · Last entry ${EVENT_CONFIG.entryCloses}`,
  },
];

const VECTORS = [
  { at: "bottom-[-14%] left-[-16%] w-[min(78vw,560px)]", spin: 150, drift: 18 },
  { at: "top-[-12%] right-[-14%] w-[min(64vw,440px)]",   spin: -190, drift: -22 },
];

const BELLS = [
  {
    at: "right-[6%] sm:right-[12%]",
    size: "w-[min(26vw,150px)] lg:w-[min(16vw,210px)]",
    flip: true,
    sway: -1.9,
    period: 5.1,
  },
];

export function HomeHero({ start = true }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const shortDesktop = useMediaQuery("(min-width: 1024px) and (max-height: 849px)");

  const compactFacts =
    useMediaQuery("(min-width: 1024px) and (max-width: 1535px)") || shortDesktop;

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);

      if (reduced) {
        gsap.set(q("[data-slide]"), { x: 0, opacity: 1 });
        return;
      }

      gsap.set(q("[data-slide]"), { x: "-115vw", opacity: 0 });
      if (start) {
        gsap.to(q("[data-slide]"), {
          x: 0,
          opacity: 1,
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.12,
        });
      }

      q("[data-bell]").forEach((el, i) => {
        const { sway, period, flip } = BELLS[i];
        gsap.set(el, { scaleX: flip ? -1 : 1 });
        gsap.fromTo(
          el,
          { rotation: -sway },
          { rotation: sway, duration: period, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );
      });

      q("[data-vector]").forEach((el, i) => {
        const { spin, drift } = VECTORS[i];

        gsap.to(el, { rotation: spin > 0 ? 360 : -360, duration: Math.abs(spin), repeat: -1, ease: "none" });
        gsap.to(el, {
          y: drift,
          duration: Math.abs(spin) / 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: ref, dependencies: [reduced, start] }
  );

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-svh w-full items-center overflow-hidden"
      aria-label={`${EVENT_CONFIG.name} — Navratri 2026`}
    >

      <picture aria-hidden className="absolute inset-0" style={{ zIndex: "var(--z-background)" }}>
        <source media="(min-width: 640px)" srcSet={IMAGES.heroBg.file} />
        <img
          src={IMAGES.heroBg.fileMobile}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          zIndex: "var(--z-atmosphere)",
          background:
            "linear-gradient(90deg, rgba(7,5,4,0.35) 0%, rgba(7,5,4,0.55) 55%, rgba(7,5,4,0.72) 100%)",
        }}
      />

      {VECTORS.map(({ at }) => (
        <picture key={at} className="contents">
        <source srcSet={IMAGES.vector.webp} type="image/webp" />
        <img
          data-vector
          src={IMAGES.vector.file}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"

          className={`pointer-events-none absolute opacity-40 ${at}`}
          style={{ zIndex: "var(--z-geometry)" }}
        />
        </picture>
      ))}

      {BELLS.map(({ at, size }) => (
        <picture key={at} className="contents">
        <source srcSet={IMAGES.bell.webp} type="image/webp" />
        <img
          data-bell
          src={IMAGES.bell.file}
          alt=""
          aria-hidden
          decoding="async"

          className={`pointer-events-none absolute top-0 hidden origin-top opacity-55 min-[1300px]:block ${size} ${at}`}
          style={{ zIndex: "var(--z-geometry)" }}
        />
        </picture>
      ))}

      <div

        className={`relative mx-auto grid w-full max-w-416 items-center gap-10 px-5 pt-32 pb-20 sm:px-10 lg:grid-cols-[minmax(560px,3fr)_2fr] lg:gap-6 ${
          shortDesktop ? "sm:pt-32 sm:pb-16" : "sm:pt-36 sm:pb-24"
        }`}
        style={{ zIndex: "var(--z-content)" }}
      >

        <div data-slide className="order-1 min-w-0 lg:order-2 lg:pl-6">

          <h1
            lang="gu"
            className="font-ui text-[clamp(2.2rem,4vw,5rem)] leading-[1.35] text-ivory"
          >
            સાંજથી પરોઢ
          </h1>

          <p className="display-type mt-5 text-[clamp(1.05rem,1.7vw,1.55rem)] text-mukut italic">
            Ten nights. One circle.
          </p>

          <p className="mt-2 text-[clamp(0.95rem,1.15vw,1.2rem)] text-ivory/80">
            Where tradition comes alive.
          </p>

          <p className="mt-4 max-w-[46ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.65] font-light text-ivory/60">
            Garba, dhol, devotion and togetherness — ten nights of music,
            movement and celebration, all coming together in one timeless
            circle.
          </p>

          <dl
            className={`grid border-t border-antique/20 2xl:mt-12 2xl:pt-8 ${shortDesktop ? "mt-6 pt-5" : "mt-8 pt-6"} ${
              compactFacts
                ? "grid-cols-1 gap-y-4"
                : "grid-cols-1 gap-y-5 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-antique/20"
            }`}
          >
            {FACTS.map(({ Icon, head, sub }) => (
              <div
                key={head}
                className={compactFacts ? "flex items-center gap-3" : "sm:px-3 sm:first:pl-0 sm:last:pr-0"}
              >
                <Icon
                  className={`text-mukut ${
                    compactFacts
                      ? "h-5 w-5 shrink-0"
                      : "mb-2 h-5 w-5 sm:mb-3 sm:h-6 sm:w-6 2xl:h-8 2xl:w-8"
                  }`}
                  aria-hidden
                  strokeWidth={1.6}
                />
                <div>

                  <dt className="text-[clamp(0.95rem,1.4vw,1.6rem)] leading-tight text-balance text-ivory">
                    {head}
                  </dt>
                  <dd
                    className={`text-[clamp(0.75rem,1.05vw,1.25rem)] tracking-[0.12em] uppercase text-ivory/45 ${
                      compactFacts ? "" : "mt-1 sm:mt-2"
                    }`}
                  >
                    {sub}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div data-slide className="order-2 min-w-0 lg:order-1">
          <GalleryFlip />
        </div>
      </div>
    </section>
  );
}
