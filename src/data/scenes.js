/* ============================================================
   SCENES — the captions AND photos that ride together through the
   hero. `from`/`to` are fractions (0–1) of the hero's total scroll
   height; `side`/`align` map straight onto CinematicHero's SIDE/ALIGN
   tables. Each scene owns one photo: `image.file` for desktop,
   `image.fileMobile` for phones (a tighter crop of the same shot).

   FIVE scenes now, not four. The copy opens with a title beat —
   "Divi Garba 2026" — before the four narrative ones, so the ranges
   below were redistributed to give each an even share. They still
   overlap by the ±0.05 the photo timelines add in CinematicHero,
   which is what keeps one picture on screen at all times.

   Photographs are matched to the references given with the copy:
   dhol players for the invitation, the centre installation for the
   circle, the crowd for one direction, friends for the last.
   ============================================================ */
export const SCENES = [
  {
    id: "opening",
    from: 0.02,
    to: 0.19,
    side: "left",
    align: "start",
    eyebrow: "Divi Garba 2026",
    heading: "Our Divi glows",
    body: "Where tradition comes alive.",
    image: {
      file: "/assets/img-1.jpg",
      fileMobile: "/assets/img1-mobile.jpg",
      alt: "A flower-ringed altar beneath a canopy of fabric petals, lit at dusk",
      focal: "center 40%",
    },
  },
  {
    id: "dhol",
    from: 0.22,
    to: 0.39,
    side: "right",
    align: "center",
    eyebrow: "The Invitation",
    heading: "First beat of dhol",
    body: "Beats invite and feet follow the rhythm.",
    image: {
      file: "/assets/img-2.jpg",
      fileMobile: "/assets/img2-mobile.jpg",
      alt: "Dhol and shehnai players performing as the crowd dances behind them",
      focal: "center 46%",
    },
  },
  {
    id: "circle",
    from: 0.41,
    to: 0.58,
    side: "left",
    align: "end",
    eyebrow: "The Circle",
    heading: "One step. One circle. One energy.",
    body: "",
    image: {
      /* The petal canopy over the flower-ringed altar — the second of
         the two circle photographs, and the one the gallery does NOT
         carry. It used to be read straight out of the gallery folder
         as DSC07975.jpg, which broke the moment that set was renamed
         to its nine titled files; the photograph itself was dropped
         from the gallery in the process. It now lives beside the other
         scene photographs as its own asset, so nothing here depends on
         what the gallery happens to hold.
         1400x933, already at the optimised size. No tighter phone crop
         exists, so the desktop file is used at both — the same
         fallback the last scene uses. */
      file: "/assets/scene-circle.jpg",
      fileMobile: "/assets/scene-circle.jpg",
      alt: "The flower-ringed altar at the centre of the ground, under a canopy of fabric petals",
      focal: "center 45%",
    },
  },
  {
    id: "ground",
    from: 0.61,
    to: 0.78,
    side: "right",
    align: "center",
    eyebrow: "One Direction",
    heading: "Rhythm",
    body: "Driving thousands of people together.",
    image: {
      file: "/assets/img-4.jpg",
      fileMobile: "/assets/img4-mobile.jpg",
      alt: "Young dhol players leading a procession through a packed night crowd",
      focal: "center 48%",
    },
  },
  {
    id: "everyone",
    from: 0.80,
    to: 0.97,
    side: "left",
    align: "end",
    eyebrow: "The Ground",
    heading: "Everyone you know is here",
    body: "Old friends, new memories and a circle that keeps growing.",
    image: {
      file: "/assets/img-3.jpg",
      // no mobile crop was uploaded for this one — falls back to the
      // desktop photo until img3-mobile.jpg is added to public/assets
      fileMobile: "/assets/img-3.jpg",
      alt: "A group of friends in festive attire smiling together at the ground",
      focal: "center 30%",
    },
  },
];
