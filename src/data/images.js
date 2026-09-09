/* ============================================================
   ASSET CATALOG — all local. Nothing is fetched from a CDN.
   Every path below points at a file that exists in public/assets.
   ============================================================ */

/* ---------- Brand ---------- */
export const BRAND = {
  /* the gold logotype on transparent — legal pages and the footer */
  logo: "/assets/logo-divi.png",

  /* The organiser's mark, set beside the Divi logo in the header.
     4140x1564, so ratio 2.65 — a wide logotype, which is why it is
     sized by HEIGHT with an auto width wherever it is used.
     Arrived as "Panchatva logo-02.png" and was renamed: a space in a
     filename has to be percent-encoded in a URL, and mixed case broke
     this project's images on Vercel once already, since Windows does
     not distinguish it locally but Linux does. */
  panchatva: "/assets/panchatva-logo.png",
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

  /* The book's second page. 414x896, so ratio 0.462 against a 0.75
     page — it is a phone-shaped crop and the two shapes do not agree.
     Shown with object-CONTAIN so the whole image is visible: cover
     would fill the page but cut 38% of its height off. Contain leaves
     about 37% of the page width empty, which GalleryFlip fills with a
     blurred copy of the same file rather than flat bars.
     A 900x1200 export of this artwork would remove the compromise. */
  opening: {
    file: "/assets/gate-mobile-414x896.jpg",
    alt: "Divi Garba — the gate",
  },

  /* The clip that plays across the book's first spread. 1280x720
     (1.78) — hopeless on a single 0.75 page, but a SPREAD is two pages
     side by side and therefore 1.5, so cover trims about 16% of the
     width instead of 58%. That is the whole reason it runs across both
     halves rather than sitting on one page.
     Re-encoded from 16.1MB to 6.7MB: H.264 CRF 23 -> 26 at preset
     slow, +faststart, and the audio track dropped outright since the
     player is muted. Measured SSIM against the original is 0.976, so
     the loss is not visible at this size. Still loaded with
     preload="none" and only started when that spread is open. */
  video: {
    file: "/assets/graba.mp4",
    alt: "Garba on the ground at night",
  },

  /* The two reels, one on the left page of each spread that follows
     the opening film. 720x1280 portrait (0.56) against a 0.75 page, so
     cover trims about a quarter of the height — the least bad of the
     options, since contain would leave a third of the page empty.
     Both arrived at 54 SECONDS and 13-15MB. The book holds a spread
     until its clip ends, so at full length it would have sat frozen on
     each one for the better part of a minute; they are trimmed to 15s,
     stripped of audio (the players are muted) and re-encoded at CRF 26,
     which also took them to about a fifth of their weight. */
  reelOne: { file: "/assets/reel/reel-1.mp4", alt: "Garba on the ground" },
  reelTwo: { file: "/assets/reel/reel-2.mp4", alt: "Garba on the ground" },

  /* The hero's ground, in place of the gradient that was there.
     Two files from one plate, both re-encoded from the 1.89MB original
     at quality 78 (mozjpeg) to about 700KB each:

       file        2667x1334, ratio 2.00 — as shot, landscape
       fileMobile  1334x2667, ratio 0.50 — the same plate ROTATED 90

     The rotation matters. A phone is around 0.46 (390x844), so
     object-cover on the landscape plate would keep a narrow vertical
     slice and throw away roughly three quarters of the width. Rotated,
     0.50 against 0.46 means it trims a little height and nothing else.
     Arrived as "master bg_divi.jpeg" and renamed: a space needs
     percent-encoding in a URL, and mixed case has broken this project
     on Vercel before — Windows ignores it locally, Linux does not. */
  heroBg: {
    file: "/assets/master-bg-divi.jpg",
    fileMobile: "/assets/master-bg-divi-mobile.jpg",
    alt: "",
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
     and high-right. A genuine 626x626 RGBA PNG, so it needs no mask —
     the transparency does the work and it sits over the gradient
     cleanly at low opacity. */
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

/* ---------- Gallery: your own photographs ----------
   The filename IS the card title — that is the convention now, so a
   new photograph only has to be dropped in and listed here.
   `rny00498` is the one camera name left in the set; it carries a
   written title until the file itself is renamed.

   Each has a .webp beside its .jpg. Media serves the webp with the
   jpg as fallback, worth roughly 30% on the wire. Both were resized
   from 6000x4000 camera originals to a 1600px long edge — the
   largest these are ever shown is the Lightbox at min(92vw,760px),
   so 1600 still covers a 2x display. The set went from 134MB to
   1.16MB. */
export const GALLERY = [
  { n: "01", slug: "the-invitation", file: "/assets/gallery/the-invitation.jpg", title: "The Invitation", alt: "The Invitation — Divi Garba" },
  { n: "02", slug: "dhol-comes-first", file: "/assets/gallery/dhol-comes-first.jpg", title: "Dhol Comes First", alt: "Dhol Comes First — Divi Garba" },
  { n: "03", slug: "the-turn", file: "/assets/gallery/the-turn.jpg", title: "The Turn", alt: "The Turn — Divi Garba" },
  { n: "04", slug: "the-step", file: "/assets/gallery/the-step.jpg", title: "The Step", alt: "The Step — Divi Garba" },
  { n: "05", slug: "the-circle", file: "/assets/gallery/the-circle.jpg", title: "The Circle", alt: "The Circle — Divi Garba" },
  { n: "06", slug: "the-center", file: "/assets/gallery/the-center.jpg", title: "The Center", alt: "The Center — Divi Garba" },
  { n: "07", slug: "aajrakh", file: "/assets/gallery/aajrakh.jpg", title: "Aajrakh", alt: "Aajrakh — Divi Garba" },
  { n: "08", slug: "blurr", file: "/assets/gallery/blurr.jpg", title: "Blurr", alt: "Blurr — Divi Garba" },
  { n: "09", slug: "rny00498", file: "/assets/gallery/rny00498.jpg", title: "The Ground", alt: "The Ground — Divi Garba" },
];

/* ---------- The installation photographs ----------
   All nine are 1080x1350, ratio 0.800 — near enough the flipbook's
   0.750 page that object-cover trims only about 6% of the height, so
   nothing meaningful is lost. Re-encoded at quality 78 (mozjpeg),
   3.55MB down to 1.93MB for the set.

   `installation-7b.jpg` arrived as "Installation 7 (1).jpg". It is NOT
   a duplicate — different bytes, a second shot of the same setup — so
   it is kept, but the book uses 1-8 and leaves it out rather than
   running two near-identical frames back to back. */
export const INSTALLATIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  file: `/assets/installations/installation-${n}.jpg`,
  alt: `Divi Garba installation ${n}`,
}));
