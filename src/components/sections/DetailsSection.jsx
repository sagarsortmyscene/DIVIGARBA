import { EVENT_CONFIG } from "../../data/event";
import { RevealText } from "../ui/RevealText";
import { ScrollReveal } from "../motion/ScrollReveal";
import { SectionPlate } from "../layout/SectionPlate";

/**
 * Dense on purpose. The copy is short, so wide gaps read as an empty
 * page rather than as restraint — everything sits close, the way an
 * old printed invitation is set.
 */
export function DetailsSection() {
  const { dates, location, gateEntry } = EVENT_CONFIG;

  return (
    <section
      id="details"
      className="relative overflow-hidden px-5 py-20 sm:px-10 sm:py-24"
      aria-label="The details"
    >
      <SectionPlate />

      <div
        className="frame-ancient frame-pips relative mx-auto max-w-3xl bg-maroon/25 px-6 py-12 text-center sm:px-14 sm:py-14"
        style={{ zIndex: "var(--z-content)" }}
      >
        <ScrollReveal className="mt-0">
          {/* The gilt band behind these dates is gone; the size and the
              gradient stay, so the line still carries the section.

              The gradient runs DARK to light. It was the other way
              round, which put the palest tone on "11 — 20" and the
              deep antique on "2026" — the year carrying the weight
              instead of the dates. Reversed, the deep gold starts on
              the 11, holds across the range, and lifts to ivory by the
              time it reaches the year. */}
          <p className="display-type bg-[linear-gradient(100deg,var(--color-antique)_0%,var(--color-gold)_55%,var(--color-ivory)_100%)] bg-clip-text text-[clamp(2.2rem,6vw,4.4rem)] leading-none font-semibold text-transparent">
            {dates}
          </p>
          <p className="label mt-3 text-antique">{location}</p>
        </ScrollReveal>

        <div className="divider-carved my-8">
          <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
        </div>

        <RevealText
          lines={["Ten nights. One circle."]}
          as="h2"
          className="display-type text-[clamp(1.7rem,4vw,2.8rem)] text-ivory"
        />

        {/* One line now. The three that were here — the event-night
            note, the music time and the last-entry rule — came out by
            request; the Find us section still carries the full timing
            statement for anyone who needs it. */}
        <ScrollReveal className="mt-6 text-sm text-ivory/55 sm:text-base">
          <p>Onward {gateEntry}</p>
        </ScrollReveal>

        <div className="divider-carved my-8">
          <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
        </div>

        <RevealText
          lines={["The Chakra turns", "until the sun returns."]}
          as="p"
          className="display-type text-[clamp(1.3rem,2.6vw,1.9rem)] leading-tight text-mukut/90"
          stagger={0.12}
        />
      </div>
    </section>
  );
}