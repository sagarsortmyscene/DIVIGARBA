/* ============================================================
   LEGAL COPY — the Terms page.
   Content lives here so the page component stays pure layout.
   The PRIVACY and DATA_DELETION blocks were removed with their
   pages; only Terms is still reachable from the site.
   ============================================================ */
import { EVENT_CONFIG } from "./event";

/* Exactly what TERMS interpolates — `email` came out with the Privacy
   and Data Deletion copy, which was the only thing using it. */
const { brandLine, organiserName, gateEntry, entryCloses, dates, location } =
  EVENT_CONFIG;

export const TERMS = {
  title: "Terms & Conditions",
  intro: `${brandLine} is owned and operated by ${organiserName}, a proprietorship registered in India.`,
  sections: [
    {
      heading: "Single Pass — Entry Terms",
      bullets: [
        "Entry & Passes — Valid event pass required. Non-transferable. QR codes valid for single scan only.",
        "Dress Code — Traditional attire encouraged; must respect cultural values.",
        `Timing & Entry — Gates open at ${gateEntry}; last entry at ${entryCloses}. No re-entry allowed.`,
        "Refunds — Passes are non-refundable; rescheduling policy applies for cancellations.",
      ],
    },
    {
      heading: "Couple Pass — Entry Terms",
      bullets: [
        "Entry & Passes — Valid event pass required. Non-transferable. QR codes valid for single scan only.",
        "Dress Code — Traditional attire encouraged; must respect cultural values.",
        "Couple Pass — One male and one female are mandatory on a Couple Pass. 2 male or 2 female are not allowed on couple entry.",
        `Timing & Entry — Gates open at ${gateEntry}; last entry at ${entryCloses}. No re-entry allowed.`,
        "Refunds — Passes are non-refundable; rescheduling policy applies for cancellations.",
      ],
    },
  ],
  footnote: `Event dates: ${dates}. Venue: ${location}.`,
};
