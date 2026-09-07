import { EVENT_CONFIG } from "../../data/event";
import { ScrollReveal } from "../motion/ScrollReveal";

/**
 * FIND US — the venue named large at the left, the map at the right.
 *
 * Set in Anek Gujarati throughout (it is the site's --font-ui now), so
 * the address reads the same whether it is written in Latin or
 * Gujarati — that is the whole reason for the face.
 */
export function VenueSection() {
  /* Two URLs for the same place on purpose — see the note in event.js:
     `maps` is the share link the button opens, `mapEmbed` is the only
     form Google serves without X-Frame-Options, so it is what the
     frame can actually show. */
  const { venueName, venueStreet, gateEntry, entryCloses, maps, mapEmbed } = EVENT_CONFIG;

  /* The widget owns #buy-btn in the header and an id can only sit on
     one element, so this forwards to the trigger it already knows. */
  const openTickets = () => document.getElementById("buy-btn")?.click();

  return (
    <section id="venue" className="relative px-5 py-16 sm:px-10 sm:py-16 lg:py-14" aria-label="Find us">
      <div
        className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-10"
        style={{ zIndex: "var(--z-content)" }}
      >
        <ScrollReveal className="mt-0">
          {/* Not the `label` utility here: that is fixed at 0.68rem,
              and it would be a second font-size rule fighting any size
              class added beside it. Written out so the size is the
              only thing that changed — tracking is eased off from
              label's 0.36em, which reads gappy once the type grows. */}
          <p className="text-[1.1rem] tracking-[0.2em] uppercase text-antique">Find us</p>

          <h2 className="mt-4 text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] font-semibold text-ivory">
            {venueName}
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-ivory/70 sm:text-2xl">
            {venueStreet}
          </p>
          <p className="mt-2 text-lg leading-relaxed text-ivory/70 sm:text-2xl">
            Gates open {gateEntry} · Last entry {entryCloses}
          </p>

          <div className="mt-7 flex flex-wrap gap-3.5">
            <button
              type="button"
              onClick={openTickets}
              data-cursor="cta"
              className="cta-label cursor-pointer rounded-full border border-mukut bg-mukut px-7 py-3.5 text-obsidian transition-colors duration-500 hover:border-gold hover:bg-gold"
            >
              Tickets →
            </button>
            {/* The share link the config already holds. It opens the
                real place card, which the embed on the right cannot —
                and it is the one the organiser verified. */}
            <a
              href={maps}
              target="_blank"
              rel="noreferrer noopener"
              className="label rounded-full border border-antique/45 px-7 py-3.5 text-ivory/85 transition-colors duration-500 hover:border-mukut hover:text-mukut"
            >
              Open in maps →
            </a>
          </div>
        </ScrollReveal>

        {/* The map. `loading="lazy"` keeps Google's payload off the
            critical path — this sits well below the fold — and the
            aspect ratio holds its box before the frame arrives, so
            nothing below it jumps when it loads. */}
        <ScrollReveal className="mt-0">
          <div className="frame-ancient relative aspect-4/3 w-full overflow-hidden sm:aspect-16/10">
            <iframe
              src={mapEmbed}
              title={`Map to ${venueName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
