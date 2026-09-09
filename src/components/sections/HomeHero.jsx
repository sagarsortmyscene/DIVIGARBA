import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Calendar, MapPin, Music } from "lucide-react";
import { IMAGES } from "../../data/images";
import { GalleryFlip } from "./GalleryFlip";
import { EVENT_CONFIG } from "../../data/event";
import { useMediaQuery, useReducedMotion } from "../../hooks/useMediaQuery";

/* The three facts that belong above the fold. Data, not markup, so the
   row is one map instead of three near-identical blocks.

   Times and the venue name are read from EVENT_CONFIG rather than
   typed again here — they were duplicated, so changing the gate time
   in one place used to leave this row saying something else. The date
   stays written out because this is the one spot that wants the short
   "Oct" form; everywhere else prints the full month. */
const FACTS = [
  { Icon: Calendar, head: "11 — 20 Oct 2026", sub: "Ten nights" },
  { Icon: MapPin,   head: EVENT_CONFIG.venueName, sub: "Vaishnodevi Circle" },
  {
    Icon: Music,
    head: "Live garba · dhol",
    sub: `From ${EVENT_CONFIG.gateEntry} · Last entry ${EVENT_CONFIG.entryCloses}`,
  },
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
/* One bell now, on the right. The left one is gone — the header's
   top-left corner carries the Divi and Panchatva marks, and a bell
   hanging behind them was competing with the thing it framed.
   Kept as an array rather than collapsed to a single object so the
   GSAP loop, the mirroring and the render below all stay unchanged,
   and a second bell is one entry away. */
const BELLS = [
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

  /* Wide enough for the two-column layout, but short. This is the same
     condition GalleryFlip uses to drop the book to 70%, so there is one
     idea of "short desktop" rather than two thresholds that could drift
     apart. Read in JS rather than as a stacked Tailwind variant because
     it changes the MARKUP below — icon beside the text instead of above
     it — not just a class. */
  const shortDesktop = useMediaQuery("(min-width: 1024px) and (max-height: 849px)");

  /* The copy column is narrow whenever it is beside the book and the
     screen is not large: 360px at 1024, 470px at 1280, 534px at 1440.
     Three facts across any of those is cramped, so they take the same
     compact one-per-line form the short screens use. Only from 2xl,
     where the column reaches ~573px, does the row fit again. */
  const compactFacts =
    useMediaQuery("(min-width: 1024px) and (max-width: 1535px)") || shortDesktop;

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
          /* Hidden below 1300px. The header now carries two marks
             plus the nav and the CTA, and under that width the bells
             sit behind them rather than beside them. `hidden` rather
             than an opacity fade so the browser never requests the
             image on those screens at all. */
          className={`pointer-events-none absolute top-0 hidden origin-top opacity-55 min-[1300px]:block ${size} ${at}`}
          style={{ zIndex: "var(--z-geometry)" }}
        />
      ))}

      <div
        /* The top padding clears the fixed header, which is not in the
           flow and so reserves no space of its own. It stands 112px
           tall (an 88px logo window plus py-3), and without room set
           aside for it the copy rendered underneath the nav links and
           read as part of the bar. 144px leaves a clear gap.

           60 / 40 — the book's column against the copy's, written as
           3fr/2fr so the gap is taken out of the free space. A literal
           60%/40% pair plus a gap would total more than 100%.

           The column is a share of WIDTH while the book is capped by
           HEIGHT, so on a short screen the book cannot always fill its
           60% and a gap opens between the columns. That is the right
           way round. The alternative was sizing the container from the
           book instead, which removes the gap but at 1600x800 pinned
           the whole layout to 944px of a 1600px screen — a third of
           the width empty down each side. A gap inside a full-width
           layout reads as a gap; a narrow layout reads as broken. */
        className={`relative mx-auto grid w-full max-w-416 items-center gap-10 px-5 pt-32 pb-20 sm:px-10 lg:grid-cols-[minmax(560px,3fr)_2fr] lg:gap-6 ${
          shortDesktop ? "sm:pt-32 sm:pb-16" : "sm:pt-36 sm:pb-24"
        }`}
        style={{ zIndex: "var(--z-content)" }}
      >
        {/* THE COPY. First in the DOM so it leads the reading order on
            a phone; order-1 on desktop puts the book back on the left
            where the design wants it. */}
        {/* Order flips at lg, because the two layouts want opposite
            things.
            SIDE BY SIDE (lg and up) the book takes the left column, so
            it is order-1 and the copy order-2.
            STACKED (below lg) the copy leads. On a phone the book is a
            portrait page around 470px tall, and putting it first would
            push the heading and the Book your passes button below the
            fold before anything has been read.
            Stacked also matches DOM order, so on a phone what a screen
            reader hears and what you see are the same. */}
        <div data-slide className="order-1 min-w-0 lg:order-2 lg:pl-6">
          {/* Gujarati, so this is set in Anek and NOT in the display
              face: Sregs Serif has no Gujarati glyphs at all, and its
              unicode-range does not claim the block, so `font-display`
              would silently fall through per character.

              Two settings differ from the Latin heading that was here:
              line-height is 1.35 rather than 0.98, because Gujarati
              carries matras above and below the baseline and a tight
              display leading clips them; and the -0.02em tracking is
              gone, since negative letter-spacing pulls conjuncts into
              each other. `lang` so screen readers and the browser's
              own shaping treat it as Gujarati.

              The xl-only <br /> went with the old copy — this is one
              short phrase and needs no break. */}
          <h1
            lang="gu"
            className="font-ui text-[clamp(2.2rem,4vw,5rem)] leading-[1.35] text-ivory"
          >
            સાંજથી પરોઢ
          </h1>

          <p className="display-type mt-5 text-[clamp(1.05rem,1.7vw,1.55rem)] text-mukut italic">
            Where heritage meets celebration.
          </p>

          <p className="mt-4 max-w-[46ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.65] font-light text-ivory/60">
            Music, garba, dandiya and devotion, ten nights running — the
            ground fills, the dhol starts, and tradition and celebration
            stop being two separate things.
          </p>

          {/* nowrap from xl. Below that they may wrap, which is right on a
              phone where two full-width buttons cannot share a row. At
              xl the column is only ~470px, so the padding and tracking
              below are cut back to keep both on one line; 2xl has the
              room to go back to full size. */}
          <div className="mt-7 flex flex-wrap gap-3 xl:flex-nowrap 2xl:mt-9 2xl:gap-3.5">
            <button
              type="button"
              onClick={openTickets}
              data-cursor="cta"
              className="cursor-pointer rounded-full border border-mukut bg-mukut px-5 py-3 text-[0.62rem] font-bold tracking-[0.16em] whitespace-nowrap uppercase text-obsidian transition-colors duration-500 hover:border-gold hover:bg-gold 2xl:px-7 2xl:py-3.5 2xl:text-label 2xl:tracking-[0.28em]"
            >
              Book your passes →
            </button>
            <a
              href="#gallery"
              className="rounded-full border border-antique/45 px-5 py-3 text-[0.62rem] tracking-[0.16em] whitespace-nowrap uppercase text-ivory/85 transition-colors duration-500 hover:border-mukut hover:text-mukut 2xl:px-7 2xl:py-3.5 2xl:text-label 2xl:tracking-[0.28em]"
            >
              Explore the lineup →
            </a>
          </div>

          {/* The facts. A hairline between columns rather than boxes —
              divide-x only paints BETWEEN children, so it needs no
              last-child exception. */}
          {/* Three across normally; a stacked list on a wide-but-SHORT
              screen. On those the book shrinks to 70%, which leaves the
              copy column very wide, and three facts spread across it
              read as drifting off to the side rather than as a row.

              Stacked, each fact turns into a single compact line —
              icon beside the text instead of above it. That matters:
              keeping the icon-on-top block and merely stacking them
              would make this group about 265px tall, taller than the
              row it replaced, which is the wrong direction on a screen
              that is short to begin with. Inline it is ~150px. */}
          <dl
            className={`grid border-t border-antique/20 2xl:mt-12 2xl:pt-8 ${shortDesktop ? "mt-6 pt-5" : "mt-8 pt-6"} ${
              compactFacts
                ? "grid-cols-1 gap-y-4"
                : "grid-cols-1 gap-y-5 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-antique/20"
            }`}
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
                  {/* text-balance so a line that has to wrap splits
                      evenly rather than leaving one orphaned word. */}
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

        {/* THE BOOK — the gallery photographs, bound and turnable. This
            replaced the couple photo that stood here; that file is
            still in public/assets if it is ever wanted back. */}
        <div data-slide className="order-2 min-w-0 lg:order-1">
          <GalleryFlip />
        </div>
      </div>
    </section>
  );
}
