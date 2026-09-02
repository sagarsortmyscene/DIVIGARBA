/* ============================================================
   IMAGE CATALOG + CDN PIPELINE — the single source for photography.

   Photos come from Unsplash's imgix CDN, so width / crop / format are
   query params: we never ship an oversized file. Swap a `file` here
   and the whole site updates — no component changes.

   All IDs are real, free Unsplash Licence photos (no Unsplash+):
   free for commercial use, attribution not required. Credits are
   kept anyway and rendered in the footer.
   ============================================================ */

const CDN = "https://images.unsplash.com/photo-";

/** Build one CDN URL. */
export function unsplash(file, { w = 1600, h, q = 78, focus } = {}) {
  const p = new URLSearchParams({ auto: "format", fit: "crop", q: String(q), w: String(w) });
  // Only crop when a height forces it. Otherwise the CDN just resizes and
  // CSS object-position does the framing — cropping in both places fights
  // itself and can push a face out of frame.
  if (h) {
    p.set("h", String(h));
    p.set("crop", focus === "faces" ? "faces,entropy" : focus || "entropy");
  }
  return `${CDN}${file}?${p}`;
}

/** Responsive srcSet — the browser picks the width, we don't guess. */
export function unsplashSrcSet(file, widths = [640, 1024, 1600, 2200]) {
  return widths.map((w) => `${unsplash(file, { w })} ${w}w`).join(", ");
}

/** A 24px version, stretched and blurred as a load-in placeholder. */
export const unsplashBlur = (file) => unsplash(file, { w: 24, q: 30 });

/** Named sizes, so no component invents its own string. */
export const SIZES = {
  full: "100vw",
  half: "(max-width: 1024px) 100vw, 50vw",
  chapter: "(max-width: 1024px) 100vw, 58vw",
  portrait: "(max-width: 768px) 90vw, 46vw",
  card: "(max-width: 768px) 80vw, 32vw",
};

/* ---------- The gate ---------- */
export const IMAGES = {
  /* The gate's backdrop — Maa Durga's gaze, split across the two
     door panels so the image stays continuous as they part. */
  door: {
    file: "/assets/gate-background.jpg",
    fileMobile: "/assets/gate-mobile-background.jpg",
    alt: "Maa Durga",
    focal: "center center",
    credit: null,
  },
  /* What waits behind the doors. */
  devi: {
    file: "1616074385287-67f6fb9e9eb8",
    alt: "Maa Durga crowned in gold",
    focal: "center 30%",
    credit: "Tanuj Adhikary",
  },
};

/* ---------- Gallery: real nights from the ground, not stock ---------- */
export const GALLERY = [
  { n: "01", file: "/assets/gallery/DSC00508.jpg", title: "The turn",    line: "Three steps, a clap, and the ghagra does the rest.",   alt: "A couple dancing together in the crowd", focal: "center 30%", credit: null },
  { n: "02", file: "/assets/gallery/DSC00688.jpg", title: "The lift",    line: "Arms up, dupatta out — the beat finds everyone.",       alt: "A dancer twirling with her arms raised", focal: "center 35%", credit: null },
  { n: "03", file: "/assets/gallery/DSC01683.jpg", title: "The ground",  line: "Ten thousand people, one direction of travel.",         alt: "A vast crowd dancing under a lit canopy at night", focal: "center 55%", credit: null },
  { n: "04", file: "/assets/gallery/DSC02502.jpg", title: "The circle",  line: "Nobody leads. The floor becomes one body.",             alt: "A woman laughing mid-spin in a red dupatta", focal: "center 30%", credit: null },
  { n: "05", file: "/assets/gallery/DSC08073.jpg", title: "The aarti",   line: "Before the dancing, the flame goes around first.",      alt: "Guests performing aarti with diya plates", focal: "center 35%", credit: null },
  { n: "06", file: "/assets/gallery/DSC07975.jpg", title: "The Devi",    line: "Installed at dusk. Everything turns around her.",       alt: "The flower-ringed altar under a canopy of fabric petals", focal: "center 45%", credit: null },
  { n: "07", file: "/assets/gallery/DSC08780.jpg", title: "The night",   line: "Nine nights. Every one of them like this.",             alt: "A woman in white dancing joyfully at night", focal: "center 30%", credit: null },
  { n: "08", file: "/assets/gallery/DSC01173.jpg", title: "The gathering", line: "Before the crowd arrives, the ground waits, lit.",    alt: "The decorated ground and canopy before the crowd arrives", focal: "center 60%", credit: null },
];

/* ---------- Attribution ----------
   The Unsplash Licence does not require attribution, but crediting
   is good practice. Profile URLs live here once; the footer derives
   its list from the images actually used, so it can never drift. */
export const PHOTOGRAPHERS = {
  "Darshan Patel": "https://unsplash.com/@darshanp9",
  "Tanuj Adhikary": "https://unsplash.com/@_tanuj_",
  "Sonika Agarwal": "https://unsplash.com/@sonika_agarwal",
  "Tirth Jivani": "https://unsplash.com/@tirthjivani",
  "Raas Usa": "https://unsplash.com/@raasusa",
  "Tanmay Abhay Mahajan": "https://unsplash.com/@mr_bond1999",
  "Joydeep Sensarma": "https://unsplash.com/@jsensarma",
};

/** De-duplicated {credit, link} for every photo actually on the page. */
export const CREDITS = [
  ...new Set([...Object.values(IMAGES), ...GALLERY].map((i) => i.credit).filter(Boolean)),
].map((credit) => ({ credit, link: PHOTOGRAPHERS[credit] }));
