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

  /* 600px is page-flip's own portrait/landscape line here: below it the
     content width falls under 2 x minWidth and the book shows a single
     page. The film is two half-pages on a spread and ONE full page
     below that, so the page count changes with it — every index in
     this component is derived from `videoPages` rather than written
     out, so the two modes cannot fall out of step. */
  const spread = useMediaQuery("(min-width: 600px)");
  const videoPages = spread ? 2 : 1;

  /* The film sits directly after the cover, so it occupies indices 1
     to `videoPages`. In landscape getCurrentPageIndex reports the
     FIRST page of the open spread, so 1 covers the pair; in portrait
     there is only index 1 to match. */
  const videoRefs = useRef([]);
  const onFilmSpread = page >= 1 && page <= videoPages;

  /* Two separate elements can drift, and at the gutter a few frames of
     difference is visible as a torn seam. The left half drives: on each
     of its time updates the right one is nudged back into line, but
     only past a threshold — assigning currentTime every tick would
     stutter the playback it is meant to fix. */
  const syncHalves = () => {
    const [l, r] = videoRefs.current;
    if (!l || !r) return;
    if (Math.abs(r.currentTime - l.currentTime) > 0.08) r.currentTime = l.currentTime;
  };

  /* Whether the clip is genuinely running. The hold on the page-turn
     timer is DERIVED from it rather than being its own state — being
     on the spread is already known, so storing both would mean keeping
     two things in step, and clearing one of them on the way out is the
     synchronous setState-in-effect that lint rightly objects to. */
  const [filmPlaying, setFilmPlaying] = useState(false);
  const filmHolding = onFilmSpread && filmPlaying;

  /* Plays only while that spread is open, and restarts each time it
     opens. preload="none" on the elements means the 16MB is not
     fetched at all until this fires.

     The hold is set from the play() PROMISE, not optimistically. If a
     browser refuses autoplay the clip never runs and never ends, so a
     hold taken on faith would stop the book on this spread for good.
     Resolving means it really is playing; rejecting leaves the hold
     off and the ordinary timer carries on turning pages. */
  useEffect(() => {
    const vids = videoRefs.current.filter(Boolean);
    if (!vids.length) return;

    /* No setState on the way out: filmHolding is gated on
       onFilmSpread, so leaving the spread releases the hold by
       itself. */
    if (!onFilmSpread) {
      for (const v of vids) v.pause();
      return;
    }

    let alive = true;
    for (const v of vids) v.currentTime = 0;
    const [lead, ...rest] = vids;
    lead
      .play()
      .then(() => alive && setFilmPlaying(true))
      .catch(() => alive && setFilmPlaying(false));
    for (const v of rest) v.play().catch(() => {});

    return () => {
      alive = false;
    };
  }, [onFilmSpread]);

  /* pageFlip() is the imperative handle the library exposes. It does
     not exist until the book has mounted and measured, so every call
     goes through the optional chain rather than assuming it is there. */
  const flip = (dir) => {
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    if (dir < 0) api.flipPrev();
    else api.flipNext();
  };

  /* The clip finished, so let the book go on. It flips straight away
     rather than releasing the hold and waiting out another 3.8s, which
     would read as the book stalling on a frozen last frame.
     Nothing happens here if the reader is hovering or has asked for
     less motion — releasing the hold is enough, and the timer picks it
     up on its own terms. */
  const handleFilmEnd = () => {
    setFilmPlaying(false);
    if (!reduced && !paused) flip(1);
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
       touch. `hover` gates the handlers off entirely there.
     - it also stands down while filmHolding is set, so the video
       spread is never cut off mid-clip. The ARROWS are untouched by
       any of this: they call flip() directly and always turn the page
       immediately, film or no film. */
  useEffect(() => {
    if (reduced || paused || filmHolding) return;
    const id = setInterval(() => {
      const api = bookRef.current?.pageFlip?.();
      if (!api) return;
      if (api.getCurrentPageIndex() >= api.getPageCount() - 1) api.turnToPage(0);
      else api.flipNext();
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [reduced, paused, filmHolding]);

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
  /* cover + film pages + gate + photographs + back cover. */
  const TOTAL = GALLERY.length + 3 + videoPages;
  const LAST = TOTAL - 1;
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

       The xl cap is 52vw, not max-w-full: its column is now "auto",
       so a percentage max-width would be measured against a column
       that is itself sized by this element. 52vw is absolute, keeps
       the book inside its half of the page, and lets 90vh win
       wherever there is room for it.
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
      className="mx-auto aspect-3/4 w-full max-w-[min(90vh,700px)] min-[600px]:aspect-3/2 xl:w-[90vh] xl:max-w-[52vw]"
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

        {/* THE FILM.

            On a SPREAD it runs across two pages: each holds the same
            clip at 200% of a page width, the left aligned left so its
            window shows the first half, the right pushed back a full
            page width so its window shows the second. Together they
            compose one continuous frame across the gutter — the same
            geometry the old temple gate used for its door panels.

            On a PHONE there is only ever one page on screen, so the
            second half is not rendered at all: half a frame beside
            nothing is meaningless, and an unused page would still take
            a turn of the book to get past. One page, object-cover, so
            the clip fills the full height.

            The count is deliberate. With showCover on, page-flip pairs
            everything after the cover, so two halves land as [1,2] —
            the first spread the book opens onto. One half lands at [1]
            alone. Everything downstream reads `videoPages` rather than
            a literal, so the page count and the last-page index follow
            automatically.

            Only the lead half carries onTimeUpdate and onEnded — one
            driver for the sync and for handing the book on. */}
        {(spread ? [0, 1] : [0]).map((half) => (
          <div key={`video-${half}`} className="relative overflow-hidden bg-obsidian">
            <video
              ref={(el) => {
                videoRefs.current[half] = el;
              }}
              src={IMAGES.video.file}
              aria-label={IMAGES.video.alt}
              muted
              playsInline
              preload="none"
              onTimeUpdate={half === 0 ? syncHalves : undefined}
              onEnded={half === 0 ? handleFilmEnd : undefined}
              className={`absolute top-0 left-0 h-full w-full max-w-none object-cover min-[600px]:w-[200%] ${
                half === 1 ? "min-[600px]:-left-full" : ""
              }`}
            />
          </div>
        ))}

        {/* PAGE 02 — the whole image, nothing cropped.

            This creative is 414x896 (ratio 0.462) against a 0.75 page,
            so the two shapes disagree and something has to give:
              object-cover  fills the page but cuts 38% of its HEIGHT
              object-contain shows all of it, leaving ~37% of the page
                             width empty down the sides
            Contain is the one that keeps the image complete, and the
            empty sides are filled by a cover-scaled, blurred copy of
            the same file sitting behind it — so the edges read as the
            artwork continuing rather than as bars. The blurred layer
            is aria-hidden; only the sharp one carries the alt text. */}
        <div key="gate" className="relative overflow-hidden bg-maroon">
          <img
            src={IMAGES.opening.file}
            alt=""
            aria-hidden
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
          />
          <img
            src={IMAGES.opening.file}
            alt={IMAGES.opening.alt}
            decoding="async"
            className="relative h-full w-full object-contain"
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

        {/* TOTAL follows videoPages, so this reads 14 on a spread and
            13 on a phone without a second literal to keep in step. */}
        <span className="label text-ivory/45 tabular-nums">
          {String(page + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
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
