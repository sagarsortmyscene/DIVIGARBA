export const BRAND = {
  logo: "/assets/logo-divi.png",

  panchatva: "/assets/panchatva-logo.png",
};

export const IMAGES = {
  cover: {
    file: "/assets/divibg-mobile.jpg",
    alt: "Divi Garba — Navratri 2026",
  },

  video: {
    file: "/assets/graba.mp4",
    alt: "Garba on the ground at night",
  },

  reelOne: { file: "/assets/reel/reel-1.mp4", alt: "Garba on the ground" },
  reelTwo: { file: "/assets/reel/reel-2.mp4", alt: "Garba on the ground" },

  heroBg: {
    file: "/assets/master-bg-divi.jpg",
    fileMobile: "/assets/master-bg-divi-mobile.jpg",
    alt: "",
  },

  bell: {
    file: "/assets/bell.png",
    webp: "/assets/bell.webp",
    alt: "",
  },

  vector: {
    file: "/assets/vector.png",
    webp: "/assets/vector.webp",
    alt: "",
  },

  devi: {
    file: "/assets/gate-background.jpg",
    alt: "Maa Durga, painted on aged canvas — the Divi key artwork",
    focal: "center 34%",
  },
};

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

export const INSTALLATIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  file: `/assets/installations/installation-${n}.jpg`,
  alt: `Divi Garba installation ${n}`,
}));
