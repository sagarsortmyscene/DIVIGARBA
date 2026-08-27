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
  /* A real carved door from Rajasthan — the ancient note the whole
     site hangs on. Photographed flat, so it splits cleanly in two. */
  door: {
    file: "1677206213866-65b5f73bb95b",
    alt: "An ancient carved wooden temple door from Rajasthan",
    focal: "center center",
    credit: "Darshan Patel",
  },
  /* What waits behind the doors. */
  devi: {
    file: "1616074385287-67f6fb9e9eb8",
    alt: "Maa Durga crowned in gold",
    focal: "center 30%",
    credit: "Tanuj Adhikary",
  },
};

/* ---------- Gallery: six plates, fanned like a hand of cards ---------- */
export const GALLERY = [
  { n: "01", file: "1754244575428-8123e0d27ef3", title: "The turn",   line: "Three steps, a clap, and the ghagra does the rest.", alt: "A dancer twirling in traditional Gujarati attire", focal: "center 38%", credit: "Raas Usa" },
  { n: "02", file: "1774377767315-cb846a51725b", title: "The dhol",   line: "It enters at midnight and stays until the sun does.",   alt: "A drummer playing dhol",                          focal: "center 38%", credit: "Tanmay Abhay Mahajan" },
  { n: "03", file: "1716655359683-791d415c3f4c", title: "The sticks", line: "Dandiya. Two pieces of wood, and a conversation.",     alt: "A dancer holding dandiya sticks",                 focal: "center 32%", credit: "Joydeep Sensarma" },
  { n: "04", file: "1774437897284-b2f7c4638c55", title: "The circle", line: "Nobody leads. The floor becomes one body.",            alt: "Women in colourful saris dancing",                focal: "center 40%", credit: "Tanmay Abhay Mahajan" },
  { n: "05", file: "1626094305935-94534682b1d9", title: "The Devi",   line: "Installed at dusk. Everything turns around her.",      alt: "Durga idol in gold ornaments and garlands",       focal: "center 30%", credit: "Sonika Agarwal" },
  { n: "06", file: "1734120113511-3fc3daa90633", title: "The ground", line: "Ten thousand people, one direction of travel.",        alt: "A vast crowd on the garba ground at night",       focal: "center 44%", credit: "Tirth Jivani" },
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
  ...new Set([...Object.values(IMAGES), ...GALLERY].map((i) => i.credit)),
].map((credit) => ({ credit, link: PHOTOGRAPHERS[credit] }));
