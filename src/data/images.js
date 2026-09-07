/* ============================================================
   ASSET CATALOG — all local. Nothing is fetched from a CDN.
   Every path below points at a file that exists in public/assets.
   ============================================================ */

/** Local assets need no transform — this keeps the <Media> API unchanged. */
export const unsplash = (file) => file;
export const unsplashSrcSet = () => undefined;

export const SIZES = {
  full:     "100vw",
  half:     "(max-width: 1024px) 100vw, 50vw",
  chapter:  "(max-width: 1024px) 100vw, 58vw",
  portrait: "(max-width: 768px) 90vw, 46vw",
  card:     "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw",
};

/* ---------- Brand ---------- */
export const BRAND = {
  /* the gold logotype on transparent — header, gate and legal pages */
  logo: "/assets/logo-divi.png",
};

/* ---------- The gate + the canvas behind it ---------- */
export const IMAGES = {
  /* The gate. Left/right on desktop; on a phone, one of four crops
     purpose-made for the exact device widths in `DOOR_MOBILE_CROPS`
     below, picked by TempleGate at render time. `fileMobile` is the
     fallback for any mobile width none of those four crops covers. */
  door: {
    file:       "/assets/gate-background.jpg",      // 1600x900, ratio 1.778
    fileMobile: "/assets/gate-mobile-background.jpg",
    alt: "Maa Durga — the gate",
    focal: "center center",
    focalMobile: "center center",
  },

  /* The aged-canvas texture behind the gallery panels. */
  devi: {
    file: "/assets/gate-background.jpg",
    alt: "Maa Durga, painted on aged canvas — the Divi key artwork",
    focal: "center 34%",
  },
};

/* ---------- Gate: desktop ----------
   One supplied creative, 1600x900 (16:9), shown with object-cover.

   Worth knowing: a real desktop viewport is rarely 16:9, because
   browser chrome takes ~110px of height — most end up WIDER
   (1920x1080 -> 1.98, 1366x768 -> 2.08) and some TALLER (1024x768 ->
   1.56). Cover therefore crops whichever axis is in surplus, and the
   "Event by panchatva" mark sits only 2.5% in from the left and 4.4%
   down from the top, so it is the first thing to go on the shapes
   furthest from 16:9. Supplying extra crops here — the way the mobile
   ones below are cut per handset — is what would fix that. */
export const DOOR_DESKTOP_CROPS = [
  { w: 1600, h: 900, file: "/assets/gate-background.jpg" },
];

/* ---------- Gate: mobile crops ----------
   Four creatives, each composed for a specific handset rather than one
   crop stretched to fit all of them. TempleGate picks whichever one's
   shape is closest to the actual viewport, because matching on width
   alone hands a phone a crop that doesn't fit it: 390x844 and 414x896
   are the SAME shape (0.462), as are 360x800 and 412x915 (0.450).

   `w`/`h` are each file's real pixel size, not what its name claims.
   Note gate-mobile-390x844.jpg is genuinely 390x915 on disk — it was
   exported at the wrong height, so it fits no 390x844 screen. Listed
   honestly here so the picker doesn't choose it for one; re-export it
   at 390x844 and this entry just starts matching those phones again. */
export const DOOR_MOBILE_CROPS = [
  { w: 414, h: 896, file: "/assets/gate-mobile-414x896.jpg" },
  { w: 412, h: 915, file: "/assets/gate-mobile-412x915.jpg" },
  { w: 390, h: 915, file: "/assets/gate-mobile-390x844.jpg" },
  { w: 360, h: 800, file: "/assets/gate-mobile-360x800.jpg" },
];

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

