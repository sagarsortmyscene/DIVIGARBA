import { IMAGES } from "../../data/images";

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

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: "var(--z-atmosphere)", background: scrim }}
      />
    </>
  );
}
