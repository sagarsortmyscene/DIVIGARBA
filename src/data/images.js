/* ============================================================
   ASSET CATALOG — all local. Nothing is fetched from a CDN.
   Every path below points at a file that exists in public/assets.
   ============================================================ */

/* ---------- Brand ---------- */
export const BRAND = {
  /* the gold logotype on transparent — legal pages and the footer */
  logo: "/assets/logo-divi.png",
};

/* ---------- Images, by the job each one does ---------- */
export const IMAGES = {
  /* The book's cover — the first page of the hero flipbook.
     1875x2500, so ratio 0.750, which is exactly the 900x1200 page it
     sits on. That is why it is shown with object-contain and still
     fills the page corner to corner: there is no letterbox to leave,
     because the shapes match. Change the page ratio in GalleryFlip
     and this stops being true. */
  cover: {
    file: "/assets/divibg-mobile.jpg",
    alt: "Divi Garba — Navratri 2026",
  },

  /* The book's second page — the first thing on show once the cover
     opens. 414x896, so ratio 0.462 against a 0.75 page: it is a
     phone-shaped crop left over from the temple gate, and it cannot
     fill this page without either bars or a heavy crop. GalleryFlip
     covers it and pins it to the top, losing 38% of its height. A
     900x1200 export of this artwork would drop that compromise. */
  opening: {
    file: "/assets/gate-mobile-414x896.jpg",
    alt: "Divi Garba — the gate",
  },

  /* The temple bells hung at the top of the hero, once each side.
     640x640 and a genuine RGBA cut-out — 85.6% of it is fully
     transparent — so it drops onto the gradient with no mask and no
     matte behind it, unlike the couple photo that used to sit there. */
  bell: {
    file: "/assets/bell.png",
    alt: "",
  },

  /* The ornament that drifts behind the home hero, twice — low-left
     and high-right. A genuine 626x626 RGBA PNG, so it needs no mask: the transparency does the work and it
     sits over the gradient cleanly at low opacity. */
  vector: {
    file: "/assets/vector.png",
    alt: "",
  },

  /* The aged-canvas texture behind the gallery panels. */
  devi: {
    file: "/assets/gate-background.jpg",
    alt: "Maa Durga, painted on aged canvas — the Divi key artwork",
    focal: "center 34%",
  },
};

/* ---------- Gallery: your own photographs ---------- */
export const GALLERY = [
  { n: "01", file: "/assets/gallery/DSC08780.jpg", title: "The turn",      line: "Ten nights. Every one of them like this.",              alt: "A woman in white dancing joyfully at night, arm raised",  focal: "center 30%", span: "tall" },
  { n: "02", file: "/assets/gallery/DSC01683.jpg", title: "The ground",    line: "Ten thousand people, one direction of travel.",          alt: "A vast crowd dancing under a lit canopy at night",        focal: "center 55%", span: "wide" },
  { n: "03", file: "/assets/gallery/DSC00509.jpg", title: "The floor",     line: "Everyone arrives at the same beat without being told.",  alt: "A group dancing together, close in the crowd",            focal: "center 32%", span: "tall" },
  { n: "04", file: "/assets/gallery/DSC00688.jpg", title: "Ajrakh",        line: "Block-printed, mirrored, and built to open like a wheel.", alt: "A dancer twirling with her arms raised",                focal: "center 35%", span: "tall" },
  { n: "05", file: "/assets/gallery/DSC00508.jpg", title: "The circle",    line: "Nobody leads. You come as six and leave as one floor.",  alt: "A couple dancing together in the crowd",                  focal: "center 30%", span: "wide" },
  { n: "06", file: "/assets/gallery/DSC08073.jpg", title: "The aarti",     line: "Before the dancing, the flame goes around first.",       alt: "Guests performing aarti with diya plates",               focal: "center 35%", span: "wide" },
  { n: "07", file: "/assets/gallery/DSC02502.jpg", title: "The blur",      line: "At the right speed the skirt stops being cloth.",         alt: "A woman laughing mid-spin in a red dupatta",             focal: "center 30%", span: "tall" },
  { n: "08", file: "/assets/gallery/DSC01173.jpg", title: "The gathering", line: "Before the crowd arrives, the ground waits, lit.",       alt: "The decorated ground and canopy before the crowd arrives", focal: "center 60%", span: "tall" },
  { n: "09", file: "/assets/gallery/DSC07975.jpg", title: "The centre",    line: "Before anyone arrives. The lamp, the rangoli, the wait.", alt: "The flower-ringed altar under a canopy of fabric petals", focal: "center 45%", span: "full" },
];

