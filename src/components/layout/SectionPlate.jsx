import { IMAGES } from "../../data/images";

/**
 * The master plate as a section background — the same two files the
 * hero uses, so the lower half of the page reads as one piece with the
 * top of it.
 *
 * Drop it in as the FIRST child of a `relative` section. It is
 * absolutely positioned, and positioned elements paint above static
 * ones, so whatever content follows needs `relative` and a z-index of
 * its own or the plate will cover it.
 *
 * A <picture> rather than two <img> behind a `hidden` class:
 * display:none does not stop a browser downloading an image, so the
 * class approach makes every phone fetch both files. A `source media`
 * is resolved before the request is made.
 *
 * `loading="lazy"` unlike the hero's copy of the same plate — these
 * sections are well below the fold, and the browser reuses the file
 * from cache anyway once the hero has pulled it.
 */
export function SectionPlate({ scrim = "rgba(7,5,4,0.55)" }) {
  return (
    <>
      <picture
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: "var(--z-background)" }}
      >
        <source media="(min-width: 640px)" srcSet={IMAGES.heroBg.file} />
        <img
          src={IMAGES.heroBg.fileMobile}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>

      {/* One flat wash rather than a gradient, so the tone does not
          shift between one section and the next.

          0.55, not the 0.82 this started at. The plate is an even
          77/255 across its whole area — measured, not guessed — so at
          0.82 these sections rendered around 14/255, which read as
          near-black with the texture invisible. 0.55 lands them near
          35/255: the plate shows, and ivory body copy still clears
          6.5:1 against it. Going much lighter starts to fail the
          faintest text on the page (the ivory/45 chip in the footer),
          so this is close to the ceiling rather than an arbitrary
          middle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: "var(--z-atmosphere)", background: scrim }}
      />
    </>
  );
}
