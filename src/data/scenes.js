/* ============================================================
   SCENES — the captions AND photos that ride together through the
   hero. `from`/`to` are fractions (0–1) of the hero's total scroll
   height; `side`/`align` map straight onto CinematicHero's SIDE/ALIGN
   tables. Each scene owns one photo: `image.file` for desktop,
   `image.fileMobile` for phones (a tighter crop of the same shot).
   ============================================================ */
export const SCENES = [
  {
    id: "altar",
    from: 0.03,
    to: 0.26,
    side: "left",
    align: "start",
    eyebrow: "The presence",
    heading: "She is installed at dusk.",
    body: "Marigold, flame and cloth, laid out before the first beat of the dhol.",
    image: {
      file: "/assets/img-1.jpg",
      fileMobile: "/assets/img1-mobile.jpg",
      alt: "A flower-ringed altar beneath a canopy of fabric petals, lit at dusk",
      focal: "center 40%",
    },
  },
  {
    id: "dhol",
    from: 0.29,
    to: 0.5,
    side: "right",
    align: "center",
    eyebrow: "The invitation",
    heading: "The dhol calls first.",
    body: "Before the feet move, the drum does. It reaches you before you reach the ground.",
    image: {
      file: "/assets/img-2.jpg",
      fileMobile: "/assets/img2-mobile.jpg",
      alt: "Dhol and shehnai players performing as the crowd dances behind them",
      focal: "center 46%",
    },
  },
  {
    id: "circle",
    from: 0.53,
    to: 0.74,
    side: "left",
    align: "end",
    eyebrow: "The circle",
    heading: "Everyone you know is here.",
    body: "Old friends, new outfits, the same nine nights.",
    image: {
      file: "/assets/img-3.jpg",
      // no mobile crop was uploaded for this one — falls back to the
      // desktop photo until img3-mobile.jpg is added to public/assets
      fileMobile: "/assets/img-3.jpg",
      alt: "A group of friends in festive attire smiling together at the ground",
      focal: "center 30%",
    },
  },
  {
    id: "ground",
    from: 0.77,
    to: 0.97,
    side: "right",
    align: "end",
    eyebrow: "One direction",
    heading: "Ten thousand people.",
    body: "One direction of travel, the whole night through.",
    image: {
      file: "/assets/img-4.jpg",
      fileMobile: "/assets/img4-mobile.jpg",
      alt: "Young dhol players leading a procession through a packed night crowd",
      focal: "center 48%",
    },
  },
];
