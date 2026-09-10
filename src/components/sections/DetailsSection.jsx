import { EVENT_CONFIG } from "../../data/event";
import { RevealText } from "../ui/RevealText";
import { ScrollReveal } from "../motion/ScrollReveal";
import { SectionPlate } from "../layout/SectionPlate";


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
