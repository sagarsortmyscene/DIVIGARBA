import { EVENT_CONFIG } from "../../data/event";
import { ScrollReveal } from "../motion/ScrollReveal";
import { SectionPlate } from "../layout/SectionPlate";

/**
 * LOCATION — the heading and address at the left, the map at the right.
 *
 * Set in Anek Gujarati throughout (it is the site's --font-ui now), so
 * the address reads the same whether it is written in Latin or
 * Gujarati — that is the whole reason for the face.
 */
export function VenueSection() {
  /* Both URLs, for two different jobs: mapEmbed is the only form
     Google will render inside a frame, and maps is the real place
     link the frame now opens when you click it. */
  const { venueName, venueStreet, maps, mapEmbed } = EVENT_CONFIG;

  return (
    <section id="venue" className="relative overflow-hidden px-5 py-16 sm:px-10 sm:py-16 lg:py-14" aria-label="Location">
      <SectionPlate />

      <div
        /* `relative` is required, not decorative: the z-index below
           does nothing without a position, and the plate above is
           absolute — so unpositioned content would sit UNDER it. */
        className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-10"
        style={{ zIndex: "var(--z-content)" }}
      >
        <ScrollReveal className="mt-0">
          {/* "Location" is the heading now and carries the large size;
              the venue name steps down to sit with the address it
              belongs to. The two swapped rather than both growing —
              one thing per block should be the loudest. */}
          <h2 className="text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] font-semibold text-ivory">
            Location
          </h2>

          <p className="mt-5 text-xl tracking-[0.06em] text-mukut sm:text-2xl">
            {venueName}
          </p>

          <p className="mt-2 text-lg leading-relaxed text-ivory/70 sm:text-xl">
            {venueStreet}
          </p>
          {/* The timing line came off by request. The hero's fact row
              still carries "From 8:00 PM · Last entry 2:00 AM", and
              the Terms page states the full rule including no
              re-entry — so this block is now purely the address. */}

          {/* The "Tickets" and "Open in maps" buttons were here and
              are gone by request. Booking is one tap away in the
              header, and the map beside this opens Google Maps when
              clicked, so neither route was lost with them. */}
        </ScrollReveal>

        {/* The map. `loading="lazy"` keeps Google's payload off the
            critical path — this sits well below the fold — and the
            aspect ratio holds its box before the frame arrives, so
            nothing below it jumps when it loads. */}
        <ScrollReveal className="mt-0">
          {/* The whole map is a link now. The iframe is
              pointer-events-none so every click lands on the anchor
              wrapping it rather than panning the embed — one tap opens
              the real place in Google Maps.

              Two things this fixes beyond the click: an embedded map
              otherwise traps touch scrolling, so dragging up the page
              over it zooms the map instead of scrolling; and it gives
              the map a keyboard-reachable, labelled target, which a
              bare iframe is not. */}
          <a
            href={maps}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Open ${venueName} in Google Maps`}
            className="frame-ancient group relative block aspect-4/3 w-full cursor-pointer overflow-hidden sm:aspect-16/10"
          >
            {/* The pin's name, printed by us rather than asked of
                Google. The embed's own label syntax
                (`q=lat,lng (Name)`) renders the map but then fails its
                place lookup and covers it with a "Place info couldn't
                load" card — so the marker stays unnamed and this says
                what it is. */}
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

            {/* A wash that lifts on hover, so it reads as something you
                can open rather than a picture of a map. */}
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
