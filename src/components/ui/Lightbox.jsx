import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Media } from "./Media";
import { SIZES } from "../../data/images";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * Tap a plate and it flips forward into the middle of the screen.
 * A fast Y-axis flip — the card turns to face you rather than
 * simply fading up, which is what makes it read as a physical plate.
 */
export function Lightbox({ shot, onClose }) {
  const cardRef = useRef(null);
  const backRef = useRef(null);
  const reduced = useReducedMotion();

  /* Held in a ref so the effect below can run ONCE per mount. Keyed on
     `onClose` it re-ran on every parent render, and each re-run
     captured the already-locked "hidden" as the value to restore — so
     closing put that back and left the page unscrollable, which reads
     as the close button doing nothing. */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  /* Esc closes; scroll is locked while open. The body class hides the
     header's Book ticket button for as long as this is up — it and the
     Close button would otherwise sit stacked in the same corner, and
     only Close is meaningful while a photo is open. CSS does it rather
     than lifting state to App, since nothing else needs to know. */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove("lightbox-open");
    };
  }, []);

  useGSAP(
    () => {
      if (reduced) {
        gsap.set([backRef.current, cardRef.current], { opacity: 1, rotateY: 0, scale: 1 });
        return;
      }
      gsap
        .timeline()
        .fromTo(backRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" }, 0)
        .fromTo(
          cardRef.current,
          { rotateY: -94, scale: 0.62, opacity: 0 },
          { rotateY: 0, scale: 1, opacity: 1, duration: 0.62, ease: "power3.out" },
          0.04
        );
    },
    { dependencies: [shot?.file] }
  );

  if (!shot) return null;

  /* Rendered into <body>, not in place. Gallery sits inside <main>,
     which has position:relative + z-index:50 and therefore opens a
     stacking context — so this dialog's z-index only ever competed
     INSIDE that context, while the fixed header (a sibling of main, at
     z-index 70) painted over the whole thing. The header has no
     background and is as tall as the docked logo, so it was an
     invisible full-width strip across the top swallowing the clicks
     meant for Close. A portal puts the dialog above the page entirely,
     which is where a modal belongs. */
  return createPortal(
    <div
      className="fixed inset-0 grid place-items-center p-5 sm:p-10"
      style={{ zIndex: "var(--z-loader)", perspective: "1600px" }}
      role="dialog"
      aria-modal="true"
      aria-label={shot.title}
    >
      <button
        ref={backRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 cursor-zoom-out bg-obsidian/92 backdrop-blur-sm"
      />

      {/* Column flex, and the two children carry the whole fix for short
          laptop viewports (roughly 1200-1400px wide but under ~800px tall):
          - `w-full` on the media box keeps its width definite, so when
            max-height clamps it the aspect-ratio can only give up height.
            Without it the ratio shrank the WIDTH to match the clamped
            height, leaving a band of dead maroon down the right side.
          - the caption is `shrink-0` and the media box may shrink, so the
            figure's own max-height is paid for out of the image instead
            of clipping the title and line off the bottom. */}
      <figure
        ref={cardRef}
        className="frame-ancient frame-pips relative flex max-h-[86svh] w-[min(92vw,760px)] flex-col bg-maroon will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative aspect-3/4 max-h-[74svh] w-full min-h-0 shrink overflow-hidden sm:aspect-4/3">
          <Media image={shot} sizes={SIZES.full} priority />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(53,10,8,0.22), transparent 42%, rgba(7,5,4,0.78))" }}
          />
          <span className="display-type absolute top-5 left-6 text-[clamp(2rem,4vw,3rem)] leading-none text-mukut">
            {shot.n}
          </span>
        </div>

        <figcaption className="shrink-0 px-6 pt-4 pb-5">
          <h3 className="display-type text-2xl text-ivory">{shot.title}</h3>
          <p className="mt-1 text-sm text-ivory/60">{shot.line}</p>
        </figcaption>
      </figure>

      <button
        type="button"
        onClick={onClose}
        className="label absolute top-6 right-6 cursor-pointer rounded-full border border-antique/40 bg-obsidian/80 px-4 py-2 text-mukut transition-colors hover:bg-mukut hover:text-obsidian"
        style={{ zIndex: 3 }}
      >
        Close
      </button>
    </div>,
    document.body
  );
}