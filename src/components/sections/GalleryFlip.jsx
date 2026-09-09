import { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND, IMAGES, INSTALLATIONS } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";
import { useMediaQuery, useReducedMotion } from "../../hooks/useMediaQuery";

/** How long a still page is held before it turns itself. */
const AUTO_MS = 3800;

/**
 * The hero's left-hand visual: the book you turn. Drag a corner, or use
 * the arrows.
 *
 * react-pageflip measures its children, so every page has to be a real
 * element that accepts a ref — hence plain <div>s rather than a
 * component per page. It also needs a definite box: `size="stretch"`
 * fills whatever the parent gives it, and width/height set the page
 * RATIO that the min/max pairs are then clamped against.
 *
 * THE RUNNING ORDER is built as data below rather than written out as
 * JSX, because page-flip pairs pages by INDEX — with showCover on it
 * takes the cover alone and then pairs everything after it, so [1,2],
 * [3,4], [5,6] and so on. Getting a reel onto the left of a spread and
 * a photograph onto its right is entirely a question of which index
 * each lands on, and hand-counting that in markup is how it breaks the
 * next time a page is added.
 */
function buildPages(spread) {
  const pages = [{ kind: "cover" }];

  if (spread) {
    /* The opening film runs ACROSS a spread: two halves of one clip,
       which is why it is two pages rather than one. */
    pages.push({ kind: "film", half: 0 }, { kind: "film", half: 1 });
  } else {
    /* One page at a time on a phone, so half a frame is meaningless. */
    pages.push({ kind: "film", half: 0, whole: true });
  }

  /* Then a reel on the LEFT of a spread with an installation shot on
     its RIGHT, twice. On a phone there are no spreads, so they simply
     alternate reel, photo, reel, photo — same order, read singly. */
  pages.push({ kind: "reel", src: IMAGES.reelOne });
  pages.push({ kind: "photo", image: INSTALLATIONS[0] });
  pages.push({ kind: "reel", src: IMAGES.reelTwo });
  pages.push({ kind: "photo", image: INSTALLATIONS[1] });

  /* The rest of the installations. */
  for (const image of INSTALLATIONS.slice(2)) pages.push({ kind: "photo", image });

  /* The back cover must end up ALONE, or page-flip pairs it with the
     last photograph and the book never shuts on it. Its createSpread
     walks the pages after the cover two at a time and only leaves the
     final one alone when there is an ODD number of them — so the count
     BEFORE adding the back cover has to be even, and a blank leaf goes
     in when it is not.

     Only in spread mode. In portrait every page stands alone anyway,
     so the same blank would just be an empty page to swipe past. */
  if (spread && (pages.length - 1) % 2 === 1) pages.push({ kind: "blank" });

  pages.push({ kind: "back" });
  return pages;
}

export function GalleryFlip() {
  const bookRef = useRef(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  /* A real pointer, not a touch screen. Gates the hover-pause below. */
  const hover = useMediaQuery("(hover: hover) and (pointer: fine)");

  /* 600px is page-flip's own portrait/landscape line here: below it the
     content width falls under 2 x minWidth and the book shows a single
     page. The running order differs between the two, so it is rebuilt
     when this flips rather than being a constant. */
  const spread = useMediaQuery("(min-width: 600px)");
  const pages = useMemo(() => buildPages(spread), [spread]);

  /* Which indices carry a moving picture, worked out from the running
     order rather than written down. In landscape getCurrentPageIndex
     reports the FIRST page of the open spread, so a clip on the left of
     a spread is found at its own index; the opening film's second half
     shares its spread with the first and never reports separately. */
  const videoRefs = useRef([]);
  const videoAt = useMemo(() => {
    const map = new Map();
    pages.forEach((p, i) => {
      if (p.kind === "film" && p.half === 0) map.set(i, "film");
      if (p.kind === "reel") map.set(i, "reel");
    });
    return map;
  }, [pages]);

  /* The open spread's clip, if it has one. A spread starts on an even
     offset from the cover, so the page index reported IS the left page
     — which is exactly where every reel sits. */
  const activeVideo = videoAt.has(page) ? page : null;

  /* Two elements make up the opening film and they can drift apart; at
     the gutter a few frames of difference shows as a torn seam. The
     left half drives, and the right is nudged back into line only past
     a threshold — assigning currentTime every tick would stutter the
     playback it is meant to fix. */
  const syncHalves = () => {
    const [l, r] = videoRefs.current;
    if (!l || !r) return;
    if (Math.abs(r.currentTime - l.currentTime) > 0.08) r.currentTime = l.currentTime;
  };

  /* Whether a clip is genuinely running. The hold on the page-turn
     timer is DERIVED from it rather than being its own state — being on
     a video page is already known, so storing both would mean keeping
     two things in step. */
  const [filmPlaying, setFilmPlaying] = useState(false);
  const filmHolding = activeVideo !== null && filmPlaying;

  /* Plays only while its page is open, and restarts each time it opens.
     preload="none" on the elements means none of the clips are fetched
     until this fires.

     The hold is set from the play() PROMISE, not optimistically. If a
     browser refuses autoplay the clip never runs and never ends, so a
     hold taken on faith would stop the book on that page for good.
     Resolving means it really is playing; rejecting leaves the hold off
     and the ordinary timer carries on turning pages. */
  useEffect(() => {
    const vids = videoRefs.current.filter(Boolean);
    if (!vids.length) return;

    for (const v of vids) {
      if (v.dataset.index !== String(activeVideo)) v.pause();
    }

    /* No setState on the way out: filmHolding is gated on activeVideo,
       so leaving the page releases the hold by itself. */
    if (activeVideo === null) return;

    let alive = true;
    const playing = vids.filter((v) => v.dataset.index === String(activeVideo));
    for (const v of playing) v.currentTime = 0;
    const [lead, ...rest] = playing;
    lead
      ?.play()
      .then(() => alive && setFilmPlaying(true))
      .catch(() => alive && setFilmPlaying(false));
    for (const v of rest) v.play().catch(() => {});

    return () => {
      alive = false;
    };
  }, [activeVideo]);

  /* page-flip measures its container once at mount and then ONLY
     re-measures on a window `resize` — it never watches the container
     itself. Anything that changes this box without changing the window
     leaves the book sized for a box that no longer exists, and since
     its pages are absolutely positioned they then spill past the bottom
     and sit over the arrows.

     The splash screen is exactly that case: it holds
     `document.body.style.overflow = "hidden"` for about two seconds,
     which removes the scrollbar and makes the page ~15px wider. The
     book mounts and measures inside that window; when the splash lifts
     the scrollbar comes back and the container narrows, with no resize
     event to notice it. Hence "wrong until you refresh".

     A ResizeObserver on the box closes that, and covers the rest of the
     same family for free: late fonts, the lg/spread switch, orientation
     changes, and the hero's slide-in. rAF-deferred because calling
     update() straight from the callback can retrigger the observer in
     the same frame. */
  const boxRef = useRef(null);
  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => bookRef.current?.pageFlip?.()?.update?.());
    });
    ro.observe(box);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

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

  /* Turns itself. Four things worth noting:
     - at the back cover it uses turnToPage(0) rather than flip(0),
       because flipping back animates every page in reverse; this cuts
       straight to the closed book and the loop stays even.
     - on a device with a real pointer it stops while the cursor is over
       the book, so it never yanks a page out from under someone reading
       or mid-drag.
     - on TOUCH it never pauses, and that is the point: a tap fires
       pointerenter with no pointerleave to follow it, so the pause
       latched on and the book simply stopped turning after the first
       touch. `hover` gates the handlers off entirely there.
     - it stands down while filmHolding is set, so no clip is ever cut
       off part-way. The ARROWS are untouched by any of this: they call
       flip() directly and always turn the page immediately. */
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

       two pages   -> left = a, right = b        (fills the box)
       last page   -> left = a, right = null     (sits in the LEFT half)
       front cover -> left = null, right = a     (sits in the RIGHT half)

     So while shut the book reads as shoved off to one side. Sliding the
     box a quarter of its width the other way puts the visible page back
     in the middle, and the transition means it glides into the full
     spread as the cover opens rather than jumping.

     It goes on the BOOK, not on the wrapper around it. On the wrapper
     it moved the arrows and the counter by the same amount, so the page
     and the controls kept their offset and the row ended up sitting off
     to one side of the page it belongs to.
     Safe as a transform because page-flip reads pointer positions from
     getBoundingClientRect, which includes it — drag stays accurate. */
  const LAST = pages.length - 1;
  const recentre =
    page === 0 ? "lg:-translate-x-1/4" : page >= LAST ? "lg:translate-x-1/4" : "";

  return (
    /* WIDTH here is a request for a HEIGHT, and it must cover BOTH
       pages. From page-flip's own stretch maths:

         portrait if  blockWidth < 2 * minWidth   (single page)
         pageWidth = blockWidth / 2               (landscape)
         height    = pageWidth / 0.75

       From lg the book FILLS its 60% column, capped so it can never run
       past the fold. That cap is derived rather than guessed:

         usable height = 100vh - 296px   (pt-36 + controls + pb-24)
         a 3:2 spread   = 1.5 x its height
         so max width   = calc(150vh - 444px)

       Below lg the parent is w-full and the layout is stacked, so the
       book is capped at min(90vh, 700px) and centred. */
    <div
      ref={boxRef}
      /* The aspect ratio is what keeps the arrows below the book.
         page-flip lays its pages out absolutely, so this box does not
         grow to fit them — it was falling back to the 373px minHeight
         while a portrait page rendered 427px tall at 360 wide, and the
         controls row started 54px INSIDE the photograph.

         The two ratios are page-flip's own maths, not a guess:
           portrait  page = blockWidth,     height = w / 0.75  -> 3/4
           landscape page = blockWidth / 2, height = w / 1.5   -> 3/2
         so the box reserves exactly the height the book draws, and the
         `height > blockHeight` clamp inside page-flip never fires.

         The switch is at 600px, not at `sm`, because that is the real
         boundary: below 600 the content width falls under the 560px
         (2 x minWidth) portrait threshold. */
      className="mx-auto aspect-3/4 w-full max-w-[min(90vh,700px)] min-[600px]:aspect-3/2 lg:w-full lg:max-w-[calc(150vh-444px)]"
      onPointerEnter={hover ? () => setPaused(true) : undefined}
      onPointerLeave={hover ? () => setPaused(false) : undefined}
    >
      <HTMLFlipBook
        ref={bookRef}
        /* 900x1200 — ratio 0.750, deliberately the exact shape of
           divibg-mobile.jpg on the cover, so that image fills its page
           with no letterbox. These are a RATIO and a ceiling, not a
           fixed size: size="stretch" fills the parent column. */
        width={900}
        height={1200}
        size="stretch"
        minWidth={280}
        maxWidth={900}
        minHeight={373}
        maxHeight={1200}
        maxShadowOpacity={0.5}
        /* Starts and ends CLOSED. The pages marked data-density="hard"
           below are treated as boards: the book opens on the front
           cover alone and shuts on the back cover. */
        showCover={true}
        /* Lets a vertical swipe that starts on a page scroll the page
           instead of being swallowed as a drag. */
        mobileScrollSupport
        /* Drag-to-turn with a mouse, not click-only. */
        useMouseEvents
        onFlip={(e) => setPage(e.data)}
        className={`mx-auto transition-transform duration-500 ease-out ${recentre}`}
      >
        {pages.map((p, i) => {
          if (p.kind === "cover") {
            /* `data-density="hard"` is what makes this a board rather
               than a leaf — the flag showCover reads to keep the book
               shut on it. object-contain, and because its ratio matches
               the page exactly it still reaches every edge. */
            return (
              <div key="cover" data-density="hard" className="overflow-hidden bg-maroon">
                <img
                  src={IMAGES.cover.file}
                  alt={IMAGES.cover.alt}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
            );
          }

          if (p.kind === "back") {
            /* Also a board, so the book shuts on it instead of ending
               on a half-open spread. The mark on the house ground
               rather than another photograph: a back cover that looks
               like a page reads as a missing page. */
            return (
              <div key="back" data-density="hard" className="overflow-hidden bg-temple">
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
            );
          }

          if (p.kind === "blank") {
            /* Only ever here to make the back cover land on the right
               index. See buildPages. */
            return <div key="blank" className="bg-maroon" aria-hidden />;
          }

          if (p.kind === "film") {
            /* The opening clip. On a spread it runs across two pages:
               each holds the same file at 200% of a page width, the
               left aligned left so its window shows the first half, the
               right pushed back a full page so its window shows the
               second. Together they compose one frame across the
               gutter — the geometry the old temple gate used for its
               door panels. On a phone (`whole`) it is one page. */
            const isRight = p.half === 1;
            return (
              <div key={`film-${p.half}`} className="relative overflow-hidden bg-obsidian">
                <video
                  ref={(el) => {
                    videoRefs.current[p.half] = el;
                    if (el) el.dataset.index = String(p.whole || !isRight ? i : i - 1);
                  }}
                  src={IMAGES.video.file}
                  aria-label={IMAGES.video.alt}
                  muted
                  playsInline
                  preload="none"
                  onTimeUpdate={!isRight ? syncHalves : undefined}
                  onEnded={!isRight ? handleFilmEnd : undefined}
                  className={`absolute top-0 left-0 h-full w-full max-w-none object-cover ${
                    p.whole ? "" : "min-[600px]:w-[200%]"
                  } ${isRight ? "min-[600px]:-left-full" : ""}`}
                />
              </div>
            );
          }

          if (p.kind === "reel") {
            /* A reel fills its own page — no gutter trick, because it
               is one page of a spread rather than spanning both.
               720x1280 against a 0.75 page, so cover trims about a
               quarter of the height; objectPosition holds the top,
               where these clips frame their subject. */
            return (
              <div key={p.src.file} className="relative overflow-hidden bg-obsidian">
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                    if (el) el.dataset.index = String(i);
                  }}
                  src={p.src.file}
                  aria-label={p.src.alt}
                  muted
                  playsInline
                  preload="none"
                  onEnded={handleFilmEnd}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "center top" }}
                />
              </div>
            );
          }

          /* A still. 1080x1350 against a 0.75 page is only ~6% of
             height trimmed, so cover costs almost nothing here. */
          return (
            <div key={p.image.file} className="overflow-hidden bg-maroon">
              {/* webp with the jpg as fallback — worth about 22% on
                  these, and all of them sit in the hero, so it is some
                  400KB off the first load. `contents` keeps the img's
                  h-full resolving against the page rather than against
                  the picture, which would otherwise collapse it. */}
              <picture className="contents">
                <source srcSet={p.image.file.replace(/\.jpg$/, ".webp")} type="image/webp" />
                <img
                  src={p.image.file}
                  alt={p.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          );
        })}
      </HTMLFlipBook>

      {/* Extra room below on a phone. The controls sit right on the
          bottom edge of the book there, and the section's own padding
          is the only thing under them. */}
      <div className="mt-6 mb-10 flex items-center justify-center gap-5 sm:mt-5 sm:mb-0">
        <button
          type="button"
          onClick={() => flip(-1)}
          aria-label="Previous page"
          className="cursor-pointer rounded-full border border-antique/40 p-2.5 text-ivory/75 transition-colors hover:border-mukut hover:text-mukut"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <span className="label text-ivory/45 tabular-nums">
          {String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
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
