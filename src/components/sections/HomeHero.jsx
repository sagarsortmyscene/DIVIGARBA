import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Calendar, MapPin, Music } from "lucide-react";
import { IMAGES } from "../../data/images";
import { GalleryFlip } from "./GalleryFlip";
import { EVENT_CONFIG } from "../../data/event";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/* The three facts that belong above the fold. Data, not markup, so the
   row is one map instead of three near-identical blocks. */
const FACTS = [
  { Icon: Calendar, head: "11 — 20 Oct 2026", sub: "Ten nights" },
  { Icon: MapPin,   head: "Master Farm",      sub: "Vaishnodevi Circle" },
  { Icon: Music,    head: "Live garba · dhol", sub: "8:00 PM — 2:00 AM" },
];

/* The two drifting vectors. Position, size and motion in one place so
   adding a third is a line rather than a copy-paste. `spin` is seconds
   for a full turn — deliberately long: these should be noticed only if
   you watch for them. Opposite directions so they never look geared
   together. */
const VECTORS = [
  { at: "bottom-[-14%] left-[-16%] w-[min(78vw,560px)]", spin: 150, drift: 18 },
  { at: "top-[-12%] right-[-14%] w-[min(64vw,440px)]",   spin: -190, drift: -22 },
];

/* The two bells, hung from the top edge either side of the nav.
   `flip` mirrors the right one so the pair reads as a matched set
   rather than the same picture twice. `sway` is the swing in degrees:
   opposite signs and different periods, because two bells moving in
   lockstep look like one animation applied twice. */
const BELLS = [
  /* The left one hangs smaller — the two are no longer a symmetrical
     pair, so `size` is per-bell rather than a shared class. */
  {
    at: "left-[6%] sm:left-[12%]",
    size: "w-[min(20vw,116px)] lg:w-[min(12vw,160px)]",
    flip: false,
    sway: 2.4,
    period: 4.2,
  },
  {
    at: "right-[6%] sm:right-[12%]",
    size: "w-[min(26vw,150px)] lg:w-[min(16vw,210px)]",
    flip: true,
    sway: -1.9,
    period: 5.1,
  },
];

/**
 * HOME — the opening screen. A gradient ground, two slowly turning
 * vectors behind everything, the gallery bound as a turnable book at
 * the left, and the event's pitch and hard facts at the right.
 *
 * This sits ahead of CinematicHero, which still runs its own
 * scroll-scrubbed photo film underneath — this section replaced
 * nothing, it just arrives first.
 */
export function HomeHero({ start = true }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);

      /* Reduced motion gets the composition, not the movement. The
         vectors are decoration — a permanent slow rotation is exactly
         the kind of thing the setting exists to switch off. */
      if (reduced) {
        gsap.set(q("[data-slide]"), { x: 0, opacity: 1 });
        return;
      }

      /* Both columns start fully outside the left edge and travel right
         into place. -115vw rather than a percentage of the element:
         the two are different widths, and only a viewport unit puts
         BOTH genuinely off screen rather than merely displaced. The
         section is overflow-hidden, so nothing here can widen the page
         while it is out there.

         Held at that offset until `start` — the splash screen owns the
         first two seconds, and without the gate this would play out
         behind the veil and be over before anyone saw it. */
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

      /* The bells swing from where they are hung, not their middle —
         origin-top in the markup.

         The mirror is set HERE, not with a `-scale-x-100` class. GSAP
         owns this element's `transform` the moment it tweens rotation,
         and it builds that string from its own cache — so a class-set
         scaleX(-1) is either dropped or, worse, decomposed as a 180
         degree rotation with a negative scaleY, which is what left the
         right bell upside down instead of mirrored. Handing GSAP both
         values means it composes them itself and they cannot fight. */
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
        /* Two independent tweens on the same element: GSAP composes
           rotation and y itself, so they can run at different speeds
           without one resetting the other. */
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

  /* The SortMyScene widget binds itself to #buy-btn in the header, and
     an id can only be on one element — so rather than a second trigger
     the widget knows nothing about, this forwards the click to the one
     it already owns. */
  const openTickets = () => document.getElementById("buy-btn")?.click();

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-svh w-full items-center overflow-hidden"
      aria-label={`${EVENT_CONFIG.name} — Navratri 2026`}
    >
      {/* The ground. Built from palette tokens rather than raw hexes so
          it follows the theme if that is ever retuned. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          zIndex: "var(--z-background)",
          background: `
            radial-gradient(80% 62% at 20% 84%, color-mix(in srgb, var(--color-ember) 32%, transparent), transparent 68%),
            radial-gradient(72% 58% at 78% 18%, color-mix(in srgb, var(--color-sindoor) 38%, transparent), transparent 72%),
            linear-gradient(168deg, var(--color-temple) 0%, var(--color-maroon) 48%, var(--color-obsidian) 100%)
          `,
        }}
      />

      {/* The vectors — one low-left, one high-right, both bled past the
          edge so no corner of the square PNG is ever visible. They are
          decoration only: aria-hidden, and pointer-events-none so they
          cannot intercept a click meant for the copy. */}
      {VECTORS.map(({ at }) => (
        <img
          key={at}
          data-vector
          src={IMAGES.vector.file}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          /* Was opacity-[0.14] with mix-blend-screen. Screen LIGHTENS
             what is under it, which on this dark ground washed the
             ornament out to almost nothing — so the blend mode is gone
             and the artwork renders in its own colour, at nearly three
             times the opacity. */
          className={`pointer-events-none absolute opacity-40 ${at}`}
          style={{ zIndex: "var(--z-geometry)" }}
        />
      ))}

      {/* The bells, hung either side of the nav. Decoration only:
          aria-hidden and pointer-events-none, so they can never take a
          click meant for the header above them. They sit on
          --z-geometry, under the header's --z-nav, so the logo, links
          and CTA all stay above and clickable. */}
      {BELLS.map(({ at, size }) => (
        <img
          key={at}
          data-bell
          src={IMAGES.bell.file}
          alt=""
          aria-hidden
          decoding="async"
          /* Held back to 55%: at full strength the bells competed with
             the nav sitting right between them. They are decoration
             and should sit behind the reading, not beside it. */
          /* Hidden below sm. On a phone the header already fills that
             strip with the logo and the Book ticket button, and a pair
             of bells behind them reads as clutter rather than as
             decoration. `hidden` also keeps the image request off the
             mobile critical path entirely. */
          className={`pointer-events-none absolute top-0 hidden origin-top opacity-55 sm:block ${size} ${at}`}
          style={{ zIndex: "var(--z-geometry)" }}
        />
      ))}

      <div
        /* The top padding clears the fixed header, which is not in the
           flow and so reserves no space of its own. It stands 112px
           tall (an 88px logo window plus py-3), and without room set
           aside for it the copy rendered underneath the nav links and
           read as part of the bar. 144px leaves a clear gap.

           The container is wide and the columns uneven (1.5fr / 1fr)
           to buy the flipbook room. That matters more than it looks:
           the book is a two-page SPREAD, so its column has to hold
           twice a page's width, and it asks for 90vh. On a 1080-tall
           screen that is 972px, so anything narrower crops the book's
           height rather than its width. 1.5fr of a 1664px container
           gives about 936px — near enough that the spread lands close
           to the 60vh it wants. */
        className="relative mx-auto grid w-full max-w-416 items-center gap-10 px-5 pt-32 pb-20 sm:px-10 sm:pt-36 sm:pb-24 lg:grid-cols-[1.5fr_1fr] lg:gap-6"
        style={{ zIndex: "var(--z-content)" }}
      >
        {/* THE COPY. First in the DOM so it leads the reading order on
            a phone; order-1 on desktop puts the book back on the left
            where the design wants it. */}
        <div data-slide className="order-1 lg:order-2 lg:pl-6">
          <h1 className="font-display text-[clamp(2.6rem,5.2vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ivory">
            Ten nights.
            <br />
            One circle.
          </h1>

          <p className="display-type mt-6 text-[clamp(1.15rem,2.2vw,1.7rem)] text-mukut italic">
            Where heritage meets celebration.
          </p>

          <p className="mt-5 max-w-[46ch] text-[clamp(1rem,1.25vw,1.15rem)] leading-[1.7] font-light text-ivory/60">
            Music, garba, dandiya and devotion, ten nights running — the
            ground fills, the dhol starts, and tradition and celebration
            stop being two separate things.
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <button
              type="button"
              onClick={openTickets}
              data-cursor="cta"
              className="cta-label cursor-pointer rounded-full border border-mukut bg-mukut px-7 py-3.5 text-obsidian transition-colors duration-500 hover:border-gold hover:bg-gold"
            >
              Book your passes →
            </button>
            <a
              href="#gallery"
              className="label rounded-full border border-antique/45 px-7 py-3.5 text-ivory/85 transition-colors duration-500 hover:border-mukut hover:text-mukut"
            >
              Explore the lineup →
            </a>
          </div>

          {/* The facts. A hairline between columns rather than boxes —
              divide-x only paints BETWEEN children, so it needs no
              last-child exception. */}
          <dl
           
            className="mt-12 grid grid-cols-1 gap-y-6 border-t border-antique/20 pt-8 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-antique/20"
          >
            {FACTS.map(({ Icon, head, sub }) => (
              /* The doubled type is a DESKTOP size. A phone shows these
                 stacked one per row at full width, where 1.75rem reads
                 as a heading rather than a detail and the three of them
                 push the CTAs off the screen — so the sm: step is where
                 the size lives, and the base stays close to what it was.
                 Padding is trimmed from px-5 for the same reason it was
                 before: at 1.75rem the three columns need every pixel
                 of their ~160px of content width. */
              <div key={head} className="sm:px-3 sm:first:pl-0 sm:last:pr-0">
                <Icon className="mb-2 h-5 w-5 text-mukut sm:mb-3 sm:h-8 sm:w-8" aria-hidden strokeWidth={1.6} />
                {/* text-balance so a line that has to wrap splits
                    evenly rather than leaving one orphaned word. */}
                <dt className="text-base leading-tight text-balance text-ivory sm:text-[1.75rem]">{head}</dt>
                <dd className="mt-1 text-[0.8rem] tracking-[0.12em] uppercase text-ivory/45 sm:mt-2 sm:text-[1.36rem]">
                  {sub}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* THE BOOK — the gallery photographs, bound and turnable. This
            replaced the couple photo that stood here; that file is
            still in public/assets if it is ever wanted back. */}
        <div data-slide className="order-2 lg:order-1">
          <GalleryFlip />
        </div>
      </div>
    </section>
  );
}
