import { EVENT_CONFIG } from "../../data/event";
import { RevealText } from "../ui/RevealText";
import { ScrollReveal } from "../motion/ScrollReveal";

/**
 * Dense on purpose. The copy is short, so wide gaps read as an empty
 * page rather than as restraint — everything sits close, the way an
 * old printed invitation is set.
 */
export function DetailsSection() {
  const { dates, location, gateEntry, entryCloses } = EVENT_CONFIG;

  return (
    <section id="details" className="relative px-5 py-20 sm:px-10 sm:py-24" aria-label="The details">
      <div
        className="frame-ancient frame-pips relative mx-auto max-w-3xl bg-maroon/25 px-6 py-12 text-center sm:px-14 sm:py-14"
        style={{ zIndex: "var(--z-content)" }}
      >
        <ScrollReveal className="mt-0">
          <p className="display-type bg-[linear-gradient(100deg,var(--color-ivory)_0%,var(--color-gold)_45%,var(--color-antique)_100%)] bg-clip-text text-[clamp(1.9rem,5vw,3.6rem)] leading-none text-transparent">{dates}</p>
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

        <ScrollReveal stagger={0.08} className="mt-8 space-y-1.5 text-sm text-ivory/55 sm:text-base">
          <p>These are event-night dates.</p>
          <p>Gates open: {gateEntry}.</p>
          <p>Last entry: {entryCloses}. No re-entry.</p>
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