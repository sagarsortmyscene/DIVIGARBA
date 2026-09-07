import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND, GALLERY, IMAGES } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";
import { useMediaQuery, useReducedMotion } from "../../hooks/useMediaQuery";

/** How long a page is held before it turns itself. */
const AUTO_MS = 3800;

/**
 * The hero's left-hand visual: the gallery photographs bound as a book
 * you turn. Drag a corner, or use the arrows.
 *
 * react-pageflip measures its children, so every page has to be a real
 * element that accepts a ref — hence plain <div>s rather than a
 * component per page. It also needs a definite box: `size="stretch"`
 * fills whatever the parent gives it, and width/height set the page
 * RATIO that the min/max pairs are then clamped against.
 */
export function GalleryFlip() {
  const bookRef = useRef(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  /* A real pointer, not a touch screen. Gates the hover-pause below. */
  const hover = useMediaQuery("(hover: hover) and (pointer: fine)");

  /* pageFlip() is the imperative handle the library exposes. It does
     not exist until the book has mounted and measured, so every call
     goes through the optional chain rather than assuming it is there. */
  const flip = (dir) => {
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    if (dir < 0) api.flipPrev();
    else api.flipNext();
  };

  /* Turns itself. Three things worth noting:
     - at the back cover it uses turnToPage(0) rather than flip(0),
       because flipping back animates every page in reverse; this cuts
       straight to the closed book and the loop stays even.
     - on a device with a real pointer it stops while the cursor is
       over the book, so it never yanks a page out from under someone
       reading or mid-drag.
     - on TOUCH it never pauses, and that is the point: a tap fires
       pointerenter with no pointerleave to follow it, so the pause
       latched on and the book simply stopped turning after the first
       touch. `hover` gates the handlers off entirely there. */
  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => {
      const api = bookRef.current?.pageFlip?.();
      if (!api) return;
      if (api.getCurrentPageIndex() >= api.getPageCount() - 1) api.turnToPage(0);
      else api.flipNext();
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [reduced, paused]);

  /* A CLOSED book only fills half its own box, and page-flip puts that
     half on a different side at each end. From its showSpread():

       two pages      -> left = a, right = b        (fills the box)
       last page      -> left = a, right = null     (sits in the LEFT half)
       front cover    -> left = null, right = a     (sits in the RIGHT half)

     So while shut the book reads as shoved off to one side. Sliding
     the box a quarter of its width the other way puts the visible page
     back in the middle, and the transition means it glides into the
     full spread as the cover opens rather than jumping.

     lg-only: below that the book is in portrait, where a single page
     already fills the box and there is nothing to correct.
     It goes on the BOOK, not on the wrapper around it. On the wrapper
     it moved the arrows and the counter by the same amount, so the
     page and the controls kept their offset and the row ended up
     sitting off to one side of the page it belongs to. Shifting only
     the book brings its visible page to the wrapper's centre, which is
     where the controls already are.
     Safe as a transform because page-flip reads pointer positions from
     getBoundingClientRect, which includes it — drag stays accurate. */
  const LAST = GALLERY.length + 2;
  const recentre =
    page === 0 ? "lg:-translate-x-1/4" : page >= LAST ? "lg:translate-x-1/4" : "";

  return (
    /* WIDTH here is a request for a HEIGHT, and it must cover BOTH
       pages. From page-flip's own stretch maths:

         portrait if  blockWidth < 2 * minWidth   (single page)
         pageWidth = blockWidth / 2               (landscape)
         height    = pageWidth / 0.75

       So a 60vh-tall spread needs a 45vh page, and the parent has to
       be 2 x that: 90vh. The previous 45vh asked for the SPREAD to be
       45vh, which made each page 22.5vh — and worse, 486px on a
       1080 screen fell under the 560px portrait threshold (2 x the
       280 minWidth), so the book collapsed to one page and the left
       page disappeared.

       max-w-full because 90vh can exceed the grid column on a tall
       screen; the book then fills the column instead and comes out a
       little under 60vh, which is the right way to lose that argument.
       No explicit height: the parent's auto height is already larger
       than the book wants, and pinning one risks the blockHeight clamp
       on the last line above shrinking the pages instead.
       Below lg the parent stays w-full, so a phone is untouched — it
       is under the threshold and shows a single page, as it did. */
    <div
      className="mx-auto w-full lg:w-[90vh] lg:max-w-full"
      onPointerEnter={hover ? () => setPaused(true) : undefined}
      onPointerLeave={hover ? () => setPaused(false) : undefined}
    >
      <HTMLFlipBook
        ref={bookRef}
        /* 900x1200 — ratio 0.750, which is deliberately the exact
           shape of divibg-mobile.jpg (1875x2500) on the cover page
           below, so that image fills its page with no letterbox.

           These are a RATIO and a ceiling, not a fixed size:
           size="stretch" fills the parent column and clamps to the
           min/max pairs, so the column is what actually decides the
           rendered size. To reach a true 900px wide the book's column
           has to be at least 900px, which needs a container around
           1760px — see the note on the grid in HomeHero for what it
           lands at instead. */
        width={900}
        height={1200}
        size="stretch"
        minWidth={280}
        maxWidth={900}
        minHeight={373}
        maxHeight={1200}
        maxShadowOpacity={0.5}
        /* Starts and ends CLOSED. With this off, the cover was just
           another leaf in a two-page spread — it sat open beside the
           first photograph from the very first frame. On, the pages
           marked data-density="hard" below are treated as boards: the
           book opens on the front cover alone, spreads through the
           photographs, and shuts on the back cover. */
        showCover={true}
        /* Lets a vertical swipe that starts on a page scroll the page
           instead of being swallowed as a drag. */
        mobileScrollSupport
        /* Drag-to-turn with a mouse, not click-only. */
        useMouseEvents
        onFlip={(e) => setPage(e.data)}
        className={`mx-auto transition-transform duration-500 ease-out ${recentre}`}
      >
        {/* THE FRONT COVER. `data-density="hard"` is what makes this a
            board rather than a leaf — it is the flag showCover reads
            to keep the book shut on it.
            object-contain, as asked, and because its ratio matches the
            page exactly it still reaches every edge: contain costs
            nothing here and guarantees the artwork is never cropped if
            either shape changes. No caption — the creative carries its
            own type. */}
        <div key="cover" data-density="hard" className="overflow-hidden bg-maroon">
          <img
            src={IMAGES.cover.file}
            alt={IMAGES.cover.alt}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>

        {/* PAGE 02 — the first thing you see once the book opens.
            A soft leaf, not a board, so it turns like a page.

            object-cover, as asked. Worth knowing what it costs: the
            creative is 414x896 (ratio 0.462) against a 0.75 page, so
            filling the page means losing 38% of the image's HEIGHT.
            objectPosition pins it to the top, because the mark sits in
            the upper part of these gate crops — centred, cover would
            take the bite out of both ends and clip it. The blurred
            side-fill that stood behind the contained version is gone
            with it; cover leaves no gap to fill. */}
        <div key="gate" className="overflow-hidden bg-maroon">
          <img
            src={IMAGES.opening.file}
            alt={IMAGES.opening.alt}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        </div>

        {GALLERY.map((shot) => (
          <div key={shot.file} className="overflow-hidden bg-maroon">
            <div className="relative h-full w-full">
              <img
                src={shot.file}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: shot.focal || "center" }}
              />
              {/* The caption needs a floor to sit on — over a photograph
                  alone, light frames swallow it. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{ background: "linear-gradient(180deg, transparent, rgba(7,5,4,0.88))" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="label text-mukut">{shot.n}</span>
                <p className="display-type mt-1 text-xl text-ivory">{shot.title}</p>
              </div>
            </div>
          </div>
        ))}

        {/* THE BACK COVER — also a board, so the book shuts on it
            instead of ending on a half-open spread. The mark on the
            house ground rather than a tenth photograph: a back cover
            that looks like a page reads as a missing page. */}
        <div key="back-cover" data-density="hard" className="overflow-hidden bg-temple">
          {/* The centring lives on an INNER div, the way the photo
              pages do it. page-flip owns the layout of the page element
              itself, so flex rules set there do not take — which is
              what left this mark parked in the top-left corner. */}
          <div className="flex h-full w-full items-center justify-center">
            <img
              src={BRAND.logo}
              alt={EVENT_CONFIG.brandLine}
              loading="lazy"
              decoding="async"
              className="w-1/2 object-contain opacity-90"
            />
          </div>
        </div>
      </HTMLFlipBook>

      {/* Arrows and a count. A drag-to-turn corner is not discoverable
          on its own, and on a touch screen it competes with scrolling —
          these make the book usable without either. */}
      <div className="mt-5 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => flip(-1)}
          aria-label="Previous page"
          className="cursor-pointer rounded-full border border-antique/40 p-2.5 text-ivory/75 transition-colors hover:border-mukut hover:text-mukut"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        </button>

        {/* +3: two covers and the opening page. */}
        <span className="label text-ivory/45 tabular-nums">
          {String(page + 1).padStart(2, "0")} / {String(GALLERY.length + 3).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={() => flip(1)}
          aria-label="Next page"
          className="cursor-pointer rounded-full border border-antique/40 p-2.5 text-ivory/75 transition-colors hover:border-mukut hover:text-mukut"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
