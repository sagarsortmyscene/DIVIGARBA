import { EVENT_CONFIG } from "../../data/event";
import { ScrollReveal } from "../motion/ScrollReveal";
import { SectionPlate } from "../layout/SectionPlate";

export function VenueSection() {
  const { venueName, venueStreet, maps, mapEmbed } = EVENT_CONFIG;

  return (
    <section id="venue" className="relative overflow-hidden px-5 py-16 sm:px-10 sm:py-16 lg:py-14" aria-label="Location">
      <SectionPlate />

      <div

        className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-10"
        style={{ zIndex: "var(--z-content)" }}
      >
        <ScrollReveal className="mt-0">

          <h2 className="text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] font-semibold text-ivory">
            Location
          </h2>

          <p className="mt-5 text-xl tracking-[0.06em] text-mukut sm:text-2xl">
            {venueName}
          </p>

          <p className="mt-2 text-lg leading-relaxed text-ivory/70 sm:text-xl">
            {venueStreet}
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-0">

          <a
            href={maps}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Open ${venueName} in Google Maps`}
            className="frame-ancient group relative block aspect-4/3 w-full cursor-pointer overflow-hidden sm:aspect-16/10"
          >

            <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-sm bg-obsidian/85 px-3 py-1.5 text-xs tracking-[0.14em] uppercase text-mukut">
              {EVENT_CONFIG.name} 2026
            </span>

            <iframe
              src={mapEmbed}
              title={`Map to ${venueName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
              className="pointer-events-none absolute inset-0 h-full w-full border-0"
            />

            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-obsidian/0 transition-colors duration-300 group-hover:bg-obsidian/20"
            />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
