import { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { BRAND, IMAGES, INSTALLATIONS } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";
import { useMediaQuery, useReducedMotion } from "../../hooks/useMediaQuery";

const AUTO_MS = 3800;

function buildPages(spread) {
  const pages = [{ kind: "cover" }];

  if (spread) {
    pages.push({ kind: "film", half: 0 }, { kind: "film", half: 1 });
  } else {
    pages.push({ kind: "film", half: 0, whole: true });
  }

  pages.push({ kind: "reel", src: IMAGES.reelOne });
  pages.push({ kind: "photo", image: INSTALLATIONS[0] });
  pages.push({ kind: "reel", src: IMAGES.reelTwo });
  pages.push({ kind: "photo", image: INSTALLATIONS[1] });

  for (const image of INSTALLATIONS.slice(2)) pages.push({ kind: "photo", image });

  if (spread && (pages.length - 1) % 2 === 1) pages.push({ kind: "blank" });

  pages.push({ kind: "back" });
  return pages;
}

export function GalleryFlip() {
  const bookRef = useRef(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const hover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const spread = useMediaQuery("(min-width: 600px)");
  const pages = useMemo(() => buildPages(spread), [spread]);

  const videoRefs = useRef([]);
  const videoAt = useMemo(() => {
    const map = new Map();
    pages.forEach((p, i) => {
      if (p.kind === "film" && p.half === 0) map.set(i, "film");
      if (p.kind === "reel") map.set(i, "reel");
    });
    return map;
  }, [pages]);

  const activeVideo = videoAt.has(page) ? page : null;

  const syncHalves = () => {
    const [l, r] = videoRefs.current;
    if (!l || !r) return;
    if (Math.abs(r.currentTime - l.currentTime) > 0.08) r.currentTime = l.currentTime;
  };

  const [filmPlaying, setFilmPlaying] = useState(false);
  const filmHolding = activeVideo !== null && filmPlaying;

  const [sound, setSound] = useState(false);

  useEffect(() => {
    const vids = videoRefs.current.filter(Boolean);
    if (!vids.length) return;

    for (const v of vids) {
      if (v.dataset.index !== String(activeVideo)) v.pause();
    }

    if (activeVideo === null) return;

    let alive = true;
    const playing = vids.filter((v) => v.dataset.index === String(activeVideo));
    for (const v of playing) v.currentTime = 0;
    const [lead, ...rest] = playing;

    const start = () =>
      lead
        ?.play()
        .then(() => alive && setFilmPlaying(true))
        .catch(() => {
          if (!alive) return;
          if (!lead.muted) {
            lead.muted = true;
            setSound(false);
            start();
            return;
          }
          setFilmPlaying(false);
        });
    start();
    for (const v of rest) v.play().catch(() => {});

    return () => {
      alive = false;
    };
  }, [activeVideo]);

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

  const flip = (dir) => {
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    if (dir < 0) api.flipPrev();
    else api.flipNext();
  };

  const handleFilmEnd = () => {
    setFilmPlaying(false);
    if (!reduced && !paused) flip(1);
  };

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

  const LAST = pages.length - 1;
  const recentre =
    page === 0 ? "lg:-translate-x-1/4" : page >= LAST ? "lg:translate-x-1/4" : "";

  return (
    <div
      ref={boxRef}

      className="mx-auto aspect-3/4 w-full max-w-[min(90vh,700px)] min-[600px]:aspect-3/2 lg:w-full lg:max-w-[calc(150vh-444px)]"
      onPointerEnter={hover ? () => setPaused(true) : undefined}
      onPointerLeave={hover ? () => setPaused(false) : undefined}
    >
      <HTMLFlipBook
        ref={bookRef}

        width={900}
        height={1200}
        size="stretch"
        minWidth={280}
        maxWidth={900}
        minHeight={373}
        maxHeight={1200}
        maxShadowOpacity={0.5}

        showCover={true}

        mobileScrollSupport

        useMouseEvents
        onFlip={(e) => setPage(e.data)}
        className={`mx-auto transition-transform duration-500 ease-out ${recentre}`}
      >
        {pages.map((p, i) => {
          if (p.kind === "cover") {
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
            return <div key="blank" className="bg-maroon" aria-hidden />;
          }

          if (p.kind === "film") {
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
            return (
              <div key={p.src.file} className="relative overflow-hidden bg-obsidian">
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                    if (el) el.dataset.index = String(i);
                  }}
                  src={p.src.file}
                  aria-label={p.src.alt}

                  muted={!sound}
                  playsInline
                  preload="none"
                  onEnded={handleFilmEnd}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "center top" }}
                />
              </div>
            );
          }

          return (
            <div key={p.image.file} className="overflow-hidden bg-maroon">

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

        <button
          type="button"
          onClick={() => setSound((s) => !s)}
          aria-label={sound ? "Mute the clips" : "Play the clips with sound"}
          aria-pressed={sound}
          className={`cursor-pointer rounded-full border p-2.5 transition-colors ${
            sound
              ? "border-mukut text-mukut"
              : "border-antique/40 text-ivory/75 hover:border-mukut hover:text-mukut"
          }`}
        >
          {sound ? (
            <Volume2 className="h-4 w-4" strokeWidth={1.8} />
          ) : (
            <VolumeX className="h-4 w-4" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
}
