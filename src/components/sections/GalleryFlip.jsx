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

     xl-only, matching the grid: below that the book is full width and
     the correction does not apply.
     It goes on the BOOK, not on the wrapper around it. On the wrapper
     it moved the arrows and the counter by the same amount, so the
     page and the controls kept their offset and the row ended up
     sitting off to one side of the page it belongs to. Shifting only
     the book brings its visible page to the wrapper's centre, which is
     where the controls already are.
     Safe as a transform because page-flip reads pointer positions from
     getBoundingClientRect, which includes it — drag stays accurate. */
  const LAST = GALLERY.length + 1;
  const recentre =
    page === 0 ? "xl:-translate-x-1/4" : page >= LAST ? "xl:translate-x-1/4" : "";

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
       Below xl the parent is w-full and the layout is stacked, so the
       book is capped at min(90vh, 700px) and centred. Without that cap
       it took the FULL content width when stacked — about 1199px at
       1279 wide — and then shrank to 808 the moment the layout went
       two-column at 1280. The cap keeps the two sides of that
       breakpoint within a few percent of each other.
       A tablet still gets a spread; a phone drops under 560 and gets a
       single page.

       The split moved from lg to xl deliberately. At lg (1024) the
       book's column worked out at 552px — four pixels under the 560
       portrait threshold — so the book collapsed to ONE page at
       exactly the width the layout went two-column. At xl the column
       is 706px and clears it. */
    <div
      /* The aspect ratio is what keeps the arrows below the book.
         page-flip lays its pages out absolutely, so this box does not
         grow to fit them — it was falling back to the 373px minHeight
         while a portrait page rendered 427px tall at 360 wide, and the
         controls row started 54px INSIDE the photograph. The narrower
         the phone the worse it got, which is why 412 looked fine and
         390 and 360 did not.

         The two ratios are page-flip's own maths, not a guess:
           portrait  page = blockWidth,     height = w / 0.75  -> 3/4
           landscape page = blockWidth / 2, height = w / 1.5   -> 3/2
         so the box now reserves exactly the height the book draws, and
         the `height > blockHeight` clamp inside page-flip never fires.

         The switch is at 600px, not at `sm`, because that is the real
         boundary: below 600 the content width falls under the 560px
         (2 x minWidth) portrait threshold. */
      className="mx-auto aspect-3/4 w-full max-w-[min(90vh,700px)] min-[600px]:aspect-3/2 xl:w-[90vh] xl:max-w-full"
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
      {/* Extra room below on a phone. The controls sit right on the
          bottom edge of the book there, and the section's own padding
          is the only thing under them — so they read as crowded against
          whatever follows. `sm:` returns it to the tighter desktop
          spacing, where the layout already has air around it. */}
      <div className="mt-6 mb-10 flex items-center justify-center gap-5 sm:mt-5 sm:mb-0">
        <button
          type="button"
          onClick={() => flip(-1)}
          aria-label="Previous page"
          className="cursor-pointer rounded-full border border-antique/40 p-2.5 text-ivory/75 transition-colors hover:border-mukut hover:text-mukut"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        </button>

        {/* +2 for the two covers, which count as pages here. */}
        <span className="label text-ivory/45 tabular-nums">
          {String(page + 1).padStart(2, "0")} / {String(GALLERY.length + 2).padStart(2, "0")}
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
