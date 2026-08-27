/* ============================================================
   BOOKING DATA — nights, categories, and price phases.
   Everything the booking page renders comes from here.
   ============================================================ */
import { EVENT_CONFIG } from "./event";

const { year, month, openNights } = EVENT_CONFIG;

const fmt = (d) =>
  d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const fmtLong = (d) =>
  d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** The ten event nights, derived — no weekday is ever hand-typed. */
export const NIGHTS = openNights.map((day) => {
  const start = new Date(Date.UTC(year, month, day));
  const next = new Date(Date.UTC(year, month, day + 1));
  return {
    id: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    day,
    label: fmt(start),
    /* Gates open the night of, and close the following morning —
       so the closing date is always the NEXT calendar day. Showing
       both in full is the point: nobody should be surprised at 3am. */
    gatesOpen: `11:00 PM, ${fmtLong(start)}`,
    gatesClose: `7:00 AM, ${fmtLong(next)}`,
  };
});

export const CATEGORIES = [
  { id: "individual", label: "Individual", blurb: "One place in the circle." },
  { id: "group", label: "Group", blurb: "Four places, booked together." },
  { id: "season", label: "Season Pass", blurb: "All ten nights, one pass." },
];

/* >>> EDIT — real prices and phase status go here.
   `status` drives everything: only "live" can be reserved. */
export const PHASES = [
  { id: "dawn", name: "Dawn", phase: "Early Bird", status: "live" },
  { id: "sunrise", name: "Sunrise", phase: "Regular Phase", status: "upcoming" },
  { id: "sunset", name: "Sunset Gate", phase: "Final Phase", status: "upcoming" },
];

/* >>> EDIT — price per category, per phase (in rupees). */
export const PRICING = {
  individual: {
    ticketName: "The Seeker (Individual)",
    grants: "Grants entry to one soul in the circle",
    dawn: 1000, sunrise: 1500, sunset: 2000,
  },
  group: {
    ticketName: "The Circle (Group of 4)",
    grants: "Grants entry to four souls, seated together",
    dawn: 3600, sunrise: 5400, sunset: 7200,
  },
  season: {
    ticketName: "The Nine Nights (Season Pass)",
    grants: "Grants entry to one soul on every event night",
    dawn: 7500, sunrise: 9500, sunset: 12000,
  },
};

export const money = (n) => `₹${n.toLocaleString("en-IN")}`;

export const STATUS_LABEL = {
  live: "Available now",
  upcoming: "Opens later",
  closed: "Closed",
};
