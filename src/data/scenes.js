/* ============================================================
   SCENES — the captions that ride alongside the cinematic film.
   `from`/`to` are fractions (0–1) of the hero's total scroll height;
   `side`/`align` map straight onto CinematicHero's SIDE/ALIGN tables.
   ============================================================ */
export const SCENES = [
  {
    id: "call",
    from: 0.04,
    to: 0.2,
    side: "left",
    align: "start",
    eyebrow: "The invitation",
    heading: "The dhol calls first.",
    body: "Before the feet move, the drum does. It reaches you before you reach the ground.",
  },
  {
    id: "circle",
    from: 0.22,
    to: 0.38,
    side: "right",
    align: "center",
    eyebrow: "The circle",
    heading: "Nobody leads.",
    body: "The floor becomes one body, turning around a single flame.",
  },
  {
    id: "devi",
    from: 0.4,
    to: 0.56,
    side: "left",
    align: "center",
    eyebrow: "The presence",
    heading: "She is installed at dusk.",
    body: "Everything on the ground turns, quite literally, around her.",
  },
  {
    id: "nights",
    from: 0.58,
    to: 0.74,
    side: "right",
    align: "end",
    eyebrow: "Ten nights",
    heading: "It doesn't end at midnight.",
    body: "The gates stay open until the sky changes colour.",
  },
  {
    id: "ground",
    from: 0.76,
    to: 0.9,
    side: "left",
    align: "end",
    eyebrow: "One direction",
    heading: "Ten thousand people.",
    body: "One direction of travel, the whole night through.",
  },
];
